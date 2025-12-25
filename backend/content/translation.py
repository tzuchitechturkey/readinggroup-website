"""Utilities for translating text using Google Gemini."""
from __future__ import annotations

import logging
from copy import deepcopy
from typing import Callable, Optional, Sequence

from django.conf import settings
from django.db import models, transaction

from .enums import LanguageChoices

try:  # pragma: no cover - dependency is optional in some environments
    import google.generativeai as genai
except ImportError:  # pragma: no cover - fallback when package missing
    genai = None  # type: ignore

LOGGER = logging.getLogger(__name__)

_LANGUAGE_LABELS = {choice.value: choice.label for choice in LanguageChoices}
_configured_api_key: Optional[str] = None

TRANSLATABLE_FIELD_MAP: dict[str, tuple[str, ...]] = {
    "content.video": ("title", "description"),
    "content.post": ("title", "subtitle", "excerpt", "body", "metadata"),
    "content.content": ("title", "subtitle", "excerpt", "body", "metadata"),
    "content.book": ("name", "description"),
    "content.event": ("title", "summary"),
    "content.teammember": ("name", "job_title", "description"),
    "content.historyentry": ("title", "description"),
    "content.postcategory": ("name", "description"),
    "content.eventcategory": ("name", "description"),
    "content.contentcategory": ("name", "description"),
    "content.videocategory": ("name", "description"),
    "content.bookcategory": ("name", "description"),
}


def _configure_client() -> bool:
    """Configure the Gemini client if possible.

    Returns True when the client is configured and ready, False otherwise.
    """
    global _configured_api_key

    api_key = getattr(settings, "GEMINI_API_KEY", "") or None
    if not api_key:
        LOGGER.warning("Gemini translation requested but GEMINI_API_KEY is unset.")
        return False

    if genai is None:
        LOGGER.error(
            "google-generativeai package not installed. Install it to enable translations."
        )
        return False

    if _configured_api_key != api_key:
        try:
            genai.configure(api_key=api_key)
            _configured_api_key = api_key
            LOGGER.debug("Configured Gemini client for translation.")
        except Exception as exc:  # pragma: no cover - defensive logging
            LOGGER.exception("Failed to configure Gemini client: %s", exc)
            return False

    return True


def _language_label(code: str) -> str:
    """Return human readable label for a language code."""
    return _LANGUAGE_LABELS.get(code, code)


def is_translation_enabled() -> bool:
    """Return True when Gemini translations are enabled and usable."""
    enabled_flag = bool(getattr(settings, "GEMINI_TRANSLATION_ENABLED", False))
    if not enabled_flag:
        return False
    return _configure_client()


def translate_text(
    text: str,
    *,
    source_language: str,
    target_language: str,
    model: Optional[str] = None,
    fallback_to_source: bool = True,
) -> Optional[str]:
    """Translate *text* from *source_language* to *target_language* using Gemini.

    Returns the translated text, the original text (when fallback_to_source is True and
    translation cannot be performed), or ``None`` when translation is disabled and
    fallback is not allowed.
    """
    if not text:
        return ""

    if target_language == source_language:
        return text

    if not is_translation_enabled():
        return text if fallback_to_source else None

    if genai is None:  # pragma: no cover - safety belt
        return text if fallback_to_source else None

    model_name = model or getattr(settings, "GEMINI_MODEL", "gemini-2.5-flash-lite")
    source_label = _language_label(source_language)
    target_label = _language_label(target_language)

    prompt = (
        "Translate the following text from "
        f"{source_label} (language code: {source_language}) to {target_label} "
        f"(language code: {target_language}). "
        "Respond with the translation only, without quotes or additional commentary.\n\n"
        "Text:\n"
        f"{text}"
    )

    try:
        model_client = genai.GenerativeModel(model_name)
        response = model_client.generate_content(prompt)
    except Exception as exc:  # pragma: no cover - external dependency
        LOGGER.exception("Gemini translation request failed: %s", exc)
        return text if fallback_to_source else None

    translated = getattr(response, "text", None)
    if translated:
        return translated.strip()

    # Some responses include candidates instead of `.text`
    try:
        candidates = getattr(response, "candidates", [])
        for candidate in candidates:
            parts = getattr(candidate, "content", {}).get("parts", [])
            for part in parts:
                maybe_text = part.get("text") if isinstance(part, dict) else None
                if maybe_text:
                    return maybe_text.strip()
    except Exception:  # pragma: no cover - defensive fail-safe
        LOGGER.debug("Gemini response did not include structured candidates.")

    LOGGER.warning(
        "Gemini translation response did not contain text. Returning source text as fallback."
    )
    return text if fallback_to_source else None


def translate_fields(
    data: dict[str, str],
    *,
    source_language: str,
    target_language: str,
    model: Optional[str] = None,
    fallback_to_source: bool = True,
) -> dict[str, str]:
    """Translate multiple text fields using Gemini.

    ``data`` is a mapping of field name -> text in the source language. The return value
    contains the translated texts (or fallbacks) keyed by the same field names.
    """
    translated: dict[str, str] = {}
    for field_name, value in data.items():
        translated[field_name] = translate_text(
            value,
            source_language=source_language,
            target_language=target_language,
            model=model,
            fallback_to_source=fallback_to_source,
        ) or ""
    return translated


def _clone_field_value(instance: models.Model, field_name: str):
    value = getattr(instance, field_name)
    if isinstance(value, (dict, list, tuple)):
        return deepcopy(value)
    return value


def generate_translations_for_instance(
    instance: models.Model,
    *,
    fields_to_translate: Sequence[str],
    target_languages: Optional[Sequence[str]] = None,
    copy_related: Optional[Sequence[Callable[[models.Model, models.Model, str], None]]] = None,
    fallback_to_source: bool = True,
) -> None:
    """Create translated siblings for *instance* across configured languages."""
    if not hasattr(instance, "translation_group"):
        LOGGER.debug(
            "Instance %s has no translation_group; skipping auto translation.", instance
        )
        return

    source_language = getattr(instance, "language", None)
    if not source_language:
        LOGGER.debug("Instance %s has no language set; skipping auto translation.", instance)
        return

    model = instance.__class__
    languages = list(target_languages) if target_languages else [code for code, _ in LanguageChoices.choices]

    base_values = {
        field: (getattr(instance, field, "") or "")
        for field in fields_to_translate
    }

    try:
        with transaction.atomic():
            for language in languages:
                if language == source_language:
                    continue

                if model.objects.filter(
                    translation_group=getattr(instance, "translation_group"),
                    language=language,
                ).exists():
                    continue

                translations = translate_fields(
                    base_values,
                    source_language=source_language,
                    target_language=language,
                    fallback_to_source=fallback_to_source,
                )

                create_kwargs: dict[str, object] = {}
                for field in model._meta.get_fields():
                    if getattr(field, "auto_created", False):
                        continue
                    if not getattr(field, "concrete", True):
                        continue
                    if field.many_to_many or field.one_to_many:
                        continue
                    if getattr(field, "primary_key", False):
                        continue

                    name = field.name
                    if name == "language":
                        create_kwargs[name] = language
                    elif name == "translation_group":
                        create_kwargs[name] = getattr(instance, "translation_group")
                    elif name in translations:
                        create_kwargs[name] = translations[name]
                    else:
                        create_kwargs[name] = _clone_field_value(instance, name)

                new_instance = model.objects.create(**create_kwargs)

                for m2m_field in model._meta.many_to_many:
                    try:
                        getattr(new_instance, m2m_field.name).set(
                            getattr(instance, m2m_field.name).all()
                        )
                    except Exception:  # pragma: no cover - defensive copy
                        LOGGER.exception(
                            "Failed to copy many-to-many field '%s' for %s translation (%s).",
                            m2m_field.name,
                            model.__name__,
                            language,
                        )

                for copier in copy_related or ():  # pragma: no branch - iterate when provided
                    try:
                        copier(instance, new_instance, language)
                    except Exception:  # pragma: no cover - defensive copy
                        LOGGER.exception(
                            "Related copier failed for %s translation (%s).",
                            model.__name__,
                            language,
                        )
    except Exception:  # pragma: no cover - defensive logging
        LOGGER.exception(
            "Failed to auto-generate translations for %s (%s).",
            model.__name__,
            getattr(instance, "pk", None),
        )


def auto_translate_instance(
    instance: models.Model,
    *,
    fields: Optional[Sequence[str]] = None,
    copy_related: Optional[Sequence[Callable[[models.Model, models.Model, str], None]]] = None,
    target_languages: Optional[Sequence[str]] = None,
    fallback_to_source: bool = True,
) -> None:
    """Convenience wrapper that looks up configured fields for *instance*."""
    fields_to_translate = list(fields or TRANSLATABLE_FIELD_MAP.get(instance._meta.label_lower, ()))
    if not fields_to_translate:
        LOGGER.debug(
            "No translatable fields configured for model '%s'; skipping auto translation.",
            instance._meta.label_lower,
        )
        return

    generate_translations_for_instance(
        instance,
        fields_to_translate=fields_to_translate,
        target_languages=target_languages,
        copy_related=copy_related,
        fallback_to_source=fallback_to_source,
    )

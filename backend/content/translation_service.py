"""
Translation service using GeminAI API for multilingual content translation.
"""
import os
import logging
from typing import Dict, List, Optional
import google.generativeai as genai
from django.conf import settings

logger = logging.getLogger(__name__)

# Supported language codes and their full names
SUPPORTED_LANGUAGES = {
    'en': 'English',
    'tr': 'Turkish',
    'ar': 'Arabic',
    'ch': 'Chinese',
    'jp': 'Japanese',
    'chsi': 'Chinese Simplified'
}


class TranslationService:
    """Service for translating text using GeminAI API."""
    
    def __init__(self):
        """Initialize the GeminAI translation service."""
        api_key = getattr(settings, 'GEMINI_API_KEY', os.environ.get('GEMINI_API_KEY'))
        if not api_key:
            logger.warning("GEMINI_API_KEY not configured. Translation service will not work.")
            self.model = None
        else:
            try:
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel('gemini-pro')
                logger.info("GeminAI translation service initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize GeminAI: {e}")
                self.model = None
    
    def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Translate text from source language to target language.
        
        Args:
            text: Text to translate
            source_lang: Source language code (en, tr, ar, ch, jp, chsi)
            target_lang: Target language code
            
        Returns:
            Translated text
        """
        if not self.model:
            logger.error("Translation model not initialized")
            return text
        
        if source_lang not in SUPPORTED_LANGUAGES or target_lang not in SUPPORTED_LANGUAGES:
            logger.error(f"Unsupported language: {source_lang} -> {target_lang}")
            return text
        
        if not text or not text.strip():
            return text
        
        try:
            source_lang_name = SUPPORTED_LANGUAGES[source_lang]
            target_lang_name = SUPPORTED_LANGUAGES[target_lang]
            
            prompt = f"""Translate the following text from {source_lang_name} to {target_lang_name}.
Only provide the translation, without any additional explanation or commentary.

Text to translate:
{text}

Translation:"""
            
            response = self.model.generate_content(prompt)
            translated_text = response.text.strip()
            
            logger.info(f"Successfully translated text from {source_lang} to {target_lang}")
            return translated_text
            
        except Exception as e:
            logger.error(f"Translation error ({source_lang} -> {target_lang}): {e}")
            return text
    
    def translate_category(
        self, 
        name: str, 
        description: str, 
        source_lang: str, 
        target_languages: List[str]
    ) -> Dict[str, Dict[str, str]]:
        """
        Translate category name and description to multiple languages.
        
        Args:
            name: Category name to translate
            description: Category description to translate
            source_lang: Source language code
            target_languages: List of target language codes
            
        Returns:
            Dictionary mapping language codes to translations:
            {
                'tr': {'name': 'translated_name', 'description': 'translated_desc'},
                'ar': {'name': 'translated_name', 'description': 'translated_desc'},
                ...
            }
        """
        translations = {}
        
        for target_lang in target_languages:
            if target_lang == source_lang:
                continue
            
            try:
                translated_name = self.translate_text(name, source_lang, target_lang)
                translated_description = self.translate_text(description, source_lang, target_lang) if description else ""
                
                translations[target_lang] = {
                    'name': translated_name,
                    'description': translated_description
                }
                
                logger.info(f"Translated category to {target_lang}")
                
            except Exception as e:
                logger.error(f"Failed to translate category to {target_lang}: {e}")
                translations[target_lang] = {
                    'name': name,
                    'description': description
                }
        
        return translations
    
    def translate_all_languages(
        self,
        name: str,
        description: str,
        source_lang: str,
        exclude_languages: Optional[List[str]] = None
    ) -> Dict[str, Dict[str, str]]:
        """
        Translate to all supported languages except source and excluded ones.
        
        Args:
            name: Text to translate
            description: Description to translate
            source_lang: Source language code
            exclude_languages: Languages to exclude from translation
            
        Returns:
            Dictionary of translations by language code
        """
        exclude = exclude_languages or []
        target_languages = [
            lang for lang in SUPPORTED_LANGUAGES.keys()
            if lang != source_lang and lang not in exclude
        ]
        
        return self.translate_category(name, description, source_lang, target_languages)


# Singleton instance
_translation_service = None


def get_translation_service() -> TranslationService:
    """Get or create the translation service singleton."""
    global _translation_service
    if _translation_service is None:
        _translation_service = TranslationService()
    return _translation_service

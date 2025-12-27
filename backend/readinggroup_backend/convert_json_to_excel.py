#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Convert JSON to Excel (.xlsx) in a clean, testable way.

Usage:
    python json_to_excel.py path/to/input.json [-o output.xlsx] [--sheet translations] [--encoding utf-8]

Examples:
    python json_to_excel.py translations_zh_Hant.json
    python json_to_excel.py data.json -o out.xlsx --sheet my_sheet
"""
from __future__ import annotations

import argparse
import json
import logging
from pathlib import Path
from typing import Any, List, Sequence, Tuple

import pandas as pd

# ==========================
# General Settings
# ==========================
DEFAULT_SHEET_NAME = "translations"
DEFAULT_ENCODING = "utf-8"
DEFAULT_LOCALES_SEGMENT = ("frontend", "src", "i18n", "locales")

logger = logging.getLogger(__name__)


# ==========================
# Pure Helper Functions
# ==========================


def flatten_json(data: Any, parent_key: str = "") -> List[Tuple[str, Any]]:
    """Flattens general JSON (dict/list) into a list of (path, value) pairs.
    Example path: "a.b[0].c"
    """
    rows: List[Tuple[str, Any]] = []

    def _walk(node: Any, key_path: str) -> None:
        if isinstance(node, dict):
            for k, v in node.items():
                _walk(v, f"{key_path}.{k}" if key_path else str(k))
        elif isinstance(node, list):
            for i, v in enumerate(node):
                _walk(v, f"{key_path}[{i}]")
        else:
            rows.append((key_path, node))

    _walk(data, parent_key)
    return rows


def is_two_column_translation(obj: Any) -> bool:
    """Considers it a simple translation map if it's a dict and all values are strings."""
    return isinstance(obj, dict) and all(isinstance(v, str) for v in obj.values())


def load_json(path: Path, encoding: str = DEFAULT_ENCODING) -> Any:
    """Reads JSON from disk and returns it as a Python object.

    Supports BOM presence when using "utf-8" (commonly works automatically with json.loads).
    """
    try:
        text = path.read_text(encoding=encoding)
        return json.loads(text)
    except FileNotFoundError as exc:
        raise SystemExit(f"لا يمكن العثور على الملف: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"ملف JSON غير صالح: {path}: {exc}") from exc


def json_to_dataframe(data: Any) -> pd.DataFrame:
    """Converts JSON to a DataFrame:

    - If it's a simple text dict: two columns (English, Traditional Chinese)
    - Otherwise: two columns (key_path, value) after flattening
    """
    if is_two_column_translation(data):
        rows = [{"English": k, "Traditional Chinese": v} for k, v in data.items()]
        df = pd.DataFrame(rows).sort_values("English").reset_index(drop=True)
    else:
        flat = flatten_json(data)
        df = (
            pd.DataFrame(flat, columns=["key_path", "value"])  # type: ignore[call-arg]
            .sort_values("key_path")
            .reset_index(drop=True)
        )
    return df


def write_excel(
    df: pd.DataFrame, out_path: Path, sheet_name: str = DEFAULT_SHEET_NAME
) -> None:
    """يحفظ DataFrame إلى ملف Excel باستخدام openpyxl."""
    try:
        with pd.ExcelWriter(out_path, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name=sheet_name)
    except Exception as exc:  # pragma: no cover - depends on openpyxl environment
        raise SystemExit(f"Failed to create Excel file: {exc}") from exc


# ==========================
# Helper Functions for Files and Paths
# ==========================


def find_repo_root(start: Path | None = None) -> Path:
    """Tries to find the repository root based on the known locales directory.

    If not found, returns the current directory.
    """
    start = (start or Path.cwd()).resolve()
    repo_root = start
    while True:
        maybe = repo_root.joinpath(*DEFAULT_LOCALES_SEGMENT)
        if maybe.exists():
            return repo_root
        if repo_root.parent == repo_root:
            # Reached the system root without finding it
            return start
        repo_root = repo_root.parent


def default_locales_dir(base: Path) -> Path:
    return base.joinpath(*DEFAULT_LOCALES_SEGMENT)


def infer_default_input(locales_dir: Path) -> Path:
    """Infers a suitable translation file when running interactively.

    Priority:
      1) frontend/src/i18n/locales/ch/translation.json if it exists
      2) The first translation.json file under any language directory
    """
    candidate = locales_dir / "ch" / "translation.json"
    if candidate.exists():
        logger.info("No input provided – using default: %s", candidate)
        return candidate

    found = list(locales_dir.glob("*/translation.json")) if locales_dir.exists() else []
    if found:
        logger.info("No input provided – using found file: %s", found[0])
        return found[0]

    raise SystemExit(
        "No default translation file found. Pass a JSON file path as an argument "
        "or ensure frontend/src/i18n/locales/<lang>/translation.json exists."
    )


# ==========================
# Entry Point (CLI)
# ==========================


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Convert JSON to Excel (.xlsx)")
    parser.add_argument(
        "input_json",
        nargs="?",
        default=None,
        help=(
            "Path to input JSON file (e.g. frontend/src/i18n/locales/ar/translation.json). "
            "If omitted when running inside interactive shells the script will try to pick a sensible default."
        ),
    )
    parser.add_argument(
        "-o",
        "--output",
        help="Output .xlsx path (default: same name as input with .xlsx)",
    )
    parser.add_argument(
        "--sheet", default=DEFAULT_SHEET_NAME, help="Sheet name inside Excel"
    )
    parser.add_argument(
        "--encoding",
        default=DEFAULT_ENCODING,
        help="Encoding for reading JSON (default: utf-8)",
    )
    parser.add_argument(
        "-v", "--verbose", action="store_true", help="Enable detailed logging (DEBUG)"
    )
    return parser.parse_args(argv)


def configure_logging(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(level=level, format="%(levelname)s: %(message)s")


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    configure_logging(args.verbose)

    # Determine input path
    in_arg = args.input_json

    # Try using __file__ to determine repo roots if available
    try:
        repo_root = Path(__file__).resolve().parents[2]
    except NameError:
        repo_root = find_repo_root(Path.cwd())

    locales_dir = default_locales_dir(repo_root)

    if (in_arg is None) or (isinstance(in_arg, str) and in_arg.lower() == "shell_plus"):
        in_path = infer_default_input(locales_dir)
    else:
        in_path = Path(in_arg).expanduser().resolve()

    if not in_path.exists():
        raise SystemExit(f"Cannot find file: {in_path}")

    out_path = (
        Path(args.output).expanduser().resolve()
        if args.output
        else in_path.with_suffix(".xlsx")
    )

    # Process data
    data = load_json(in_path, encoding=args.encoding)
    df = json_to_dataframe(data)

    # Save file
    write_excel(df, out_path, sheet_name=args.sheet)
    logger.info("File created: %s", out_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

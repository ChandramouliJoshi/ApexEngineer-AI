from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

CACHE_DIR = BASE_DIR / "cache"
DATA_DIR = BASE_DIR / "data"

CACHE_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)
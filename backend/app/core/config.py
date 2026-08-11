from pathlib import Path


# backend/
BASE_DIR = Path(__file__).resolve().parents[2]

# backend/cache/
CACHE_DIR = BASE_DIR / "cache"

# Create cache directory automatically
CACHE_DIR.mkdir(
    parents=True,
    exist_ok=True
)
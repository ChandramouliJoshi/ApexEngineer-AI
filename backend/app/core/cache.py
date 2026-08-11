import fastf1

from app.core.config import CACHE_DIR


def enable_cache():
    """
    Enable FastF1 caching.
    """

    fastf1.Cache.enable_cache(
        str(CACHE_DIR)
    )
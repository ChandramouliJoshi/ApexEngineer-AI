import fastf1

from app.core.config import CACHE_DIR

# Enable local cache
fastf1.Cache.enable_cache(CACHE_DIR)


class FastF1Service:

    def get_session(self, year: int, grand_prix: str, session_type: str = "R"):
        """
        Load an F1 session.

        Example:
        year = 2025
        grand_prix = "Monaco"
        session_type = "R"
        """

        session = fastf1.get_session(
            year,
            grand_prix,
            session_type
        )

        session.load()

        return session
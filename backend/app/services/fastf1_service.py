import fastf1

from app.core.config import CACHE_DIR


class FastF1Service:

    def __init__(self):
        fastf1.Cache.enable_cache(str(CACHE_DIR))

        self._session_cache = {}

    def load_session(
        self,
        year: int,
        grand_prix: str,
        session_type: str = "R"
    ):
        """
        Load and return a FastF1 session.

        Already-loaded sessions are reused from memory.
        """

        cache_key = (
            year,
            grand_prix,
            session_type
        )

        # Return already loaded session
        if cache_key in self._session_cache:
            return self._session_cache[cache_key]

        # Load session from FastF1
        session = fastf1.get_session(
            year,
            grand_prix,
            session_type
        )

        session.load()

        # Store loaded session in memory
        self._session_cache[cache_key] = session

        return session
import fastf1

from app.core.config import CACHE_DIR


class FastF1Service:

    def __init__(self):
        fastf1.Cache.enable_cache(str(CACHE_DIR))

    def load_session(
        self,
        year: int,
        grand_prix: str,
        session_type: str = "R"
    ):
        session = fastf1.get_session(
            year,
            grand_prix,
            session_type
        )

        session.load()

        return session
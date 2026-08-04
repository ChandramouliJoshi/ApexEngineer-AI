from app.services.session_service import SessionService


class LapService:
    def __init__(self):
        self.session_service = SessionService()

    def get_all_laps(
        self,
        year: int,
        grand_prix: str,
        session_type: str = "R"
    ):
        """
        Returns all laps in a session.
        """

        session = self.session_service.get_session(
            year,
            grand_prix,
            session_type
        )

        return session.laps

    def get_driver_laps(
        self,
        year: int,
        grand_prix: str,
        driver: str,
        session_type: str = "R"
    ):
        """
        Returns all laps completed by a driver.
        """

        laps = self.get_all_laps(
            year,
            grand_prix,
            session_type
        )

        return laps.pick_drivers(driver)

    def get_fastest_lap(
        self,
        year: int,
        grand_prix: str,
        driver: str,
        session_type: str = "R"
    ):
        """
        Returns the fastest lap for a driver.
        """

        driver_laps = self.get_driver_laps(
            year,
            grand_prix,
            driver,
            session_type
        )

        return driver_laps.pick_fastest()

    def get_stints(
        self,
        year: int,
        grand_prix: str,
        driver: str,
        session_type: str = "R"
    ):
        """
        Returns all stints completed by a driver.
        """

        driver_laps = self.get_driver_laps(
            year,
            grand_prix,
            driver,
            session_type
        )

        return driver_laps.groupby("Stint")
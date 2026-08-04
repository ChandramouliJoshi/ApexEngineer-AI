from app.services.session_service import SessionService


class TelemetryService:
    def __init__(self):
        self.session_service = SessionService()

    def get_fastest_lap(
        self,
        year: int,
        grand_prix: str,
        driver: str,
        session_type: str = "R"
    ):
        """
        Returns the fastest lap for the given driver.
        """

        session = self.session_service.get_session(
            year,
            grand_prix,
            session_type
        )

        driver_laps = session.laps.pick_drivers(driver)

        fastest_lap = driver_laps.pick_fastest()

        return fastest_lap

    def get_telemetry(
        self,
        year: int,
        grand_prix: str,
        driver: str,
        session_type: str = "R"
    ):
        """
        Returns telemetry data for the driver's fastest lap.
        """

        fastest_lap = self.get_fastest_lap(
            year,
            grand_prix,
            driver,
            session_type
        )

        telemetry = fastest_lap.get_car_data().add_distance()

        return telemetry
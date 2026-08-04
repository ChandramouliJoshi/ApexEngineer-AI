from app.services.lap_service import LapService


class TelemetryService:
    def __init__(self):
        self.lap_service = LapService()

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

        return self.lap_service.get_fastest_lap(
            year,
            grand_prix,
            driver,
            session_type
        )

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

        return fastest_lap.get_car_data().add_distance()

    def get_telemetry_from_session(
        self,
        session,
        driver: str
    ):
        """
        Returns telemetry for a driver's fastest lap from an
        already loaded session.
        """

        fastest_lap = (
            session.laps
            .pick_drivers(driver)
            .pick_fastest()
        )

        return fastest_lap.get_car_data().add_distance()
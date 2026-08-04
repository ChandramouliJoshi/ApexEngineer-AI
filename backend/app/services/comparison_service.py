from app.services.session_service import SessionService
from app.services.telemetry_service import TelemetryService


class ComparisonService:

    def __init__(self):
        self.session_service = SessionService()
        self.telemetry_service = TelemetryService()

    def compare_drivers(
        self,
        year: int,
        grand_prix: str,
        driver_1: str,
        driver_2: str,
        session_type: str = "R"
    ):
        # Load the session only once
        session = self.session_service.get_session(
            year,
            grand_prix,
            session_type
        )

        telemetry_1 = self.telemetry_service.get_telemetry_from_session(
            session,
            driver_1
        )

        telemetry_2 = self.telemetry_service.get_telemetry_from_session(
            session,
            driver_2
        )

        return telemetry_1, telemetry_2
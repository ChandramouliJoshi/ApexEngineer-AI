from fastapi import APIRouter

from app.services.telemetry_service import TelemetryService


router = APIRouter(
    prefix="/telemetry",
    tags=["Telemetry"]
)

telemetry_service = TelemetryService()


@router.get("/")
def get_telemetry(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R"
):
    """
    Returns telemetry data for a driver's fastest lap.
    """

    telemetry = telemetry_service.get_telemetry(
        year,
        grand_prix,
        driver,
        session_type
    )

    return telemetry.to_dict(orient="records")
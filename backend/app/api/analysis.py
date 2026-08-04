from fastapi import APIRouter

from app.analytics.telemetry_analysis import TelemetryAnalysis
from app.services.telemetry_service import TelemetryService

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)

telemetry_service = TelemetryService()


@router.get("/summary")
def telemetry_summary(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R"
):

    telemetry = telemetry_service.get_telemetry(
        year,
        grand_prix,
        driver,
        session_type
    )

    analysis = TelemetryAnalysis(
        telemetry
    )

    return analysis.get_summary()
from fastapi import APIRouter

from app.services.session_service import SessionService
from app.services.telemetry_service import TelemetryService

from app.analytics.corner_analysis import CornerAnalysis
from app.analytics.corner_comparison import CornerComparison
from app.analytics.delta_analysis import DeltaAnalysis
from app.analytics.telemetry_analysis import TelemetryAnalysis


router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


session_service = SessionService()
telemetry_service = TelemetryService()


@router.get("/telemetry")
def analyze_telemetry(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R"
):
    """
    Returns telemetry analysis metrics for a driver's fastest lap.
    """

    telemetry = telemetry_service.get_telemetry(
        year,
        grand_prix,
        driver,
        session_type
    )

    analysis = TelemetryAnalysis(telemetry)

    return analysis.get_summary()


@router.get("/corners")
def analyze_corners(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R"
):
    """
    Returns corner-by-corner analysis for a driver.
    """

    telemetry = telemetry_service.get_telemetry(
        year,
        grand_prix,
        driver,
        session_type
    )

    session = session_service.get_session(
        year,
        grand_prix,
        session_type
    )

    analysis = CornerAnalysis(
        telemetry,
        session.get_circuit_info()
    )

    return analysis.analyze_all_corners()


@router.get("/corner-comparison")
def compare_corners(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver_1: str = "VER",
    driver_2: str = "NOR",
    session_type: str = "R"
):
    """
    Compares two drivers corner by corner.
    """

    telemetry_1 = telemetry_service.get_telemetry(
        year,
        grand_prix,
        driver_1,
        session_type
    )

    telemetry_2 = telemetry_service.get_telemetry(
        year,
        grand_prix,
        driver_2,
        session_type
    )

    session = session_service.get_session(
        year,
        grand_prix,
        session_type
    )

    comparison = CornerComparison()

    return comparison.compare_drivers(
        telemetry_1,
        telemetry_2,
        session.get_circuit_info(),
        driver_1,
        driver_2
    )


@router.get("/delta")
def analyze_delta(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver_1: str = "VER",
    driver_2: str = "NOR",
    session_type: str = "R"
):
    """
    Returns telemetry deltas between two drivers.
    """

    telemetry_1 = telemetry_service.get_telemetry(
        year,
        grand_prix,
        driver_1,
        session_type
    )

    telemetry_2 = telemetry_service.get_telemetry(
        year,
        grand_prix,
        driver_2,
        session_type
    )

    delta = DeltaAnalysis(
        telemetry_1,
        telemetry_2
    )

    result = delta.calculate_deltas()

    return result.to_dict(orient="records")
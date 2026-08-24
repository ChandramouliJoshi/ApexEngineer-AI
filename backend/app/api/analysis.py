from fastapi import APIRouter

from app.services.session_service import SessionService
from app.services.telemetry_service import TelemetryService
from app.services.lap_service import LapService
from app.services.ai_engineer import AIEngineer

from app.analytics.corner_analysis import CornerAnalysis
from app.analytics.corner_comparison import CornerComparison
from app.analytics.delta_analysis import DeltaAnalysis
from app.analytics.telemetry_analysis import TelemetryAnalysis
from app.analytics.sector_analysis import SectorAnalysis
from app.analytics.sector_comparison import SectorComparison
from app.analytics.tyre_analysis import TyreAnalysis
from app.analytics.weather_analysis import WeatherAnalysis


router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


session_service = SessionService()
telemetry_service = TelemetryService()
lap_service = LapService()


# ==========================================================
# TELEMETRY
# ==========================================================

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


# ==========================================================
# CORNERS
# ==========================================================

@router.get("/corners")
def analyze_corners(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R"
):
    """
    Returns detailed corner-by-corner analysis for a driver.
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

    circuit_info = session.get_circuit_info()

    analysis = CornerAnalysis(
        telemetry,
        circuit_info
    )

    return analysis.analyze_all_corners()


# ==========================================================
# CORNER COMPARISON
# ==========================================================

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

    circuit_info = session.get_circuit_info()

    comparison = CornerComparison()

    return comparison.compare_drivers(
        telemetry_1,
        telemetry_2,
        circuit_info,
        driver_1,
        driver_2
    )


# ==========================================================
# DELTA
# ==========================================================

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

    return result.to_dict(
        orient="records"
    )


# ==========================================================
# SECTORS
# ==========================================================

@router.get("/sectors")
def analyze_sectors(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R"
):
    """
    Returns sector performance analysis for a driver.
    """

    laps = lap_service.get_driver_laps(
        year,
        grand_prix,
        driver,
        session_type
    )

    analysis = SectorAnalysis(laps)

    return analysis.get_summary()


# ==========================================================
# SECTOR COMPARISON
# ==========================================================

@router.get("/sector-comparison")
def compare_sectors(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver_1: str = "VER",
    driver_2: str = "NOR",
    session_type: str = "R"
):
    """
    Compares fastest sector times between two drivers.
    """

    laps_1 = lap_service.get_driver_laps(
        year,
        grand_prix,
        driver_1,
        session_type
    )

    laps_2 = lap_service.get_driver_laps(
        year,
        grand_prix,
        driver_2,
        session_type
    )

    comparison = SectorComparison(
        laps_1,
        laps_2
    )

    result = comparison.compare()

    result["driver_1"] = driver_1
    result["driver_2"] = driver_2

    return result


# ==========================================================
# TYRES
# ==========================================================

@router.get("/tyres")
def analyze_tyres(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R"
):
    """
    Returns tyre and stint analysis for a driver.
    """

    laps = lap_service.get_driver_laps(
        year,
        grand_prix,
        driver,
        session_type
    )

    analysis = TyreAnalysis(laps)

    return analysis.get_summary()


# ==========================================================
# WEATHER
# ==========================================================

@router.get("/weather")
def analyze_weather(
    year: int = 2025,
    grand_prix: str = "Monaco",
    session_type: str = "R"
):
    """
    Returns weather conditions for a session.
    """

    session = session_service.get_session(
        year,
        grand_prix,
        session_type
    )

    analysis = WeatherAnalysis(session)

    return analysis.get_summary()


# ==========================================================
# AI ENGINEER
# ==========================================================

@router.get("/engineer")
def engineer_report(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R"
):
    """
    Returns a complete AI engineering report.

    Includes:
        - Telemetry analysis
        - Sector analysis
        - Corner-by-corner analysis
        - Corner engineering summary
        - Driver performance score
        - Performance breakdown
        - Engineering summary
        - AI recommendations
    """

    # ------------------------------------------------------
    # Load session
    # ------------------------------------------------------

    session = session_service.get_session(
        year,
        grand_prix,
        session_type
    )

    # ------------------------------------------------------
    # Load telemetry
    # ------------------------------------------------------

    telemetry = telemetry_service.get_telemetry_from_session(
        session,
        driver
    )

    # ------------------------------------------------------
    # Load laps
    # ------------------------------------------------------

    laps = lap_service.get_driver_laps(
        year,
        grand_prix,
        driver,
        session_type
    )

    # ------------------------------------------------------
    # Circuit information
    # ------------------------------------------------------

    circuit_info = session.get_circuit_info()

    # ------------------------------------------------------
    # Create AI Engineer
    # ------------------------------------------------------

    engineer = AIEngineer(
        telemetry,
        laps
    )

    # ------------------------------------------------------
    # Attach circuit information
    #
    # AIEngineer.generate_report() reads circuit_info
    # from the object itself.
    # ------------------------------------------------------

    engineer.circuit_info = circuit_info

    # ------------------------------------------------------
    # Generate complete report
    # ------------------------------------------------------

    return engineer.generate_report()


# ==========================================================
# AI ENGINEER COMPARISON
# ==========================================================

@router.get("/engineer-comparison")
def engineer_comparison(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver_1: str = "VER",
    driver_2: str = "NOR",
    session_type: str = "R"
):
    """
    Returns a complete engineering comparison
    between two drivers.

    Includes:
        - Driver performance scores
        - Sector comparison
        - Corner comparison
        - Overall winner
        - Biggest performance loss
        - Engineering diagnosis
    """

    # ------------------------------------------------------
    # Load session
    # ------------------------------------------------------

    session = session_service.get_session(
        year,
        grand_prix,
        session_type
    )

    # ------------------------------------------------------
    # Load telemetry
    # ------------------------------------------------------

    telemetry_1 = telemetry_service.get_telemetry_from_session(
        session,
        driver_1
    )

    telemetry_2 = telemetry_service.get_telemetry_from_session(
        session,
        driver_2
    )

    # ------------------------------------------------------
    # Load laps
    # ------------------------------------------------------

    laps_1 = lap_service.get_driver_laps(
        year,
        grand_prix,
        driver_1,
        session_type
    )

    laps_2 = lap_service.get_driver_laps(
        year,
        grand_prix,
        driver_2,
        session_type
    )

    # ------------------------------------------------------
    # Circuit information
    # ------------------------------------------------------

    circuit_info = session.get_circuit_info()

    # ------------------------------------------------------
    # Create AI Engineer
    # ------------------------------------------------------

    engineer = AIEngineer(
        telemetry_1,
        laps_1
    )

    # ------------------------------------------------------
    # Attach circuit information
    # ------------------------------------------------------

    engineer.circuit_info = circuit_info

    # ------------------------------------------------------
    # Generate comparison
    # ------------------------------------------------------

    return engineer.generate_comparison_report(
        telemetry_1,
        telemetry_2,
        circuit_info,
        driver_1,
        driver_2,
        laps_1,
        laps_2
    )
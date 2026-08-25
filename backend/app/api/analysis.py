from fastapi import APIRouter, HTTPException

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
    tags=["Analysis"],
)


# ==========================================================
# SERVICES
# ==========================================================

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
    session_type: str = "R",
):
    """
    Returns telemetry analysis metrics for a driver's
    fastest available telemetry lap.
    """

    try:
        telemetry = telemetry_service.get_telemetry(
            year,
            grand_prix,
            driver,
            session_type,
        )

        analysis = TelemetryAnalysis(telemetry)

        return analysis.get_summary()

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Telemetry analysis failed: {str(exc)}",
        )


# ==========================================================
# CORNERS
# ==========================================================

@router.get("/corners")
def analyze_corners(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R",
):
    """
    Returns detailed corner-by-corner analysis for a driver.
    """

    try:
        telemetry = telemetry_service.get_telemetry(
            year,
            grand_prix,
            driver,
            session_type,
        )

        session = session_service.get_session(
            year,
            grand_prix,
            session_type,
        )

        circuit_info = session.get_circuit_info()

        analysis = CornerAnalysis(
            telemetry,
            circuit_info,
        )

        return analysis.analyze_all_corners()

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Corner analysis failed: {str(exc)}",
        )


# ==========================================================
# CORNER COMPARISON
# ==========================================================

@router.get("/corner-comparison")
def compare_corners(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver_1: str = "VER",
    driver_2: str = "NOR",
    session_type: str = "R",
):
    """
    Compares two drivers corner by corner.
    """

    try:
        telemetry_1 = telemetry_service.get_telemetry(
            year,
            grand_prix,
            driver_1,
            session_type,
        )

        telemetry_2 = telemetry_service.get_telemetry(
            year,
            grand_prix,
            driver_2,
            session_type,
        )

        session = session_service.get_session(
            year,
            grand_prix,
            session_type,
        )

        circuit_info = session.get_circuit_info()

        comparison = CornerComparison()

        return comparison.compare_drivers(
            telemetry_1,
            telemetry_2,
            circuit_info,
            driver_1,
            driver_2,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Corner comparison failed: {str(exc)}",
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
    session_type: str = "R",
):
    """
    Returns telemetry deltas between two drivers.
    """

    try:
        telemetry_1 = telemetry_service.get_telemetry(
            year,
            grand_prix,
            driver_1,
            session_type,
        )

        telemetry_2 = telemetry_service.get_telemetry(
            year,
            grand_prix,
            driver_2,
            session_type,
        )

        delta = DeltaAnalysis(
            telemetry_1,
            telemetry_2,
        )

        result = delta.calculate_deltas()

        return result.to_dict(
            orient="records",
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Delta analysis failed: {str(exc)}",
        )


# ==========================================================
# SECTORS
# ==========================================================

@router.get("/sectors")
def analyze_sectors(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R",
):
    """
    Returns sector performance analysis for a driver.
    """

    try:
        laps = lap_service.get_driver_laps(
            year,
            grand_prix,
            driver,
            session_type,
        )

        analysis = SectorAnalysis(laps)

        return analysis.get_summary()

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Sector analysis failed: {str(exc)}",
        )


# ==========================================================
# SECTOR COMPARISON
# ==========================================================

@router.get("/sector-comparison")
def compare_sectors(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver_1: str = "VER",
    driver_2: str = "NOR",
    session_type: str = "R",
):
    """
    Compares fastest sector times between two drivers.
    """

    try:
        laps_1 = lap_service.get_driver_laps(
            year,
            grand_prix,
            driver_1,
            session_type,
        )

        laps_2 = lap_service.get_driver_laps(
            year,
            grand_prix,
            driver_2,
            session_type,
        )

        comparison = SectorComparison(
            laps_1,
            laps_2,
        )

        result = comparison.compare()

        result["driver_1"] = driver_1
        result["driver_2"] = driver_2

        return result

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Sector comparison failed: {str(exc)}",
        )


# ==========================================================
# TYRES
# ==========================================================

@router.get("/tyres")
def analyze_tyres(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R",
):
    """
    Returns tyre and stint analysis for a driver.
    """

    try:
        laps = lap_service.get_driver_laps(
            year,
            grand_prix,
            driver,
            session_type,
        )

        analysis = TyreAnalysis(laps)

        return analysis.get_summary()

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Tyre analysis failed: {str(exc)}",
        )


# ==========================================================
# WEATHER
# ==========================================================

@router.get("/weather")
def analyze_weather(
    year: int = 2025,
    grand_prix: str = "Monaco",
    session_type: str = "R",
):
    """
    Returns weather conditions for a session.
    """

    try:
        session = session_service.get_session(
            year,
            grand_prix,
            session_type,
        )

        analysis = WeatherAnalysis(session)

        return analysis.get_summary()

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Weather analysis failed: {str(exc)}",
        )


# ==========================================================
# AI ENGINEER REPORT
# ==========================================================

@router.get("/engineer")
def engineer_report(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R",
):
    """
    Returns a complete AI engineering report.

    Includes:
        - Telemetry summary
        - Sector performance
        - Corner analysis
        - Corner summary
        - Performance score
        - Performance breakdown
        - Engineering summary
        - Engineering recommendations
    """

    try:

        # --------------------------------------------------
        # SESSION
        # --------------------------------------------------

        session = session_service.get_session(
            year,
            grand_prix,
            session_type,
        )

        if session is None:
            raise ValueError(
                "Unable to load the requested session."
            )

        # --------------------------------------------------
        # TELEMETRY
        # --------------------------------------------------

        telemetry = telemetry_service.get_telemetry_from_session(
            session,
            driver,
        )

        if telemetry is None:
            raise ValueError(
                f"No telemetry available for driver {driver}."
            )

        # --------------------------------------------------
        # LAPS
        # --------------------------------------------------

        laps = lap_service.get_driver_laps(
            year,
            grand_prix,
            driver,
            session_type,
        )

        if laps is None:
            raise ValueError(
                f"No lap data available for driver {driver}."
            )

        # --------------------------------------------------
        # CIRCUIT
        # --------------------------------------------------

        circuit_info = session.get_circuit_info()

        # --------------------------------------------------
        # AI ENGINEER
        # --------------------------------------------------

        engineer = AIEngineer(
            telemetry,
            laps,
        )

        engineer.circuit_info = circuit_info

        # --------------------------------------------------
        # GENERATE REPORT
        # --------------------------------------------------

        report = engineer.generate_report()

        if report is None:
            raise ValueError(
                "AI Engineer returned no report."
            )

        return report

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Engineer report generation failed: {str(exc)}",
        )


# ==========================================================
# AI ENGINEER COMPARISON
# ==========================================================

@router.get("/engineer-comparison")
def engineer_comparison(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver_1: str = "VER",
    driver_2: str = "NOR",
    session_type: str = "R",
):
    """
    Returns a complete engineering comparison between
    two drivers.

    Includes:
        - Performance scores
        - Sector comparison
        - Corner comparison
        - Overall winner
        - Biggest performance loss
        - Engineering diagnosis
    """

    try:

        # --------------------------------------------------
        # SESSION
        # --------------------------------------------------

        session = session_service.get_session(
            year,
            grand_prix,
            session_type,
        )

        if session is None:
            raise ValueError(
                "Unable to load the requested session."
            )

        # --------------------------------------------------
        # DRIVER 1 TELEMETRY
        # --------------------------------------------------

        telemetry_1 = telemetry_service.get_telemetry_from_session(
            session,
            driver_1,
        )

        if telemetry_1 is None:
            raise ValueError(
                f"No telemetry available for driver {driver_1}."
            )

        # --------------------------------------------------
        # DRIVER 2 TELEMETRY
        # --------------------------------------------------

        telemetry_2 = telemetry_service.get_telemetry_from_session(
            session,
            driver_2,
        )

        if telemetry_2 is None:
            raise ValueError(
                f"No telemetry available for driver {driver_2}."
            )

        # --------------------------------------------------
        # LAPS
        # --------------------------------------------------

        laps_1 = lap_service.get_driver_laps(
            year,
            grand_prix,
            driver_1,
            session_type,
        )

        laps_2 = lap_service.get_driver_laps(
            year,
            grand_prix,
            driver_2,
            session_type,
        )

        if laps_1 is None:
            raise ValueError(
                f"No lap data available for driver {driver_1}."
            )

        if laps_2 is None:
            raise ValueError(
                f"No lap data available for driver {driver_2}."
            )

        # --------------------------------------------------
        # CIRCUIT
        # --------------------------------------------------

        circuit_info = session.get_circuit_info()

        # --------------------------------------------------
        # AI ENGINEER
        # --------------------------------------------------

        engineer = AIEngineer(
            telemetry_1,
            laps_1,
        )

        engineer.circuit_info = circuit_info

        # --------------------------------------------------
        # GENERATE COMPARISON
        # --------------------------------------------------

        report = engineer.generate_comparison_report(
            telemetry_1,
            telemetry_2,
            circuit_info,
            driver_1,
            driver_2,
            laps_1,
            laps_2,
        )

        if report is None:
            raise ValueError(
                "AI Engineer returned no comparison report."
            )

        return report

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Engineer comparison failed: {str(exc)}",
        )
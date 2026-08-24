from fastapi import APIRouter, HTTPException

from app.services.telemetry_service import TelemetryService


router = APIRouter(
    prefix="/telemetry",
    tags=["Telemetry"]
)


telemetry_service = TelemetryService()


# ==========================================================
# TELEMETRY
# ==========================================================

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

    # ------------------------------------------------------
    # Validate year
    # ------------------------------------------------------

    if year < 2018:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_YEAR",
                "message": "Year must be 2018 or later."
            }
        )

    # ------------------------------------------------------
    # Validate Grand Prix
    # ------------------------------------------------------

    grand_prix = grand_prix.strip()

    if not grand_prix:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_GRAND_PRIX",
                "message": "Grand Prix cannot be empty."
            }
        )

    # ------------------------------------------------------
    # Normalize driver
    # ------------------------------------------------------

    driver = driver.strip().upper()

    if not driver:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_DRIVER",
                "message": "Driver code cannot be empty."
            }
        )

    # ------------------------------------------------------
    # Validate session type
    # ------------------------------------------------------

    session_type = session_type.strip().upper()

    allowed_sessions = {
        "FP1",
        "FP2",
        "FP3",
        "Q",
        "S",
        "SQ",
        "R"
    }

    if session_type not in allowed_sessions:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_SESSION_TYPE",
                "message": (
                    "Invalid session type. "
                    "Use FP1, FP2, FP3, Q, S, SQ or R."
                )
            }
        )

    # ------------------------------------------------------
    # Load telemetry
    # ------------------------------------------------------

    try:

        telemetry = telemetry_service.get_telemetry(
            year,
            grand_prix,
            driver,
            session_type
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail={
                "code": "TELEMETRY_LOAD_ERROR",
                "message": str(exc)
            }
        )

    # ------------------------------------------------------
    # Validate returned telemetry
    # ------------------------------------------------------

    if telemetry is None:

        raise HTTPException(
            status_code=404,
            detail={
                "code": "TELEMETRY_NOT_FOUND",
                "message": (
                    "No telemetry data was found for "
                    f"{driver} in {grand_prix}."
                )
            }
        )

    # ------------------------------------------------------
    # Return JSON-compatible telemetry
    # ------------------------------------------------------

    return telemetry.to_dict(
        orient="records"
    )
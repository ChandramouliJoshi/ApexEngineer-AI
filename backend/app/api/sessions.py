from fastapi import APIRouter, HTTPException

from app.services.session_service import SessionService


router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"]
)


session_service = SessionService()


# ==========================================================
# SESSION INFO
# ==========================================================

@router.get("/info")
def get_session_info(
    year: int = 2025,
    grand_prix: str = "Monaco",
    session_type: str = "R"
):
    """
    Returns information about an F1 session.
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

    if not grand_prix.strip():
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_GRAND_PRIX",
                "message": "Grand Prix cannot be empty."
            }
        )

    # ------------------------------------------------------
    # Validate session type
    # ------------------------------------------------------

    session_type = session_type.upper().strip()

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
    # Load session
    # ------------------------------------------------------

    try:

        return session_service.get_session_info(
            year,
            grand_prix.strip(),
            session_type
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail={
                "code": "SESSION_LOAD_ERROR",
                "message": str(exc)
            }
        )
from fastapi import APIRouter

from app.services.session_service import SessionService

router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"]
)

session_service = SessionService()


@router.get("/info")
def get_session_info(
    year: int = 2025,
    grand_prix: str = "Monaco",
    session_type: str = "R"
):
    """
    Returns information about an F1 session.
    """

    return session_service.get_session_info(
        year,
        grand_prix,
        session_type
    )
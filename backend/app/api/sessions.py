from fastapi import APIRouter

from app.services.session_service import SessionService

router = APIRouter(
    prefix="/session",
    tags=["Session"]
)

session_service = SessionService()


@router.get("/")
def get_session(
    year: int = 2025,
    grand_prix: str = "Monaco",
    session_type: str = "R"
):
    return session_service.get_session_info(
        year,
        grand_prix,
        session_type
    )
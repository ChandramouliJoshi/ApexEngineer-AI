from fastapi import APIRouter

from app.services.session_service import SessionService


router = APIRouter(
    prefix="/drivers",
    tags=["Drivers"]
)

session_service = SessionService()


@router.get("/")
def get_drivers(
    year: int = 2025,
    grand_prix: str = "Monaco",
    session_type: str = "R"
):
    """
    Returns the drivers participating in the selected session.
    """

    session = session_service.get_session(
        year,
        grand_prix,
        session_type
    )

    drivers = []

    for driver_number in session.drivers:

        driver_info = session.get_driver(driver_number)

        drivers.append({
            "driver_number": str(driver_number),
            "abbreviation": driver_info["Abbreviation"],
            "full_name": driver_info["FullName"],
            "team": driver_info["TeamName"]
        })

    return {
        "drivers": drivers
    }
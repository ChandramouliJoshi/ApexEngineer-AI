import pandas as pd

from fastapi import APIRouter

from app.services.lap_service import LapService


router = APIRouter(
    prefix="/laps",
    tags=["Laps"]
)

lap_service = LapService()


@router.get("/")
def get_all_laps(
    year: int = 2025,
    grand_prix: str = "Monaco",
    session_type: str = "R",
    limit: int = 20,
    offset: int = 0
):
    """
    Returns a paginated list of laps in a session.
    """

    laps = lap_service.get_all_laps(
        year,
        grand_prix,
        session_type
    )

    total = len(laps)

    paginated_laps = laps.iloc[
        offset:offset + limit
    ].copy()

    # Convert NaN / NaT values to None
    # so FastAPI can safely serialize the data as JSON.
    paginated_laps = paginated_laps.astype(object).where(
        pd.notna(paginated_laps),
        None
    )

    records = paginated_laps.to_dict(
        orient="records"
    )

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "laps": records
    }


@router.get("/driver")
def get_driver_laps(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R"
):
    """
    Returns all laps completed by a driver.
    """

    laps = lap_service.get_driver_laps(
        year,
        grand_prix,
        driver,
        session_type
    )

    laps = laps.astype(object).where(
        pd.notna(laps),
        None
    )

    return laps.to_dict(
        orient="records"
    )


@router.get("/fastest")
def get_fastest_lap(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R"
):
    """
    Returns the fastest lap for a driver.
    """

    lap = lap_service.get_fastest_lap(
        year,
        grand_prix,
        driver,
        session_type
    )

    if lap is None:
        return {
            "error": "No valid lap found"
        }

    return {
        "driver": driver,

        "lap_number": (
            float(lap["LapNumber"])
            if pd.notna(lap["LapNumber"])
            else None
        ),

        "lap_time": (
            str(lap["LapTime"])
            if pd.notna(lap["LapTime"])
            else None
        ),

        "compound": (
            str(lap["Compound"])
            if pd.notna(lap["Compound"])
            else None
        ),

        "tyre_life": (
            float(lap["TyreLife"])
            if pd.notna(lap["TyreLife"])
            else None
        ),

        "position": (
            float(lap["Position"])
            if pd.notna(lap["Position"])
            else None
        )
    }


@router.get("/stints")
def get_driver_stints(
    year: int = 2025,
    grand_prix: str = "Monaco",
    driver: str = "VER",
    session_type: str = "R"
):
    """
    Returns stint information for a driver.
    """

    stints = lap_service.get_stints(
        year,
        grand_prix,
        driver,
        session_type
    )

    result = []

    for stint_number, stint_data in stints:

        result.append({
            "stint": int(stint_number),

            "laps": len(stint_data),

            "compound": (
                str(stint_data["Compound"].iloc[0])
                if (
                    not stint_data.empty
                    and pd.notna(
                        stint_data["Compound"].iloc[0]
                    )
                )
                else None
            ),

            "tyre_life_start": (
                float(stint_data["TyreLife"].iloc[0])
                if (
                    not stint_data.empty
                    and pd.notna(
                        stint_data["TyreLife"].iloc[0]
                    )
                )
                else None
            ),

            "tyre_life_end": (
                float(stint_data["TyreLife"].iloc[-1])
                if (
                    not stint_data.empty
                    and pd.notna(
                        stint_data["TyreLife"].iloc[-1]
                    )
                )
                else None
            )
        })

    return result
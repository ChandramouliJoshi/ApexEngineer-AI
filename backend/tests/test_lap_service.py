from app.services.lap_service import LapService


def test_get_fastest_lap():

    lap_service = LapService()

    fastest = lap_service.get_fastest_lap(
        2025,
        "Monaco",
        "VER"
    )

    assert fastest is not None
    assert fastest.Driver == "VER"
    assert fastest.LapNumber is not None
    assert fastest.LapTime is not None
    assert fastest.Compound is not None
    assert fastest.TyreLife is not None
    assert fastest.Position is not None
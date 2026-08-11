from app.services.telemetry_service import TelemetryService


def test_get_fastest_lap():

    telemetry = TelemetryService()

    lap = telemetry.get_fastest_lap(
        2025,
        "Monaco",
        "VER"
    )

    assert lap is not None
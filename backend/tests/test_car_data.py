from app.services.telemetry_service import TelemetryService


def test_car_data():

    telemetry_service = TelemetryService()

    telemetry = telemetry_service.get_telemetry(
        year=2025,
        grand_prix="Monaco",
        driver="VER",
        session_type="R"
    )

    assert telemetry is not None
    assert not telemetry.empty

    # Core telemetry columns expected from FastF1
    required_columns = [
        "Speed",
        "RPM",
        "nGear",
        "Throttle",
        "Brake",
        "DRS",
        "Distance"
    ]

    for column in required_columns:
        assert column in telemetry.columns

    # Verify that the core telemetry data contains values
    assert telemetry["Speed"].notna().any()
    assert telemetry["RPM"].notna().any()
    assert telemetry["Distance"].notna().any()
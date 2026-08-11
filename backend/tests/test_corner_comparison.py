from app.analytics.corner_comparison import CornerComparison
from app.services.session_service import SessionService
from app.services.telemetry_service import TelemetryService


def test_corner_comparison():

    telemetry_service = TelemetryService()
    session_service = SessionService()

    telemetry_1 = telemetry_service.get_telemetry(
        2025,
        "Monaco",
        "VER"
    )

    telemetry_2 = telemetry_service.get_telemetry(
        2025,
        "Monaco",
        "NOR"
    )

    session = session_service.get_session(
        2025,
        "Monaco"
    )

    comparison = CornerComparison()

    results = comparison.compare_drivers(
        telemetry_1,
        telemetry_2,
        session.get_circuit_info(),
        "VER",
        "NOR"
    )

    assert results is not None
    assert len(results) > 0

    for corner in results:

        assert "corner" in corner
        assert "driver_1" in corner
        assert "driver_2" in corner

        assert "entry_speed_delta" in corner
        assert "apex_speed_delta" in corner
        assert "exit_speed_delta" in corner

        assert "winner" in corner

        assert isinstance(
            corner["entry_speed_delta"],
            (int, float)
        )

        assert isinstance(
            corner["apex_speed_delta"],
            (int, float)
        )

        assert isinstance(
            corner["exit_speed_delta"],
            (int, float)
        )
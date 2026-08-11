from app.analytics.corner_analysis import CornerAnalysis
from app.services.session_service import SessionService
from app.services.telemetry_service import TelemetryService


def test_corner_analysis():

    telemetry_service = TelemetryService()
    session_service = SessionService()

    telemetry = telemetry_service.get_telemetry(
        2025,
        "Monaco",
        "VER"
    )

    session = session_service.get_session(
        2025,
        "Monaco"
    )

    analysis = CornerAnalysis(
        telemetry,
        session.get_circuit_info()
    )

    results = analysis.analyze_all_corners()

    assert results is not None
    assert len(results) > 0

    for corner in results:

        assert "corner" in corner
        assert "entry_speed" in corner
        assert "apex_speed" in corner
        assert "exit_speed" in corner
        assert "max_brake" in corner
        assert "max_throttle" in corner
        assert "average_rpm" in corner
        assert "samples" in corner

        assert corner["corner"] > 0
        assert corner["entry_speed"] >= 0
        assert corner["apex_speed"] >= 0
        assert corner["exit_speed"] >= 0
        assert corner["max_brake"] >= 0
        assert corner["max_throttle"] >= 0
        assert corner["samples"] > 0
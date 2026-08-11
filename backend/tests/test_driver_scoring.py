from app.analytics.telemetry_analysis import TelemetryAnalysis
from app.ml.driver_scoring import DriverScoring
from app.services.telemetry_service import TelemetryService


def test_driver_scoring():

    telemetry_service = TelemetryService()

    telemetry = telemetry_service.get_telemetry(
        2025,
        "Monaco",
        "VER"
    )

    assert telemetry is not None
    assert not telemetry.empty

    analysis = TelemetryAnalysis(
        telemetry
    )

    scoring = DriverScoring(
        analysis
    )

    result = scoring.get_score()

    assert result is not None

    required_scores = [
        "speed_score",
        "throttle_score",
        "braking_score",
        "consistency_score",
        "overall_score"
    ]

    for score in required_scores:

        assert score in result

        assert isinstance(
            result[score],
            (int, float)
        )

        assert 0 <= result[score] <= 100
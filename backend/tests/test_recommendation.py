from app.analytics.telemetry_analysis import TelemetryAnalysis
from app.ml.driver_scoring import DriverScoring
from app.ml.recommendation import RecommendationEngine
from app.services.telemetry_service import TelemetryService


def test_recommendations():

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

    recommendation_engine = RecommendationEngine(
        scoring
    )

    recommendations = (
        recommendation_engine.get_recommendations()
    )

    assert recommendations is not None
    assert isinstance(
        recommendations,
        list
    )

    assert len(recommendations) > 0

    for recommendation in recommendations:

        assert "area" in recommendation
        assert "priority" in recommendation
        assert "message" in recommendation

        assert recommendation["area"]
        assert recommendation["priority"]
        assert recommendation["message"]
from app.services.telemetry_service import TelemetryService
from app.analytics.telemetry_analysis import TelemetryAnalysis


def test_telemetry_analysis():

    telemetry_service = TelemetryService()

    telemetry = telemetry_service.get_telemetry(
        year=2025,
        grand_prix="Monaco",
        driver="VER"
    )

    analysis = TelemetryAnalysis(
        telemetry
    )

    summary = analysis.get_summary()

    assert summary is not None

    assert "speed" in summary
    assert "rpm" in summary
    assert "gear" in summary
    assert "distance" in summary
    assert "full_throttle" in summary
    assert "brake_usage" in summary
    assert "drs_usage" in summary

    assert summary["speed"]["max"] > 0
    assert summary["speed"]["average"] > 0
    assert summary["speed"]["minimum"] >= 0

    assert summary["rpm"]["max"] > 0
    assert summary["rpm"]["average"] > 0

    assert summary["gear"]["max"] >= 0
    assert summary["gear"]["average"] >= 0

    assert summary["distance"] > 0
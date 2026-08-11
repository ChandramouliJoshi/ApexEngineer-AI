from app.services.comparison_service import ComparisonService
from app.analytics.comparison_analysis import ComparisonAnalysis


def test_driver_comparison():

    comparison_service = ComparisonService()

    telemetry_1, telemetry_2 = (
        comparison_service.compare_drivers(
            year=2025,
            grand_prix="Monaco",
            driver_1="VER",
            driver_2="NOR"
        )
    )

    assert telemetry_1 is not None
    assert telemetry_2 is not None

    assert not telemetry_1.empty
    assert not telemetry_2.empty

    analysis = ComparisonAnalysis(
        telemetry_1,
        telemetry_2
    )

    max_speed_difference = (
        analysis.max_speed_difference()
    )

    average_speed_difference = (
        analysis.average_speed_difference()
    )

    throttle_difference = (
        analysis.throttle_difference()
    )

    brake_difference = (
        analysis.brake_difference()
    )

    assert isinstance(
        max_speed_difference,
        float
    )

    assert isinstance(
        average_speed_difference,
        float
    )

    assert isinstance(
        throttle_difference,
        float
    )

    assert isinstance(
        brake_difference,
        float
    )
from app.analytics.delta_analysis import DeltaAnalysis
from app.services.comparison_service import ComparisonService


def test_delta_analysis():

    comparison = ComparisonService()

    telemetry_1, telemetry_2 = (
        comparison.compare_drivers(
            2025,
            "Monaco",
            "VER",
            "NOR"
        )
    )

    assert telemetry_1 is not None
    assert telemetry_2 is not None

    assert not telemetry_1.empty
    assert not telemetry_2.empty

    delta = DeltaAnalysis(
        telemetry_1,
        telemetry_2
    )

    merged = delta.calculate_deltas()

    assert merged is not None
    assert not merged.empty

    required_columns = [
        "Distance",
        "SpeedDelta",
        "ThrottleDelta",
        "BrakeDelta",
        "RPMDelta"
    ]

    for column in required_columns:
        assert column in merged.columns

    # Verify delta columns contain numerical data
    assert merged["SpeedDelta"].notna().any()
    assert merged["ThrottleDelta"].notna().any()
    assert merged["BrakeDelta"].notna().any()
    assert merged["RPMDelta"].notna().any()
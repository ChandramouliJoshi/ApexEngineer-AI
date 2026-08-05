from app.analytics.delta_analysis import DeltaAnalysis
from app.services.comparison_service import ComparisonService


def main():

    comparison = ComparisonService()

    telemetry_1, telemetry_2 = comparison.compare_drivers(
        2025,
        "Monaco",
        "VER",
        "NOR"
    )

    print(telemetry_1.dtypes)
    print()

    delta = DeltaAnalysis(
        telemetry_1,
        telemetry_2
    )

    merged = delta.calculate_deltas()

    print(
        merged[
            [
                "Distance",
                "SpeedDelta",
                "ThrottleDelta",
                "BrakeDelta",
                "RPMDelta"
            ]
        ].head(15)
    )


if __name__ == "__main__":
    main()
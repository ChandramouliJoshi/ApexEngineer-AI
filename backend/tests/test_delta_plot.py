from app.analytics.delta_analysis import DeltaAnalysis
from app.services.comparison_service import ComparisonService
from app.visualization.delta_plot import DeltaPlotter


def main():

    comparison = ComparisonService()

    telemetry_1, telemetry_2 = comparison.compare_drivers(
        2025,
        "Monaco",
        "VER",
        "NOR"
    )

    delta = DeltaAnalysis(
        telemetry_1,
        telemetry_2
    )

    delta_df = delta.calculate_deltas()

    plotter = DeltaPlotter()

    plotter.plot_speed_delta(delta_df)
    plotter.plot_throttle_delta(delta_df)
    plotter.plot_brake_delta(delta_df)
    plotter.plot_rpm_delta(delta_df)

    print("Delta plots generated successfully!")


if __name__ == "__main__":
    main()
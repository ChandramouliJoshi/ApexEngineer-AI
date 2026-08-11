from pathlib import Path

from app.analytics.delta_analysis import DeltaAnalysis
from app.services.comparison_service import ComparisonService
from app.visualization.delta_plot import DeltaPlotter


def test_delta_plots():

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

    delta = DeltaAnalysis(
        telemetry_1,
        telemetry_2
    )

    delta_df = delta.calculate_deltas()

    assert delta_df is not None
    assert not delta_df.empty

    plotter = DeltaPlotter()

    plotter.plot_speed_delta(delta_df)
    plotter.plot_throttle_delta(delta_df)
    plotter.plot_brake_delta(delta_df)
    plotter.plot_rpm_delta(delta_df)

    output_dir = Path("output")

    expected_files = [
        "speed_delta.png",
        "throttle_delta.png",
        "brake_delta.png",
        "rpm_delta.png"
    ]

    for filename in expected_files:

        file_path = output_dir / filename

        assert file_path.exists()
        assert file_path.stat().st_size > 0
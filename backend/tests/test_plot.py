from pathlib import Path

from app.services.comparison_service import ComparisonService
from app.visualization.telemetry_plot import TelemetryPlotter


def test_telemetry_plots():

    service = ComparisonService()

    telemetry_1, telemetry_2 = service.compare_drivers(
        2025,
        "Monaco",
        "VER",
        "NOR"
    )

    assert telemetry_1 is not None
    assert telemetry_2 is not None

    assert not telemetry_1.empty
    assert not telemetry_2.empty

    plotter = TelemetryPlotter()

    plotter.plot_speed(
        telemetry_1,
        telemetry_2,
        "VER",
        "NOR"
    )

    plotter.plot_throttle(
        telemetry_1,
        telemetry_2,
        "VER",
        "NOR"
    )

    plotter.plot_brake(
        telemetry_1,
        telemetry_2,
        "VER",
        "NOR"
    )

    plotter.plot_gear(
        telemetry_1,
        telemetry_2,
        "VER",
        "NOR"
    )

    output_dir = Path("output")

    expected_files = [
        "speed_comparison.png",
        "throttle_comparison.png",
        "brake_comparison.png",
        "gear_comparison.png"
    ]

    for filename in expected_files:

        file_path = output_dir / filename

        assert file_path.exists()
        assert file_path.stat().st_size > 0
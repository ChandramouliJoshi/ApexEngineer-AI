from app.services.comparison_service import ComparisonService
from app.visualization.telemetry_plot import TelemetryPlotter


def main():

    service = ComparisonService()

    telemetry_1, telemetry_2 = service.compare_drivers(
        2025,
        "Monaco",
        "VER",
        "NOR"
    )

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

    print("All graphs generated successfully.")

if __name__ == "__main__":
    main()
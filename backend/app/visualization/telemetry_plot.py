import os
import matplotlib.pyplot as plt


class TelemetryPlotter:

    def __init__(self):
        os.makedirs("output", exist_ok=True)

    def _plot_metric(
        self,
        telemetry_1,
        telemetry_2,
        driver_1,
        driver_2,
        column,
        title,
        ylabel,
        filename
    ):
        """
        Generic plotting function for telemetry comparisons.
        """

        plt.figure(figsize=(14, 6))

        plt.plot(
            telemetry_1["Distance"],
            telemetry_1[column],
            label=driver_1,
            linewidth=2
        )

        plt.plot(
            telemetry_2["Distance"],
            telemetry_2[column],
            label=driver_2,
            linewidth=2
        )

        plt.title(title)
        plt.xlabel("Distance (m)")
        plt.ylabel(ylabel)

        plt.legend()
        plt.grid(True)
        plt.tight_layout()

        plt.savefig(f"output/{filename}")

        plt.close()

    def plot_speed(
        self,
        telemetry_1,
        telemetry_2,
        driver_1,
        driver_2
    ):
        self._plot_metric(
            telemetry_1,
            telemetry_2,
            driver_1,
            driver_2,
            column="Speed",
            title="Speed Comparison",
            ylabel="Speed (km/h)",
            filename="speed_comparison.png"
        )

    def plot_throttle(
        self,
        telemetry_1,
        telemetry_2,
        driver_1,
        driver_2
    ):
        self._plot_metric(
            telemetry_1,
            telemetry_2,
            driver_1,
            driver_2,
            column="Throttle",
            title="Throttle Comparison",
            ylabel="Throttle (%)",
            filename="throttle_comparison.png"
        )

    def plot_brake(
        self,
        telemetry_1,
        telemetry_2,
        driver_1,
        driver_2
    ):
        self._plot_metric(
            telemetry_1,
            telemetry_2,
            driver_1,
            driver_2,
            column="Brake",
            title="Brake Comparison",
            ylabel="Brake",
            filename="brake_comparison.png"
        )

    def plot_gear(
        self,
        telemetry_1,
        telemetry_2,
        driver_1,
        driver_2
    ):
        self._plot_metric(
            telemetry_1,
            telemetry_2,
            driver_1,
            driver_2,
            column="nGear",
            title="Gear Comparison",
            ylabel="Gear",
            filename="gear_comparison.png"
        )
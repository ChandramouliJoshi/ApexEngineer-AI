import os

import matplotlib.pyplot as plt


class DeltaPlotter:

    def __init__(self):
        os.makedirs("output", exist_ok=True)

    def _plot_delta(
        self,
        delta_df,
        column,
        title,
        ylabel,
        filename
    ):
        plt.figure(figsize=(14, 6))

        plt.plot(
            delta_df["Distance"],
            delta_df[column],
            linewidth=2
        )

        plt.axhline(
            y=0,
            linestyle="--",
            linewidth=1
        )

        plt.title(title)

        plt.xlabel("Distance (m)")

        plt.ylabel(ylabel)

        plt.grid(True)

        plt.tight_layout()

        plt.savefig(f"output/{filename}")

        plt.close()

    def plot_speed_delta(self, delta_df):

        self._plot_delta(
            delta_df,
            column="SpeedDelta",
            title="Speed Delta",
            ylabel="Speed Difference (km/h)",
            filename="speed_delta.png"
        )

    def plot_throttle_delta(self, delta_df):

        self._plot_delta(
            delta_df,
            column="ThrottleDelta",
            title="Throttle Delta",
            ylabel="Throttle Difference (%)",
            filename="throttle_delta.png"
        )

    def plot_brake_delta(self, delta_df):

        self._plot_delta(
            delta_df,
            column="BrakeDelta",
            title="Brake Delta",
            ylabel="Brake Difference",
            filename="brake_delta.png"
        )

    def plot_rpm_delta(self, delta_df):

        self._plot_delta(
            delta_df,
            column="RPMDelta",
            title="RPM Delta",
            ylabel="RPM Difference",
            filename="rpm_delta.png"
        )
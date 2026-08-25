import pandas as pd


class DeltaAnalysis:

    def __init__(
        self,
        telemetry_1: pd.DataFrame,
        telemetry_2: pd.DataFrame
    ):
        self.telemetry_1 = telemetry_1.sort_values(
            "Distance"
        ).reset_index(drop=True)

        self.telemetry_2 = telemetry_2.sort_values(
            "Distance"
        ).reset_index(drop=True)

    # ==========================================================
    # Align Telemetry
    # ==========================================================

    def align_telemetry(self):

        merged = pd.merge_asof(
            self.telemetry_1,
            self.telemetry_2,
            on="Distance",
            direction="nearest",
            suffixes=("_1", "_2")
        )

        return merged

    # ==========================================================
    # Calculate Deltas
    # ==========================================================

    def calculate_deltas(self):

        merged = self.align_telemetry()

        # ------------------------------------------------------
        # Speed
        # ------------------------------------------------------

        merged["SpeedDelta"] = (
            merged["Speed_1"]
            - merged["Speed_2"]
        )

        # ------------------------------------------------------
        # Throttle
        # ------------------------------------------------------

        merged["ThrottleDelta"] = (
            merged["Throttle_1"]
            - merged["Throttle_2"]
        )

        # ------------------------------------------------------
        # Brake
        # ------------------------------------------------------

        merged["BrakeDelta"] = (
            merged["Brake_1"].astype(int)
            - merged["Brake_2"].astype(int)
        )

        # ------------------------------------------------------
        # RPM
        # ------------------------------------------------------

        merged["RPMDelta"] = (
            merged["RPM_1"]
            - merged["RPM_2"]
        )

        return merged
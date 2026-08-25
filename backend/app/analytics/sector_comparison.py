import pandas as pd


class SectorComparison:

    def __init__(self, laps_1, laps_2):
        self.laps_1 = laps_1
        self.laps_2 = laps_2

    # ==========================================================
    # Helpers
    # ==========================================================

    def _fastest(self, laps, column):
        """
        Returns the fastest sector time in seconds.

        Handles:
        - None
        - empty DataFrames
        - missing columns
        - NaN values
        - string/timedelta values
        """

        if laps is None:
            return None

        if laps.empty:
            return None

        if column not in laps.columns:
            return None

        times = laps[column].dropna()

        if times.empty:
            return None

        # Ensure pandas Timedelta values
        if not pd.api.types.is_timedelta64_dtype(times):
            times = pd.to_timedelta(
                times,
                errors="coerce"
            ).dropna()

        if times.empty:
            return None

        fastest = times.min()

        return round(
            float(
                fastest.total_seconds()
            ),
            3
        )

    def _delta(self, driver_1, driver_2):
        """
        Positive delta = Driver 1 is slower.
        Negative delta = Driver 1 is faster.
        """

        if (
            driver_1 is None
            or driver_2 is None
        ):
            return None

        return round(
            driver_1 - driver_2,
            3
        )

    # ==========================================================
    # Comparison
    # ==========================================================

    def compare(self):

        # ------------------------------------------------------
        # Driver 1
        # ------------------------------------------------------

        s1_1 = self._fastest(
            self.laps_1,
            "Sector1Time"
        )

        s2_1 = self._fastest(
            self.laps_1,
            "Sector2Time"
        )

        s3_1 = self._fastest(
            self.laps_1,
            "Sector3Time"
        )

        # ------------------------------------------------------
        # Driver 2
        # ------------------------------------------------------

        s1_2 = self._fastest(
            self.laps_2,
            "Sector1Time"
        )

        s2_2 = self._fastest(
            self.laps_2,
            "Sector2Time"
        )

        s3_2 = self._fastest(
            self.laps_2,
            "Sector3Time"
        )

        # ------------------------------------------------------
        # Result
        # ------------------------------------------------------

        return {

            "sector_1": {

                "driver_1": s1_1,

                "driver_2": s1_2,

                "delta": self._delta(
                    s1_1,
                    s1_2
                )
            },

            "sector_2": {

                "driver_1": s2_1,

                "driver_2": s2_2,

                "delta": self._delta(
                    s2_1,
                    s2_2
                )
            },

            "sector_3": {

                "driver_1": s3_1,

                "driver_2": s3_2,

                "delta": self._delta(
                    s3_1,
                    s3_2
                )
            }
        }
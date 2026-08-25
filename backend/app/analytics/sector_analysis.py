import pandas as pd


class SectorAnalysis:

    def __init__(self, laps):
        self.laps = laps

    # ==========================================================
    # Helpers
    # ==========================================================

    def _valid_sector_times(self, column):
        """
        Returns valid sector times.

        Handles:
        - None
        - empty DataFrames
        - missing columns
        - NaN values
        - string/timedelta values
        """

        if self.laps is None:
            return pd.Series(
                dtype="timedelta64[ns]"
            )

        if self.laps.empty:
            return pd.Series(
                dtype="timedelta64[ns]"
            )

        if column not in self.laps.columns:
            return pd.Series(
                dtype="timedelta64[ns]"
            )

        times = self.laps[column].dropna()

        if times.empty:
            return pd.Series(
                dtype="timedelta64[ns]"
            )

        # ------------------------------------------------------
        # Convert to pandas Timedelta
        # ------------------------------------------------------

        if not pd.api.types.is_timedelta64_dtype(times):

            times = pd.to_timedelta(
                times,
                errors="coerce"
            ).dropna()

        return times

    def _seconds(self, value):

        if value is None:
            return None

        return round(
            float(
                value.total_seconds()
            ),
            3
        )

    # ==========================================================
    # Sector 1
    # ==========================================================

    def get_fastest_sector_1(self):

        times = self._valid_sector_times(
            "Sector1Time"
        )

        if times.empty:
            return None

        return self._seconds(
            times.min()
        )

    def get_average_sector_1(self):

        times = self._valid_sector_times(
            "Sector1Time"
        )

        if times.empty:
            return None

        return self._seconds(
            times.mean()
        )

    def get_sector_1_consistency(self):

        times = self._valid_sector_times(
            "Sector1Time"
        )

        if len(times) < 2:
            return None

        return round(
            float(
                times.dt
                .total_seconds()
                .std()
            ),
            3
        )

    # ==========================================================
    # Sector 2
    # ==========================================================

    def get_fastest_sector_2(self):

        times = self._valid_sector_times(
            "Sector2Time"
        )

        if times.empty:
            return None

        return self._seconds(
            times.min()
        )

    def get_average_sector_2(self):

        times = self._valid_sector_times(
            "Sector2Time"
        )

        if times.empty:
            return None

        return self._seconds(
            times.mean()
        )

    def get_sector_2_consistency(self):

        times = self._valid_sector_times(
            "Sector2Time"
        )

        if len(times) < 2:
            return None

        return round(
            float(
                times.dt
                .total_seconds()
                .std()
            ),
            3
        )

    # ==========================================================
    # Sector 3
    # ==========================================================

    def get_fastest_sector_3(self):

        times = self._valid_sector_times(
            "Sector3Time"
        )

        if times.empty:
            return None

        return self._seconds(
            times.min()
        )

    def get_average_sector_3(self):

        times = self._valid_sector_times(
            "Sector3Time"
        )

        if times.empty:
            return None

        return self._seconds(
            times.mean()
        )

    def get_sector_3_consistency(self):

        times = self._valid_sector_times(
            "Sector3Time"
        )

        if len(times) < 2:
            return None

        return round(
            float(
                times.dt
                .total_seconds()
                .std()
            ),
            3
        )

    # ==========================================================
    # Sector Performance Gap
    # ==========================================================

    def get_sector_1_gap(self):

        fastest = self.get_fastest_sector_1()
        average = self.get_average_sector_1()

        if fastest is None or average is None:
            return None

        return round(
            average - fastest,
            3
        )

    def get_sector_2_gap(self):

        fastest = self.get_fastest_sector_2()
        average = self.get_average_sector_2()

        if fastest is None or average is None:
            return None

        return round(
            average - fastest,
            3
        )

    def get_sector_3_gap(self):

        fastest = self.get_fastest_sector_3()
        average = self.get_average_sector_3()

        if fastest is None or average is None:
            return None

        return round(
            average - fastest,
            3
        )

    # ==========================================================
    # Best Sector Combination
    # ==========================================================

    def get_best_sector_combination(self):

        sector_1 = self.get_fastest_sector_1()
        sector_2 = self.get_fastest_sector_2()
        sector_3 = self.get_fastest_sector_3()

        if any(
            sector is None
            for sector in (
                sector_1,
                sector_2,
                sector_3
            )
        ):
            return None

        return round(
            sector_1 +
            sector_2 +
            sector_3,
            3
        )

    # ==========================================================
    # Best Sector
    # ==========================================================

    def get_best_sector(self):

        sectors = {
            "sector_1":
                self.get_fastest_sector_1(),

            "sector_2":
                self.get_fastest_sector_2(),

            "sector_3":
                self.get_fastest_sector_3()
        }

        valid = {
            key: value
            for key, value in sectors.items()
            if value is not None
        }

        if not valid:
            return None

        return min(
            valid,
            key=valid.get
        )

    # ==========================================================
    # Sector Performance
    # ==========================================================

    def get_sector_performance(self):

        gaps = {
            "sector_1":
                self.get_sector_1_gap(),

            "sector_2":
                self.get_sector_2_gap(),

            "sector_3":
                self.get_sector_3_gap()
        }

        valid = {
            key: value
            for key, value in gaps.items()
            if value is not None
        }

        if not valid:
            return None

        strongest = min(
            valid,
            key=valid.get
        )

        weakest = max(
            valid,
            key=valid.get
        )

        return {
            "strongest_sector":
                strongest,

            "weakest_sector":
                weakest,

            "strongest_gap":
                valid[strongest],

            "weakest_gap":
                valid[weakest]
        }

    # ==========================================================
    # Summary
    # ==========================================================

    def get_summary(self):

        return {

            "sector_1": {

                "fastest":
                    self.get_fastest_sector_1(),

                "average":
                    self.get_average_sector_1()
            },

            "sector_2": {

                "fastest":
                    self.get_fastest_sector_2(),

                "average":
                    self.get_average_sector_2()
            },

            "sector_3": {

                "fastest":
                    self.get_fastest_sector_3(),

                "average":
                    self.get_average_sector_3()
            },

            "best_sector_combination":
                self.get_best_sector_combination()
        }
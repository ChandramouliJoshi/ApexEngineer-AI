class SectorComparison:

    def __init__(self, laps_1, laps_2):
        self.laps_1 = laps_1
        self.laps_2 = laps_2

    def _fastest(self, laps, column):

        times = laps[column].dropna()

        if times.empty:
            return None

        return float(times.min().total_seconds())

    def compare(self):

        s1_1 = self._fastest(self.laps_1, "Sector1Time")
        s2_1 = self._fastest(self.laps_1, "Sector2Time")
        s3_1 = self._fastest(self.laps_1, "Sector3Time")

        s1_2 = self._fastest(self.laps_2, "Sector1Time")
        s2_2 = self._fastest(self.laps_2, "Sector2Time")
        s3_2 = self._fastest(self.laps_2, "Sector3Time")

        return {
            "sector_1": {
                "driver_1": s1_1,
                "driver_2": s1_2,
                "delta": (
                    round(s1_1 - s1_2, 3)
                    if s1_1 is not None and s1_2 is not None
                    else None
                )
            },

            "sector_2": {
                "driver_1": s2_1,
                "driver_2": s2_2,
                "delta": (
                    round(s2_1 - s2_2, 3)
                    if s2_1 is not None and s2_2 is not None
                    else None
                )
            },

            "sector_3": {
                "driver_1": s3_1,
                "driver_2": s3_2,
                "delta": (
                    round(s3_1 - s3_2, 3)
                    if s3_1 is not None and s3_2 is not None
                    else None
                )
            }
        }
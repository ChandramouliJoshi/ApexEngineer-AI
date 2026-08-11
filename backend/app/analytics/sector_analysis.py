class SectorAnalysis:

    def __init__(self, laps):
        self.laps = laps

    def _valid_sector_times(self, column):
        return self.laps[column].dropna()

    def _seconds(self, value):
        if value is None:
            return None

        return round(
            float(value.total_seconds()),
            3
        )

    def get_fastest_sector_1(self):
        times = self._valid_sector_times("Sector1Time")

        if times.empty:
            return None

        return self._seconds(times.min())

    def get_fastest_sector_2(self):
        times = self._valid_sector_times("Sector2Time")

        if times.empty:
            return None

        return self._seconds(times.min())

    def get_fastest_sector_3(self):
        times = self._valid_sector_times("Sector3Time")

        if times.empty:
            return None

        return self._seconds(times.min())

    def get_average_sector_1(self):
        times = self._valid_sector_times("Sector1Time")

        if times.empty:
            return None

        return self._seconds(times.mean())

    def get_average_sector_2(self):
        times = self._valid_sector_times("Sector2Time")

        if times.empty:
            return None

        return self._seconds(times.mean())

    def get_average_sector_3(self):
        times = self._valid_sector_times("Sector3Time")

        if times.empty:
            return None

        return self._seconds(times.mean())

    def get_best_sector_combination(self):

        sector_1 = self.get_fastest_sector_1()
        sector_2 = self.get_fastest_sector_2()
        sector_3 = self.get_fastest_sector_3()

        if None in (sector_1, sector_2, sector_3):
            return None

        return round(
            sector_1 + sector_2 + sector_3,
            3
        )

    def get_summary(self):

        return {
            "sector_1": {
                "fastest": self.get_fastest_sector_1(),
                "average": self.get_average_sector_1()
            },

            "sector_2": {
                "fastest": self.get_fastest_sector_2(),
                "average": self.get_average_sector_2()
            },

            "sector_3": {
                "fastest": self.get_fastest_sector_3(),
                "average": self.get_average_sector_3()
            },

            "best_sector_combination":
                self.get_best_sector_combination()
        }
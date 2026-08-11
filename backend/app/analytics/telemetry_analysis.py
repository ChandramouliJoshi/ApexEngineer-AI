from app.analytics.base_analysis import BaseAnalysis


class TelemetryAnalysis(BaseAnalysis):
    """
    Performs analytics on telemetry data.
    """

    def get_max_speed(self):
        return round(float(self.telemetry["Speed"].max()), 2)

    def get_average_speed(self):
        return round(float(self.telemetry["Speed"].mean()), 2)

    def get_min_speed(self):
        return round(float(self.telemetry["Speed"].min()), 2)

    def get_max_rpm(self):
        return round(float(self.telemetry["RPM"].max()), 2)

    def get_average_rpm(self):
        return round(float(self.telemetry["RPM"].mean()), 2)

    def get_average_gear(self):
        return round(float(self.telemetry["nGear"].mean()), 2)

    def get_max_gear(self):
        return int(self.telemetry["nGear"].max())

    def get_total_distance(self):
        return round(float(self.telemetry["Distance"].max()), 2)

    def get_full_throttle_percentage(self):
        full_throttle = (
            self.telemetry["Throttle"] == 100
        ).sum()

        return round(
            (full_throttle / len(self.telemetry)) * 100,
            2
        )

    def get_brake_percentage(self):
        braking = self.telemetry["Brake"].sum()

        return round(
            (braking / len(self.telemetry)) * 100,
            2
        )

    def get_drs_usage(self):
        drs_active = (
            self.telemetry["DRS"] > 0
        ).sum()

        return round(
            (drs_active / len(self.telemetry)) * 100,
            2
        )

    def get_summary(self):
        """
        Returns a complete telemetry summary.
        """

        return {
            "speed": {
                "max": self.get_max_speed(),
                "average": self.get_average_speed(),
                "minimum": self.get_min_speed()
            },
            "rpm": {
                "max": self.get_max_rpm(),
                "average": self.get_average_rpm()
            },
            "gear": {
                "max": self.get_max_gear(),
                "average": self.get_average_gear()
            },
            "distance": self.get_total_distance(),
            "full_throttle": self.get_full_throttle_percentage(),
            "brake_usage": self.get_brake_percentage(),
            "drs_usage": self.get_drs_usage()
        }
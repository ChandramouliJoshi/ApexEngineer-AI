from app.analytics.base_analysis import BaseAnalysis


class ComparisonAnalysis:

    def __init__(self, telemetry_1, telemetry_2):
        self.telemetry_1 = telemetry_1
        self.telemetry_2 = telemetry_2

    def max_speed_difference(self):

        speed1 = self.telemetry_1["Speed"].max()
        speed2 = self.telemetry_2["Speed"].max()

        return float(speed1 - speed2)

    def average_speed_difference(self):

        avg1 = self.telemetry_1["Speed"].mean()
        avg2 = self.telemetry_2["Speed"].mean()

        return float(avg1 - avg2)

    def throttle_difference(self):

        throttle1 = self.telemetry_1["Throttle"].mean()
        throttle2 = self.telemetry_2["Throttle"].mean()

        return float(throttle1 - throttle2)

    def brake_difference(self):

        brake1 = self.telemetry_1["Brake"].mean()
        brake2 = self.telemetry_2["Brake"].mean()

        return float(brake1 - brake2)
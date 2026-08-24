class DriverScoring:

    def __init__(self, telemetry_analysis):
        self.analysis = telemetry_analysis

    # ==========================================================
    # Speed
    # ==========================================================

    def get_speed_score(self):

        max_speed = self.analysis.get_max_speed()
        average_speed = self.analysis.get_average_speed()

        max_speed_score = (
            max_speed / 300
        ) * 50

        average_speed_score = (
            average_speed / 200
        ) * 50

        score = (
            max_speed_score +
            average_speed_score
        )

        return round(
            min(max(score, 0), 100),
            2
        )

    # ==========================================================
    # Throttle
    # ==========================================================

    def get_throttle_score(self):

        throttle = (
            self.analysis
            .get_full_throttle_percentage()
        )

        return round(
            min(max(throttle, 0), 100),
            2
        )

    # ==========================================================
    # Braking
    # ==========================================================

    def get_braking_score(self):

        brake = (
            self.analysis
            .get_brake_percentage()
        )

        score = 100 - brake

        return round(
            min(max(score, 0), 100),
            2
        )

    # ==========================================================
    # Consistency
    # ==========================================================

    def get_consistency_score(self):

        telemetry = self.analysis.telemetry

        if telemetry.empty:
            return 0.0

        speed_std = (
            telemetry["Speed"]
            .astype(float)
            .std()
        )

        average_speed = (
            telemetry["Speed"]
            .astype(float)
            .mean()
        )

        if average_speed <= 0:
            return 0.0

        variation = (
            speed_std /
            average_speed
        ) * 100

        score = 100 - variation

        return round(
            min(max(score, 0), 100),
            2
        )

    # ==========================================================
    # Performance Balance
    # ==========================================================

    def get_performance_breakdown(self):

        return {
            "speed": self.get_speed_score(),
            "throttle": self.get_throttle_score(),
            "braking": self.get_braking_score(),
            "consistency": self.get_consistency_score()
        }

    # ==========================================================
    # Overall Score
    # ==========================================================

    def get_overall_score(self):

        speed_score = self.get_speed_score()
        throttle_score = self.get_throttle_score()
        braking_score = self.get_braking_score()
        consistency_score = self.get_consistency_score()

        # Weighted engineering score
        overall = (

            speed_score * 0.35 +

            throttle_score * 0.25 +

            braking_score * 0.20 +

            consistency_score * 0.20

        )

        return round(
            min(max(overall, 0), 100),
            2
        )

    # ==========================================================
    # Final Score
    # ==========================================================

    def get_score(self):

        return {

            "speed_score": round(
                self.get_speed_score(),
                2
            ),

            "throttle_score": round(
                self.get_throttle_score(),
                2
            ),

            "braking_score": round(
                self.get_braking_score(),
                2
            ),

            "consistency_score": round(
                self.get_consistency_score(),
                2
            ),

            "overall_score":
                self.get_overall_score()

        }
class DriverScoring:

    def __init__(self, telemetry_analysis):
        self.analysis = telemetry_analysis

    # ==========================================================
    # Helpers
    # ==========================================================

    @staticmethod
    def _clamp(value, minimum=0.0, maximum=100.0):
        return round(
            min(max(float(value), minimum), maximum),
            2
        )

    # ==========================================================
    # Speed
    # ==========================================================

    def get_speed_score(self):

        max_speed = self.analysis.get_max_speed()
        average_speed = self.analysis.get_average_speed()

        # ------------------------------------------------------
        # Maximum speed contribution
        # ------------------------------------------------------

        max_speed_score = (
            (max_speed / 320) * 50
        )

        # ------------------------------------------------------
        # Average speed contribution
        # ------------------------------------------------------

        average_speed_score = (
            (average_speed / 220) * 50
        )

        score = (
            max_speed_score +
            average_speed_score
        )

        return self._clamp(score)

    # ==========================================================
    # Throttle
    # ==========================================================

    def get_throttle_score(self):

        throttle = (
            self.analysis
            .get_full_throttle_percentage()
        )

        return self._clamp(throttle)

    # ==========================================================
    # Braking
    # ==========================================================

    def get_braking_score(self):

        brake_percentage = (
            self.analysis
            .get_brake_percentage()
        )

        # ------------------------------------------------------
        # Braking is not scored as:
        #
        #     100 - brake_percentage
        #
        # because using the brakes more does not automatically
        # mean worse driving.
        #
        # Instead, moderate and controlled brake usage receives
        # a better score than extremely low or extremely high
        # usage.
        # ------------------------------------------------------

        if brake_percentage <= 0:
            return 0.0

        # Approximate engineering target for total brake usage.
        target = 20.0

        difference = abs(
            brake_percentage - target
        )

        score = 100 - (
            difference * 3
        )

        return self._clamp(score)

    # ==========================================================
    # Consistency
    # ==========================================================

    def get_consistency_score(self):

        telemetry = self.analysis.telemetry

        if telemetry is None or telemetry.empty:
            return 0.0

        # ------------------------------------------------------
        # Make sure Speed exists
        # ------------------------------------------------------

        if "Speed" not in telemetry.columns:
            return 0.0

        speed = (
            telemetry["Speed"]
            .astype(float)
            .dropna()
        )

        if speed.empty:
            return 0.0

        average_speed = speed.mean()

        if average_speed <= 0:
            return 0.0

        speed_std = speed.std()

        if speed_std is None:
            return 0.0

        # ------------------------------------------------------
        # Coefficient of variation
        # ------------------------------------------------------

        variation = (
            speed_std /
            average_speed
        ) * 100

        # ------------------------------------------------------
        # Convert variation into score
        # ------------------------------------------------------

        score = 100 - variation

        return self._clamp(score)

    # ==========================================================
    # Performance Breakdown
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

        speed_score = (
            self.get_speed_score()
        )

        throttle_score = (
            self.get_throttle_score()
        )

        braking_score = (
            self.get_braking_score()
        )

        consistency_score = (
            self.get_consistency_score()
        )

        # ------------------------------------------------------
        # Engineering weighting
        #
        # Speed       -> 35%
        # Throttle    -> 25%
        # Braking     -> 20%
        # Consistency -> 20%
        # ------------------------------------------------------

        overall = (

            speed_score * 0.35 +

            throttle_score * 0.25 +

            braking_score * 0.20 +

            consistency_score * 0.20

        )

        return self._clamp(overall)

    # ==========================================================
    # Final Score
    # ==========================================================

    def get_score(self):

        speed_score = (
            self.get_speed_score()
        )

        throttle_score = (
            self.get_throttle_score()
        )

        braking_score = (
            self.get_braking_score()
        )

        consistency_score = (
            self.get_consistency_score()
        )

        overall_score = (
            self.get_overall_score()
        )

        return {

            "speed_score":
                speed_score,

            "throttle_score":
                throttle_score,

            "braking_score":
                braking_score,

            "consistency_score":
                consistency_score,

            "overall_score":
                overall_score
        }
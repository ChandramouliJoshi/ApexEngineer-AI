from app.analytics.base_analysis import BaseAnalysis


class TelemetryAnalysis(BaseAnalysis):
    """
    Performs engineering analytics on telemetry data.

    Provides:
    - Speed analysis
    - RPM analysis
    - Gear analysis
    - Throttle analysis
    - Braking analysis
    - DRS analysis
    - Distance analysis
    - Engineering indicators
    """

    # ==========================================================
    # Speed
    # ==========================================================

    def get_max_speed(self):
        if self.telemetry.empty:
            return 0.0

        return round(
            float(self.telemetry["Speed"].max()),
            2
        )

    def get_average_speed(self):
        if self.telemetry.empty:
            return 0.0

        return round(
            float(self.telemetry["Speed"].mean()),
            2
        )

    def get_min_speed(self):
        if self.telemetry.empty:
            return 0.0

        return round(
            float(self.telemetry["Speed"].min()),
            2
        )

    def get_speed_range(self):
        if self.telemetry.empty:
            return 0.0

        return round(
            self.get_max_speed() -
            self.get_min_speed(),
            2
        )

    # ==========================================================
    # RPM
    # ==========================================================

    def get_max_rpm(self):
        if self.telemetry.empty:
            return 0.0

        return round(
            float(self.telemetry["RPM"].max()),
            2
        )

    def get_average_rpm(self):
        if self.telemetry.empty:
            return 0.0

        return round(
            float(self.telemetry["RPM"].mean()),
            2
        )

    # ==========================================================
    # Gear
    # ==========================================================

    def get_average_gear(self):
        if self.telemetry.empty:
            return 0.0

        return round(
            float(self.telemetry["nGear"].mean()),
            2
        )

    def get_max_gear(self):
        if self.telemetry.empty:
            return 0

        return int(
            self.telemetry["nGear"].max()
        )

    # ==========================================================
    # Distance
    # ==========================================================

    def get_total_distance(self):
        if self.telemetry.empty:
            return 0.0

        return round(
            float(self.telemetry["Distance"].max()),
            2
        )

    # ==========================================================
    # Throttle
    # ==========================================================

    def get_full_throttle_percentage(self):
        if self.telemetry.empty:
            return 0.0

        full_throttle = (
            self.telemetry["Throttle"] >= 99
        ).sum()

        return round(
            (
                full_throttle /
                len(self.telemetry)
            ) * 100,
            2
        )

    def get_average_throttle(self):
        if self.telemetry.empty:
            return 0.0

        return round(
            float(
                self.telemetry["Throttle"]
                .astype(float)
                .mean()
            ),
            2
        )

    # ==========================================================
    # Braking
    # ==========================================================

    def get_brake_percentage(self):
        if self.telemetry.empty:
            return 0.0

        braking = (
            self.telemetry["Brake"]
            .astype(float)
            .sum()
        )

        return round(
            (
                braking /
                len(self.telemetry)
            ) * 100,
            2
        )

    def get_braking_samples(self):
        if self.telemetry.empty:
            return 0

        return int(
            (
                self.telemetry["Brake"]
                .astype(float) > 0
            ).sum()
        )

    # ==========================================================
    # DRS
    # ==========================================================

    def get_drs_usage(self):
        if self.telemetry.empty:
            return 0.0

        drs_active = (
            self.telemetry["DRS"] > 0
        ).sum()

        return round(
            (
                drs_active /
                len(self.telemetry)
            ) * 100,
            2
        )

    # ==========================================================
    # Consistency
    # ==========================================================

    def get_speed_std(self):
        if self.telemetry.empty:
            return 0.0

        return round(
            float(
                self.telemetry["Speed"]
                .astype(float)
                .std()
            ),
            2
        )

    def get_speed_consistency(self):
        """
        Measures speed consistency using
        coefficient of variation.
        """

        average_speed = (
            self.get_average_speed()
        )

        if average_speed <= 0:
            return 0.0

        speed_std = self.get_speed_std()

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
    # Engineering Indicators
    # ==========================================================

    def get_engineering_indicators(self):
        """
        Returns higher-level telemetry indicators
        useful for engineering analysis.
        """

        return {
            "speed_consistency": (
                self.get_speed_consistency()
            ),

            "average_throttle": (
                self.get_average_throttle()
            ),

            "braking_samples": (
                self.get_braking_samples()
            ),

            "speed_range": (
                self.get_speed_range()
            )
        }

    # ==========================================================
    # Summary
    # ==========================================================

    def get_summary(self):
        """
        Returns a complete telemetry engineering summary.
        """

        return {

            "speed": {
                "max": self.get_max_speed(),
                "average": self.get_average_speed(),
                "minimum": self.get_min_speed(),
                "range": self.get_speed_range()
            },

            "rpm": {
                "max": self.get_max_rpm(),
                "average": self.get_average_rpm()
            },

            "gear": {
                "max": self.get_max_gear(),
                "average": self.get_average_gear()
            },

            "distance": (
                self.get_total_distance()
            ),

            "throttle": {
                "full_throttle": (
                    self.get_full_throttle_percentage()
                ),
                "average": (
                    self.get_average_throttle()
                )
            },

            "braking": {
                "usage": (
                    self.get_brake_percentage()
                ),
                "samples": (
                    self.get_braking_samples()
                )
            },

            "drs_usage": (
                self.get_drs_usage()
            ),

            "engineering_indicators": (
                self.get_engineering_indicators()
            )
        }
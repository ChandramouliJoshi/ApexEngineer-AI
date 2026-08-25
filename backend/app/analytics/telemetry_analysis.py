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
        if self.telemetry.empty or "Speed" not in self.telemetry.columns:
            return 0.0

        speed = self.telemetry["Speed"].astype(float).dropna()

        if speed.empty:
            return 0.0

        return round(float(speed.max()), 2)

    def get_average_speed(self):
        if self.telemetry.empty or "Speed" not in self.telemetry.columns:
            return 0.0

        speed = self.telemetry["Speed"].astype(float).dropna()

        if speed.empty:
            return 0.0

        return round(float(speed.mean()), 2)

    def get_min_speed(self):
        if self.telemetry.empty or "Speed" not in self.telemetry.columns:
            return 0.0

        speed = self.telemetry["Speed"].astype(float).dropna()

        if speed.empty:
            return 0.0

        return round(float(speed.min()), 2)

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
        if self.telemetry.empty or "RPM" not in self.telemetry.columns:
            return 0.0

        rpm = self.telemetry["RPM"].astype(float).dropna()

        if rpm.empty:
            return 0.0

        return round(float(rpm.max()), 2)

    def get_average_rpm(self):
        if self.telemetry.empty or "RPM" not in self.telemetry.columns:
            return 0.0

        rpm = self.telemetry["RPM"].astype(float).dropna()

        if rpm.empty:
            return 0.0

        return round(float(rpm.mean()), 2)

    # ==========================================================
    # Gear
    # ==========================================================

    def get_average_gear(self):
        if self.telemetry.empty or "nGear" not in self.telemetry.columns:
            return 0.0

        gear = self.telemetry["nGear"].astype(float).dropna()

        if gear.empty:
            return 0.0

        return round(float(gear.mean()), 2)

    def get_max_gear(self):
        if self.telemetry.empty or "nGear" not in self.telemetry.columns:
            return 0

        gear = self.telemetry["nGear"].astype(float).dropna()

        if gear.empty:
            return 0

        return int(gear.max())

    # ==========================================================
    # Distance
    # ==========================================================

    def get_total_distance(self):
        if self.telemetry.empty or "Distance" not in self.telemetry.columns:
            return 0.0

        distance = (
            self.telemetry["Distance"]
            .astype(float)
            .dropna()
        )

        if distance.empty:
            return 0.0

        return round(float(distance.max()), 2)

    # ==========================================================
    # Throttle
    # ==========================================================

    def get_full_throttle_percentage(self):
        if self.telemetry.empty or "Throttle" not in self.telemetry.columns:
            return 0.0

        throttle = (
            self.telemetry["Throttle"]
            .astype(float)
            .dropna()
        )

        if throttle.empty:
            return 0.0

        full_throttle = (
            throttle >= 99
        ).sum()

        return round(
            (
                full_throttle /
                len(throttle)
            ) * 100,
            2
        )

    def get_average_throttle(self):
        if self.telemetry.empty or "Throttle" not in self.telemetry.columns:
            return 0.0

        throttle = (
            self.telemetry["Throttle"]
            .astype(float)
            .dropna()
        )

        if throttle.empty:
            return 0.0

        return round(
            float(throttle.mean()),
            2
        )

    # ==========================================================
    # Braking
    # ==========================================================

    def get_brake_percentage(self):
        """
        Returns the percentage of valid telemetry samples
        where the driver is applying the brakes.

        This is intentionally based on BRAKE ACTIVITY rather
        than summing brake values.

        FastF1 brake data can be boolean or numeric depending
        on the source/session, so treating every non-zero
        value as an active braking sample is safer.
        """

        if self.telemetry.empty or "Brake" not in self.telemetry.columns:
            return 0.0

        brake = (
            self.telemetry["Brake"]
            .astype(float)
            .fillna(0)
        )

        if brake.empty:
            return 0.0

        braking_samples = (
            brake > 0
        ).sum()

        return round(
            (
                braking_samples /
                len(brake)
            ) * 100,
            2
        )

    def get_braking_samples(self):
        if self.telemetry.empty or "Brake" not in self.telemetry.columns:
            return 0

        brake = (
            self.telemetry["Brake"]
            .astype(float)
            .fillna(0)
        )

        return int(
            (brake > 0).sum()
        )

    # ==========================================================
    # DRS
    # ==========================================================

    def get_drs_usage(self):
        if self.telemetry.empty or "DRS" not in self.telemetry.columns:
            return 0.0

        drs = (
            self.telemetry["DRS"]
            .astype(float)
            .fillna(0)
        )

        if drs.empty:
            return 0.0

        drs_active = (
            drs > 0
        ).sum()

        return round(
            (
                drs_active /
                len(drs)
            ) * 100,
            2
        )

    # ==========================================================
    # Consistency
    # ==========================================================

    def get_speed_std(self):
        if self.telemetry.empty or "Speed" not in self.telemetry.columns:
            return 0.0

        speed = (
            self.telemetry["Speed"]
            .astype(float)
            .dropna()
        )

        if len(speed) < 2:
            return 0.0

        return round(
            float(speed.std()),
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

        speed_std = (
            self.get_speed_std()
        )

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
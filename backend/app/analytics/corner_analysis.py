class CornerAnalysis:

    def __init__(
        self,
        telemetry,
        circuit_info
    ):
        self.telemetry = telemetry
        self.circuit_info = circuit_info

    # ==========================================================
    # Corner Data
    # ==========================================================

    def get_corner_data(
        self,
        corner_number,
        window=50
    ):
        """
        Returns telemetry data around a specific corner.
        """

        if (
            corner_number < 1
            or corner_number > len(self.circuit_info.corners)
        ):
            return self.telemetry.iloc[0:0]

        corner = self.circuit_info.corners.iloc[
            corner_number - 1
        ]

        distance = corner["Distance"]

        return self.telemetry[
            (self.telemetry["Distance"] >= distance - window) &
            (self.telemetry["Distance"] <= distance + window)
        ]

    # ==========================================================
    # Corner Diagnosis
    # ==========================================================

    def _get_diagnosis(
        self,
        entry_to_apex_loss,
        apex_to_exit_gain,
        braking_intensity,
        throttle_application,
        entry_speed,
        apex_speed,
        exit_speed
    ):
        """
        Generates an engineering diagnosis from
        corner telemetry behaviour.
        """

        diagnosis = []
        priority = "Low"

        # ------------------------------------------------------
        # Excessive speed loss
        # ------------------------------------------------------

        if (
            entry_to_apex_loss >= 70
            and entry_speed >= 120
        ):
            diagnosis.append(
                "Large speed loss between corner entry and apex."
            )

            priority = "High"

        elif (
            entry_to_apex_loss >= 45
            and entry_speed >= 100
        ):
            diagnosis.append(
                "Significant speed loss approaching the apex."
            )

            if priority != "High":
                priority = "Medium"

        # ------------------------------------------------------
        # Poor exit acceleration
        # ------------------------------------------------------

        if (
            apex_to_exit_gain < 20
            and apex_speed < 180
        ):
            diagnosis.append(
                "Weak speed recovery on corner exit."
            )

            if priority == "Low":
                priority = "Medium"

        # ------------------------------------------------------
        # Heavy braking
        # ------------------------------------------------------

        if braking_intensity >= 0.45:
            diagnosis.append(
                "High braking intensity detected."
            )

            priority = "High"

        elif braking_intensity >= 0.30:
            diagnosis.append(
                "Moderate braking intensity detected."
            )

            if priority == "Low":
                priority = "Medium"

        # ------------------------------------------------------
        # Poor throttle application
        # ------------------------------------------------------

        if (
            throttle_application < 20
            and apex_speed < 150
        ):
            diagnosis.append(
                "Low throttle application is limiting corner exit acceleration."
            )

            priority = "High"

        elif throttle_application < 35:
            diagnosis.append(
                "Throttle application could be earlier and smoother."
            )

            if priority == "Low":
                priority = "Medium"

        # ------------------------------------------------------
        # Strong corner
        # ------------------------------------------------------

        if not diagnosis:
            diagnosis.append(
                "Corner execution is well balanced."
            )

        return {
            "priority": priority,
            "diagnosis": diagnosis
        }

    # ==========================================================
    # Corner Score
    # ==========================================================

    def _get_corner_score(
        self,
        entry_to_apex_loss,
        apex_to_exit_gain,
        braking_intensity,
        throttle_application
    ):
        """
        Calculates a normalized corner performance score.
        """

        # Lower speed loss is better
        speed_score = max(
            0,
            min(
                100,
                100 - (entry_to_apex_loss * 0.8)
            )
        )

        # Higher exit recovery is better
        exit_score = max(
            0,
            min(
                100,
                apex_to_exit_gain * 2
            )
        )

        # Moderate braking is preferred
        braking_score = max(
            0,
            min(
                100,
                100 - (braking_intensity * 100)
            )
        )

        # Higher throttle application is better
        throttle_score = max(
            0,
            min(
                100,
                throttle_application
            )
        )

        score = (
            speed_score * 0.30 +
            exit_score * 0.25 +
            braking_score * 0.20 +
            throttle_score * 0.25
        )

        return round(
            max(0, min(score, 100)),
            2
        )

    # ==========================================================
    # Single Corner Analysis
    # ==========================================================

    def analyze_corner(
        self,
        corner_number
    ):
        """
        Analyze a single corner and derive
        engineering indicators and diagnosis.
        """

        corner = self.get_corner_data(
            corner_number
        )

        # ------------------------------------------------------
        # Empty corner
        # ------------------------------------------------------

        if corner.empty:
            return {
                "corner": corner_number,
                "entry_speed": 0.0,
                "apex_speed": 0.0,
                "exit_speed": 0.0,
                "max_brake": 0,
                "max_throttle": 0.0,
                "average_rpm": 0.0,
                "samples": 0,
                "entry_to_apex_loss": 0.0,
                "apex_to_exit_gain": 0.0,
                "braking_intensity": 0.0,
                "throttle_application": 0.0,
                "corner_score": 0.0,
                "priority": "Unknown",
                "diagnosis": [
                    "Insufficient telemetry data."
                ]
            }

        # ------------------------------------------------------
        # Raw metrics
        # ------------------------------------------------------

        entry_speed = float(
            corner.iloc[0]["Speed"]
        )

        apex_speed = float(
            corner["Speed"].min()
        )

        exit_speed = float(
            corner.iloc[-1]["Speed"]
        )

        max_brake = int(
            corner["Brake"]
            .astype(int)
            .max()
        )

        max_throttle = float(
            corner["Throttle"]
            .max()
        )

        average_rpm = float(
            corner["RPM"]
            .mean()
        )

        # ------------------------------------------------------
        # Derived metrics
        # ------------------------------------------------------

        entry_to_apex_loss = max(
            0,
            entry_speed - apex_speed
        )

        apex_to_exit_gain = max(
            0,
            exit_speed - apex_speed
        )

        braking_intensity = float(
            corner["Brake"]
            .astype(float)
            .mean()
        )

        throttle_application = float(
            corner["Throttle"]
            .mean()
        )

        # ------------------------------------------------------
        # Engineering intelligence
        # ------------------------------------------------------

        corner_score = self._get_corner_score(
            entry_to_apex_loss,
            apex_to_exit_gain,
            braking_intensity,
            throttle_application
        )

        engineering = self._get_diagnosis(
            entry_to_apex_loss,
            apex_to_exit_gain,
            braking_intensity,
            throttle_application,
            entry_speed,
            apex_speed,
            exit_speed
        )

        # ------------------------------------------------------
        # Final result
        # ------------------------------------------------------

        return {
            "corner": corner_number,

            "entry_speed": round(
                entry_speed,
                2
            ),

            "apex_speed": round(
                apex_speed,
                2
            ),

            "exit_speed": round(
                exit_speed,
                2
            ),

            "max_brake": max_brake,

            "max_throttle": round(
                max_throttle,
                2
            ),

            "average_rpm": round(
                average_rpm,
                2
            ),

            "samples": len(corner),

            "entry_to_apex_loss": round(
                entry_to_apex_loss,
                2
            ),

            "apex_to_exit_gain": round(
                apex_to_exit_gain,
                2
            ),

            "braking_intensity": round(
                braking_intensity,
                2
            ),

            "throttle_application": round(
                throttle_application,
                2
            ),

            "corner_score": corner_score,

            "priority": engineering[
                "priority"
            ],

            "diagnosis": engineering[
                "diagnosis"
            ]
        }

    # ==========================================================
    # All Corners
    # ==========================================================

    def analyze_all_corners(self):
        """
        Analyze every corner on the circuit.
        """

        results = []

        total_corners = len(
            self.circuit_info.corners
        )

        for corner_number in range(
            1,
            total_corners + 1
        ):

            results.append(
                self.analyze_corner(
                    corner_number
                )
            )

        return results
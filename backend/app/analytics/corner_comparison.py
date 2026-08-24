from app.analytics.corner_analysis import CornerAnalysis


class CornerComparison:

    def compare_drivers(
        self,
        telemetry_1,
        telemetry_2,
        circuit_info,
        driver_1_name,
        driver_2_name
    ):
        """
        Compare two drivers corner by corner and identify
        the main performance advantage at each corner.
        """

        analysis_1 = CornerAnalysis(
            telemetry_1,
            circuit_info
        )

        analysis_2 = CornerAnalysis(
            telemetry_2,
            circuit_info
        )

        driver_1 = analysis_1.analyze_all_corners()
        driver_2 = analysis_2.analyze_all_corners()

        comparison = []

        for c1, c2 in zip(driver_1, driver_2):

            # --------------------------------------------------
            # Speed deltas
            # Positive = Driver 1 faster
            # Negative = Driver 2 faster
            # --------------------------------------------------

            entry_delta = (
                c1["entry_speed"]
                - c2["entry_speed"]
            )

            apex_delta = (
                c1["apex_speed"]
                - c2["apex_speed"]
            )

            exit_delta = (
                c1["exit_speed"]
                - c2["exit_speed"]
            )

            # --------------------------------------------------
            # Driving technique deltas
            # --------------------------------------------------

            throttle_delta = (
                c1["throttle_application"]
                - c2["throttle_application"]
            )

            braking_delta = (
                c1["braking_intensity"]
                - c2["braking_intensity"]
            )

            entry_loss_delta = (
                c1["entry_to_apex_loss"]
                - c2["entry_to_apex_loss"]
            )

            exit_gain_delta = (
                c1["apex_to_exit_gain"]
                - c2["apex_to_exit_gain"]
            )

            # --------------------------------------------------
            # Overall corner speed advantage
            # --------------------------------------------------

            speed_score_1 = (
                c1["entry_speed"]
                + c1["apex_speed"]
                + c1["exit_speed"]
            )

            speed_score_2 = (
                c2["entry_speed"]
                + c2["apex_speed"]
                + c2["exit_speed"]
            )

            speed_delta = (
                speed_score_1 - speed_score_2
            )

            # --------------------------------------------------
            # Identify dominant speed phase
            # --------------------------------------------------

            phase_deltas = {
                "entry": abs(entry_delta),
                "apex": abs(apex_delta),
                "exit": abs(exit_delta)
            }

            primary_phase = max(
                phase_deltas,
                key=phase_deltas.get
            )

            # --------------------------------------------------
            # Determine winner
            # --------------------------------------------------

            if speed_delta > 0:
                winner = driver_1_name

            elif speed_delta < 0:
                winner = driver_2_name

            else:
                winner = "Equal"

            # --------------------------------------------------
            # Determine engineering advantage
            # --------------------------------------------------

            technique_deltas = {
                "Braking": abs(braking_delta),
                "Throttle": abs(throttle_delta),
                "Entry": abs(entry_delta),
                "Apex": abs(apex_delta),
                "Exit": abs(exit_delta)
            }

            dominant_area = max(
                technique_deltas,
                key=technique_deltas.get
            )

            # --------------------------------------------------
            # Determine which driver has the advantage
            # --------------------------------------------------

            if dominant_area == "Braking":

                # Lower braking intensity can indicate
                # less time spent braking.
                if braking_delta < 0:
                    technique_advantage = driver_1_name
                elif braking_delta > 0:
                    technique_advantage = driver_2_name
                else:
                    technique_advantage = "Equal"

            elif dominant_area == "Throttle":

                if throttle_delta > 0:
                    technique_advantage = driver_1_name
                elif throttle_delta < 0:
                    technique_advantage = driver_2_name
                else:
                    technique_advantage = "Equal"

            else:

                if phase_deltas[dominant_area.lower()] == 0:
                    technique_advantage = "Equal"

                elif (
                    {
                        "entry": entry_delta,
                        "apex": apex_delta,
                        "exit": exit_delta
                    }[dominant_area.lower()]
                    > 0
                ):
                    technique_advantage = driver_1_name

                else:
                    technique_advantage = driver_2_name

            # --------------------------------------------------
            # Engineering interpretation
            # --------------------------------------------------

            if dominant_area == "Braking":

                insight = (
                    f"{technique_advantage} has the stronger "
                    "braking profile."
                )

            elif dominant_area == "Throttle":

                insight = (
                    f"{technique_advantage} has stronger "
                    "throttle application."
                )

            elif dominant_area == "Entry":

                insight = (
                    f"{technique_advantage} carries more speed "
                    "into the corner."
                )

            elif dominant_area == "Apex":

                insight = (
                    f"{technique_advantage} carries more speed "
                    "through the apex."
                )

            else:

                insight = (
                    f"{technique_advantage} achieves the stronger "
                    "corner exit."
                )

            # --------------------------------------------------
            # Final corner result
            # --------------------------------------------------

            comparison.append({

                "corner": c1["corner"],

                "driver_1": c1,

                "driver_2": c2,

                "entry_speed_delta": round(
                    entry_delta,
                    2
                ),

                "apex_speed_delta": round(
                    apex_delta,
                    2
                ),

                "exit_speed_delta": round(
                    exit_delta,
                    2
                ),

                "throttle_delta": round(
                    throttle_delta,
                    2
                ),

                "braking_delta": round(
                    braking_delta,
                    2
                ),

                "entry_to_apex_loss_delta": round(
                    entry_loss_delta,
                    2
                ),

                "apex_to_exit_gain_delta": round(
                    exit_gain_delta,
                    2
                ),

                "speed_delta": round(
                    speed_delta,
                    2
                ),

                "primary_phase": primary_phase,

                "dominant_area": dominant_area,

                "technique_advantage": technique_advantage,

                "winner": winner,

                "engineering_insight": insight
            })

        return comparison
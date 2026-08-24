from app.analytics.telemetry_analysis import TelemetryAnalysis
from app.analytics.sector_analysis import SectorAnalysis
from app.analytics.corner_analysis import CornerAnalysis
from app.analytics.corner_comparison import CornerComparison

from app.ml.driver_scoring import DriverScoring
from app.ml.recommendation import RecommendationEngine


class AIEngineer:

    def __init__(
        self,
        telemetry,
        laps,
        circuit_info=None
    ):
        self.telemetry = telemetry
        self.laps = laps
        self.circuit_info = circuit_info

    # ==========================================================
    # Engineering Summary
    # ==========================================================

    def _generate_engineering_summary(
        self,
        score
    ):
        breakdown = {
            "Speed": score["speed_score"],
            "Throttle": score["throttle_score"],
            "Braking": score["braking_score"],
            "Consistency": score["consistency_score"]
        }

        strongest_area = max(
            breakdown,
            key=breakdown.get
        )

        weakest_area = min(
            breakdown,
            key=breakdown.get
        )

        strongest_score = breakdown[
            strongest_area
        ]

        weakest_score = breakdown[
            weakest_area
        ]

        # ------------------------------------------------------
        # Determine priority
        # ------------------------------------------------------

        if weakest_score < 50:
            priority = "High"

        elif weakest_score < 70:
            priority = "Medium"

        else:
            priority = "Low"

        # ------------------------------------------------------
        # Engineering message
        # ------------------------------------------------------

        if weakest_area == "Throttle":

            message = (
                f"Throttle is the primary performance limitation "
                f"with a score of {weakest_score:.2f}/100. "
                f"Focus on improving throttle application and "
                f"earlier, smoother acceleration while maintaining "
                f"the driver's strength in {strongest_area.lower()}."
            )

        elif weakest_area == "Braking":

            message = (
                f"Braking is the primary performance limitation "
                f"with a score of {weakest_score:.2f}/100. "
                f"Focus on improving braking points, brake release "
                f"and corner entry control while maintaining "
                f"the driver's strength in {strongest_area.lower()}."
            )

        elif weakest_area == "Consistency":

            message = (
                f"Consistency is the primary performance limitation "
                f"with a score of {weakest_score:.2f}/100. "
                f"Focus on repeating consistent braking, cornering "
                f"and throttle patterns while maintaining "
                f"the driver's strength in {strongest_area.lower()}."
            )

        else:

            message = (
                f"Speed is the primary performance limitation "
                f"with a score of {weakest_score:.2f}/100. "
                f"Focus on improving corner speed and maintaining "
                f"momentum through the lap."
            )

        return {
            "overall_score": score["overall_score"],

            "strongest_area": strongest_area,

            "strongest_score": strongest_score,

            "weakest_area": weakest_area,

            "weakest_score": weakest_score,

            "priority": priority,

            "message": message
        }

    # ==========================================================
    # Corner Engineering Summary
    # ==========================================================

    def _generate_corner_summary(
        self,
        corners
    ):
        if not corners:
            return {
                "total_corners": 0,
                "highest_braking_corner": None,
                "largest_speed_loss_corner": None,
                "best_acceleration_corner": None,
                "summary": (
                    "Corner analysis unavailable because "
                    "circuit information was not provided."
                )
            }

        # ------------------------------------------------------
        # Highest braking intensity
        # ------------------------------------------------------

        highest_braking = max(
            corners,
            key=lambda x: x["braking_intensity"]
        )

        # ------------------------------------------------------
        # Largest entry → apex speed loss
        # ------------------------------------------------------

        largest_speed_loss = max(
            corners,
            key=lambda x: x["entry_to_apex_loss"]
        )

        # ------------------------------------------------------
        # Best apex → exit acceleration
        # ------------------------------------------------------

        best_acceleration = max(
            corners,
            key=lambda x: x["apex_to_exit_gain"]
        )

        return {
            "total_corners": len(corners),

            "highest_braking_corner": {
                "corner": highest_braking["corner"],
                "braking_intensity": highest_braking[
                    "braking_intensity"
                ]
            },

            "largest_speed_loss_corner": {
                "corner": largest_speed_loss["corner"],
                "speed_loss": largest_speed_loss[
                    "entry_to_apex_loss"
                ]
            },

            "best_acceleration_corner": {
                "corner": best_acceleration["corner"],
                "speed_gain": best_acceleration[
                    "apex_to_exit_gain"
                ]
            },

            "summary": (
                f"Corner {largest_speed_loss['corner']} "
                f"has the largest entry-to-apex speed loss "
                f"({largest_speed_loss['entry_to_apex_loss']:.1f}). "
                f"Corner {best_acceleration['corner']} produces "
                f"the strongest exit acceleration with "
                f"{best_acceleration['apex_to_exit_gain']:.1f} "
                f"speed gain."
            )
        }

    # ==========================================================
    # Single Driver Report
    # ==========================================================

    def generate_report(self):

        # ------------------------------------------------------
        # Telemetry
        # ------------------------------------------------------

        telemetry_analysis = TelemetryAnalysis(
            self.telemetry
        )

        telemetry_summary = (
            telemetry_analysis.get_summary()
        )

        # ------------------------------------------------------
        # Driver scoring
        # ------------------------------------------------------

        scoring = DriverScoring(
            telemetry_analysis
        )

        score = scoring.get_score()

        performance_breakdown = (
            scoring.get_performance_breakdown()
        )

        # ------------------------------------------------------
        # Recommendations
        # ------------------------------------------------------

        recommendation_engine = RecommendationEngine(
            scoring
        )

        recommendations = (
            recommendation_engine.get_recommendations()
        )

        # ------------------------------------------------------
        # Sector analysis
        # ------------------------------------------------------

        sector_analysis = SectorAnalysis(
            self.laps
        )

        sector_summary = (
            sector_analysis.get_summary()
        )

        # ------------------------------------------------------
        # Corner analysis
        # ------------------------------------------------------

        corners = []

        if self.circuit_info is not None:

            corner_analysis = CornerAnalysis(
                self.telemetry,
                self.circuit_info
            )

            corners = (
                corner_analysis.analyze_all_corners()
            )

        corner_summary = (
            self._generate_corner_summary(
                corners
            )
        )

        # ------------------------------------------------------
        # Engineering summary
        # ------------------------------------------------------

        engineering_summary = (
            self._generate_engineering_summary(
                score
            )
        )

        # ------------------------------------------------------
        # Final report
        # ------------------------------------------------------

        return {

            "telemetry":
                telemetry_summary,

            "sectors":
                sector_summary,

            "corners":
                corners,

            "corner_summary":
                corner_summary,

            "performance_score":
                score,

            "performance_breakdown":
                performance_breakdown,

            "engineering_summary":
                engineering_summary,

            "recommendations":
                recommendations
        }

    # ==========================================================
    # Driver Comparison Report
    # ==========================================================

    def generate_comparison_report(
        self,
        telemetry_1,
        telemetry_2,
        circuit_info,
        driver_1_name,
        driver_2_name,
        laps_1,
        laps_2
    ):

        # ------------------------------------------------------
        # Telemetry analysis
        # ------------------------------------------------------

        analysis_1 = TelemetryAnalysis(
            telemetry_1
        )

        analysis_2 = TelemetryAnalysis(
            telemetry_2
        )

        # ------------------------------------------------------
        # Driver scoring
        # ------------------------------------------------------

        scoring_1 = DriverScoring(
            analysis_1
        )

        scoring_2 = DriverScoring(
            analysis_2
        )

        score_1 = scoring_1.get_score()
        score_2 = scoring_2.get_score()

        # ------------------------------------------------------
        # Sector analysis
        # ------------------------------------------------------

        sector_analysis_1 = SectorAnalysis(
            laps_1
        )

        sector_analysis_2 = SectorAnalysis(
            laps_2
        )

        sectors_1 = (
            sector_analysis_1.get_summary()
        )

        sectors_2 = (
            sector_analysis_2.get_summary()
        )

        sector_comparison = {

            "sector_1": {
                "driver_1": sectors_1["sector_1"]["fastest"],
                "driver_2": sectors_2["sector_1"]["fastest"],
                "delta": round(
                    sectors_1["sector_1"]["fastest"]
                    -
                    sectors_2["sector_1"]["fastest"],
                    3
                )
            },

            "sector_2": {
                "driver_1": sectors_1["sector_2"]["fastest"],
                "driver_2": sectors_2["sector_2"]["fastest"],
                "delta": round(
                    sectors_1["sector_2"]["fastest"]
                    -
                    sectors_2["sector_2"]["fastest"],
                    3
                )
            },

            "sector_3": {
                "driver_1": sectors_1["sector_3"]["fastest"],
                "driver_2": sectors_2["sector_3"]["fastest"],
                "delta": round(
                    sectors_1["sector_3"]["fastest"]
                    -
                    sectors_2["sector_3"]["fastest"],
                    3
                )
            }
        }

        # ------------------------------------------------------
        # Corner comparison
        # ------------------------------------------------------

        corner_comparison_engine = (
            CornerComparison()
        )

        corner_comparison = (
            corner_comparison_engine.compare_drivers(
                telemetry_1,
                telemetry_2,
                circuit_info,
                driver_1_name,
                driver_2_name
            )
        )

        # ------------------------------------------------------
        # Find biggest sector loss
        # ------------------------------------------------------

        sector_deltas = {

            "Sector 1":
                sector_comparison["sector_1"]["delta"],

            "Sector 2":
                sector_comparison["sector_2"]["delta"],

            "Sector 3":
                sector_comparison["sector_3"]["delta"]
        }

        biggest_loss_sector = max(
            sector_deltas,
            key=lambda x: sector_deltas[x]
        )

        biggest_loss = sector_deltas[
            biggest_loss_sector
        ]

        # ------------------------------------------------------
        # Determine faster driver
        # ------------------------------------------------------

        score_difference = (
            score_1["overall_score"]
            -
            score_2["overall_score"]
        )

        if score_difference > 0:

            faster_driver = driver_1_name

        elif score_difference < 0:

            faster_driver = driver_2_name

        else:

            faster_driver = "Equal"

        # ------------------------------------------------------
        # Engineering diagnosis
        # ------------------------------------------------------

        diagnosis = []

        if biggest_loss > 0:

            diagnosis.append({

                "area":
                    biggest_loss_sector,

                "priority":
                    "High",

                "time_loss":
                    round(
                        biggest_loss,
                        3
                    ),

                "message": (
                    f"{driver_1_name} loses the most time "
                    f"to {driver_2_name} in "
                    f"{biggest_loss_sector}."
                )
            })

        elif biggest_loss < 0:

            diagnosis.append({

                "area":
                    biggest_loss_sector,

                "priority":
                    "Low",

                "time_gain":
                    round(
                        abs(biggest_loss),
                        3
                    ),

                "message": (
                    f"{driver_1_name} is faster than "
                    f"{driver_2_name} in "
                    f"{biggest_loss_sector}."
                )
            })

        # ------------------------------------------------------
        # Find corner advantages
        # ------------------------------------------------------

        driver_1_corner_wins = 0
        driver_2_corner_wins = 0

        for corner in corner_comparison:

            if corner["winner"] == driver_1_name:

                driver_1_corner_wins += 1

            elif corner["winner"] == driver_2_name:

                driver_2_corner_wins += 1

        # ------------------------------------------------------
        # Final comparison report
        # ------------------------------------------------------

        return {

            "driver_1":
                driver_1_name,

            "driver_2":
                driver_2_name,

            "performance": {

                driver_1_name:
                    score_1,

                driver_2_name:
                    score_2
            },

            "sector_comparison":
                sector_comparison,

            "corner_comparison":
                corner_comparison,

            "corner_summary": {

                driver_1_name:
                    driver_1_corner_wins,

                driver_2_name:
                    driver_2_corner_wins
            },

            "overall": {

                "faster_driver":
                    faster_driver,

                "score_difference":
                    round(
                        score_difference,
                        2
                    )
            },

            "diagnosis":
                diagnosis
        }
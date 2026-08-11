from app.analytics.telemetry_analysis import TelemetryAnalysis
from app.analytics.sector_analysis import SectorAnalysis
from app.analytics.corner_comparison import CornerComparison
from app.ml.driver_scoring import DriverScoring
from app.ml.recommendation import RecommendationEngine


class AIEngineer:

    def __init__(
        self,
        telemetry,
        laps
    ):
        self.telemetry = telemetry
        self.laps = laps

    # ==========================================================
    # Single Driver Report
    # ==========================================================

    def generate_report(self):

        telemetry_analysis = TelemetryAnalysis(
            self.telemetry
        )

        telemetry_summary = (
            telemetry_analysis.get_summary()
        )

        scoring = DriverScoring(
            telemetry_analysis
        )

        score = scoring.get_score()

        recommendation_engine = RecommendationEngine(
            scoring
        )

        recommendations = (
            recommendation_engine.get_recommendations()
        )

        sector_analysis = SectorAnalysis(
            self.laps
        )

        sector_summary = (
            sector_analysis.get_summary()
        )

        return {
            "telemetry": telemetry_summary,

            "sectors": sector_summary,

            "performance_score": score,

            "recommendations": recommendations
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
        # Driver scores
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
        # Sector comparison
        # ------------------------------------------------------

        sector_analysis_1 = SectorAnalysis(
            laps_1
        )

        sector_analysis_2 = SectorAnalysis(
            laps_2
        )

        sectors_1 = sector_analysis_1.get_summary()
        sectors_2 = sector_analysis_2.get_summary()

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

        corner_comparison_engine = CornerComparison()

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
                "area": biggest_loss_sector,
                "priority": "High",
                "time_loss": round(
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
                "area": biggest_loss_sector,
                "priority": "Low",
                "time_gain": round(
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
        # Final report
        # ------------------------------------------------------

        return {

            "driver_1": driver_1_name,

            "driver_2": driver_2_name,

            "performance": {
                driver_1_name: score_1,
                driver_2_name: score_2
            },

            "sector_comparison":
                sector_comparison,

            "corner_comparison":
                corner_comparison,

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
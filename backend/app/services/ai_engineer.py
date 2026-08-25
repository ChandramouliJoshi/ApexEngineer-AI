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
    # ENGINEERING SUMMARY
    # ==========================================================

    def _generate_engineering_summary(self, score):

        breakdown = {
            "Speed": float(score.get("speed_score", 0)),
            "Throttle": float(score.get("throttle_score", 0)),
            "Braking": float(score.get("braking_score", 0)),
            "Consistency": float(
                score.get("consistency_score", 0)
            ),
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
        # Priority
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

        messages = {

            "Throttle": (
                f"Throttle is the primary performance limitation "
                f"with a score of {weakest_score:.2f}/100. "
                f"Focus on earlier and smoother throttle application "
                f"while maintaining the driver's strength in "
                f"{strongest_area.lower()}."
            ),

            "Braking": (
                f"Braking is the primary performance limitation "
                f"with a score of {weakest_score:.2f}/100. "
                f"Focus on braking points, brake release and "
                f"corner-entry control while maintaining the "
                f"driver's strength in "
                f"{strongest_area.lower()}."
            ),

            "Consistency": (
                f"Consistency is the primary performance limitation "
                f"with a score of {weakest_score:.2f}/100. "
                f"Focus on repeating consistent braking, cornering "
                f"and throttle patterns while maintaining the "
                f"driver's strength in "
                f"{strongest_area.lower()}."
            ),

            "Speed": (
                f"Speed is the primary performance limitation "
                f"with a score of {weakest_score:.2f}/100. "
                f"Focus on improving corner speed and maintaining "
                f"momentum through the lap."
            ),
        }

        return {
            "overall_score": float(
                score.get("overall_score", 0)
            ),

            "strongest_area":
                strongest_area,

            "strongest_score":
                strongest_score,

            "weakest_area":
                weakest_area,

            "weakest_score":
                weakest_score,

            "priority":
                priority,

            "message":
                messages[weakest_area],
        }

    # ==========================================================
    # CORNER ENGINEERING SUMMARY
    # ==========================================================

    def _generate_corner_summary(self, corners):

        if not corners:

            return {
                "total_corners": 0,

                "highest_braking_corner": None,

                "largest_speed_loss_corner": None,

                "best_acceleration_corner": None,

                "summary": (
                    "Corner analysis unavailable because "
                    "circuit information or valid telemetry "
                    "was not provided."
                ),
            }

        # ------------------------------------------------------
        # Highest braking intensity
        # ------------------------------------------------------

        highest_braking = max(
            corners,
            key=lambda x: x.get(
                "braking_intensity",
                0
            )
        )

        # ------------------------------------------------------
        # Largest entry → apex speed loss
        # ------------------------------------------------------

        largest_speed_loss = max(
            corners,
            key=lambda x: x.get(
                "entry_to_apex_loss",
                0
            )
        )

        # ------------------------------------------------------
        # Best apex → exit acceleration
        # ------------------------------------------------------

        best_acceleration = max(
            corners,
            key=lambda x: x.get(
                "apex_to_exit_gain",
                0
            )
        )

        braking_corner = highest_braking.get(
            "corner"
        )

        braking_intensity = highest_braking.get(
            "braking_intensity",
            0
        )

        speed_loss_corner = largest_speed_loss.get(
            "corner"
        )

        speed_loss = largest_speed_loss.get(
            "entry_to_apex_loss",
            0
        )

        acceleration_corner = best_acceleration.get(
            "corner"
        )

        acceleration_gain = best_acceleration.get(
            "apex_to_exit_gain",
            0
        )

        return {

            "total_corners":
                len(corners),

            "highest_braking_corner": {

                "corner":
                    braking_corner,

                "braking_intensity":
                    braking_intensity,
            },

            "largest_speed_loss_corner": {

                "corner":
                    speed_loss_corner,

                "speed_loss":
                    speed_loss,
            },

            "best_acceleration_corner": {

                "corner":
                    acceleration_corner,

                "speed_gain":
                    acceleration_gain,
            },

            "summary": (
                f"Corner {speed_loss_corner} has the largest "
                f"entry-to-apex speed loss "
                f"({speed_loss:.1f}). "
                f"Corner {acceleration_corner} produces the "
                f"strongest exit acceleration with "
                f"{acceleration_gain:.1f} speed gain."
            ),
        }

    # ==========================================================
    # SINGLE DRIVER REPORT
    # ==========================================================

    def generate_report(self):

        # ------------------------------------------------------
        # TELEMETRY
        # ------------------------------------------------------

        telemetry_analysis = TelemetryAnalysis(
            self.telemetry
        )

        telemetry_summary = (
            telemetry_analysis.get_summary()
        )

        # ------------------------------------------------------
        # DRIVER SCORING
        # ------------------------------------------------------

        scoring = DriverScoring(
            telemetry_analysis
        )

        score = scoring.get_score()

        performance_breakdown = (
            scoring.get_performance_breakdown()
        )

        # ------------------------------------------------------
        # RECOMMENDATIONS
        # ------------------------------------------------------

        recommendation_engine = RecommendationEngine(
            scoring
        )

        recommendations = (
            recommendation_engine.get_recommendations()
        )

        # ------------------------------------------------------
        # SECTORS
        # ------------------------------------------------------

        sector_analysis = SectorAnalysis(
            self.laps
        )

        sector_summary = (
            sector_analysis.get_summary()
        )

        # ------------------------------------------------------
        # CORNERS
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
        # ENGINEERING SUMMARY
        # ------------------------------------------------------

        engineering_summary = (
            self._generate_engineering_summary(
                score
            )
        )

        # ------------------------------------------------------
        # FINAL REPORT
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
                recommendations,
        }

    # ==========================================================
    # DRIVER COMPARISON REPORT
    # ==========================================================

    def generate_comparison_report(
        self,
        telemetry_1,
        telemetry_2,
        circuit_info,
        driver_1_name,
        driver_2_name,
        laps_1,
        laps_2,
    ):

        # ------------------------------------------------------
        # TELEMETRY ANALYSIS
        # ------------------------------------------------------

        analysis_1 = TelemetryAnalysis(
            telemetry_1
        )

        analysis_2 = TelemetryAnalysis(
            telemetry_2
        )

        # ------------------------------------------------------
        # DRIVER SCORING
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
        # ENGINEERING SUMMARIES
        # ------------------------------------------------------

        summary_1 = (
            self._generate_engineering_summary(
                score_1
            )
        )

        summary_2 = (
            self._generate_engineering_summary(
                score_2
            )
        )

        # ------------------------------------------------------
        # SECTOR ANALYSIS
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

        # ------------------------------------------------------
        # SAFE SECTOR VALUES
        # ------------------------------------------------------

        def sector_time(
            sectors,
            sector
        ):
            value = sectors.get(
                sector,
                {}
            ).get("fastest")

            if value is None:
                return None

            return float(value)

        # ------------------------------------------------------
        # SECTOR COMPARISON
        # ------------------------------------------------------

        sector_comparison = {}

        for sector_name, sector_key in [
            ("Sector 1", "sector_1"),
            ("Sector 2", "sector_2"),
            ("Sector 3", "sector_3"),
        ]:

            time_1 = sector_time(
                sectors_1,
                sector_key
            )

            time_2 = sector_time(
                sectors_2,
                sector_key
            )

            delta = None

            if (
                time_1 is not None
                and time_2 is not None
            ):
                delta = round(
                    time_1 - time_2,
                    3
                )

            sector_comparison[
                sector_key
            ] = {

                "driver_1":
                    time_1,

                "driver_2":
                    time_2,

                "delta":
                    delta,
            }

        # ------------------------------------------------------
        # CORNER COMPARISON
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
                driver_2_name,
            )
        )

        # ------------------------------------------------------
        # VALID SECTOR DELTAS
        # ------------------------------------------------------

        sector_deltas = {}

        for sector_key, display_name in [
            ("sector_1", "Sector 1"),
            ("sector_2", "Sector 2"),
            ("sector_3", "Sector 3"),
        ]:

            delta = sector_comparison[
                sector_key
            ]["delta"]

            if delta is not None:

                sector_deltas[
                    display_name
                ] = delta

        # ------------------------------------------------------
        # BIGGEST ABSOLUTE SECTOR DIFFERENCE
        # ------------------------------------------------------

        biggest_loss_sector = None
        biggest_loss = None

        if sector_deltas:

            biggest_loss_sector = max(
                sector_deltas,
                key=lambda x: abs(
                    sector_deltas[x]
                )
            )

            biggest_loss = sector_deltas[
                biggest_loss_sector
            ]

        # ------------------------------------------------------
        # DETERMINE FASTER DRIVER
        # ------------------------------------------------------

        score_difference = round(
            score_1["overall_score"]
            -
            score_2["overall_score"],
            2
        )

        if score_difference > 0:

            faster_driver = driver_1_name

        elif score_difference < 0:

            faster_driver = driver_2_name

        else:

            faster_driver = "Equal"

        # ------------------------------------------------------
        # ENGINEERING DIAGNOSIS
        # ------------------------------------------------------

        diagnosis = []

        if (
            biggest_loss_sector is not None
            and biggest_loss is not None
        ):

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
                        f"{driver_1_name} loses "
                        f"{abs(biggest_loss):.3f}s "
                        f"to {driver_2_name} in "
                        f"{biggest_loss_sector}."
                    ),
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
                        f"{driver_1_name} gains "
                        f"{abs(biggest_loss):.3f}s "
                        f"on {driver_2_name} in "
                        f"{biggest_loss_sector}."
                    ),
                })

        # ------------------------------------------------------
        # CORNER WINS
        # ------------------------------------------------------

        driver_1_corner_wins = 0
        driver_2_corner_wins = 0

        for corner in corner_comparison:

            winner = corner.get(
                "winner"
            )

            if winner == driver_1_name:

                driver_1_corner_wins += 1

            elif winner == driver_2_name:

                driver_2_corner_wins += 1

        # ------------------------------------------------------
        # FINAL COMPARISON REPORT
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
                    score_2,
            },

            "engineering_summary": {

                driver_1_name:
                    summary_1,

                driver_2_name:
                    summary_2,
            },

            "sector_comparison":
                sector_comparison,

            "corner_comparison":
                corner_comparison,

            "corner_summary": {

                driver_1_name:
                    driver_1_corner_wins,

                driver_2_name:
                    driver_2_corner_wins,
            },

            "overall": {

                "faster_driver":
                    faster_driver,

                "score_difference":
                    score_difference,
            },

            "diagnosis":
                diagnosis,
        }
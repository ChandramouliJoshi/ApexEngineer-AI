class RecommendationEngine:

    def __init__(self, scoring):
        self.scoring = scoring

    # ==========================================================
    # Helpers
    # ==========================================================

    @staticmethod
    def _priority(score):
        if score < 50:
            return "High"

        elif score < 70:
            return "Medium"

        return "Low"

    # ==========================================================
    # Recommendations
    # ==========================================================

    def get_recommendations(self):

        scores = self.scoring.get_score()

        recommendations = []

        # ======================================================
        # SPEED
        # ======================================================

        speed_score = scores["speed_score"]

        if speed_score < 50:

            recommendations.append({
                "area": "Speed",
                "priority": "High",
                "message": (
                    f"Speed performance is significantly below target "
                    f"({speed_score:.1f}/100). Focus on carrying more "
                    "minimum speed through corners and maintaining "
                    "higher average speed without compromising stability."
                )
            })

        elif speed_score < 70:

            recommendations.append({
                "area": "Speed",
                "priority": "Medium",
                "message": (
                    f"Speed performance has room for improvement "
                    f"({speed_score:.1f}/100). Focus on increasing "
                    "minimum corner speed and maintaining momentum "
                    "through slower sections."
                )
            })

        # ======================================================
        # THROTTLE
        # ======================================================

        throttle_score = scores["throttle_score"]

        if throttle_score < 50:

            recommendations.append({
                "area": "Throttle",
                "priority": "High",
                "message": (
                    f"Throttle performance is significantly below target "
                    f"({throttle_score:.1f}/100). Work on earlier and "
                    "smoother throttle application at corner exits "
                    "while maintaining traction."
                )
            })

        elif throttle_score < 70:

            recommendations.append({
                "area": "Throttle",
                "priority": "Medium",
                "message": (
                    f"Throttle performance has room for improvement "
                    f"({throttle_score:.1f}/100). Focus on earlier "
                    "acceleration and smoother throttle application "
                    "after the apex."
                )
            })

        # ======================================================
        # BRAKING
        # ======================================================

        braking_score = scores["braking_score"]

        if braking_score < 50:

            recommendations.append({
                "area": "Braking",
                "priority": "High",
                "message": (
                    f"Braking performance is significantly below target "
                    f"({braking_score:.1f}/100). Review braking points, "
                    "brake pressure and brake release technique. "
                    "Aim for controlled and repeatable braking phases."
                )
            })

        elif braking_score < 70:

            recommendations.append({
                "area": "Braking",
                "priority": "Medium",
                "message": (
                    f"Braking performance can be improved "
                    f"({braking_score:.1f}/100). Refine braking points "
                    "and work toward smoother brake release while "
                    "maintaining corner entry stability."
                )
            })

        # ======================================================
        # CONSISTENCY
        # ======================================================

        consistency_score = scores["consistency_score"]

        if consistency_score < 50:

            recommendations.append({
                "area": "Consistency",
                "priority": "High",
                "message": (
                    f"Driving consistency is weak "
                    f"({consistency_score:.1f}/100). Focus on repeating "
                    "braking, cornering and throttle patterns with "
                    "less variation between inputs."
                )
            })

        elif consistency_score < 70:

            recommendations.append({
                "area": "Consistency",
                "priority": "Medium",
                "message": (
                    f"Driving consistency can be improved "
                    f"({consistency_score:.1f}/100). Focus on making "
                    "braking, cornering and throttle inputs more "
                    "repeatable throughout the lap."
                )
            })

        # ======================================================
        # Overall score
        # ======================================================

        overall_score = scores["overall_score"]

        # ======================================================
        # If no weak areas exist
        # ======================================================

        if not recommendations:

            recommendations.append({
                "area": "Overall",
                "priority": "Low",
                "message": (
                    f"Performance is well balanced with an overall "
                    f"score of {overall_score:.1f}/100. Focus on "
                    "marginal gains in corner entry, apex speed, "
                    "exit acceleration and maintaining consistency."
                )
            })

        # ======================================================
        # Sort recommendations by priority
        # ======================================================

        priority_order = {
            "High": 0,
            "Medium": 1,
            "Low": 2
        }

        recommendations.sort(
            key=lambda recommendation:
                priority_order.get(
                    recommendation["priority"],
                    3
                )
        )

        return recommendations
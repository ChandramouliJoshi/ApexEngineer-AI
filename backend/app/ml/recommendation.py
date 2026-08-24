class RecommendationEngine:

    def __init__(self, scoring):
        self.scoring = scoring

    def get_recommendations(self):

        recommendations = []

        scores = self.scoring.get_score()

        # ======================================================
        # Speed
        # ======================================================

        speed_score = scores["speed_score"]

        if speed_score < 60:
            recommendations.append({
                "area": "Speed",
                "priority": "High",
                "message": (
                    f"Speed performance is below target "
                    f"({speed_score:.1f}/100). Focus on carrying "
                    "more speed through the lap, particularly "
                    "through slower corners."
                )
            })

        elif speed_score < 75:
            recommendations.append({
                "area": "Speed",
                "priority": "Medium",
                "message": (
                    f"Speed performance is moderate "
                    f"({speed_score:.1f}/100). Look for opportunities "
                    "to increase minimum and average corner speed."
                )
            })

        # ======================================================
        # Throttle
        # ======================================================

        throttle_score = scores["throttle_score"]

        if throttle_score < 50:
            recommendations.append({
                "area": "Throttle",
                "priority": "High",
                "message": (
                    f"Full-throttle performance is low "
                    f"({throttle_score:.1f}%). Improve throttle "
                    "application and aim for earlier, smoother "
                    "acceleration on corner exits."
                )
            })

        elif throttle_score < 70:
            recommendations.append({
                "area": "Throttle",
                "priority": "Medium",
                "message": (
                    f"Full-throttle usage is moderate "
                    f"({throttle_score:.1f}%). Look for opportunities "
                    "to apply throttle earlier while maintaining "
                    "traction and stability."
                )
            })

        # ======================================================
        # Braking
        # ======================================================

        braking_score = scores["braking_score"]

        if braking_score < 60:
            recommendations.append({
                "area": "Braking",
                "priority": "High",
                "message": (
                    f"Braking efficiency is low "
                    f"({braking_score:.1f}/100). Review braking points "
                    "and reduce unnecessary time spent on the brakes."
                )
            })

        elif braking_score < 75:
            recommendations.append({
                "area": "Braking",
                "priority": "Medium",
                "message": (
                    f"Braking efficiency can be improved "
                    f"({braking_score:.1f}/100). Refine braking points "
                    "and work toward shorter, more controlled braking "
                    "phases."
                )
            })

        # ======================================================
        # Consistency
        # ======================================================

        consistency_score = scores["consistency_score"]

        if consistency_score < 60:
            recommendations.append({
                "area": "Consistency",
                "priority": "High",
                "message": (
                    f"Speed consistency is weak "
                    f"({consistency_score:.1f}/100). Focus on repeating "
                    "consistent braking, cornering and throttle "
                    "patterns across the lap."
                )
            })

        elif consistency_score < 75:
            recommendations.append({
                "area": "Consistency",
                "priority": "Medium",
                "message": (
                    f"Speed consistency is moderate "
                    f"({consistency_score:.1f}/100). Focus on making "
                    "braking, cornering and throttle inputs more "
                    "repeatable."
                )
            })

        # ======================================================
        # Overall
        # ======================================================

        if not recommendations:
            recommendations.append({
                "area": "Overall",
                "priority": "Low",
                "message": (
                    "Performance is well balanced across the measured "
                    "areas. Focus on marginal gains and maintaining "
                    "consistency."
                )
            })

        return recommendations
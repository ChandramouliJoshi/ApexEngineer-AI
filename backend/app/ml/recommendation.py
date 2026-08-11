class RecommendationEngine:

    def __init__(self, scoring):
        self.scoring = scoring

    def get_recommendations(self):

        recommendations = []

        scores = self.scoring.get_score()

        if scores["speed_score"] < 60:
            recommendations.append({
                "area": "Speed",
                "priority": "High",
                "message":
                    "Focus on carrying more speed through the lap."
            })

        elif scores["speed_score"] < 75:
            recommendations.append({
                "area": "Speed",
                "priority": "Medium",
                "message":
                    "Look for opportunities to increase minimum and average speed."
            })

        if scores["throttle_score"] < 50:
            recommendations.append({
                "area": "Throttle",
                "priority": "High",
                "message":
                    "Improve throttle application and maximize full-throttle time."
            })

        elif scores["throttle_score"] < 70:
            recommendations.append({
                "area": "Throttle",
                "priority": "Medium",
                "message":
                    "Work on earlier and smoother throttle application."
            })

        if scores["braking_score"] < 60:
            recommendations.append({
                "area": "Braking",
                "priority": "High",
                "message":
                    "Improve braking efficiency and reduce unnecessary braking."
            })

        elif scores["braking_score"] < 75:
            recommendations.append({
                "area": "Braking",
                "priority": "Medium",
                "message":
                    "Refine braking points and reduce time spent on the brakes."
            })

        if scores["consistency_score"] < 60:
            recommendations.append({
                "area": "Consistency",
                "priority": "High",
                "message":
                    "Work on maintaining a more consistent speed profile."
            })

        elif scores["consistency_score"] < 75:
            recommendations.append({
                "area": "Consistency",
                "priority": "Medium",
                "message":
                    "Focus on repeating braking, cornering and throttle patterns."
            })

        if not recommendations:
            recommendations.append({
                "area": "Overall",
                "priority": "Low",
                "message":
                    "Performance is well balanced. Focus on marginal gains."
            })

        return recommendations
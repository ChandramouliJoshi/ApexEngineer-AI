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
        Compare two drivers corner by corner.
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

            comparison.append({

                "corner": c1["corner"],

                "driver_1": c1,

                "driver_2": c2,

                "entry_speed_delta":
                    c1["entry_speed"] - c2["entry_speed"],

                "apex_speed_delta":
                    c1["apex_speed"] - c2["apex_speed"],

                "exit_speed_delta":
                    c1["exit_speed"] - c2["exit_speed"],

                "winner": (
                    "Driver 1"
                    if (
                        c1["entry_speed"] +
                        c1["apex_speed"] +
                        c1["exit_speed"]
                    ) >
                    (
                        c2["entry_speed"] +
                        c2["apex_speed"] +
                        c2["exit_speed"]
                    )
                    else "Driver 2"
                )

            })

        return comparison
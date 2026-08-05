class CornerAnalysis:

    def __init__(
        self,
        telemetry,
        circuit_info
    ):
        self.telemetry = telemetry
        self.circuit_info = circuit_info

    def get_corner_data(
        self,
        corner_number,
        window=50
    ):
        """
        Returns telemetry data around a specific corner.
        """

        corner = self.circuit_info.corners.iloc[
            corner_number - 1
        ]

        distance = corner["Distance"]

        corner_data = self.telemetry[
            (self.telemetry["Distance"] >= distance - window) &
            (self.telemetry["Distance"] <= distance + window)
        ]

        return corner_data

    def analyze_corner(
        self,
        corner_number
    ):
        """
        Analyze a single corner.
        """

        corner = self.get_corner_data(corner_number)

        return {

            "corner": corner_number,

            "entry_speed": float(
                corner.iloc[0]["Speed"]
            ),

            "apex_speed": float(
                corner["Speed"].min()
            ),

            "exit_speed": float(
                corner.iloc[-1]["Speed"]
            ),

            "max_brake": int(
                corner["Brake"].astype(int).max()
            ),

            "max_throttle": float(
                corner["Throttle"].max()
            ),

            "average_rpm": float(
                corner["RPM"].mean()
            ),

            "samples": len(corner)

        }

    def analyze_all_corners(self):
        """
        Analyze every corner on the circuit.
        """

        results = []

        total_corners = len(self.circuit_info.corners)

        for corner_number in range(1, total_corners + 1):

            result = self.analyze_corner(
                corner_number
            )

            results.append(result)

        return results
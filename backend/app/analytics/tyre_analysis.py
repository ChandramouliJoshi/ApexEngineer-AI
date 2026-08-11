class TyreAnalysis:

    def __init__(self, laps):
        self.laps = laps

    def get_compounds_used(self):
        compounds = (
            self.laps["Compound"]
            .dropna()
            .astype(str)
            .unique()
            .tolist()
        )

        return compounds

    def get_stint_summary(self):

        result = []

        grouped = self.laps.groupby("Stint")

        for stint_number, stint_data in grouped:

            if stint_data.empty:
                continue

            compound = stint_data["Compound"].dropna()

            tyre_life = stint_data["TyreLife"].dropna()

            result.append({
                "stint": int(stint_number),

                "compound": (
                    str(compound.iloc[0])
                    if not compound.empty
                    else None
                ),

                "laps": len(stint_data),

                "tyre_life_start": (
                    float(tyre_life.iloc[0])
                    if not tyre_life.empty
                    else None
                ),

                "tyre_life_end": (
                    float(tyre_life.iloc[-1])
                    if not tyre_life.empty
                    else None
                )
            })

        return result

    def get_fastest_lap_by_compound(self):

        result = {}

        for compound, compound_data in self.laps.groupby("Compound"):

            valid_laps = compound_data[
                compound_data["LapTime"].notna()
            ]

            if valid_laps.empty:
                continue

            fastest = valid_laps["LapTime"].min()

            result[str(compound)] = round(
                fastest.total_seconds(),
                3
            )

        return result

    def get_summary(self):

        return {
            "compounds_used":
                self.get_compounds_used(),

            "stints":
                self.get_stint_summary(),

            "fastest_lap_by_compound":
                self.get_fastest_lap_by_compound()
        }
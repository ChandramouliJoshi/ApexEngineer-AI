import pandas as pd


class TyreAnalysis:

    def __init__(self, laps):
        self.laps = laps

    # ==========================================================
    # Helpers
    # ==========================================================

    def _empty(self):
        return (
            self.laps is None
            or self.laps.empty
        )

    def _has_column(self, column):
        return (
            not self._empty()
            and column in self.laps.columns
        )

    # ==========================================================
    # Compounds
    # ==========================================================

    def get_compounds_used(self):

        if not self._has_column("Compound"):
            return []

        compounds = (
            self.laps["Compound"]
            .dropna()
            .astype(str)
            .str.strip()
        )

        compounds = compounds[
            compounds != ""
        ].unique().tolist()

        return compounds

    # ==========================================================
    # Stint Summary
    # ==========================================================

    def get_stint_summary(self):

        if not self._has_column("Stint"):
            return []

        result = []

        grouped = self.laps.groupby(
            "Stint",
            dropna=True
        )

        for stint_number, stint_data in grouped:

            if stint_data.empty:
                continue

            # --------------------------------------------------
            # Compound
            # --------------------------------------------------

            compound = pd.Series(
                dtype="object"
            )

            if "Compound" in stint_data.columns:

                compound = (
                    stint_data["Compound"]
                    .dropna()
                    .astype(str)
                    .str.strip()
                )

                compound = compound[
                    compound != ""
                ]

            # --------------------------------------------------
            # Tyre life
            # --------------------------------------------------

            tyre_life = pd.Series(
                dtype="float64"
            )

            if "TyreLife" in stint_data.columns:

                tyre_life = pd.to_numeric(
                    stint_data["TyreLife"],
                    errors="coerce"
                ).dropna()

            # --------------------------------------------------
            # Stint number
            # --------------------------------------------------

            try:
                stint_value = int(
                    stint_number
                )
            except (
                TypeError,
                ValueError
            ):
                continue

            # --------------------------------------------------
            # Result
            # --------------------------------------------------

            result.append({

                "stint":
                    stint_value,

                "compound": (
                    str(compound.iloc[0])
                    if not compound.empty
                    else None
                ),

                "laps":
                    len(stint_data),

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

    # ==========================================================
    # Fastest Lap By Compound
    # ==========================================================

    def get_fastest_lap_by_compound(self):

        if not self._has_column("Compound"):
            return {}

        if not self._has_column("LapTime"):
            return {}

        result = {}

        # ------------------------------------------------------
        # Convert LapTime safely
        # ------------------------------------------------------

        lap_times = self.laps[
            ["Compound", "LapTime"]
        ].copy()

        lap_times["LapTime"] = pd.to_timedelta(
            lap_times["LapTime"],
            errors="coerce"
        )

        lap_times = lap_times.dropna(
            subset=[
                "Compound",
                "LapTime"
            ]
        )

        if lap_times.empty:
            return {}

        # ------------------------------------------------------
        # Group by compound
        # ------------------------------------------------------

        grouped = lap_times.groupby(
            "Compound"
        )

        for compound, compound_data in grouped:

            if compound_data.empty:
                continue

            fastest = compound_data[
                "LapTime"
            ].min()

            result[str(compound)] = round(
                float(
                    fastest.total_seconds()
                ),
                3
            )

        return result

    # ==========================================================
    # Fastest Compound
    # ==========================================================

    def get_fastest_compound(self):

        fastest_by_compound = (
            self.get_fastest_lap_by_compound()
        )

        if not fastest_by_compound:
            return None

        return min(
            fastest_by_compound,
            key=fastest_by_compound.get
        )

    # ==========================================================
    # Tyre Performance Comparison
    # ==========================================================

    def get_compound_performance(self):

        fastest_by_compound = (
            self.get_fastest_lap_by_compound()
        )

        if not fastest_by_compound:
            return {}

        fastest_time = min(
            fastest_by_compound.values()
        )

        result = {}

        for compound, lap_time in (
            fastest_by_compound.items()
        ):

            result[compound] = {
                "fastest_lap":
                    lap_time,

                "gap_to_best": round(
                    lap_time -
                    fastest_time,
                    3
                )
            }

        return result

    # ==========================================================
    # Summary
    # ==========================================================

    def get_summary(self):

        return {

            "compounds_used":
                self.get_compounds_used(),

            "stints":
                self.get_stint_summary(),

            "fastest_lap_by_compound":
                self.get_fastest_lap_by_compound(),

            "fastest_compound":
                self.get_fastest_compound(),

            "compound_performance":
                self.get_compound_performance()
        }
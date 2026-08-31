/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import axios from "axios"

export interface TyreStint {
  stint: number
  compound: string
  laps: number
  tyreLifeStart: number
  tyreLifeEnd: number
}

export interface TyreData {
  compoundsUsed: string[]
  stints: TyreStint[]
  fastestLapByCompound: Record<string, number>
}

interface UseTyresParams {
  year: number
  grandPrix: string
  driver: string
  sessionType: string
}

interface UseTyresResult {
  data: TyreData | null
  loading: boolean
  error: string | null
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000"

export function useTyres({
  year,
  grandPrix,
  driver,
  sessionType,
}: UseTyresParams): UseTyresResult {

  const [data, setData] =
    useState<TyreData | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {

    let cancelled = false

    async function fetchTyres() {

      try {

        setLoading(true)
        setError(null)

        const response = await axios.get(
          `${API_URL}/analysis/tyres`,
          {
            params: {
              year,
              grand_prix: grandPrix,
              driver,
              session_type: sessionType,
            },
          }
        )

        if (cancelled) {
          return
        }

        const payload = response.data

        if (
          !payload ||
          typeof payload !== "object"
        ) {
          throw new Error(
            "Tyre analysis endpoint returned an invalid response."
          )
        }

        /*
         * Compounds
         */

        const compoundsUsed =
          Array.isArray(
            payload.compounds_used
          )
            ? payload.compounds_used.map(
                (compound: any) =>
                  String(compound)
              )
            : []

        /*
         * Stints
         */

        const rawStints =
          Array.isArray(payload.stints)
            ? payload.stints
            : []

        const stints: TyreStint[] =
          rawStints
            .map(
              (row: any): TyreStint => ({
                stint: Number(
                  row.stint ?? 0
                ),

                compound: String(
                  row.compound ?? "UNKNOWN"
                ),

                laps: Number(
                  row.laps ?? 0
                ),

                tyreLifeStart: Number(
                  row.tyre_life_start ??
                  row.tyreLifeStart ??
                  0
                ),

                tyreLifeEnd: Number(
                  row.tyre_life_end ??
                  row.tyreLifeEnd ??
                  0
                ),
              })
            )
            .filter(
              (stint: TyreStint) =>
                Number.isFinite(
                  stint.stint
                )
            )
            .sort(
              (a: TyreStint, b: TyreStint) =>
                a.stint - b.stint
            )

        /*
         * Fastest lap by compound
         */

        const fastestLapByCompound: Record<
          string,
          number
        > = {}

        if (
          payload.fastest_lap_by_compound &&
          typeof payload.fastest_lap_by_compound ===
            "object"
        ) {

          Object.entries(
            payload.fastest_lap_by_compound
          ).forEach(
            ([compound, value]) => {

              const lapTime =
                Number(value)

              if (
                Number.isFinite(
                  lapTime
                )
              ) {

                fastestLapByCompound[
                  compound
                ] = lapTime

              }

            }
          )

        }

        /*
         * Make sure we received useful
         * tyre information.
         */

        if (
          compoundsUsed.length === 0 &&
          stints.length === 0 &&
          Object.keys(
            fastestLapByCompound
          ).length === 0
        ) {
          throw new Error(
            "Tyre analysis endpoint returned no tyre data."
          )
        }

        setData({
          compoundsUsed,
          stints,
          fastestLapByCompound,
        })

      }
      catch (err: any) {

        if (cancelled) {
          return
        }

        console.error(
          "Tyre analysis fetch failed:",
          err
        )

        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load tyre analysis."
        )

        setData(null)

      }
      finally {

        if (!cancelled) {
          setLoading(false)
        }

      }

    }

    fetchTyres()

    return () => {
      cancelled = true
    }

  }, [
    year,
    grandPrix,
    driver,
    sessionType,
  ])

  return {
    data,
    loading,
    error,
  }
}

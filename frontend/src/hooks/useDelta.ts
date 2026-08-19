import { useEffect, useState } from "react"
import axios from "axios"


export interface DeltaPoint {
  Distance: number

  Speed_1: number
  Speed_2: number

  Throttle_1: number
  Throttle_2: number

  Brake_1: boolean
  Brake_2: boolean

  RPM_1: number
  RPM_2: number

  nGear_1: number
  nGear_2: number

  DRS_1: number
  DRS_2: number

  Time_1: number
  Time_2: number

  SessionTime_1: number
  SessionTime_2: number

  SpeedDelta: number
  ThrottleDelta: number
  BrakeDelta: number
  RPMDelta: number
}


interface UseDeltaParams {
  year: number
  grandPrix: string
  driver1: string
  driver2: string
  sessionType: string
}


interface UseDeltaResult {
  data: DeltaPoint[]
  loading: boolean
  error: string | null
}


const API_URL = "http://127.0.0.1:8000"


export function useDelta({
  year,
  grandPrix,
  driver1,
  driver2,
  sessionType,
}: UseDeltaParams): UseDeltaResult {

  const [data, setData] =
    useState<DeltaPoint[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)


  useEffect(() => {

    let cancelled = false


    async function fetchDelta() {

      try {

        setLoading(true)
        setError(null)


        const response = await axios.get(
          `${API_URL}/analysis/delta`,
          {
            params: {
              year,
              grand_prix: grandPrix,
              driver_1: driver1,
              driver_2: driver2,
              session_type: sessionType,
            },
          }
        )


        if (cancelled) {
          return
        }


        const payload = response.data


        /*
         * Supported API response formats:
         *
         * 1. [
         *      {...},
         *      {...}
         *    ]
         *
         * 2. {
         *      "data": [...]
         *    }
         */


        let rows: any[] = []


        if (Array.isArray(payload)) {

          rows = payload

        }
        else if (
          payload &&
          Array.isArray(payload.data)
        ) {

          rows = payload.data

        }


        /*
         * Normalize backend response.
         */

        const normalised: DeltaPoint[] =
          rows
            .map((row) => {

              return {

                Distance: Number(
                  row.Distance ?? 0
                ),

                Speed_1: Number(
                  row.Speed_1 ?? 0
                ),

                Speed_2: Number(
                  row.Speed_2 ?? 0
                ),

                Throttle_1: Number(
                  row.Throttle_1 ?? 0
                ),

                Throttle_2: Number(
                  row.Throttle_2 ?? 0
                ),

                Brake_1: Boolean(
                  row.Brake_1
                ),

                Brake_2: Boolean(
                  row.Brake_2
                ),

                RPM_1: Number(
                  row.RPM_1 ?? 0
                ),

                RPM_2: Number(
                  row.RPM_2 ?? 0
                ),

                nGear_1: Number(
                  row.nGear_1 ?? 0
                ),

                nGear_2: Number(
                  row.nGear_2 ?? 0
                ),

                DRS_1: Number(
                  row.DRS_1 ?? 0
                ),

                DRS_2: Number(
                  row.DRS_2 ?? 0
                ),

                Time_1: Number(
                  row.Time_1 ?? 0
                ),

                Time_2: Number(
                  row.Time_2 ?? 0
                ),

                SessionTime_1: Number(
                  row.SessionTime_1 ?? 0
                ),

                SessionTime_2: Number(
                  row.SessionTime_2 ?? 0
                ),

                SpeedDelta: Number(
                  row.SpeedDelta ?? 0
                ),

                ThrottleDelta: Number(
                  row.ThrottleDelta ?? 0
                ),

                BrakeDelta: Number(
                  row.BrakeDelta ?? 0
                ),

                RPMDelta: Number(
                  row.RPMDelta ?? 0
                ),

              }

            })
            .filter(
              (row) =>
                Number.isFinite(row.Distance)
            )


        if (normalised.length === 0) {

          throw new Error(
            "Delta endpoint returned no telemetry samples."
          )

        }


        /*
         * Always progress from the beginning
         * of the track to the end.
         */

        normalised.sort(
          (a, b) =>
            a.Distance - b.Distance
        )


        if (!cancelled) {

          setData(normalised)

        }

      }
      catch (err: any) {

        if (cancelled) {
          return
        }


        console.error(
          "Delta fetch failed:",
          err
        )


        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load delta analysis."
        )

      }
      finally {

        if (!cancelled) {
          setLoading(false)
        }

      }

    }


    fetchDelta()


    return () => {

      cancelled = true

    }

  }, [
    year,
    grandPrix,
    driver1,
    driver2,
    sessionType,
  ])


  return {
    data,
    loading,
    error,
  }
}
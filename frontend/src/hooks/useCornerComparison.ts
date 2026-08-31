/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import axios from "axios"


export interface CornerMetrics {
  corner: number
  entry_speed: number
  apex_speed: number
  exit_speed: number
  max_brake: number
  max_throttle: number
  average_rpm: number
  samples: number
}


export interface CornerComparisonPoint {
  corner: number

  driver_1: CornerMetrics
  driver_2: CornerMetrics

  entry_speed_delta: number
  apex_speed_delta: number
  exit_speed_delta: number

  winner: string
}


interface UseCornerComparisonParams {
  year: number
  grandPrix: string
  driver1: string
  driver2: string
  sessionType: string
}


interface UseCornerComparisonResult {
  data: CornerComparisonPoint[]
  loading: boolean
  error: string | null
}


const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000"

export function useCornerComparison({
  year,
  grandPrix,
  driver1,
  driver2,
  sessionType,
}: UseCornerComparisonParams): UseCornerComparisonResult {

  const [data, setData] =
    useState<CornerComparisonPoint[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)


  useEffect(() => {

    let cancelled = false


    async function fetchCornerComparison() {

      try {

        setLoading(true)
        setError(null)


        const response = await axios.get(
          `${API_URL}/analysis/corner-comparison`,
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

        const normalised: CornerComparisonPoint[] =
          rows
            .map((row) => {

              const driver1Data =
                row.driver_1 ?? {}

              const driver2Data =
                row.driver_2 ?? {}


              return {

                corner: Number(
                  row.corner ?? 0
                ),


                driver_1: {

                  corner: Number(
                    driver1Data.corner ??
                    row.corner ??
                    0
                  ),

                  entry_speed: Number(
                    driver1Data.entry_speed ??
                    0
                  ),

                  apex_speed: Number(
                    driver1Data.apex_speed ??
                    0
                  ),

                  exit_speed: Number(
                    driver1Data.exit_speed ??
                    0
                  ),

                  max_brake: Number(
                    driver1Data.max_brake ??
                    0
                  ),

                  max_throttle: Number(
                    driver1Data.max_throttle ??
                    0
                  ),

                  average_rpm: Number(
                    driver1Data.average_rpm ??
                    0
                  ),

                  samples: Number(
                    driver1Data.samples ??
                    0
                  ),

                },


                driver_2: {

                  corner: Number(
                    driver2Data.corner ??
                    row.corner ??
                    0
                  ),

                  entry_speed: Number(
                    driver2Data.entry_speed ??
                    0
                  ),

                  apex_speed: Number(
                    driver2Data.apex_speed ??
                    0
                  ),

                  exit_speed: Number(
                    driver2Data.exit_speed ??
                    0
                  ),

                  max_brake: Number(
                    driver2Data.max_brake ??
                    0
                  ),

                  max_throttle: Number(
                    driver2Data.max_throttle ??
                    0
                  ),

                  average_rpm: Number(
                    driver2Data.average_rpm ??
                    0
                  ),

                  samples: Number(
                    driver2Data.samples ??
                    0
                  ),

                },


                entry_speed_delta: Number(
                  row.entry_speed_delta ??
                  0
                ),

                apex_speed_delta: Number(
                  row.apex_speed_delta ??
                  0
                ),

                exit_speed_delta: Number(
                  row.exit_speed_delta ??
                  0
                ),

                winner: String(
                  row.winner ??
                  ""
                ),

              }

            })
            .filter(
              (row) =>
                Number.isFinite(row.corner)
            )


        if (normalised.length === 0) {

          throw new Error(
            "Corner comparison endpoint returned no data."
          )

        }


        /*
         * Always display corners in track order.
         */

        normalised.sort(
          (a, b) =>
            a.corner - b.corner
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
          "Corner comparison fetch failed:",
          err
        )


        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load corner comparison."
        )

      }
      finally {

        if (!cancelled) {

          setLoading(false)

        }

      }

    }


    fetchCornerComparison()


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

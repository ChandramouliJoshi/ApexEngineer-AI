import { useEffect, useState } from "react"
import axios from "axios"

export interface CornerData {
  corner: number
  entrySpeed: number
  apexSpeed: number
  exitSpeed: number
  maxBrake: number
  maxThrottle: number
  averageRPM: number
  samples: number
}

interface UseCornersParams {
  year: number
  grandPrix: string
  driver: string
  sessionType: string
}

interface UseCornersResult {
  data: CornerData[]
  loading: boolean
  error: string | null
}

const API_URL = "http://127.0.0.1:8000"

export function useCorners({
  year,
  grandPrix,
  driver,
  sessionType,
}: UseCornersParams): UseCornersResult {

  const [data, setData] =
    useState<CornerData[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {

    let cancelled = false

    async function fetchCorners() {

      try {

        setLoading(true)
        setError(null)

        const response = await axios.get(
          `${API_URL}/analysis/corners`,
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

        /*
         * Backend currently returns:
         *
         * [
         *   {
         *     corner,
         *     entry_speed,
         *     apex_speed,
         *     exit_speed,
         *     max_brake,
         *     max_throttle,
         *     average_rpm,
         *     samples
         *   }
         * ]
         */

        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.corners)
            ? payload.corners
            : Array.isArray(payload?.data)
              ? payload.data
              : []

        const normalised: CornerData[] =
          rows
            .map((row: any): CornerData => ({
              corner: Number(
                row.corner ?? 0
              ),

              entrySpeed: Number(
                row.entry_speed ??
                row.entrySpeed ??
                row.EntrySpeed ??
                0
              ),

              apexSpeed: Number(
                row.apex_speed ??
                row.apexSpeed ??
                row.ApexSpeed ??
                0
              ),

              exitSpeed: Number(
                row.exit_speed ??
                row.exitSpeed ??
                row.ExitSpeed ??
                0
              ),

              maxBrake: Number(
                row.max_brake ??
                row.maxBrake ??
                row.MaxBrake ??
                0
              ),

              maxThrottle: Number(
                row.max_throttle ??
                row.maxThrottle ??
                row.MaxThrottle ??
                0
              ),

              averageRPM: Number(
                row.average_rpm ??
                row.averageRPM ??
                row.AverageRPM ??
                0
              ),

              samples: Number(
                row.samples ?? 0
              ),
            }))
            .filter(
              (corner: CornerData) =>
                Number.isFinite(
                  corner.corner
                )
            )
            .sort(
              (a: CornerData, b: CornerData) =>
                a.corner - b.corner
            )

        if (normalised.length === 0) {
          throw new Error(
            "Corner analysis endpoint returned no corner data."
          )
        }

        /*
         * Validate the important numerical
         * fields before exposing the data
         * to the dashboard.
         */

        const hasInvalidData =
          normalised.some(
            (corner) =>
              !Number.isFinite(
                corner.entrySpeed
              ) ||
              !Number.isFinite(
                corner.apexSpeed
              ) ||
              !Number.isFinite(
                corner.exitSpeed
              ) ||
              !Number.isFinite(
                corner.maxBrake
              ) ||
              !Number.isFinite(
                corner.maxThrottle
              ) ||
              !Number.isFinite(
                corner.averageRPM
              ) ||
              !Number.isFinite(
                corner.samples
              )
          )

        if (hasInvalidData) {
          throw new Error(
            "Corner analysis returned invalid numerical data."
          )
        }

        setData(normalised)

      }
      catch (err: any) {

        if (cancelled) {
          return
        }

        console.error(
          "Corner analysis fetch failed:",
          err
        )

        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load corner analysis."
        )

        setData([])

      }
      finally {

        if (!cancelled) {
          setLoading(false)
        }

      }

    }

    fetchCorners()

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
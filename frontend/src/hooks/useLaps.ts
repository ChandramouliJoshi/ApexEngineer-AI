import { useEffect, useState } from "react"
import axios from "axios"

export interface LapData {
  LapNumber: number
  LapTime: number | null
  Sector1Time: number | null
  Sector2Time: number | null
  Sector3Time: number | null
  Compound: string | null
  TyreLife: number | null
  Stint: number | null
  Position: number | null
  SpeedFL: number | null
  SpeedST: number | null
  IsPersonalBest: boolean
  Deleted: boolean
  IsAccurate: boolean
}

interface UseLapsParams {
  year: number
  grandPrix: string
  driver: string
  sessionType: string
  limit?: number
}

interface UseLapsResult {
  laps: LapData[]
  loading: boolean
  error: string | null
  total: number
}

const API_URL = "http://127.0.0.1:8000"

export function useLaps({
  year,
  grandPrix,
  driver,
  sessionType,
  limit = 20,
}: UseLapsParams): UseLapsResult {

  const [laps, setLaps] = useState<LapData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {

    let cancelled = false

    async function fetchLaps() {

      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(
          `${API_URL}/laps/`,
          {
            params: {
              year,
              grand_prix: grandPrix,
              driver,
              session_type: sessionType,
              limit,
              offset: 0,
            },
          }
        )

        if (cancelled) return

        const payload = response.data

        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.laps)
            ? payload.laps
            : Array.isArray(payload?.data)
              ? payload.data
              : []

        const normalised: LapData[] = rows
          .map((row: any): LapData => ({
            LapNumber: Number(
              row.LapNumber ??
              row.lap_number ??
              0
            ),

            LapTime:
              row.LapTime ??
              row.lap_time ??
              null,

            Sector1Time:
              row.Sector1Time ??
              row.sector1_time ??
              null,

            Sector2Time:
              row.Sector2Time ??
              row.sector2_time ??
              null,

            Sector3Time:
              row.Sector3Time ??
              row.sector3_time ??
              null,

            Compound:
              row.Compound ??
              row.compound ??
              null,

            TyreLife:
              row.TyreLife ??
              row.tyre_life ??
              null,

            Stint:
              row.Stint ??
              row.stint ??
              null,

            Position:
              row.Position ??
              row.position ??
              null,

            SpeedFL:
              row.SpeedFL ??
              row.speed_fl ??
              null,

            SpeedST:
              row.SpeedST ??
              row.speed_st ??
              null,

            IsPersonalBest: Boolean(
              row.IsPersonalBest ??
              row.is_personal_best ??
              false
            ),

            Deleted: Boolean(
              row.Deleted ??
              row.deleted ??
              false
            ),

            IsAccurate: Boolean(
              row.IsAccurate ??
              row.is_accurate ??
              false
            ),
          }))
          .filter(
            (lap: LapData) =>
              Number.isFinite(lap.LapNumber)
          )
          .sort(
            (a: LapData, b: LapData) =>
              b.LapNumber - a.LapNumber
          )

        setLaps(normalised)

        setTotal(
          Number(
            payload?.total ??
            normalised.length
          )
        )

      } catch (err: any) {

        if (cancelled) return

        console.error(
          "Lap data fetch failed:",
          err
        )

        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load lap data."
        )

      } finally {

        if (!cancelled) {
          setLoading(false)
        }

      }

    }

    fetchLaps()

    return () => {
      cancelled = true
    }

  }, [
    year,
    grandPrix,
    driver,
    sessionType,
    limit,
  ])

  return {
    laps,
    loading,
    error,
    total,
  }
}
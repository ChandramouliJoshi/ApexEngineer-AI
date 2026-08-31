/* eslint-disable @typescript-eslint/no-explicit-any */
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

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000"
  
function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null
  }

  const number = Number(value)

  return Number.isFinite(number) ? number : null
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true"
  }

  return Boolean(value)
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail

    if (typeof detail === "string") {
      return detail
    }

    if (
      detail &&
      typeof detail === "object" &&
      typeof detail.message === "string"
    ) {
      return detail.message
    }

    if (typeof error.message === "string") {
      return error.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Unable to load lap data."
}

function normaliseLap(row: any): LapData {
  return {
    LapNumber: Number(
      row?.LapNumber ??
      row?.lap_number ??
      0
    ),

    LapTime: toNumber(
      row?.LapTime ??
      row?.lap_time
    ),

    Sector1Time: toNumber(
      row?.Sector1Time ??
      row?.sector1_time
    ),

    Sector2Time: toNumber(
      row?.Sector2Time ??
      row?.sector2_time
    ),

    Sector3Time: toNumber(
      row?.Sector3Time ??
      row?.sector3_time
    ),

    Compound:
      row?.Compound ??
      row?.compound ??
      null,

    TyreLife: toNumber(
      row?.TyreLife ??
      row?.tyre_life
    ),

    Stint: toNumber(
      row?.Stint ??
      row?.stint
    ),

    Position: toNumber(
      row?.Position ??
      row?.position
    ),

    SpeedFL: toNumber(
      row?.SpeedFL ??
      row?.speed_fl
    ),

    SpeedST: toNumber(
      row?.SpeedST ??
      row?.speed_st
    ),

    IsPersonalBest: toBoolean(
      row?.IsPersonalBest ??
      row?.is_personal_best
    ),

    Deleted: toBoolean(
      row?.Deleted ??
      row?.deleted
    ),

    IsAccurate: toBoolean(
      row?.IsAccurate ??
      row?.is_accurate
    ),
  }
}

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

        const normalised = rows
          .map(normaliseLap)
          .filter(
            (lap: LapData) =>
              Number.isFinite(lap.LapNumber) &&
              lap.LapNumber > 0
          )
          .sort(
            (a: LapData, b: LapData) =>
              a.LapNumber - b.LapNumber
          )

        setLaps(normalised)

        const backendTotal = Number(payload?.total)

        setTotal(
          Number.isFinite(backendTotal)
            ? backendTotal
            : normalised.length
        )

      } catch (err: unknown) {
        if (cancelled) return

        console.error(
          "Lap data fetch failed:",
          err
        )

        setError(getErrorMessage(err))

        setLaps([])
        setTotal(0)

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

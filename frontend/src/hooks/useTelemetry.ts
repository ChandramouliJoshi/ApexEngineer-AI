/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import axios from "axios"

export interface TelemetryPoint {
  Distance: number
  Speed: number
  Throttle: number
  Brake: number
  RPM: number
  Gear: number
  DRS: number
}

interface UseTelemetryParams {
  year: number
  grandPrix: string
  driver: string
  sessionType: string
}

interface UseTelemetryResult {
  data: TelemetryPoint[]
  loading: boolean
  error: string | null
}

const API_URL = "http://127.0.0.1:8000"

function toNumber(value: unknown, fallback = 0): number {
  if (value === null || value === undefined || value === "") {
    return fallback
  }

  const number = Number(value)

  return Number.isFinite(number) ? number : fallback
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

  return "Unable to load telemetry."
}

function normaliseTelemetryPoint(row: any): TelemetryPoint {
  return {
    Distance: toNumber(
      row?.Distance ??
      row?.distance
    ),

    Speed: toNumber(
      row?.Speed ??
      row?.speed
    ),

    Throttle: toNumber(
      row?.Throttle ??
      row?.throttle
    ),

    Brake: toNumber(
      row?.Brake ??
      row?.brake
    ),

    RPM: toNumber(
      row?.RPM ??
      row?.rpm
    ),

    Gear: toNumber(
      row?.nGear ??
      row?.NGear ??
      row?.Gear ??
      row?.gear
    ),

    DRS: toNumber(
      row?.DRS ??
      row?.drs ??
      row?.nDRS ??
      row?.DRSState ??
      row?.drs_state
    ),
  }
}

export function useTelemetry({
  year,
  grandPrix,
  driver,
  sessionType,
}: UseTelemetryParams): UseTelemetryResult {
  const [data, setData] = useState<TelemetryPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchTelemetry() {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(
          `${API_URL}/telemetry/`,
          {
            params: {
              year,
              grand_prix: grandPrix,
              driver,
              session_type: sessionType,
            },
          }
        )

        if (cancelled) return

        const payload = response.data

        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.telemetry)
              ? payload.telemetry
              : []

        const normalised = rows
          .map(normaliseTelemetryPoint)
          .filter(
            (point: TelemetryPoint) =>
              Number.isFinite(point.Distance)
          )
          .sort(
            (a: TelemetryPoint, b: TelemetryPoint) =>
              a.Distance - b.Distance
          )

        if (normalised.length === 0) {
          throw new Error(
            "Telemetry endpoint returned no telemetry samples."
          )
        }

        setData(normalised)

      } catch (err: unknown) {
        if (cancelled) return

        console.error(
          "Telemetry fetch failed:",
          err
        )

        setError(getErrorMessage(err))
        setData([])

      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchTelemetry()

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

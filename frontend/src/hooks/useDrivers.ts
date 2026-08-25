/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import axios from "axios"

export interface Driver {
  driver_number: string
  abbreviation: string
  full_name: string
  team: string
}

interface UseDriversResult {
  drivers: Driver[]
  loading: boolean
  error: string | null
}

const API_URL = "http://127.0.0.1:8000"

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

  return "Unable to load drivers."
}

function normaliseDriver(driver: any): Driver {
  return {
    driver_number: String(
      driver?.driver_number ??
      driver?.DriverNumber ??
      ""
    ),

    abbreviation: String(
      driver?.abbreviation ??
      driver?.Abbreviation ??
      ""
    ),

    full_name: String(
      driver?.full_name ??
      driver?.FullName ??
      ""
    ),

    team: String(
      driver?.team ??
      driver?.TeamName ??
      ""
    ),
  }
}

export function useDrivers(): UseDriversResult {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchDrivers() {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(
          `${API_URL}/drivers/`
        )

        if (cancelled) return

        const payload = response.data

        const rows =
          Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.drivers)
              ? payload.drivers
              : Array.isArray(payload?.data)
                ? payload.data
                : []

        const normalised = rows
          .map(normaliseDriver)
          .filter(
            (driver: Driver) =>
              driver.abbreviation.length > 0 &&
              driver.full_name.length > 0
          )

        setDrivers(normalised)

      } catch (err: unknown) {
        if (cancelled) return

        console.error(
          "Driver fetch failed:",
          err
        )

        setError(getErrorMessage(err))
        setDrivers([])

      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchDrivers()

    return () => {
      cancelled = true
    }
  }, [])

  return {
    drivers,
    loading,
    error,
  }
}

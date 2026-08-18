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

        /*
         * Backend response:
         *
         * {
         *   "drivers": [
         *     {
         *       "driver_number": "4",
         *       "abbreviation": "NOR",
         *       "full_name": "Lando Norris",
         *       "team": "McLaren"
         *     }
         *   ]
         * }
         */

        const rows =
          Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.drivers)
              ? payload.drivers
              : []

        const normalised: Driver[] = rows
          .map((driver: any) => ({
            driver_number: String(
              driver.driver_number ?? ""
            ),

            abbreviation: String(
              driver.abbreviation ?? ""
            ),

            full_name: String(
              driver.full_name ?? ""
            ),

            team: String(
              driver.team ?? ""
            ),
          }))
          .filter(
            (driver: Driver) =>
              driver.abbreviation &&
              driver.full_name
          )

        setDrivers(normalised)

      } catch (err: any) {
        if (cancelled) return

        console.error(
          "Driver fetch failed:",
          err
        )

        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load drivers."
        )

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
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import axios from "axios"

export interface SectorComparisonData {
  sector_1: {
    driver_1: number
    driver_2: number
    delta: number
  }

  sector_2: {
    driver_1: number
    driver_2: number
    delta: number
  }

  sector_3: {
    driver_1: number
    driver_2: number
    delta: number
  }

  driver_1: string
  driver_2: string
}

interface UseSectorComparisonParams {
  year: number
  grandPrix: string
  driver1: string
  driver2: string
  sessionType: string
}

interface UseSectorComparisonResult {
  data: SectorComparisonData | null
  loading: boolean
  error: string | null
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000"

function toNumber(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function normaliseSector(
  sector: any
): SectorComparisonData["sector_1"] {
  return {
    driver_1: toNumber(
      sector?.driver_1 ??
      sector?.driver1
    ),

    driver_2: toNumber(
      sector?.driver_2 ??
      sector?.driver2
    ),

    delta: toNumber(
      sector?.delta
    ),
  }
}

export function useSectorComparison({
  year,
  grandPrix,
  driver1,
  driver2,
  sessionType,
}: UseSectorComparisonParams): UseSectorComparisonResult {
  const [data, setData] =
    useState<SectorComparisonData | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchSectorComparison() {
      try {
        setLoading(true)
        setError(null)

        /*
         * Do not request a comparison when
         * both selectors contain the same driver.
         */

        if (
          !driver1 ||
          !driver2 ||
          driver1 === driver2
        ) {
          setData(null)
          setLoading(false)
          return
        }

        const response = await axios.get(
          `${API_URL}/analysis/sector-comparison`,
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

        if (cancelled) return

        const payload = response.data

        if (
          !payload ||
          typeof payload !== "object"
        ) {
          throw new Error(
            "Sector comparison endpoint returned an invalid response."
          )
        }

        /*
         * Normalise the API response.
         *
         * Expected:
         *
         * {
         *   driver_1: "VER",
         *   driver_2: "NOR",
         *   sector_1: {
         *     driver_1: 20.123,
         *     driver_2: 20.456,
         *     delta: 0.333
         *   },
         *   sector_2: {...},
         *   sector_3: {...}
         * }
         */

        const normalised: SectorComparisonData = {
          driver_1: String(
            payload.driver_1 ??
            payload.driver1 ??
            driver1
          ),

          driver_2: String(
            payload.driver_2 ??
            payload.driver2 ??
            driver2
          ),

          sector_1: normaliseSector(
            payload.sector_1 ??
            payload.sector1
          ),

          sector_2: normaliseSector(
            payload.sector_2 ??
            payload.sector2
          ),

          sector_3: normaliseSector(
            payload.sector_3 ??
            payload.sector3
          ),
        }

        /*
         * Make sure at least one sector contains
         * meaningful comparison data.
         */

        const hasUsefulData =
          normalised.sector_1.driver_1 !== 0 ||
          normalised.sector_1.driver_2 !== 0 ||
          normalised.sector_1.delta !== 0 ||
          normalised.sector_2.driver_1 !== 0 ||
          normalised.sector_2.driver_2 !== 0 ||
          normalised.sector_2.delta !== 0 ||
          normalised.sector_3.driver_1 !== 0 ||
          normalised.sector_3.driver_2 !== 0 ||
          normalised.sector_3.delta !== 0

        if (!hasUsefulData) {
          throw new Error(
            "Sector comparison returned no usable data."
          )
        }

        if (!cancelled) {
          setData(normalised)
        }
      } catch (err: unknown) {
        if (cancelled) return

        console.error(
          "Sector comparison fetch failed:",
          err
        )

        if (axios.isAxiosError(err)) {
          const detail = err.response?.data?.detail

          if (typeof detail === "string") {
            setError(detail)
          } else if (
            detail &&
            typeof detail === "object" &&
            typeof detail.message === "string"
          ) {
            setError(detail.message)
          } else {
            setError(
              err.message ||
              "Unable to load sector comparison."
            )
          }
        } else if (err instanceof Error) {
          setError(err.message)
        } else {
          setError(
            "Unable to load sector comparison."
          )
        }

        setData(null)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchSectorComparison()

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

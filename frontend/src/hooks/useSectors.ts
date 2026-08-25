import { useEffect, useState } from "react"
import axios from "axios"

export interface SectorData {
  sector1: {
    fastest: number
    average: number
  }
  sector2: {
    fastest: number
    average: number
  }
  sector3: {
    fastest: number
    average: number
  }
  bestSectorCombination: number
}

interface UseSectorsParams {
  year: number
  grandPrix: string
  driver: string
  sessionType: string
}

interface UseSectorsResult {
  data: SectorData | null
  loading: boolean
  error: string | null
}

const API_URL = "http://127.0.0.1:8000"

function toNumber(value: unknown): number {
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : 0
}

export function useSectors({
  year,
  grandPrix,
  driver,
  sessionType,
}: UseSectorsParams): UseSectorsResult {
  const [data, setData] = useState<SectorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchSectors() {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(
          `${API_URL}/analysis/sectors`,
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

        /*
         * Accept the normal backend response:
         *
         * {
         *   sector_1: {
         *     fastest: 20.123,
         *     average: 20.456
         *   },
         *   sector_2: {
         *     fastest: 30.123,
         *     average: 30.456
         *   },
         *   sector_3: {
         *     fastest: 25.123,
         *     average: 25.456
         *   },
         *   best_sector_combination: 75.789
         * }
         *
         * Also tolerate camelCase keys if the
         * frontend receives them from another serializer.
         */

        if (!payload || typeof payload !== "object") {
          throw new Error(
            "Sector analysis returned an invalid response."
          )
        }

        const sector1 = payload.sector_1 ?? payload.sector1 ?? {}
        const sector2 = payload.sector_2 ?? payload.sector2 ?? {}
        const sector3 = payload.sector_3 ?? payload.sector3 ?? {}

        const normalised: SectorData = {
          sector1: {
            fastest: toNumber(sector1.fastest),
            average: toNumber(sector1.average),
          },

          sector2: {
            fastest: toNumber(sector2.fastest),
            average: toNumber(sector2.average),
          },

          sector3: {
            fastest: toNumber(sector3.fastest),
            average: toNumber(sector3.average),
          },

          bestSectorCombination: toNumber(
            payload.best_sector_combination ??
              payload.bestSectorCombination
          ),
        }

        /*
         * Make sure we actually received useful data.
         */

        const hasUsefulData =
          normalised.sector1.fastest > 0 ||
          normalised.sector1.average > 0 ||
          normalised.sector2.fastest > 0 ||
          normalised.sector2.average > 0 ||
          normalised.sector3.fastest > 0 ||
          normalised.sector3.average > 0 ||
          normalised.bestSectorCombination > 0

        if (!hasUsefulData) {
          throw new Error(
            "Sector analysis returned no usable sector data."
          )
        }

        if (!cancelled) {
          setData(normalised)
        }
      } catch (err: unknown) {
        if (cancelled) return

        console.error(
          "Sector analysis fetch failed:",
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
                "Unable to load sector analysis."
            )
          }
        } else if (err instanceof Error) {
          setError(err.message)
        } else {
          setError(
            "Unable to load sector analysis."
          )
        }

        setData(null)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchSectors()

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

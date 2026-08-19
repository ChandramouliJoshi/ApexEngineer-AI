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

        if (cancelled) {
          return
        }

        const payload = response.data

        const normalised: SectorData = {
          sector1: {
            fastest: Number(
              payload?.sector_1?.fastest ?? 0
            ),
            average: Number(
              payload?.sector_1?.average ?? 0
            ),
          },

          sector2: {
            fastest: Number(
              payload?.sector_2?.fastest ?? 0
            ),
            average: Number(
              payload?.sector_2?.average ?? 0
            ),
          },

          sector3: {
            fastest: Number(
              payload?.sector_3?.fastest ?? 0
            ),
            average: Number(
              payload?.sector_3?.average ?? 0
            ),
          },

          bestSectorCombination: Number(
            payload?.best_sector_combination ?? 0
          ),
        }

        if (
          !Number.isFinite(normalised.sector1.fastest) ||
          !Number.isFinite(normalised.sector1.average) ||
          !Number.isFinite(normalised.sector2.fastest) ||
          !Number.isFinite(normalised.sector2.average) ||
          !Number.isFinite(normalised.sector3.fastest) ||
          !Number.isFinite(normalised.sector3.average) ||
          !Number.isFinite(
            normalised.bestSectorCombination
          )
        ) {
          throw new Error(
            "Sector analysis returned invalid data."
          )
        }

        setData(normalised)

      }
      catch (err: any) {

        if (cancelled) {
          return
        }

        console.error(
          "Sector analysis fetch failed:",
          err
        )

        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load sector analysis."
        )

      }
      finally {

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
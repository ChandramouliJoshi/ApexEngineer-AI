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


const API_URL = "http://127.0.0.1:8000"


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


        if (cancelled) {
          return
        }


        const payload = response.data


        if (!payload) {
          throw new Error(
            "Sector comparison endpoint returned no data."
          )
        }


        setData(payload)

      }
      catch (err: any) {

        if (cancelled) {
          return
        }


        console.error(
          "Sector comparison fetch failed:",
          err
        )


        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load sector comparison."
        )

      }
      finally {

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
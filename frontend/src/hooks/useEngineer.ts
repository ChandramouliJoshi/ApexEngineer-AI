import { useEffect, useState } from "react"
import axios from "axios"


export interface EngineerData {
  telemetry: {
    speed: {
      max: number
      average: number
      minimum: number
    }

    rpm: {
      max: number
      average: number
    }

    gear: {
      max: number
      average: number
    }

    distance: number
    full_throttle: number
    brake_usage: number
    drs_usage: number
  }

  sectors: {
    sector_1: {
      fastest: number
      average: number
    }

    sector_2: {
      fastest: number
      average: number
    }

    sector_3: {
      fastest: number
      average: number
    }

    best_sector_combination: number
  }

  performance_score: {
    speed_score: number
    throttle_score: number
    braking_score: number
    consistency_score: number
    overall_score: number
  }

  recommendations: {
    area: string
    priority: string
    message: string
  }[]
}


interface UseEngineerParams {
  year: number
  grandPrix: string
  driver: string
  sessionType: string
}


interface UseEngineerResult {
  data: EngineerData | null
  loading: boolean
  error: string | null
}


const API_URL = "http://127.0.0.1:8000"


export function useEngineer({
  year,
  grandPrix,
  driver,
  sessionType,
}: UseEngineerParams): UseEngineerResult {

  const [data, setData] =
    useState<EngineerData | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)


  useEffect(() => {

    let cancelled = false


    async function fetchEngineerReport() {

      try {

        setLoading(true)
        setError(null)


        const response = await axios.get(
          `${API_URL}/analysis/engineer`,
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


        if (!payload) {
          throw new Error(
            "Engineer endpoint returned no data."
          )
        }


        setData(payload)

      }
      catch (err: any) {

        if (cancelled) {
          return
        }


        console.error(
          "Engineer report fetch failed:",
          err
        )


        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load engineer report."
        )

      }
      finally {

        if (!cancelled) {
          setLoading(false)
        }

      }

    }


    fetchEngineerReport()


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
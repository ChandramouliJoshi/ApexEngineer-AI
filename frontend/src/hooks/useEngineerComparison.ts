/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import axios from "axios"


export interface DriverPerformance {
  speed_score: number
  throttle_score: number
  braking_score: number
  consistency_score: number
  overall_score: number
}


export interface SectorComparison {
  driver_1: number
  driver_2: number
  delta: number
}


export interface CornerDriverData {
  corner: number
  entry_speed: number
  apex_speed: number
  exit_speed: number
  max_brake: number
  max_throttle: number
  average_rpm: number
  samples: number
}


export interface CornerComparison {
  corner: number
  driver_1: CornerDriverData
  driver_2: CornerDriverData
  entry_speed_delta: number
  apex_speed_delta: number
  exit_speed_delta: number
  winner: string
}


export interface EngineerComparisonData {
  driver_1: string
  driver_2: string

  performance: {
    [driver: string]: DriverPerformance
  }

  sector_comparison: {
    sector_1: SectorComparison
    sector_2: SectorComparison
    sector_3: SectorComparison
  }

  corner_comparison: CornerComparison[]

  overall: {
    faster_driver: string
    score_difference: number
  }

  diagnosis: {
    area: string
    priority: string
    time_loss: number
    message: string
  }[]
}


interface UseEngineerComparisonParams {
  year: number
  grandPrix: string
  driver1: string
  driver2: string
  sessionType: string
}


interface UseEngineerComparisonResult {
  data: EngineerComparisonData | null
  loading: boolean
  error: string | null
}


const API_URL = "http://127.0.0.1:8000"


export function useEngineerComparison({
  year,
  grandPrix,
  driver1,
  driver2,
  sessionType,
}: UseEngineerComparisonParams): UseEngineerComparisonResult {

  const [data, setData] =
    useState<EngineerComparisonData | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)


  useEffect(() => {

    let cancelled = false


    async function fetchEngineerComparison() {

      try {

        setLoading(true)
        setError(null)


        const response = await axios.get(
          `${API_URL}/analysis/engineer-comparison`,
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
            "Engineer comparison endpoint returned no data."
          )
        }


        setData(payload)

      }
      catch (err: any) {

        if (cancelled) {
          return
        }


        console.error(
          "Engineer comparison fetch failed:",
          err
        )


        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load engineer comparison."
        )

      }
      finally {

        if (!cancelled) {
          setLoading(false)
        }

      }

    }


    fetchEngineerComparison()


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

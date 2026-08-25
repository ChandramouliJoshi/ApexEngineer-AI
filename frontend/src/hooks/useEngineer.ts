import { useEffect, useState } from "react"

import {
  getEngineerReport,
} from "../services/api"

import type {
  EngineerReport,
} from "../types/api"


interface UseEngineerParams {
  year: number
  grandPrix: string
  driver: string
  sessionType: string
}

interface UseEngineerResult {
  data: EngineerReport | null
  loading: boolean
  error: string | null
}


export function useEngineer({
  year,
  grandPrix,
  driver,
  sessionType,
}: UseEngineerParams): UseEngineerResult {
  const [data, setData] = useState<EngineerReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchEngineerReport() {
      try {
        setLoading(true)
        setError(null)

        const report = await getEngineerReport(
          year,
          grandPrix,
          driver,
          sessionType,
        )

        if (cancelled) {
          return
        }

        if (!report) {
          throw new Error(
            "Engineer endpoint returned no data.",
          )
        }

        setData(report)
      } catch (err: unknown) {
        if (cancelled) {
          return
        }

        console.error(
          "Engineer report fetch failed:",
          err,
        )

        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError(
            "Unable to load engineer report.",
          )
        }

        setData(null)
      } finally {
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
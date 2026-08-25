import { useEffect, useState } from "react"

import { getEngineerReport } from "../services/api"
import type { EngineerReport } from "../types/api"


interface UseEngineerReportProps {
  year: number
  grandPrix: string
  driver: string
  sessionType: string
}


interface UseEngineerReportResult {
  data: EngineerReport | null
  loading: boolean
  error: string | null
}


export function useEngineerReport({
  year,
  grandPrix,
  driver,
  sessionType,
}: UseEngineerReportProps): UseEngineerReportResult {
  const [data, setData] = useState<EngineerReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadReport() {
      try {
        setLoading(true)
        setError(null)

        const result = await getEngineerReport(
          year,
          grandPrix,
          driver,
          sessionType,
        )

        if (cancelled) {
          return
        }

        if (!result) {
          throw new Error(
            "Engineer endpoint returned no data.",
          )
        }

        setData(result)
      } catch (err: unknown) {
        if (cancelled) {
          return
        }

        console.error(
          "Failed to load engineer report:",
          err,
        )

        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError(
            "Unable to load engineering data.",
          )
        }

        setData(null)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadReport()

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
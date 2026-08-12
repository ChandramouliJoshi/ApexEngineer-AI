import { useEffect, useState } from "react"

import { getEngineerReport } from "../services/api"
import type { EngineerReport } from "../types/api"

interface UseEngineerReportProps {
  year: number
  grandPrix: string
  driver: string
  sessionType: string
}

export function useEngineerReport({
  year,
  grandPrix,
  driver,
  sessionType,
}: UseEngineerReportProps) {

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

        if (!cancelled) {
          setData(result)
        }

      } catch (err) {

        console.error(
          "Failed to load engineer report:",
          err,
        )

        if (!cancelled) {
          setError(
            "Unable to load engineering data.",
          )
        }

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
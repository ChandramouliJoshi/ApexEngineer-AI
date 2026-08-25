/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react"
import axios from "axios"

interface DriverOption {
  code: string
  name: string
  number?: string
  team?: string
}

export interface DriverComparisonResult {
  code: string
  name: string
  team?: string

  overall: number
  speed: number
  throttle: number
  braking: number
  consistency: number
}

interface UseDriverComparisonParams {
  year: number
  grandPrix: string
  sessionType: string
}

interface UseDriverComparisonResult {
  primary: DriverComparisonResult | null
  secondary: DriverComparisonResult | null

  loading: boolean
  error: string | null

  compare: (
    primaryDriver: string,
    secondaryDriver: string,
    drivers: DriverOption[]
  ) => Promise<boolean>

  clear: () => void
}

const API_URL = "http://127.0.0.1:8000"

function numberOrZero(value: unknown): number {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return 0
  }

  return Math.max(0, Math.min(100, parsed))
}

function extractComparisonResult(
  payload: any,
  driver: DriverOption
): DriverComparisonResult {

  const performance =
    payload?.performance_score ??
    payload?.performanceScore ??
    {}

  return {
    code: driver.code,
    name: driver.name,
    team: driver.team,

    overall: numberOrZero(
      performance.overall_score ??
      performance.overall ??
      payload?.overall_score
    ),

    speed: numberOrZero(
      performance.speed_score ??
      performance.speed
    ),

    throttle: numberOrZero(
      performance.throttle_score ??
      performance.throttle
    ),

    braking: numberOrZero(
      performance.braking_score ??
      performance.braking_score ??
      performance.braking
    ),

    consistency: numberOrZero(
      performance.consistency_score ??
      performance.consistency
    ),
  }
}

export function useDriverComparison({
  year,
  grandPrix,
  sessionType,
}: UseDriverComparisonParams): UseDriverComparisonResult {

  const [primary, setPrimary] =
    useState<DriverComparisonResult | null>(null)

  const [secondary, setSecondary] =
    useState<DriverComparisonResult | null>(null)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)


  const clear = useCallback(() => {

    setPrimary(null)
    setSecondary(null)
    setError(null)

  }, [])


  const compare = useCallback(
    async (
      primaryDriver: string,
      secondaryDriver: string,
      drivers: DriverOption[]
    ): Promise<boolean> => {

      if (!primaryDriver || !secondaryDriver) {

        setError(
          "Select two drivers before running a comparison."
        )

        return false
      }


      if (primaryDriver === secondaryDriver) {

        setError(
          "Select two different drivers."
        )

        return false
      }


      const primaryInfo =
        drivers.find(
          (driver) =>
            driver.code === primaryDriver
        )

      const secondaryInfo =
        drivers.find(
          (driver) =>
            driver.code === secondaryDriver
        )


      if (!primaryInfo || !secondaryInfo) {

        setError(
          "Unable to identify the selected drivers."
        )

        return false
      }


      try {

        setLoading(true)
        setError(null)

        /*
         * IMPORTANT:
         *
         * This request only happens when Dashboard
         * explicitly calls compare().
         *
         * Changing either dropdown does NOT trigger
         * a backend request anymore.
         */

        const [primaryResponse, secondaryResponse] =
          await Promise.all([
            axios.get(
              `${API_URL}/analysis/engineer`,
              {
                params: {
                  year,
                  grand_prix: grandPrix,
                  driver: primaryDriver,
                  session_type: sessionType,
                },
              }
            ),

            axios.get(
              `${API_URL}/analysis/engineer`,
              {
                params: {
                  year,
                  grand_prix: grandPrix,
                  driver: secondaryDriver,
                  session_type: sessionType,
                },
              }
            ),
          ])


        const primaryResult =
          extractComparisonResult(
            primaryResponse.data,
            primaryInfo
          )

        const secondaryResult =
          extractComparisonResult(
            secondaryResponse.data,
            secondaryInfo
          )


        setPrimary(primaryResult)
        setSecondary(secondaryResult)

        return true

      } catch (err: any) {

        console.error(
          "Driver comparison fetch failed:",
          err
        )

        setPrimary(null)
        setSecondary(null)

        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load driver comparison."
        )

        return false

      } finally {

        setLoading(false)

      }

    },
    [
      year,
      grandPrix,
      sessionType,
    ]
  )


  return {
    primary,
    secondary,
    loading,
    error,
    compare,
    clear,
  }
}

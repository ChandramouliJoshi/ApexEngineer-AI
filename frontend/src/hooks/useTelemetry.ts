import { useEffect, useState } from "react"
import axios from "axios"

export interface TelemetryPoint {
  Distance: number
  Speed: number
  Throttle: number
  Brake: number
  RPM: number
  Gear: number
  DRS: number
}

interface UseTelemetryParams {
  year: number
  grandPrix: string
  driver: string
  sessionType: string
}

interface UseTelemetryResult {
  data: TelemetryPoint[]
  loading: boolean
  error: string | null
}

const API_URL = "http://127.0.0.1:8000"


export function useTelemetry({
  year,
  grandPrix,
  driver,
  sessionType,
}: UseTelemetryParams): UseTelemetryResult {

  const [data, setData] =
    useState<TelemetryPoint[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)


  useEffect(() => {

    let cancelled = false


    async function fetchTelemetry() {

      try {

        setLoading(true)
        setError(null)


        const response = await axios.get(
          `${API_URL}/telemetry/`,
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


        /*
         * Supported API response formats:
         *
         * 1. [
         *      {...},
         *      {...}
         *    ]
         *
         * 2. {
         *      "data": [...]
         *    }
         *
         * 3. {
         *      "telemetry": [...]
         *    }
         */


        let rows: any[] = []


        if (Array.isArray(payload)) {

          rows = payload

        }
        else if (
          payload &&
          Array.isArray(payload.data)
        ) {

          rows = payload.data

        }
        else if (
          payload &&
          Array.isArray(payload.telemetry)
        ) {

          rows = payload.telemetry

        }


        /*
         * Convert backend telemetry into the
         * format expected by the dashboard.
         */

        const normalised: TelemetryPoint[] =
          rows
            .map((row) => {

              /*
               * Distance
               */

              const distance = Number(
                row.Distance ??
                row.distance ??
                0
              )


              /*
               * Speed
               */

              const speed = Number(
                row.Speed ??
                row.speed ??
                0
              )


              /*
               * Throttle
               */

              const throttle = Number(
                row.Throttle ??
                row.throttle ??
                0
              )


              /*
               * Brake
               */

              const brake = Number(
                row.Brake ??
                row.brake ??
                0
              )


              /*
               * RPM
               */

              const rpm = Number(
                row.RPM ??
                row.rpm ??
                0
              )


              /*
               * GEAR
               *
               * FastF1's original telemetry
               * column is normally:
               *
               * nGear
               *
               * Some backend serializers may
               * rename it to Gear or gear.
               */

              const gear = Number(
                row.nGear ??
                row.Gear ??
                row.gear ??
                row.NGear ??
                0
              )


              /*
               * DRS
               *
               * FastF1 normally exposes this
               * as DRS.
               *
               * Depending on serialization it
               * may arrive as:
               *
               * DRS
               * drs
               * nDRS
               * DRSState
               * drs_state
               */

              const drs = Number(
                row.DRS ??
                row.drs ??
                row.nDRS ??
                row.DRSState ??
                row.drs_state ??
                0
              )


              return {
                Distance: distance,
                Speed: speed,
                Throttle: throttle,
                Brake: brake,
                RPM: rpm,
                Gear: gear,
                DRS: drs,
              }

            })
            .filter(
              (row) =>
                Number.isFinite(row.Distance)
            )


        /*
         * Make sure the API actually returned
         * usable telemetry.
         */

        if (normalised.length === 0) {

          throw new Error(
            "Telemetry endpoint returned no telemetry samples."
          )

        }


        /*
         * Sort telemetry by track distance.
         *
         * This makes sure the graph always
         * progresses from the start of the lap
         * to the end of the lap.
         */

        normalised.sort(
          (a, b) =>
            a.Distance - b.Distance
        )


        if (!cancelled) {

          setData(normalised)

        }

      }
      catch (err: any) {

        if (cancelled) {
          return
        }


        console.error(
          "Telemetry fetch failed:",
          err
        )


        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load telemetry."
        )

      }
      finally {

        if (!cancelled) {

          setLoading(false)

        }

      }

    }


    fetchTelemetry()


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
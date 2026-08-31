/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import axios from "axios"


export interface WeatherData {
  available: boolean
  samples: number

  air_temperature: {
    minimum: number
    maximum: number
    average: number
  }

  track_temperature: {
    minimum: number
    maximum: number
    average: number
  }

  humidity: {
    minimum: number
    maximum: number
    average: number
  }

  wind_speed: {
    minimum: number
    maximum: number
    average: number
  }

  rainfall: {
    occurred: boolean
  }
}


interface UseWeatherParams {
  year: number
  grandPrix: string
  driver: string
  sessionType: string
}


interface UseWeatherResult {
  data: WeatherData | null
  loading: boolean
  error: string | null
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000"

export function useWeather({
  year,
  grandPrix,
  driver,
  sessionType,
}: UseWeatherParams): UseWeatherResult {

  const [data, setData] =
    useState<WeatherData | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)


  useEffect(() => {

    let cancelled = false


    async function fetchWeather() {

      try {

        setLoading(true)
        setError(null)


        const response = await axios.get(
          `${API_URL}/analysis/weather`,
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
            "Weather endpoint returned no data."
          )
        }


        const normalised: WeatherData = {

          available: Boolean(
            payload.available ?? false
          ),

          samples: Number(
            payload.samples ?? 0
          ),

          air_temperature: {
            minimum: Number(
              payload.air_temperature?.minimum ?? 0
            ),
            maximum: Number(
              payload.air_temperature?.maximum ?? 0
            ),
            average: Number(
              payload.air_temperature?.average ?? 0
            ),
          },

          track_temperature: {
            minimum: Number(
              payload.track_temperature?.minimum ?? 0
            ),
            maximum: Number(
              payload.track_temperature?.maximum ?? 0
            ),
            average: Number(
              payload.track_temperature?.average ?? 0
            ),
          },

          humidity: {
            minimum: Number(
              payload.humidity?.minimum ?? 0
            ),
            maximum: Number(
              payload.humidity?.maximum ?? 0
            ),
            average: Number(
              payload.humidity?.average ?? 0
            ),
          },

          wind_speed: {
            minimum: Number(
              payload.wind_speed?.minimum ?? 0
            ),
            maximum: Number(
              payload.wind_speed?.maximum ?? 0
            ),
            average: Number(
              payload.wind_speed?.average ?? 0
            ),
          },

          rainfall: {
            occurred: Boolean(
              payload.rainfall?.occurred ?? false
            ),
          },
        }


        if (!normalised.available) {
          throw new Error(
            "Weather data is unavailable for this session."
          )
        }


        if (!cancelled) {
          setData(normalised)
        }

      }
      catch (err: any) {

        if (cancelled) {
          return
        }


        console.error(
          "Weather fetch failed:",
          err
        )


        setError(
          err?.response?.data?.detail ??
          err?.message ??
          "Unable to load weather data."
        )

      }
      finally {

        if (!cancelled) {
          setLoading(false)
        }

      }

    }


    fetchWeather()


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

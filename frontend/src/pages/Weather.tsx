import {
  CloudRain,
  Droplets,
  Gauge,
  Thermometer,
  Wind,
} from "lucide-react"

import { useWeather } from "../hooks/useWeather"


function Weather() {

  /*
   * Temporary session configuration.
   *
   * We will later connect these to the
   * global session/driver selectors.
   */

  const year = 2025
  const grandPrix = "Monaco"
  const driver = "VER"
  const sessionType = "R"


  const {
    data,
    loading,
    error,
  } = useWeather({
    year,
    grandPrix,
    driver,
    sessionType,
  })


  if (loading) {

    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Loading weather telemetry
          </p>

        </div>

      </div>
    )
  }


  if (error) {

    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/[0.04] p-8">

        <div className="flex items-center gap-3">

          <CloudRain
            size={20}
            className="text-red-400"
          />

          <div>

            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-red-300">
              Weather data unavailable
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

          </div>

        </div>

      </div>
    )
  }


  if (!data) {
    return null
  }


  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-slate-800 pb-8">

        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-400/[0.04] blur-3xl" />

        <div className="relative">

          <div className="mb-3 flex items-center gap-2">

            <CloudRain
              size={16}
              className="text-cyan-400"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
              APEXENGINEER AI
            </span>

          </div>


          <div className="flex items-end justify-between gap-8">

            <div>

              <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
                WEATHER INTELLIGENCE
              </h1>

              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Track conditions · atmosphere · environmental telemetry
              </p>

            </div>


            <div className="hidden items-center gap-8 md:flex">

              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
                  DRIVER
                </p>

                <p className="mt-1 font-mono text-lg font-bold text-cyan-400">
                  {driver}
                </p>
              </div>


              <div className="h-8 w-px bg-slate-800" />


              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
                  SAMPLES
                </p>

                <p className="mt-1 font-mono text-lg font-bold text-white">
                  {data.samples}
                </p>
              </div>


              <div className="h-8 w-px bg-slate-800" />


              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
                  CONDITIONS
                </p>

                <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
                  {data.rainfall.occurred
                    ? "WET"
                    : "DRY"}
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ENVIRONMENTAL OVERVIEW
      ===================================================== */}

      <section>

        <div className="mb-4 flex items-center gap-3">

          <div className="h-px w-8 bg-cyan-400" />

          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Environmental overview
          </span>

        </div>


        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">


          {/* Air Temperature */}

          <div className="group rounded-xl border border-cyan-400/20 bg-slate-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Air temperature
                </p>

                <p className="mt-4 font-mono text-3xl font-bold text-cyan-400">
                  {data.air_temperature.average.toFixed(1)}
                  <span className="ml-1 text-sm text-slate-500">
                    °C
                  </span>
                </p>

              </div>

              <Thermometer
                size={19}
                className="text-cyan-400"
              />

            </div>


            <div className="mt-5 flex justify-between border-t border-slate-800 pt-3">

              <span className="text-[9px] uppercase tracking-wider text-slate-600">
                MIN {data.air_temperature.minimum.toFixed(1)}°
              </span>

              <span className="text-[9px] uppercase tracking-wider text-slate-600">
                MAX {data.air_temperature.maximum.toFixed(1)}°
              </span>

            </div>

          </div>


          {/* Track Temperature */}

          <div className="group rounded-xl border border-orange-400/20 bg-slate-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/50 hover:shadow-[0_0_30px_rgba(251,146,60,0.08)]">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Track temperature
                </p>

                <p className="mt-4 font-mono text-3xl font-bold text-orange-400">
                  {data.track_temperature.average.toFixed(1)}
                  <span className="ml-1 text-sm text-slate-500">
                    °C
                  </span>
                </p>

              </div>

              <Gauge
                size={19}
                className="text-orange-400"
              />

            </div>


            <div className="mt-5 flex justify-between border-t border-slate-800 pt-3">

              <span className="text-[9px] uppercase tracking-wider text-slate-600">
                MIN {data.track_temperature.minimum.toFixed(1)}°
              </span>

              <span className="text-[9px] uppercase tracking-wider text-slate-600">
                MAX {data.track_temperature.maximum.toFixed(1)}°
              </span>

            </div>

          </div>


          {/* Humidity */}

          <div className="group rounded-xl border border-blue-400/20 bg-slate-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(96,165,250,0.08)]">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Humidity
                </p>

                <p className="mt-4 font-mono text-3xl font-bold text-blue-400">
                  {data.humidity.average.toFixed(1)}
                  <span className="ml-1 text-sm text-slate-500">
                    %
                  </span>
                </p>

              </div>

              <Droplets
                size={19}
                className="text-blue-400"
              />

            </div>


            <div className="mt-5 flex justify-between border-t border-slate-800 pt-3">

              <span className="text-[9px] uppercase tracking-wider text-slate-600">
                MIN {data.humidity.minimum.toFixed(0)}%
              </span>

              <span className="text-[9px] uppercase tracking-wider text-slate-600">
                MAX {data.humidity.maximum.toFixed(0)}%
              </span>

            </div>

          </div>


          {/* Wind */}

          <div className="group rounded-xl border border-violet-400/20 bg-slate-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/50 hover:shadow-[0_0_30px_rgba(167,139,250,0.08)]">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Wind speed
                </p>

                <p className="mt-4 font-mono text-3xl font-bold text-violet-400">
                  {data.wind_speed.average.toFixed(1)}
                  <span className="ml-1 text-sm text-slate-500">
                    m/s
                  </span>
                </p>

              </div>

              <Wind
                size={19}
                className="text-violet-400"
              />

            </div>


            <div className="mt-5 flex justify-between border-t border-slate-800 pt-3">

              <span className="text-[9px] uppercase tracking-wider text-slate-600">
                MIN {data.wind_speed.minimum.toFixed(1)}
              </span>

              <span className="text-[9px] uppercase tracking-wider text-slate-600">
                MAX {data.wind_speed.maximum.toFixed(1)}
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TRACK CONDITIONS
      ===================================================== */}

      <section className="grid gap-5 lg:grid-cols-2">


        {/* Temperature relationship */}

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-white">
                Thermal conditions
              </h2>

              <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-600">
                Air vs track temperature
              </p>

            </div>

            <Thermometer
              size={18}
              className="text-orange-400"
            />

          </div>


          <div className="space-y-5">


            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-xs text-slate-400">
                  Air
                </span>

                <span className="font-mono text-xs font-bold text-cyan-400">
                  {data.air_temperature.average.toFixed(1)} °C
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-900">

                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      100,
                      (data.air_temperature.average / 50) * 100
                    )}%`,
                  }}
                />

              </div>

            </div>


            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-xs text-slate-400">
                  Track
                </span>

                <span className="font-mono text-xs font-bold text-orange-400">
                  {data.track_temperature.average.toFixed(1)} °C
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-900">

                <div
                  className="h-full rounded-full bg-orange-400 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      100,
                      (data.track_temperature.average / 60) * 100
                    )}%`,
                  }}
                />

              </div>

            </div>


            <div className="grid grid-cols-2 gap-3 pt-3">

              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">

                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                  Track delta
                </p>

                <p className="mt-2 font-mono text-lg font-bold text-white">
                  {(
                    data.track_temperature.average -
                    data.air_temperature.average
                  ).toFixed(1)}
                  <span className="ml-1 text-xs text-slate-500">
                    °C
                  </span>
                </p>

              </div>


              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">

                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                  Rainfall
                </p>

                <p
                  className={`mt-2 font-mono text-lg font-bold ${
                    data.rainfall.occurred
                      ? "text-cyan-400"
                      : "text-emerald-400"
                  }`}
                >
                  {data.rainfall.occurred
                    ? "DETECTED"
                    : "NONE"}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* Atmosphere */}

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-white">
                Atmospheric profile
              </h2>

              <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-600">
                Environmental stability
              </p>

            </div>

            <Wind
              size={18}
              className="text-violet-400"
            />

          </div>


          <div className="grid grid-cols-2 gap-3">


            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

              <p className="text-[9px] uppercase tracking-wider text-slate-600">
                Humidity
              </p>

              <p className="mt-3 font-mono text-2xl font-bold text-blue-400">
                {data.humidity.average.toFixed(1)}
                <span className="text-sm">
                  %
                </span>
              </p>

              <p className="mt-2 text-[9px] text-slate-600">
                {data.humidity.minimum}% — {data.humidity.maximum}%
              </p>

            </div>


            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">

              <p className="text-[9px] uppercase tracking-wider text-slate-600">
                Wind
              </p>

              <p className="mt-3 font-mono text-2xl font-bold text-violet-400">
                {data.wind_speed.average.toFixed(1)}
                <span className="text-sm">
                  m/s
                </span>
              </p>

              <p className="mt-2 text-[9px] text-slate-600">
                {data.wind_speed.minimum.toFixed(1)} — {data.wind_speed.maximum.toFixed(1)}
              </p>

            </div>


            <div className="col-span-2 rounded-lg border border-slate-800 bg-slate-900/40 p-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[9px] uppercase tracking-wider text-slate-600">
                    Weather status
                  </p>

                  <p className="mt-2 font-mono text-xl font-bold text-white">
                    {data.rainfall.occurred
                      ? "RAIN EVENT"
                      : "DRY TRACK"}
                  </p>

                </div>

                <CloudRain
                  size={25}
                  className={
                    data.rainfall.occurred
                      ? "text-cyan-400"
                      : "text-slate-600"
                  }
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          DATA FOOTER
      ===================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">

        <div className="flex items-center gap-2">

          <span
            className={`h-2 w-2 rounded-full ${
              data.available
                ? "bg-emerald-400"
                : "bg-red-400"
            }`}
          />

          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Weather telemetry {data.available ? "available" : "unavailable"}
          </span>

        </div>


        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-600">
          {data.samples} environmental samples
        </span>

      </div>

    </div>
  )
}


export default Weather
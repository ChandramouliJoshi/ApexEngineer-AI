import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Gauge,
  Lightbulb,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react"

import { useEngineer } from "../hooks/useEngineer"


function Engineer() {

  const [year, setYear] = useState(2025)
  const [grandPrix, setGrandPrix] = useState("Monaco")
  const [driver, setDriver] = useState("PIA")
  const [sessionType, setSessionType] = useState("Race")


  const {
    data,
    loading,
    error,
  } = useEngineer({
    year,
    grandPrix,
    driver,
    sessionType,
  })


  const score = data?.performance_score


  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 border-b border-slate-800 pb-7 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="mb-3 flex items-center gap-2">

            <Lightbulb
              size={16}
              className="text-amber-400"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
              ApexEngineer AI
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            ENGINEER REPORT
          </h1>

          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
            Driver performance intelligence & recommendations
          </p>

        </div>


        {data && (
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] px-5 py-4">

            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
              Overall Performance
            </p>

            <div className="mt-1 flex items-end gap-2">

              <span className="text-3xl font-black text-amber-300">
                {score?.overall_score.toFixed(2)}
              </span>

              <span className="mb-1 text-[10px] text-slate-500">
                / 100
              </span>

            </div>

          </div>
        )}

      </div>


      {/* Parameters */}

      <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">

        <div className="mb-5 flex items-center gap-2">

          <Gauge
            size={15}
            className="text-amber-400"
          />

          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            Report Parameters
          </h2>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          {/* Season */}

          <div>

            <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Season
            </label>

            <select
              value={year}
              onChange={(e) =>
                setYear(Number(e.target.value))
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-medium text-slate-200 outline-none transition focus:border-amber-400"
            >
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>

          </div>


          {/* Grand Prix */}

          <div>

            <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Grand Prix
            </label>

            <select
              value={grandPrix}
              onChange={(e) =>
                setGrandPrix(e.target.value)
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-medium text-slate-200 outline-none transition focus:border-amber-400"
            >
              <option value="Monaco">Monaco</option>
              <option value="Italy">Italy</option>
              <option value="Belgium">Belgium</option>
              <option value="Austria">Austria</option>
            </select>

          </div>


          {/* Driver */}

          <div>

            <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Driver
            </label>

            <input
              value={driver}
              onChange={(e) =>
                setDriver(e.target.value.toUpperCase())
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-bold uppercase text-amber-300 outline-none transition focus:border-amber-400"
              placeholder="PIA"
            />

          </div>


          {/* Session */}

          <div>

            <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Session
            </label>

            <select
              value={sessionType}
              onChange={(e) =>
                setSessionType(e.target.value)
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-medium text-slate-200 outline-none transition focus:border-amber-400"
            >
              <option value="Race">Race</option>
              <option value="Qualifying">Qualifying</option>
              <option value="Sprint">Sprint</option>
            </select>

          </div>

        </div>

      </section>


      {/* Loading */}

      {loading && (
        <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60">

          <div className="text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-amber-400" />

            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Generating engineer report
            </p>

          </div>

        </div>
      )}


      {/* Error */}

      {!loading && error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/[0.04] p-6">

          <div className="flex items-center gap-2">

            <AlertTriangle
              size={16}
              className="text-red-400"
            />

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-400">
              Engineer report unavailable
            </p>

          </div>

          <p className="mt-2 text-sm text-slate-400">
            {error}
          </p>

        </div>
      )}


      {/* Report */}

      {!loading && !error && data && score && (

        <>

          {/* Performance Scores */}

          <section>

            <div className="mb-4 flex items-center gap-2">

              <Target
                size={15}
                className="text-amber-400"
              />

              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Performance Score
              </h2>

            </div>


            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

              <ScoreCard
                label="Overall"
                value={score.overall_score}
                icon={ShieldCheck}
                emphasis
              />

              <ScoreCard
                label="Speed"
                value={score.speed_score}
                icon={Zap}
              />

              <ScoreCard
                label="Throttle"
                value={score.throttle_score}
                icon={Activity}
              />

              <ScoreCard
                label="Braking"
                value={score.braking_score}
                icon={Gauge}
              />

              <ScoreCard
                label="Consistency"
                value={score.consistency_score}
                icon={BarChart3}
              />

            </div>

          </section>


          {/* Telemetry Overview */}

          <section>

            <div className="mb-4 flex items-center gap-2">

              <Activity
                size={15}
                className="text-cyan-400"
              />

              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Telemetry Overview
              </h2>

            </div>


            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

              <MetricCard
                label="Maximum Speed"
                value={`${data.telemetry.speed.max}`}
                unit="KM/H"
              />

              <MetricCard
                label="Average Speed"
                value={`${data.telemetry.speed.average.toFixed(1)}`}
                unit="KM/H"
              />

              <MetricCard
                label="Maximum RPM"
                value={`${data.telemetry.rpm.max.toLocaleString()}`}
                unit="RPM"
              />

              <MetricCard
                label="Average RPM"
                value={`${data.telemetry.rpm.average.toFixed(0)}`}
                unit="RPM"
              />

              <MetricCard
                label="Maximum Gear"
                value={`${data.telemetry.gear.max}`}
                unit="GEAR"
              />

              <MetricCard
                label="Distance"
                value={`${(data.telemetry.distance / 1000).toFixed(2)}`}
                unit="KM"
              />

              <MetricCard
                label="Full Throttle"
                value={`${data.telemetry.full_throttle.toFixed(1)}`}
                unit="%"
              />

              <MetricCard
                label="Brake Usage"
                value={`${data.telemetry.brake_usage.toFixed(1)}`}
                unit="%"
              />

            </div>

          </section>


          {/* Sector Performance */}

          <section className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">

            <div className="border-b border-slate-800 px-6 py-5">

              <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
                Sector Performance
              </h2>

              <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-600">
                Fastest and average sector times
              </p>

            </div>


            <div className="grid grid-cols-1 divide-y divide-slate-800 md:grid-cols-3 md:divide-x md:divide-y-0">

              <SectorCard
                name="Sector 1"
                fastest={data.sectors.sector_1.fastest}
                average={data.sectors.sector_1.average}
              />

              <SectorCard
                name="Sector 2"
                fastest={data.sectors.sector_2.fastest}
                average={data.sectors.sector_2.average}
              />

              <SectorCard
                name="Sector 3"
                fastest={data.sectors.sector_3.fastest}
                average={data.sectors.sector_3.average}
              />

            </div>


            <div className="border-t border-slate-800 bg-slate-900/30 px-6 py-5">

              <div className="flex items-center justify-between">

                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Best Sector Combination
                </span>

                <span className="text-2xl font-bold text-emerald-300">
                  {data.sectors.best_sector_combination.toFixed(3)}s
                </span>

              </div>

            </div>

          </section>


          {/* Recommendations */}

          <section>

            <div className="mb-4 flex items-center gap-2">

              <Lightbulb
                size={15}
                className="text-amber-400"
              />

              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Engineer Recommendations
              </h2>

            </div>


            <div className="space-y-3">

              {data.recommendations.map(
                (recommendation, index) => {

                  const highPriority =
                    recommendation.priority === "High"

                  return (
                    <div
                      key={`${recommendation.area}-${index}`}
                      className={[
                        "rounded-xl border p-5",
                        highPriority
                          ? "border-red-400/20 bg-red-400/[0.04]"
                          : "border-amber-400/20 bg-amber-400/[0.04]",
                      ].join(" ")}
                    >

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                          <div
                            className={[
                              "flex h-9 w-9 items-center justify-center rounded-lg",
                              highPriority
                                ? "bg-red-400/10"
                                : "bg-amber-400/10",
                            ].join(" ")}
                          >

                            {highPriority ? (
                              <AlertTriangle
                                size={17}
                                className="text-red-400"
                              />
                            ) : (
                              <Lightbulb
                                size={17}
                                className="text-amber-400"
                              />
                            )}

                          </div>

                          <div>

                            <p className="text-sm font-bold text-white">
                              {recommendation.area}
                            </p>

                            <span
                              className={[
                                "text-[9px] font-semibold uppercase tracking-[0.18em]",
                                highPriority
                                  ? "text-red-400"
                                  : "text-amber-400",
                              ].join(" ")}
                            >
                              {recommendation.priority} Priority
                            </span>

                          </div>

                        </div>

                      </div>


                      <p className="mt-4 text-sm leading-6 text-slate-400">
                        {recommendation.message}
                      </p>

                    </div>
                  )
                }
              )}

            </div>

          </section>

        </>

      )}

    </div>
  )
}


/* -------------------------------------------------- */
/* Score Card */
/* -------------------------------------------------- */

interface ScoreCardProps {
  label: string
  value: number
  icon: React.ElementType
  emphasis?: boolean
}


function ScoreCard({
  label,
  value,
  icon: Icon,
  emphasis = false,
}: ScoreCardProps) {

  return (
    <div
      className={[
        "rounded-xl border p-5",
        emphasis
          ? "border-amber-400/30 bg-amber-400/[0.06]"
          : "border-slate-800 bg-slate-950/60",
      ].join(" ")}
    >

      <div className="flex items-center justify-between">

        <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>

        <Icon
          size={15}
          className={
            emphasis
              ? "text-amber-400"
              : "text-slate-600"
          }
        />

      </div>


      <p
        className={[
          "mt-4 font-bold",
          emphasis
            ? "text-3xl text-amber-300"
            : "text-2xl text-slate-200",
        ].join(" ")}
      >
        {value.toFixed(2)}
      </p>


      <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-current transition-all"
          style={{
            width: `${Math.min(
              Math.max(value, 0),
              100
            )}%`,
          }}
        />

      </div>

    </div>
  )
}


/* -------------------------------------------------- */
/* Metric Card */
/* -------------------------------------------------- */

interface MetricCardProps {
  label: string
  value: string
  unit: string
}


function MetricCard({
  label,
  value,
  unit,
}: MetricCardProps) {

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">

      <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
        {label}
      </p>

      <div className="mt-3 flex items-end gap-2">

        <span className="text-2xl font-bold text-slate-200">
          {value}
        </span>

        <span className="mb-1 text-[9px] text-slate-600">
          {unit}
        </span>

      </div>

    </div>
  )
}


/* -------------------------------------------------- */
/* Sector Card */
/* -------------------------------------------------- */

interface SectorCardProps {
  name: string
  fastest: number
  average: number
}


function SectorCard({
  name,
  fastest,
  average,
}: SectorCardProps) {

  return (
    <div className="p-6">

      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {name}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">

        <div>

          <p className="text-[9px] uppercase tracking-[0.15em] text-slate-600">
            Fastest
          </p>

          <p className="mt-1 text-xl font-bold text-emerald-300">
            {fastest.toFixed(3)}s
          </p>

        </div>


        <div>

          <p className="text-[9px] uppercase tracking-[0.15em] text-slate-600">
            Average
          </p>

          <p className="mt-1 text-xl font-bold text-slate-300">
            {average.toFixed(3)}s
          </p>

        </div>

      </div>

    </div>
  )
}


export default Engineer
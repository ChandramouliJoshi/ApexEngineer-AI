import { useState } from "react"
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Gauge,
  GitCompareArrows,
  Lightbulb,
  Target,
  Trophy,
} from "lucide-react"

import { useEngineerComparison } from "../hooks/useEngineerComparison"


function EngineerComparison() {

  const [year, setYear] = useState(2025)
  const [grandPrix, setGrandPrix] = useState("Monaco")
  const [driver1, setDriver1] = useState("VER")
  const [driver2, setDriver2] = useState("NOR")
  const [sessionType, setSessionType] = useState("Race")


  const {
    data,
    loading,
    error,
  } = useEngineerComparison({
    year,
    grandPrix,
    driver1,
    driver2,
    sessionType,
  })


  const performance1 =
    data?.performance?.[data.driver_1]

  const performance2 =
    data?.performance?.[data.driver_2]


  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 border-b border-slate-800 pb-7 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="mb-3 flex items-center gap-2">

            <GitCompareArrows
              size={16}
              className="text-rose-400"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-400">
              ApexEngineer AI
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            ENGINEER COMPARISON
          </h1>

          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
            Driver-to-driver performance intelligence
          </p>

        </div>


        {data && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.05] px-5 py-4">

            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
              Faster Driver
            </p>

            <div className="mt-1 flex items-center gap-3">

              <Trophy
                size={18}
                className="text-yellow-300"
              />

              <span className="text-2xl font-black text-white">
                {data.overall.faster_driver}
              </span>

              <span className="text-xs text-slate-500">
                +{data.overall.score_difference.toFixed(2)}
              </span>

            </div>

          </div>
        )}

      </div>


      {/* Parameters */}

      <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">

        <div className="mb-5 flex items-center gap-2">

          <Target
            size={15}
            className="text-rose-400"
          />

          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            Comparison Parameters
          </h2>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

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
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-medium text-slate-200 outline-none transition focus:border-rose-400"
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
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-medium text-slate-200 outline-none transition focus:border-rose-400"
            >
              <option value="Monaco">Monaco</option>
              <option value="Italy">Italy</option>
              <option value="Belgium">Belgium</option>
              <option value="Austria">Austria</option>
            </select>

          </div>


          {/* Driver 1 */}

          <div>

            <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Driver 1
            </label>

            <input
              value={driver1}
              onChange={(e) =>
                setDriver1(
                  e.target.value.toUpperCase()
                )
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-bold uppercase text-rose-300 outline-none transition focus:border-rose-400"
              placeholder="VER"
            />

          </div>


          {/* Driver 2 */}

          <div>

            <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Driver 2
            </label>

            <input
              value={driver2}
              onChange={(e) =>
                setDriver2(
                  e.target.value.toUpperCase()
                )
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-bold uppercase text-sky-300 outline-none transition focus:border-rose-400"
              placeholder="NOR"
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
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-medium text-slate-200 outline-none transition focus:border-rose-400"
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

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-rose-400" />

            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Comparing drivers
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
              Engineer comparison unavailable
            </p>

          </div>

          <p className="mt-2 text-sm text-slate-400">
            {error}
          </p>

        </div>
      )}


      {!loading && !error && data && performance1 && performance2 && (

        <>

          {/* Driver Overview */}

          <section>

            <div className="mb-4 flex items-center gap-2">

              <Gauge
                size={15}
                className="text-rose-400"
              />

              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Driver Performance
              </h2>

            </div>


            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

              <PerformanceCard
                driver={data.driver_1}
                performance={performance1}
                winner={
                  data.overall.faster_driver ===
                  data.driver_1
                }
                accent="rose"
              />

              <PerformanceCard
                driver={data.driver_2}
                performance={performance2}
                winner={
                  data.overall.faster_driver ===
                  data.driver_2
                }
                accent="sky"
              />

            </div>

          </section>


          {/* Score Comparison */}

          <section className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">

            <div className="border-b border-slate-800 px-6 py-5">

              <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
                Performance Comparison
              </h2>

              <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-600">
                Relative driver performance scores
              </p>

            </div>


            <div className="divide-y divide-slate-800">

              <ComparisonRow
                label="Speed"
                value1={performance1.speed_score}
                value2={performance2.speed_score}
                driver1={data.driver_1}
                driver2={data.driver_2}
              />

              <ComparisonRow
                label="Throttle"
                value1={performance1.throttle_score}
                value2={performance2.throttle_score}
                driver1={data.driver_1}
                driver2={data.driver_2}
              />

              <ComparisonRow
                label="Braking"
                value1={performance1.braking_score}
                value2={performance2.braking_score}
                driver1={data.driver_1}
                driver2={data.driver_2}
              />

              <ComparisonRow
                label="Consistency"
                value1={performance1.consistency_score}
                value2={performance2.consistency_score}
                driver1={data.driver_1}
                driver2={data.driver_2}
              />

              <ComparisonRow
                label="Overall"
                value1={performance1.overall_score}
                value2={performance2.overall_score}
                driver1={data.driver_1}
                driver2={data.driver_2}
                emphasis
              />

            </div>

          </section>


          {/* Sector Comparison */}

          <section>

            <div className="mb-4 flex items-center gap-2">

              <BarChart3
                size={15}
                className="text-emerald-400"
              />

              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Sector Comparison
              </h2>

            </div>


            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <SectorComparisonCard
                name="Sector 1"
                data={data.sector_comparison.sector_1}
                driver1={data.driver_1}
                driver2={data.driver_2}
              />

              <SectorComparisonCard
                name="Sector 2"
                data={data.sector_comparison.sector_2}
                driver1={data.driver_1}
                driver2={data.driver_2}
              />

              <SectorComparisonCard
                name="Sector 3"
                data={data.sector_comparison.sector_3}
                driver1={data.driver_1}
                driver2={data.driver_2}
              />

            </div>

          </section>


          {/* Corner Comparison */}

          <section className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">

            <div className="border-b border-slate-800 px-6 py-5">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
                    Corner-by-Corner Analysis
                  </h2>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-600">
                    Speed comparison across all corners
                  </p>

                </div>

                <span className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                  {data.corner_comparison.length} Corners
                </span>

              </div>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] text-left">

                <thead>

                  <tr className="border-b border-slate-800 text-[9px] uppercase tracking-[0.15em] text-slate-600">

                    <th className="px-5 py-4">
                      Corner
                    </th>

                    <th className="px-5 py-4">
                      Entry Δ
                    </th>

                    <th className="px-5 py-4">
                      Apex Δ
                    </th>

                    <th className="px-5 py-4">
                      Exit Δ
                    </th>

                    <th className="px-5 py-4">
                      {data.driver_1} Exit
                    </th>

                    <th className="px-5 py-4">
                      {data.driver_2} Exit
                    </th>

                    <th className="px-5 py-4">
                      Winner
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {data.corner_comparison.map((corner) => {

                    const driver1Winner =
                      corner.winner === "Driver 1"

                    const driver2Winner =
                      corner.winner === "Driver 2"

                    return (
                      <tr
                        key={corner.corner}
                        className="border-b border-slate-900 transition hover:bg-slate-900/60"
                      >

                        <td className="px-5 py-4">

                          <span className="font-bold text-white">
                            T{corner.corner}
                          </span>

                        </td>


                        <DeltaCell
                          value={
                            corner.entry_speed_delta
                          }
                        />

                        <DeltaCell
                          value={
                            corner.apex_speed_delta
                          }
                        />

                        <DeltaCell
                          value={
                            corner.exit_speed_delta
                          }
                        />


                        <td className="px-5 py-4 text-sm text-slate-300">
                          {corner.driver_1.exit_speed}
                        </td>


                        <td className="px-5 py-4 text-sm text-slate-300">
                          {corner.driver_2.exit_speed}
                        </td>


                        <td className="px-5 py-4">

                          <span
                            className={[
                              "rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em]",
                              driver1Winner
                                ? "bg-rose-400/10 text-rose-300"
                                : driver2Winner
                                ? "bg-sky-400/10 text-sky-300"
                                : "bg-slate-800 text-slate-400",
                            ].join(" ")}
                          >
                            {driver1Winner
                              ? data.driver_1
                              : driver2Winner
                              ? data.driver_2
                              : "Even"}
                          </span>

                        </td>

                      </tr>
                    )
                  })}

                </tbody>

              </table>

            </div>

          </section>


          {/* Diagnosis */}

          <section>

            <div className="mb-4 flex items-center gap-2">

              <Lightbulb
                size={15}
                className="text-amber-400"
              />

              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Engineer Diagnosis
              </h2>

            </div>


            <div className="space-y-3">

              {data.diagnosis.map(
                (item, index) => {

                  const highPriority =
                    item.priority === "High"

                  return (
                    <div
                      key={`${item.area}-${index}`}
                      className={[
                        "rounded-xl border p-5",
                        highPriority
                          ? "border-red-400/20 bg-red-400/[0.04]"
                          : "border-amber-400/20 bg-amber-400/[0.04]",
                      ].join(" ")}
                    >

                      <div className="flex items-center justify-between">

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
                              {item.area}
                            </p>

                            <span
                              className={[
                                "text-[9px] font-semibold uppercase tracking-[0.18em]",
                                highPriority
                                  ? "text-red-400"
                                  : "text-amber-400",
                              ].join(" ")}
                            >
                              {item.priority} Priority
                            </span>

                          </div>

                        </div>


                        <span className="text-lg font-bold text-red-300">
                          +{item.time_loss.toFixed(3)}s
                        </span>

                      </div>


                      <p className="mt-4 text-sm leading-6 text-slate-400">
                        {item.message}
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
/* Performance Card */
/* -------------------------------------------------- */

interface PerformanceCardProps {
  driver: string
  performance: {
    speed_score: number
    throttle_score: number
    braking_score: number
    consistency_score: number
    overall_score: number
  }
  winner: boolean
  accent: "rose" | "sky"
}


function PerformanceCard({
  driver,
  performance,
  winner,
  accent,
}: PerformanceCardProps) {

  const accentClass =
    accent === "rose"
      ? "rose"
      : "sky"

  return (
    <div
      className={[
        "rounded-xl border p-6",
        winner
          ? `border-${accentClass}-400/30 bg-${accentClass}-400/[0.05]`
          : "border-slate-800 bg-slate-950/60",
      ].join(" ")}
    >

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className={[
              "flex h-10 w-10 items-center justify-center rounded-lg",
              accent === "rose"
                ? "bg-rose-400/10"
                : "bg-sky-400/10",
            ].join(" ")}
          >

            <span
              className={[
                "text-sm font-black",
                accent === "rose"
                  ? "text-rose-300"
                  : "text-sky-300",
              ].join(" ")}
            >
              {driver}
            </span>

          </div>


          <div>

            <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Driver
            </p>

            <p className="text-sm font-bold text-white">
              {driver}
            </p>

          </div>

        </div>


        {winner && (
          <Trophy
            size={18}
            className="text-yellow-300"
          />
        )}

      </div>


      <div className="mt-6">

        <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
          Overall Score
        </p>

        <p
          className={[
            "mt-1 text-4xl font-black",
            accent === "rose"
              ? "text-rose-300"
              : "text-sky-300",
          ].join(" ")}
        >
          {performance.overall_score.toFixed(2)}
        </p>

      </div>

    </div>
  )
}


/* -------------------------------------------------- */
/* Comparison Row */
/* -------------------------------------------------- */

interface ComparisonRowProps {
  label: string
  value1: number
  value2: number
  driver1: string
  driver2: string
  emphasis?: boolean
}


function ComparisonRow({
  label,
  value1,
  value2,
  driver1,
  driver2,
  emphasis = false,
}: ComparisonRowProps) {

  const driver1Better = value1 > value2
  const driver2Better = value2 > value1


  return (
    <div className="grid grid-cols-[1fr_100px_1fr] items-center gap-4 px-6 py-5">

      <div className="text-right">

        <span
          className={[
            "text-lg font-bold",
            driver1Better
              ? "text-rose-300"
              : "text-slate-400",
          ].join(" ")}
        >
          {value1.toFixed(2)}
        </span>

        <span className="ml-2 text-[9px] uppercase text-slate-600">
          {driver1}
        </span>

      </div>


      <div className="text-center">

        <p
          className={[
            "text-[9px] uppercase tracking-[0.15em]",
            emphasis
              ? "font-bold text-white"
              : "text-slate-600",
          ].join(" ")}
        >
          {label}
        </p>

      </div>


      <div>

        <span
          className={[
            "text-lg font-bold",
            driver2Better
              ? "text-sky-300"
              : "text-slate-400",
          ].join(" ")}
        >
          {value2.toFixed(2)}
        </span>

        <span className="ml-2 text-[9px] uppercase text-slate-600">
          {driver2}
        </span>

      </div>

    </div>
  )
}


/* -------------------------------------------------- */
/* Sector Comparison Card */
/* -------------------------------------------------- */

interface SectorComparisonCardProps {
  name: string
  data: {
    driver_1: number
    driver_2: number
    delta: number
  }
  driver1: string
  driver2: string
}


function SectorComparisonCard({
  name,
  data,
  driver1,
  driver2,
}: SectorComparisonCardProps) {

  const driver1Faster =
    data.driver_1 < data.driver_2

  const driver2Faster =
    data.driver_2 < data.driver_1


  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">

      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {name}
      </p>


      <div className="mt-4 flex items-end justify-between">

        <div>

          <p
            className={[
              "text-2xl font-bold",
              driver1Faster
                ? "text-rose-300"
                : "text-slate-300",
            ].join(" ")}
          >
            {data.driver_1.toFixed(3)}
          </p>

          <p className="text-[9px] uppercase text-slate-600">
            {driver1}
          </p>

        </div>


        <span className="pb-2 text-xs text-slate-700">
          VS
        </span>


        <div className="text-right">

          <p
            className={[
              "text-2xl font-bold",
              driver2Faster
                ? "text-sky-300"
                : "text-slate-300",
            ].join(" ")}
          >
            {data.driver_2.toFixed(3)}
          </p>

          <p className="text-[9px] uppercase text-slate-600">
            {driver2}
          </p>

        </div>

      </div>


      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">

        <span className="text-[9px] uppercase tracking-[0.15em] text-slate-600">
          Delta
        </span>

        <span className="text-sm font-bold text-amber-300">
          {data.delta.toFixed(3)}s
        </span>

      </div>

    </div>
  )
}


/* -------------------------------------------------- */
/* Delta Cell */
/* -------------------------------------------------- */

function DeltaCell({
  value,
}: {
  value: number
}) {

  const positive = value > 0
  const negative = value < 0


  return (
    <td className="px-5 py-4">

      <span
        className={[
          "inline-flex items-center gap-1 text-sm font-bold",
          positive
            ? "text-rose-300"
            : negative
            ? "text-sky-300"
            : "text-slate-500",
        ].join(" ")}
      >

        {positive && (
          <ArrowUp size={13} />
        )}

        {negative && (
          <ArrowDown size={13} />
        )}

        {value > 0 ? "+" : ""}
        {value}

      </span>

    </td>
  )
}


export default EngineerComparison
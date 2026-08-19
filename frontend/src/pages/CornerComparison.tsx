import {
  Activity,
  ArrowDown,
  ArrowUp,
  Gauge,
  Trophy,
} from "lucide-react"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { useCornerComparison } from "../hooks/useCornerComparison"


function CornerComparison() {

  const year = 2025
  const grandPrix = "Monaco"
  const driver1 = "VER"
  const driver2 = "HAM"
  const sessionType = "R"


  const {
    data,
    loading,
    error,
  } = useCornerComparison({
    year,
    grandPrix,
    driver1,
    driver2,
    sessionType,
  })


  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Loading corner comparison
          </p>

        </div>
      </div>
    )
  }


  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/[0.04] p-8">

        <div className="flex items-center gap-3">

          <Activity
            size={20}
            className="text-red-400"
          />

          <div>

            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-red-300">
              Corner comparison unavailable
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

          </div>

        </div>

      </div>
    )
  }


  if (!data.length) {
    return null
  }


  /*
   * Overall corner wins
   */

  const driver1Wins =
    data.filter(
      (point) =>
        point.winner === "Driver 1"
    ).length

  const driver2Wins =
    data.filter(
      (point) =>
        point.winner === "Driver 2"
    ).length


  /*
   * Largest entry / apex / exit differences
   */

  const largestEntry =
    data.reduce(
      (best, point) =>
        Math.abs(point.entry_speed_delta) >
        Math.abs(best.entry_speed_delta)
          ? point
          : best,
      data[0]
    )


  const largestApex =
    data.reduce(
      (best, point) =>
        Math.abs(point.apex_speed_delta) >
        Math.abs(best.apex_speed_delta)
          ? point
          : best,
      data[0]
    )


  const largestExit =
    data.reduce(
      (best, point) =>
        Math.abs(point.exit_speed_delta) >
        Math.abs(best.exit_speed_delta)
          ? point
          : best,
      data[0]
    )


  /*
   * Chart data
   */

  const chartData = data.map((point) => ({
    corner: `T${point.corner}`,
    entry: point.entry_speed_delta,
    apex: point.apex_speed_delta,
    exit: point.exit_speed_delta,
  }))


  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-slate-800 pb-8">

        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-400/[0.04] blur-3xl" />

        <div className="relative">

          <div className="mb-3 flex items-center gap-2">

            <Activity
              size={16}
              className="text-violet-400"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-400">
              APEXENGINEER AI
            </span>

          </div>


          <div className="flex flex-wrap items-end justify-between gap-6">

            <div>

              <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
                CORNER COMPARISON
              </h1>

              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Corner-by-corner driver performance analysis
              </p>

            </div>


            <div className="flex items-center gap-5">

              <div className="text-right">

                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
                  DRIVER 01
                </p>

                <p className="mt-1 font-mono text-lg font-bold text-cyan-400">
                  {driver1}
                </p>

              </div>


              <span className="font-mono text-xs text-slate-700">
                VS
              </span>


              <div>

                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
                  DRIVER 02
                </p>

                <p className="mt-1 font-mono text-lg font-bold text-orange-400">
                  {driver2}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SCOREBOARD
      ===================================================== */}

      <section>

        <div className="mb-4 flex items-center gap-3">

          <div className="h-px w-8 bg-violet-400" />

          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Corner scoreboard
          </span>

        </div>


        <div className="grid gap-4 md:grid-cols-3">


          {/* Driver 1 */}

          <div className="rounded-xl border border-cyan-400/20 bg-slate-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Driver 01
                </p>

                <p className="mt-2 font-mono text-2xl font-bold text-cyan-400">
                  {driver1}
                </p>

              </div>

              <Trophy
                size={20}
                className="text-cyan-400"
              />

            </div>


            <p className="mt-5 border-t border-slate-800 pt-3 font-mono text-3xl font-bold text-white">
              {driver1Wins}
              <span className="ml-2 text-xs font-normal uppercase tracking-wider text-slate-600">
                corners won
              </span>
            </p>

          </div>


          {/* Driver 2 */}

          <div className="rounded-xl border border-orange-400/20 bg-slate-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/50">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Driver 02
                </p>

                <p className="mt-2 font-mono text-2xl font-bold text-orange-400">
                  {driver2}
                </p>

              </div>

              <Trophy
                size={20}
                className="text-orange-400"
              />

            </div>


            <p className="mt-5 border-t border-slate-800 pt-3 font-mono text-3xl font-bold text-white">
              {driver2Wins}
              <span className="ml-2 text-xs font-normal uppercase tracking-wider text-slate-600">
                corners won
              </span>
            </p>

          </div>


          {/* Total */}

          <div className="rounded-xl border border-violet-400/20 bg-slate-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/50">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Corners analysed
                </p>

                <p className="mt-2 font-mono text-2xl font-bold text-violet-400">
                  {data.length}
                </p>

              </div>

              <Gauge
                size={20}
                className="text-violet-400"
              />

            </div>


            <p className="mt-5 border-t border-slate-800 pt-3 text-xs text-slate-500">
              Full circuit comparison
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          DELTA CHART
      ===================================================== */}

      <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">

        <div className="mb-6">

          <h2 className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-white">
            Corner speed differential
          </h2>

          <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-600">
            Driver 01 minus Driver 02 · km/h
          </p>

        </div>


        <div className="h-[380px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >

              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="corner"
                tick={{
                  fill: "#64748b",
                  fontSize: 9,
                }}
                axisLine={{
                  stroke: "#1e293b",
                }}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: "#64748b",
                  fontSize: 9,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(value, name) => [
                  `${Number(value).toFixed(1)} km/h`,
                  name === "entry"
                    ? "Entry Δ"
                    : name === "apex"
                      ? "Apex Δ"
                      : "Exit Δ",
                ]}
              />

              <Bar
                dataKey="entry"
                fill="#22d3ee"
                radius={[3, 3, 0, 0]}
              />

              <Bar
                dataKey="apex"
                fill="#a78bfa"
                radius={[3, 3, 0, 0]}
              />

              <Bar
                dataKey="exit"
                fill="#fb923c"
                radius={[3, 3, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        <div className="mt-5 flex flex-wrap gap-5 border-t border-slate-800 pt-4">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-cyan-400" />

            <span className="text-[9px] uppercase tracking-wider text-slate-500">
              Entry
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-violet-400" />

            <span className="text-[9px] uppercase tracking-wider text-slate-500">
              Apex
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-orange-400" />

            <span className="text-[9px] uppercase tracking-wider text-slate-500">
              Exit
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          EXTREME DIFFERENCES
      ===================================================== */}

      <section>

        <div className="mb-4 flex items-center gap-3">

          <div className="h-px w-8 bg-orange-400" />

          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Key performance differences
          </span>

        </div>


        <div className="grid gap-4 md:grid-cols-3">


          {/* Entry */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">

            <div className="flex items-center justify-between">

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                Largest entry delta
              </p>

              {largestEntry.entry_speed_delta >= 0
                ? (
                  <ArrowUp
                    size={16}
                    className="text-emerald-400"
                  />
                )
                : (
                  <ArrowDown
                    size={16}
                    className="text-red-400"
                  />
                )}

            </div>


            <p className={`mt-3 font-mono text-2xl font-bold ${
              largestEntry.entry_speed_delta >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}>

              {largestEntry.entry_speed_delta >= 0
                ? "+"
                : ""}

              {largestEntry.entry_speed_delta.toFixed(1)}
              <span className="ml-1 text-sm text-slate-500">
                km/h
              </span>

            </p>


            <p className="mt-2 text-xs text-slate-500">
              Turn {largestEntry.corner}
            </p>

          </div>


          {/* Apex */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">

            <div className="flex items-center justify-between">

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                Largest apex delta
              </p>

              {largestApex.apex_speed_delta >= 0
                ? (
                  <ArrowUp
                    size={16}
                    className="text-emerald-400"
                  />
                )
                : (
                  <ArrowDown
                    size={16}
                    className="text-red-400"
                  />
                )}

            </div>


            <p className={`mt-3 font-mono text-2xl font-bold ${
              largestApex.apex_speed_delta >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}>

              {largestApex.apex_speed_delta >= 0
                ? "+"
                : ""}

              {largestApex.apex_speed_delta.toFixed(1)}
              <span className="ml-1 text-sm text-slate-500">
                km/h
              </span>

            </p>


            <p className="mt-2 text-xs text-slate-500">
              Turn {largestApex.corner}
            </p>

          </div>


          {/* Exit */}

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">

            <div className="flex items-center justify-between">

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                Largest exit delta
              </p>

              {largestExit.exit_speed_delta >= 0
                ? (
                  <ArrowUp
                    size={16}
                    className="text-emerald-400"
                  />
                )
                : (
                  <ArrowDown
                    size={16}
                    className="text-red-400"
                  />
                )}

            </div>


            <p className={`mt-3 font-mono text-2xl font-bold ${
              largestExit.exit_speed_delta >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}>

              {largestExit.exit_speed_delta >= 0
                ? "+"
                : ""}

              {largestExit.exit_speed_delta.toFixed(1)}
              <span className="ml-1 text-sm text-slate-500">
                km/h
              </span>

            </p>


            <p className="mt-2 text-xs text-slate-500">
              Turn {largestExit.corner}
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CORNER TABLE
      ===================================================== */}

      <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">

        <div className="mb-6">

          <h2 className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-white">
            Corner-by-corner breakdown
          </h2>

          <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-600">
            Entry · apex · exit · throttle · RPM
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px] border-collapse">

            <thead>

              <tr className="border-b border-slate-800">

                <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.15em] text-slate-600">
                  Corner
                </th>

                <th className="px-4 py-3 text-right text-[9px] uppercase tracking-[0.15em] text-cyan-500">
                  {driver1} Entry
                </th>

                <th className="px-4 py-3 text-right text-[9px] uppercase tracking-[0.15em] text-orange-500">
                  {driver2} Entry
                </th>

                <th className="px-4 py-3 text-right text-[9px] uppercase tracking-[0.15em] text-violet-500">
                  Apex Δ
                </th>

                <th className="px-4 py-3 text-right text-[9px] uppercase tracking-[0.15em] text-cyan-500">
                  {driver1} Exit
                </th>

                <th className="px-4 py-3 text-right text-[9px] uppercase tracking-[0.15em] text-orange-500">
                  {driver2} Exit
                </th>

                <th className="px-4 py-3 text-center text-[9px] uppercase tracking-[0.15em] text-slate-600">
                  Winner
                </th>

              </tr>

            </thead>


            <tbody>

              {data.map((point) => {

                const driver1Winner =
                  point.winner === "Driver 1"

                const driver2Winner =
                  point.winner === "Driver 2"


                return (
                  <tr
                    key={point.corner}
                    className="border-b border-slate-900 transition-colors hover:bg-slate-900/70"
                  >

                    <td className="px-4 py-3">

                      <span className="font-mono text-sm font-bold text-white">
                        T{point.corner}
                      </span>

                    </td>


                    <td className={`px-4 py-3 text-right font-mono text-sm ${
                      driver1Winner
                        ? "font-bold text-cyan-300"
                        : "text-slate-400"
                    }`}>
                      {point.driver_1.entry_speed}
                    </td>


                    <td className={`px-4 py-3 text-right font-mono text-sm ${
                      driver2Winner
                        ? "font-bold text-orange-300"
                        : "text-slate-400"
                    }`}>
                      {point.driver_2.entry_speed}
                    </td>


                    <td className={`px-4 py-3 text-right font-mono text-sm ${
                      point.apex_speed_delta > 0
                        ? "text-emerald-400"
                        : point.apex_speed_delta < 0
                          ? "text-red-400"
                          : "text-slate-500"
                    }`}>
                      {point.apex_speed_delta > 0
                        ? "+"
                        : ""}
                      {point.apex_speed_delta}
                    </td>


                    <td className="px-4 py-3 text-right font-mono text-sm text-cyan-300">
                      {point.driver_1.exit_speed}
                    </td>


                    <td className="px-4 py-3 text-right font-mono text-sm text-orange-300">
                      {point.driver_2.exit_speed}
                    </td>


                    <td className="px-4 py-3 text-center">

                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                          driver1Winner
                            ? "bg-cyan-400/10 text-cyan-300"
                            : "bg-orange-400/10 text-orange-300"
                        }`}
                      >
                        {driver1Winner
                          ? driver1
                          : driver2}
                      </span>

                    </td>

                  </tr>
                )

              })}

            </tbody>

          </table>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Corner comparison synchronized
          </span>

        </div>


        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-600">
          {year} · {grandPrix} · {sessionType}
        </span>

      </div>

    </div>
  )
}


export default CornerComparison
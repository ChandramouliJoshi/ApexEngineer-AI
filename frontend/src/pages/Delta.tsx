import {
  Activity,
  ArrowDown,
  ArrowUp,
  Gauge,
  Zap,
} from "lucide-react"

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { useDelta } from "../hooks/useDelta"


function Delta() {

  /*
   * Temporary comparison configuration.
   *
   * We will connect these to the global
   * session selectors later.
   */

  const year = 2025
  const grandPrix = "Monaco"
  const driver1 = "VER"
  const driver2 = "HAM"
  const sessionType = "R"


  const {
    data,
    loading,
    error,
  } = useDelta({
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

          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Loading delta analysis
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
              Delta data unavailable
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
   * Summary calculations
   */

  const maxSpeedGain =
    Math.max(...data.map((point) => point.SpeedDelta))

  const maxSpeedLoss =
    Math.min(...data.map((point) => point.SpeedDelta))

  const maxThrottleDifference =
    Math.max(
      ...data.map((point) =>
        Math.abs(point.ThrottleDelta)
      )
    )

  const maxRPMDifference =
    Math.max(
      ...data.map((point) =>
        Math.abs(point.RPMDelta)
      )
    )


  const averageSpeedDelta =
    data.reduce(
      (sum, point) =>
        sum + point.SpeedDelta,
      0
    ) / data.length


  /*
   * Reduce chart density while preserving
   * the shape of the telemetry trace.
   */

  const chartData = data
    .filter(
      (_, index) =>
        index % Math.max(
          1,
          Math.floor(data.length / 250)
        ) === 0
    )
    .map((point) => ({
      distance: Number(
        point.Distance.toFixed(0)
      ),
      speed: Number(
        point.SpeedDelta.toFixed(1)
      ),
      throttle: Number(
        point.ThrottleDelta.toFixed(1)
      ),
      rpm: Number(
        point.RPMDelta.toFixed(0)
      ),
    }))


  const speedGainPoint =
    data.reduce(
      (best, point) =>
        point.SpeedDelta > best.SpeedDelta
          ? point
          : best,
      data[0]
    )


  const speedLossPoint =
    data.reduce(
      (worst, point) =>
        point.SpeedDelta < worst.SpeedDelta
          ? point
          : worst,
      data[0]
    )


  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-slate-800 pb-8">

        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/[0.04] blur-3xl" />

        <div className="relative">

          <div className="mb-3 flex items-center gap-2">

            <Activity
              size={16}
              className="text-cyan-400"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
              APEXENGINEER AI
            </span>

          </div>


          <div className="flex flex-wrap items-end justify-between gap-6">

            <div>

              <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
                DELTA ANALYSIS
              </h1>

              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Comparative telemetry · driver performance differential
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


              <div className="font-mono text-xs text-slate-700">
                VS
              </div>


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
          SUMMARY CARDS
      ===================================================== */}

      <section>

        <div className="mb-4 flex items-center gap-3">

          <div className="h-px w-8 bg-cyan-400" />

          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Performance differential
          </span>

        </div>


        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">


          {/* Average speed */}

          <div className="group rounded-xl border border-cyan-400/20 bg-slate-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Average speed delta
                </p>

                <p
                  className={`mt-4 font-mono text-3xl font-bold ${
                    averageSpeedDelta >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {averageSpeedDelta >= 0
                    ? "+"
                    : ""}
                  {averageSpeedDelta.toFixed(1)}

                  <span className="ml-1 text-sm text-slate-500">
                    km/h
                  </span>
                </p>

              </div>

              <Gauge
                size={19}
                className="text-cyan-400"
              />

            </div>

          </div>


          {/* Speed gain */}

          <div className="group rounded-xl border border-emerald-400/20 bg-slate-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Maximum speed gain
                </p>

                <p className="mt-4 font-mono text-3xl font-bold text-emerald-400">
                  +{maxSpeedGain.toFixed(1)}

                  <span className="ml-1 text-sm text-slate-500">
                    km/h
                  </span>
                </p>

              </div>

              <ArrowUp
                size={19}
                className="text-emerald-400"
              />

            </div>

            <p className="mt-4 border-t border-slate-800 pt-3 font-mono text-[9px] uppercase tracking-wider text-slate-600">
              @ {speedGainPoint.Distance.toFixed(0)} m
            </p>

          </div>


          {/* Speed loss */}

          <div className="group rounded-xl border border-red-400/20 bg-slate-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-400/50 hover:shadow-[0_0_30px_rgba(248,113,113,0.08)]">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Maximum speed loss
                </p>

                <p className="mt-4 font-mono text-3xl font-bold text-red-400">
                  {maxSpeedLoss.toFixed(1)}

                  <span className="ml-1 text-sm text-slate-500">
                    km/h
                  </span>
                </p>

              </div>

              <ArrowDown
                size={19}
                className="text-red-400"
              />

            </div>

            <p className="mt-4 border-t border-slate-800 pt-3 font-mono text-[9px] uppercase tracking-wider text-slate-600">
              @ {speedLossPoint.Distance.toFixed(0)} m
            </p>

          </div>


          {/* Control delta */}

          <div className="group rounded-xl border border-orange-400/20 bg-slate-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/50 hover:shadow-[0_0_30px_rgba(251,146,60,0.08)]">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Max throttle delta
                </p>

                <p className="mt-4 font-mono text-3xl font-bold text-orange-400">
                  {maxThrottleDifference.toFixed(0)}

                  <span className="ml-1 text-sm text-slate-500">
                    %
                  </span>
                </p>

              </div>

              <Zap
                size={19}
                className="text-orange-400"
              />

            </div>

            <p className="mt-4 border-t border-slate-800 pt-3 font-mono text-[9px] uppercase tracking-wider text-slate-600">
              RPM Δ max {maxRPMDifference.toFixed(0)}
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          SPEED DELTA CHART
      ===================================================== */}

      <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div>

            <h2 className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-white">
              Speed delta
            </h2>

            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-600">
              Driver 01 minus Driver 02 · track distance
            </p>

          </div>


          <div className="flex items-center gap-4">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-[9px] uppercase tracking-wider text-slate-500">
                Gain
              </span>

            </div>

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-red-400" />

              <span className="text-[9px] uppercase tracking-wider text-slate-500">
                Loss
              </span>

            </div>

          </div>

        </div>


        <div className="h-[360px] w-full">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >

              <XAxis
                dataKey="distance"
                tick={{
                  fill: "#64748b",
                  fontSize: 9,
                }}
                axisLine={{
                  stroke: "#1e293b",
                }}
                tickLine={false}
                tickFormatter={(value) =>
                  `${value}m`
                }
              />

              <YAxis
                tick={{
                  fill: "#64748b",
                  fontSize: 9,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  `${value}`
                }
              />

              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                labelStyle={{
                  color: "#94a3b8",
                }}
                formatter={(value) => [
                  `${Number(value).toFixed(1)} km/h`,
                  "Speed Δ",
                ]}
                labelFormatter={(value) =>
                  `${value} m`
                }
              />

              <Line
                type="monotone"
                dataKey="speed"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </section>


      {/* =====================================================
          CONTROL DELTAS
      ===================================================== */}

      <section className="grid gap-5 lg:grid-cols-2">


        {/* Throttle */}

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">

          <div className="mb-6">

            <h2 className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-white">
              Throttle differential
            </h2>

            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-600">
              Throttle application difference
            </p>

          </div>


          <div className="h-[250px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={chartData}>

                <XAxis
                  dataKey="distance"
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
                  formatter={(value) => [
                    `${Number(value).toFixed(1)} %`,
                    "Throttle Δ",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="throttle"
                  stroke="#fb923c"
                  strokeWidth={2}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* RPM */}

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">

          <div className="mb-6">

            <h2 className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-white">
              RPM differential
            </h2>

            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-600">
              Engine speed difference
            </p>

          </div>


          <div className="h-[250px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={chartData}>

                <XAxis
                  dataKey="distance"
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
                  formatter={(value) => [
                    `${Number(value).toFixed(0)} RPM`,
                    "RPM Δ",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="rpm"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </section>


      {/* =====================================================
          ENGINEERING INSIGHTS
      ===================================================== */}

      <section>

        <div className="mb-4 flex items-center gap-3">

          <div className="h-px w-8 bg-orange-400" />

          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Engineering observations
          </span>

        </div>


        <div className="grid gap-4 md:grid-cols-3">


          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">

            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
              Largest gain
            </p>

            <p className="mt-3 font-mono text-2xl font-bold text-emerald-400">
              +{maxSpeedGain.toFixed(1)} km/h
            </p>

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Driver 01 reaches the largest speed advantage around{" "}
              <span className="font-mono text-slate-300">
                {speedGainPoint.Distance.toFixed(0)} m
              </span>{" "}
              on the track.
            </p>

          </div>


          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">

            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
              Largest loss
            </p>

            <p className="mt-3 font-mono text-2xl font-bold text-red-400">
              {maxSpeedLoss.toFixed(1)} km/h
            </p>

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Driver 01 loses the most speed around{" "}
              <span className="font-mono text-slate-300">
                {speedLossPoint.Distance.toFixed(0)} m
              </span>
              .
            </p>

          </div>


          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">

            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
              Data resolution
            </p>

            <p className="mt-3 font-mono text-2xl font-bold text-cyan-400">
              {data.length}
            </p>

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Synchronized telemetry samples used for this comparison.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Delta telemetry synchronized
          </span>

        </div>


        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-600">
          {year} · {grandPrix} · {sessionType}
        </span>

      </div>

    </div>
  )
}


export default Delta
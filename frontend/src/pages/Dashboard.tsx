import { motion } from "framer-motion"
import {
  AlertTriangle,
  BrainCircuit,
  Gauge,
  Radio,
  Trophy,
  Zap,
  CircleStop,
  RotateCw,
  Settings2,
  Wind,
  type LucideIcon,
} from "lucide-react"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { useTelemetry } from "../hooks/useTelemetry"
import { useEngineerReport } from "../hooks/useEngineerReport"

import RacingPanel from "../components/f1/RacingPanel"
import SectionHeader from "../components/f1/SectionHeader"
import StatusLight from "../components/f1/StatusLight"
import TelemetryBar from "../components/f1/TelemetryBar"


function Dashboard() {

  const {
    data,
    loading,
    error,
  } = useEngineerReport({
    year: 2025,
    grandPrix: "Monaco",
    driver: "VER",
    sessionType: "R",
  })

  const {
    data: telemetry,
    loading: telemetryLoading,
    error: telemetryError,
  } = useTelemetry({
    year: 2025,
    grandPrix: "Monaco",
    driver: "VER",
    sessionType: "R",
  })

  const [telemetryMetric, setTelemetryMetric] =
    useState<
      "Speed" |
      "Throttle" |
      "Brake" |
      "RPM" |
      "Gear" |
      "DRS"
    >("Speed")

  const telemetryTabs = [
    {
      key: "Speed",
      label: "SPEED",
      icon: Gauge,
      text: "text-cyan-300",
      border: "border-cyan-400/70",
      bg: "bg-cyan-400/10",
      glow: "shadow-[0_0_16px_rgba(34,211,238,0.16)]",
      chart: "#22d3ee",
    },
    {
      key: "Throttle",
      label: "THROTTLE",
      icon: Zap,
      text: "text-yellow-300",
      border: "border-yellow-400/70",
      bg: "bg-yellow-400/10",
      glow: "shadow-[0_0_16px_rgba(250,204,21,0.14)]",
      chart: "#facc15",
    },
    {
      key: "Brake",
      label: "BRAKE",
      icon: CircleStop,
      text: "text-red-400",
      border: "border-red-500/70",
      bg: "bg-red-500/10",
      glow: "shadow-[0_0_16px_rgba(239,68,68,0.16)]",
      chart: "#ef4444",
    },
    {
      key: "RPM",
      label: "RPM",
      icon: RotateCw,
      text: "text-orange-300",
      border: "border-orange-400/70",
      bg: "bg-orange-400/10",
      glow: "shadow-[0_0_16px_rgba(251,146,60,0.15)]",
      chart: "#fb923c",
    },
    {
      key: "Gear",
      label: "GEAR",
      icon: Settings2,
      text: "text-purple-300",
      border: "border-purple-400/70",
      bg: "bg-purple-400/10",
      glow: "shadow-[0_0_16px_rgba(192,132,252,0.14)]",
      chart: "#c084fc",
    },
    {
      key: "DRS",
      label: "DRS",
      icon: Wind,
      text: "text-emerald-300",
      border: "border-emerald-400/70",
      bg: "bg-emerald-400/10",
      glow: "shadow-[0_0_16px_rgba(52,211,153,0.14)]",
      chart: "#34d399",
    },
  ] as const

  const activeTelemetryTab =
    telemetryTabs.find(
      (tab) => tab.key === telemetryMetric
    )

  const telemetryColor =
    activeTelemetryTab?.chart ?? "#22d3ee"


  return (
    <div className="space-y-6">

      {/* ─────────────────────────────────────────────
          API CONNECTION STATUS
      ───────────────────────────────────────────── */}

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4 font-mono text-xs text-cyan-400"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_#00b8ff]" />

          <span>
            CONNECTING TO APEXENGINEER CORE...
          </span>
        </motion.div>
      )}


      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-500/30 bg-red-500/5 p-4"
        >
          <div className="flex items-center gap-3">

            <AlertTriangle
              size={18}
              className="text-[#e10600]"
            />

            <div>

              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#e10600]">
                Engineering System Error
              </p>

              <p className="mt-1 font-mono text-xs text-slate-400">
                {error}
              </p>

            </div>

          </div>
        </motion.div>
      )}


      {/* ─────────────────────────────────────────────
          SESSION HEADER
      ───────────────────────────────────────────── */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <SectionHeader
          eyebrow="Race Intelligence"
          title="Driver Performance"
          description="2025 Monaco Grand Prix · Race"
        />

        <div className="mb-7 flex items-center gap-4">

          <div className="hidden border-l border-slate-800 pl-4 sm:block">

            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
              Session
            </p>

            <p className="mt-1 font-mono text-xs font-bold text-slate-300">
              RACE
            </p>

          </div>

          <StatusLight
            label={
              loading
                ? "CONNECTING"
                : error
                  ? "OFFLINE"
                  : "LIVE TELEMETRY"
            }
          />

        </div>

      </div>


      {/* ─────────────────────────────────────────────
          DRIVER HERO
      ───────────────────────────────────────────── */}

      <RacingPanel
        className="carbon"
        accent="red"
      >

        <div className="grid lg:grid-cols-[1.25fr_0.75fr]">

          {/* DRIVER */}

          <div className="relative overflow-hidden border-b border-slate-800/70 p-6 lg:border-b-0 lg:border-r">

            <div className="pointer-events-none absolute -right-4 -top-14 select-none font-black text-[180px] leading-none text-white/[0.025]">
              1
            </div>

            <div className="relative flex h-full flex-col justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-[#e10600] shadow-[0_0_10px_#e10600]" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#e10600]">
                    Selected Driver
                  </span>

                </div>

                <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
                  VER
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-400">
                  Max Verstappen
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700">
                  Red Bull Racing · #1
                </p>

              </div>

              <div className="mt-8 flex items-center gap-3">

                <div className="h-1 w-16 rounded-full bg-[#e10600] shadow-[0_0_12px_#e10600]" />

                <span className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
                  Race Engineering
                </span>

              </div>

            </div>

          </div>


          {/* SCORE + BARS */}

          <div className="p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Overall Performance
                </p>

                <motion.p
                  initial={{
                    opacity: 0,
                    scale: 0.85,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className="mt-1 font-mono text-5xl font-black text-white"
                >
                  {data?.performance_score.overall_score.toFixed(2) ?? "--"}
                </motion.p>

              </div>

              <Trophy
                size={20}
                className="text-[#ffb800]"
              />

            </div>

            <div className="mt-5 space-y-4">

              <TelemetryBar
                label="Speed"
                value={data?.performance_score.speed_score ?? 0}
                color="#00b8ff"
              />

              <TelemetryBar
                label="Throttle"
                value={data?.performance_score.throttle_score ?? 0}
                suffix="%"
                color="#ffb800"
              />

              <TelemetryBar
                label="Braking"
                value={data?.performance_score.braking_score ?? 0}
                color="#e10600"
              />

              <TelemetryBar
                label="Consistency"
                value={data?.performance_score.consistency_score ?? 0}
                color="#ffb800"
              />

            </div>

          </div>

        </div>

      </RacingPanel>


      {/* ─────────────────────────────────────────────
          TELEMETRY + TRACK
      ───────────────────────────────────────────── */}

      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.8fr]">

        {/* TELEMETRY */}

        <RacingPanel
          title="Telemetry Overview"
          accent="cyan"
        >

          <div className="p-5">

            <div className="mb-5 flex flex-wrap gap-2">

              {telemetryTabs.map((tab) => {

                const Icon = tab.icon
                const active = telemetryMetric === tab.key

                return (
                  <button
                    key={tab.key}
                    onClick={() =>
                      setTelemetryMetric(
                        tab.key as typeof telemetryMetric
                      )
                    }
                    className={`
                      group
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      px-4
                      py-2
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-widest
                      transition-all
                      duration-200
                      ${
                        active
                          ? `${tab.border} ${tab.bg} ${tab.text} ${tab.glow}`
                          : "border-slate-800 bg-slate-950/40 text-slate-600 hover:border-slate-700 hover:bg-slate-900/40 hover:text-slate-300"
                      }
                    `}
                  >
                    <Icon
                      size={14}
                      strokeWidth={2}
                      className={`
                        transition-all
                        duration-200
                        ${
                          active
                            ? tab.text
                            : "text-slate-600 group-hover:text-slate-400"
                        }
                      `}
                    />

                    <span>{tab.label}</span>
                  </button>
                )
              })}

            </div>


            {/* REAL FASTF1 TELEMETRY */}

            <div className="relative h-[330px] overflow-hidden rounded-lg border border-slate-800/70 bg-[#050912]">

              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(148,163,184,0.055) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(148,163,184,0.055) 1px, transparent 1px)
                  `,
                  backgroundSize: "50px 50px",
                }}
              />

              <motion.div
                className="absolute inset-x-0 top-0 z-10 h-px"
                animate={{
                  opacity: [0.35, 0.8, 0.35],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                }}
                style={{
                  backgroundColor: telemetryColor,
                  boxShadow: `0 0 12px ${telemetryColor}`,
                }}
              />

              <div className="absolute left-4 top-4 z-10 flex items-center gap-2">

                <span
                  className={`
                    h-2 w-2 rounded-full
                    ${
                      telemetryLoading
                        ? "animate-pulse bg-yellow-400 shadow-[0_0_8px_#ffb800]"
                        : telemetryError
                          ? "bg-red-500 shadow-[0_0_8px_#e10600]"
                          : "shadow-[0_0_8px_currentColor]"
                    }
                  `}
                  style={
                    !telemetryLoading && !telemetryError
                      ? { backgroundColor: telemetryColor, color: telemetryColor }
                      : undefined
                  }
                />

                <span
                  className={`text-[9px] font-bold uppercase tracking-widest ${
                    telemetryLoading
                      ? "text-yellow-300"
                      : telemetryError
                        ? "text-red-400"
                        : activeTelemetryTab?.text ?? "text-cyan-300"
                  }`}
                >
                  VER · {activeTelemetryTab?.label ?? telemetryMetric}
                </span>

              </div>

              {!telemetryLoading &&
                !telemetryError &&
                telemetry.length > 0 && (
                  <div className="absolute right-5 top-3 z-10 text-right">
                    <p className="text-[8px] uppercase tracking-widest text-slate-600">
                      Samples
                    </p>

                    <p className="font-mono text-xs font-bold text-white">
                      {telemetry.length.toLocaleString()}
                    </p>
                  </div>
                )}

              {telemetryLoading && (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div
                      className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-800"
                      style={{
                        borderTopColor: telemetryColor,
                      }}
                    />

                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                      Loading FastF1 telemetry...
                    </p>
                  </div>
                </div>
              )}

              {!telemetryLoading && telemetryError && (
                <div className="flex h-full items-center justify-center px-8">
                  <div className="text-center">

                    <AlertTriangle
                      size={20}
                      className="mx-auto mb-3 text-[#e10600]"
                    />

                    <p className="text-[9px] font-black uppercase tracking-widest text-[#e10600]">
                      Telemetry Feed Error
                    </p>

                    <p className="mt-2 max-w-md font-mono text-[9px] leading-4 text-slate-600">
                      {telemetryError}
                    </p>

                  </div>
                </div>
              )}

              {!telemetryLoading &&
                !telemetryError &&
                telemetry.length === 0 && (
                  <div className="flex h-full items-center justify-center">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                      No telemetry samples available
                    </p>
                  </div>
                )}

              {!telemetryLoading &&
                !telemetryError &&
                telemetry.length > 0 && (
                  <div className="absolute inset-x-3 bottom-3 top-10">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <LineChart
                        data={telemetry}
                        margin={{
                          top: 10,
                          right: 10,
                          left: 0,
                          bottom: 5,
                        }}
                      >

                        <CartesianGrid
                          stroke="rgba(148,163,184,0.07)"
                          vertical
                          horizontal
                        />

                        <XAxis
                          dataKey="Distance"
                          tick={{
                            fill: "#334155",
                            fontSize: 8,
                            fontFamily: "monospace",
                          }}
                          tickFormatter={(value) =>
                            `${Math.round(Number(value))}`
                          }
                          axisLine={{
                            stroke: "#1e293b",
                          }}
                          tickLine={false}
                          minTickGap={40}
                        />

                        <YAxis
                          tick={{
                            fill: "#334155",
                            fontSize: 8,
                            fontFamily: "monospace",
                          }}
                          axisLine={false}
                          tickLine={false}
                          width={38}
                          domain={["auto", "auto"]}
                        />

                        <Tooltip
                          contentStyle={{
                            background: "#050912",
                            border:
                              "1px solid rgba(0,184,255,0.25)",
                            borderRadius: "6px",
                            fontFamily: "monospace",
                            fontSize: "10px",
                          }}
                          labelStyle={{
                            color: "#64748b",
                          }}
                          itemStyle={{
                            color: telemetryColor,
                          }}
                          labelFormatter={(value) =>
                            `DIST ${Number(value).toFixed(1)}m`
                          }
                          formatter={(value) => [
                            Number(value).toFixed(
                              telemetryMetric === "RPM" ? 0 : 2
                            ),
                            telemetryMetric,
                          ]}
                        />

                        <Line
                          type="monotone"
                          dataKey={telemetryMetric}
                          stroke={telemetryColor}
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{
                            r: 4,
                            fill: telemetryColor,
                            stroke: "#ffffff",
                            strokeWidth: 1,
                          }}
                          isAnimationActive
                          animationDuration={900}
                        />

                      </LineChart>

                    </ResponsiveContainer>

                  </div>
                )}

            </div>

          </div>

        </RacingPanel>


        {/* CIRCUIT */}

        <RacingPanel
          title="Circuit Intelligence"
          accent="red"
        >

          <div className="relative min-h-[420px] overflow-hidden p-5">

            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgba(225,6,0,.15), transparent 60%)",
              }}
            />

            <div className="absolute right-5 top-5 text-right">

              <p className="text-xl font-black italic text-white">
                MONACO
              </p>

              <p className="text-[8px] font-bold uppercase tracking-widest text-[#e10600]">
                Circuit de Monaco
              </p>

            </div>


            <svg
              viewBox="0 0 400 450"
              className="absolute inset-10 h-[350px] w-[calc(100%-80px)]"
            >

              <motion.path
                d="
                  M85 360
                  C40 330 55 270 100 250
                  C150 228 170 270 205 240
                  C250 200 220 140 265 110
                  C300 88 350 110 335 155
                  C320 200 270 205 285 245
                  C300 280 350 270 345 315
                  C340 355 290 380 250 350
                  C205 315 190 350 150 370
                  C120 385 100 375 85 360
                "
                fill="none"
                stroke="#e10600"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 2.5,
                }}
                style={{
                  filter: "drop-shadow(0 0 8px rgba(225,6,0,.7))",
                }}
              />

              <motion.circle
                cx="205"
                cy="240"
                r="6"
                fill="#00b8ff"
                animate={{
                  r: [5, 9, 5],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />

            </svg>


            <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2">

              <SectorBox
                sector="S1"
                time={data?.sectors.sector_1.fastest ?? 0}
                average={data?.sectors.sector_1.average ?? 0}
              />

              <SectorBox
                sector="S2"
                time={data?.sectors.sector_2.fastest ?? 0}
                average={data?.sectors.sector_2.average ?? 0}
              />

              <SectorBox
                sector="S3"
                time={data?.sectors.sector_3.fastest ?? 0}
                average={data?.sectors.sector_3.average ?? 0}
              />

            </div>

          </div>

        </RacingPanel>

      </div>


      {/* ─────────────────────────────────────────────
          TELEMETRY METRICS
      ───────────────────────────────────────────── */}

      <RacingPanel
        title="Telemetry Metrics"
        accent="cyan"
      >

        <div className="grid grid-cols-2 gap-px bg-slate-800/60 md:grid-cols-4">

          <Metric
            label="DISTANCE"
            value={`${data?.telemetry.distance.toFixed(2) ?? "--"} m`}
          />

          <Metric
            label="FULL THROTTLE"
            value={`${data?.telemetry.full_throttle.toFixed(1) ?? "--"}%`}
          />

          <Metric
            label="BRAKE USAGE"
            value={`${data?.telemetry.brake_usage.toFixed(2) ?? "--"}%`}
          />

          <Metric
            label="DRS USAGE"
            value={`${data?.telemetry.drs_usage.toFixed(1) ?? "--"}%`}
          />

        </div>

      </RacingPanel>


      {/* ─────────────────────────────────────────────
          LOWER ANALYTICS
      ───────────────────────────────────────────── */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* LAP TIMES */}

        <RacingPanel
          title="Lap Times"
          accent="red"
        >

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-slate-800 text-[8px] uppercase tracking-widest text-slate-700">

                  <th className="px-5 py-3">
                    Lap
                  </th>

                  <th className="py-3">
                    S1
                  </th>

                  <th className="py-3">
                    S2
                  </th>

                  <th className="py-3">
                    S3
                  </th>

                  <th className="py-3">
                    Time
                  </th>

                </tr>

              </thead>

              <tbody>

                {[
                  ["42", "19.233", "35.103", "19.669", "1:14.005"],
                  ["41", "19.521", "35.441", "19.801", "1:14.763"],
                  ["40", "19.602", "35.802", "19.920", "1:15.324"],
                  ["39", "19.411", "35.640", "19.844", "1:14.895"],
                  ["38", "19.734", "35.712", "19.932", "1:15.378"],
                ].map((lap, index) => (

                  <motion.tr
                    key={lap[0]}
                    initial={{
                      opacity: 0,
                      x: -8,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: index * 0.06,
                    }}
                    className={`
                      border-b border-slate-900
                      text-[10px]
                      ${
                        index === 0
                          ? "bg-[#e10600]/5"
                          : ""
                      }
                    `}
                  >

                    {lap.map((value, i) => (

                      <td
                        key={i}
                        className={`
                          px-5 py-3 font-mono
                          ${
                            i === 0
                              ? "font-bold text-slate-300"
                              : "text-slate-500"
                          }
                        `}
                      >
                        {value}
                      </td>

                    ))}

                  </motion.tr>

                ))}

              </tbody>

            </table>

          </div>

        </RacingPanel>


        {/* DRIVER COMPARISON */}

        <RacingPanel
          title="Driver Comparison"
          accent="cyan"
        >

          <div className="space-y-5 p-5">

            <DriverCompare
              driver="VER"
              value={87}
              delta="-"
              color="#00b8ff"
            />

            <DriverCompare
              driver="NOR"
              value={79}
              delta="+0.406"
              color="#ff8a00"
            />

            <DriverCompare
              driver="LEC"
              value={76}
              delta="+0.621"
              color="#e10600"
            />

            <DriverCompare
              driver="HAM"
              value={72}
              delta="+0.802"
              color="#ffb800"
            />

            <DriverCompare
              driver="SAI"
              value={69}
              delta="+1.104"
              color="#00e676"
            />

          </div>

        </RacingPanel>


        {/* ENGINEER INSIGHTS */}

        <RacingPanel
          title="Engineer Insights"
          accent="yellow"
        >

          <div className="space-y-3 p-5">

            {data?.recommendations?.map(
              (recommendation, index) => (

                <Insight
                  key={`${recommendation.area}-${index}`}
                  icon={
                    recommendation.priority.toLowerCase() === "high"
                      ? AlertTriangle
                      : BrainCircuit
                  }
                  priority={recommendation.priority.toUpperCase()}
                  area={recommendation.area.toUpperCase()}
                  message={recommendation.message}
                  color={
                    recommendation.priority.toLowerCase() === "high"
                      ? "#e10600"
                      : "#ffb800"
                  }
                />

              )
            )}

          </div>

        </RacingPanel>

      </div>


      {/* ─────────────────────────────────────────────
          BOTTOM STRIP
      ───────────────────────────────────────────── */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* SPEED TRAP */}

        <RacingPanel
          title="Speed Trap"
          accent="cyan"
        >

          <div className="flex items-center justify-between p-5">

            <div>

              <p className="text-[9px] uppercase tracking-widest text-slate-600">
                Maximum Speed
              </p>

              <p className="mt-2 font-mono text-4xl font-black text-white">
                {data?.telemetry.speed.max ?? "--"}
              </p>

              <p className="text-[9px] uppercase tracking-widest text-cyan-400">
                KM/H
              </p>

            </div>

            <Gauge
              size={50}
              className="text-cyan-400"
            />

          </div>

        </RacingPanel>


        {/* TELEMETRY STATS */}

        <RacingPanel
          title="Telemetry Stats"
          accent="yellow"
        >

          <div className="grid grid-cols-2 gap-3 p-5">

            <MiniStat
              label="AVG SPEED"
              value={`${data?.telemetry.speed.average ?? "--"} km/h`}
            />

            <MiniStat
              label="MAX RPM"
              value={`${data?.telemetry.rpm.max ?? "--"}`}
            />

            <MiniStat
              label="AVG RPM"
              value={`${data?.telemetry.rpm.average ?? "--"}`}
            />

            <MiniStat
              label="MAX GEAR"
              value={`${data?.telemetry.gear.max ?? "--"}`}
            />

          </div>

        </RacingPanel>


        {/* RACE ENGINEER */}

        <RacingPanel
          title="Race Engineer"
          accent="red"
        >

          <div className="flex items-center gap-4 p-5">

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e10600]/10 text-[#e10600]">

              <Radio size={20} />

            </div>

            <div>

              <div className="flex items-center gap-2">

                <span className="text-[9px] font-bold uppercase tracking-widest text-[#e10600]">
                  LIVE
                </span>

                <span className="text-[9px] text-slate-700">
                  ·
                </span>

                <span className="text-[9px] uppercase tracking-widest text-slate-600">
                  ENGINEER RADIO
                </span>

              </div>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                {data?.recommendations?.[0]?.message ??
                  "Waiting for engineering instructions."}
              </p>

            </div>

          </div>

        </RacingPanel>

      </div>

    </div>
  )
}


/* ─────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────── */

function SectorBox({
  sector,
  time,
  average,
}: {
  sector: string
  time: number
  average: number
}) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-950/70 p-2">

      <div className="flex items-center justify-between">

        <span className="text-[8px] font-bold text-slate-600">
          {sector}
        </span>

        <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-cyan-400">
          FASTEST
        </span>

      </div>

      <p className="mt-1 font-mono text-xs font-bold text-slate-300">
        {time.toFixed(3)}s
      </p>

      <p className="mt-1 font-mono text-[8px] text-slate-600">
        AVG {average.toFixed(3)}s
      </p>

    </div>
  )
}


function Metric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="bg-[#050912] p-5">

      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">
        {label}
      </p>

      <p className="mt-2 font-mono text-lg font-black text-white">
        {value}
      </p>

    </div>
  )
}


function MiniStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">

      <p className="text-[8px] font-bold uppercase tracking-widest text-slate-600">
        {label}
      </p>

      <p className="mt-2 font-mono text-sm font-bold text-slate-200">
        {value}
      </p>

    </div>
  )
}


function DriverCompare({
  driver,
  value,
  delta,
  color,
}: {
  driver: string
  value: number
  delta: string
  color: string
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="font-mono text-xs font-bold text-slate-300">
          {driver}
        </span>

        <span className="font-mono text-[9px] text-slate-600">
          {delta}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-900">

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8 }}
          className="h-full rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />

      </div>

    </div>
  )
}


function Insight({
  icon: Icon,
  priority,
  area,
  message,
  color,
}: {
  icon: LucideIcon
  priority: string
  area: string
  message: string
  color: string
}) {
  return (
    <motion.div
      whileHover={{
        x: 3,
      }}
      className="flex gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3"
    >

      <Icon
        size={17}
        style={{
          color,
        }}
      />

      <div className="min-w-0">

        <div className="flex items-center gap-2">

          <span
            className="text-[8px] font-black uppercase tracking-widest"
            style={{
              color,
            }}
          >
            {priority}
          </span>

          <span className="text-[8px] text-slate-700">
            {area}
          </span>

        </div>

        <p className="mt-1 text-[10px] leading-4 text-slate-400">
          {message}
        </p>

      </div>

    </motion.div>
  )
}


export default Dashboard
import { useEffect, useMemo, useState } from "react"
import {
  Timer,
  Flag,
  Gauge,
  Trophy,
  Activity,
  CircleDot,
  AlertTriangle,
  CheckCircle2,
  Zap,
  TrendingDown,
  Target,
  Radio,
  ChevronDown,
} from "lucide-react"
import { motion } from "framer-motion"

import { useLaps } from "../hooks/useLaps"
import { useDrivers } from "../hooks/useDrivers"

export default function Laps() {
  const [year] = useState(2025)
  const [grandPrix] = useState("Monaco")
  const [driver, setDriver] = useState("VER")
  const [sessionType, setSessionType] = useState("R")
  const [hoveredLapNumber, setHoveredLapNumber] = useState<number | null>(null)

  // ==========================================================
  // DRIVERS
  // ==========================================================

  const {
    drivers,
    loading: driversLoading,
    error: driversError,
  } = useDrivers()

  /*
   * Keep the currently selected driver if it exists.
   * Otherwise automatically select the first driver returned
   * by the backend.
   */
  useEffect(() => {
    if (!drivers.length) return

    const currentDriverExists = drivers.some(
      (item) => item.abbreviation === driver
    )

    if (!currentDriverExists) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDriver(drivers[0].abbreviation)
    }
  }, [drivers, driver])

  const selectedDriver = useMemo(
    () =>
      drivers.find(
        (item) => item.abbreviation === driver
      ) ?? null,
    [drivers, driver]
  )

  const selectedDriverName =
    selectedDriver?.full_name ?? driver

  // ==========================================================
  // LAPS
  // ==========================================================

  const {
    laps,
    loading,
    error,
  } = useLaps({
    year,
    grandPrix,
    driver,
    sessionType,
    limit: 30,
  })

  // ==========================================================
  // VALID LAPS
  // ==========================================================

  const validLaps = useMemo(
    () =>
      laps.filter(
        (lap) =>
          lap.LapTime !== null &&
          !lap.Deleted &&
          lap.IsAccurate
      ),
    [laps]
  )

  // ==========================================================
  // FASTEST LAP
  // ==========================================================

  const fastestLap = useMemo(() => {
    if (!validLaps.length) return null

    return validLaps.reduce((fastest, lap) =>
      fastest.LapTime === null ||
      (lap.LapTime !== null &&
        lap.LapTime < fastest.LapTime)
        ? lap
        : fastest
    )
  }, [validLaps])

  // ==========================================================
  // AVERAGE LAP
  // ==========================================================

  const averageLap = useMemo(() => {
    if (!validLaps.length) return null

    return (
      validLaps.reduce(
        (sum, lap) =>
          sum + (lap.LapTime ?? 0),
        0
      ) / validLaps.length
    )
  }, [validLaps])

  // ==========================================================
  // BEST POSITION
  // ==========================================================

  const bestPosition = useMemo(() => {
    const positions = laps
      .map((lap) => lap.Position)
      .filter(
        (p): p is number =>
          p !== null && p > 0
      )

    return positions.length
      ? Math.min(...positions)
      : null
  }, [laps])

  // ==========================================================
  // TOP SPEED
  // ==========================================================

  const topSpeed = useMemo(() => {
    const speeds = validLaps
      .flatMap((lap) => [
        lap.SpeedFL,
        lap.SpeedST,
      ])
      .filter(
        (s): s is number =>
          s !== null &&
          Number.isFinite(s)
      )

    return speeds.length
      ? Math.max(...speeds)
      : null
  }, [validLaps])

  // ==========================================================
  // BEST SECTORS
  // ==========================================================

  const bestSectors = useMemo(() => {
    const best = (
      values: (number | null)[]
    ) => {
      const valid = values.filter(
        (v): v is number =>
          v !== null &&
          Number.isFinite(v)
      )

      return valid.length
        ? Math.min(...valid)
        : null
    }

    return {
      s1: best(
        validLaps.map(
          (lap) => lap.Sector1Time
        )
      ),
      s2: best(
        validLaps.map(
          (lap) => lap.Sector2Time
        )
      ),
      s3: best(
        validLaps.map(
          (lap) => lap.Sector3Time
        )
      ),
    }
  }, [validLaps])

  // ==========================================================
  // CONSISTENCY
  // ==========================================================

  const consistency = useMemo(() => {
    const times = validLaps
      .map((lap) => lap.LapTime)
      .filter(
        (v): v is number =>
          v !== null &&
          Number.isFinite(v)
      )

    if (times.length < 2) return null

    const mean =
      times.reduce(
        (sum, v) => sum + v,
        0
      ) / times.length

    const variance =
      times.reduce(
        (sum, v) =>
          sum + Math.pow(v - mean, 2),
        0
      ) / times.length

    const sd = Math.sqrt(variance)

    return Math.max(
      0,
      Math.min(
        100,
        100 - (sd / mean) * 1000
      )
    )
  }, [validLaps])

  // ==========================================================
  // PACE CHANGE
  // ==========================================================

  const paceChange = useMemo(() => {
    if (validLaps.length < 4) return null

    const ordered = [...validLaps].sort(
      (a, b) =>
        a.LapNumber - b.LapNumber
    )

    const midpoint = Math.floor(
      ordered.length / 2
    )

    const first = ordered.slice(
      0,
      midpoint
    )

    const second = ordered.slice(
      midpoint
    )

    const avg = (
      group: typeof ordered
    ) =>
      group.length
        ? group.reduce(
            (sum, lap) =>
              sum + (lap.LapTime ?? 0),
            0
          ) / group.length
        : null

    const firstAvg = avg(first)
    const secondAvg = avg(second)

    return firstAvg !== null &&
      secondAvg !== null
      ? secondAvg - firstAvg
      : null
  }, [validLaps])

  // ==========================================================
  // STINTS
  // ==========================================================

  const stints = useMemo(() => {
    const groups = new Map<
      number,
      {
        stint: number
        compound: string
        laps: number
        average: number | null
        tyreLife: number | null
      }
    >()

    validLaps.forEach((lap) => {
      const stint = lap.Stint ?? 0
      const existing = groups.get(stint)

      if (!existing) {
        groups.set(stint, {
          stint,
          compound:
            lap.Compound ?? "UNKNOWN",
          laps: 1,
          average: lap.LapTime,
          tyreLife: lap.TyreLife,
        })
      } else {
        existing.laps += 1

        existing.tyreLife = Math.max(
          existing.tyreLife ?? 0,
          lap.TyreLife ?? 0
        )
      }
    })

    groups.forEach((group) => {
      const stintLaps = validLaps.filter(
        (lap) =>
          (lap.Stint ?? 0) ===
          group.stint
      )

      group.average =
        stintLaps.reduce(
          (sum, lap) =>
            sum + (lap.LapTime ?? 0),
          0
        ) / stintLaps.length
    })

    return Array.from(
      groups.values()
    ).sort(
      (a, b) =>
        a.stint - b.stint
    )
  }, [validLaps])

  // ==========================================================
  // FORMATTERS
  // ==========================================================

  const formatLapTime = (
    seconds: number | null
  ) => {
    if (
      seconds === null ||
      !Number.isFinite(seconds)
    ) {
      return "—"
    }

    const minutes =
      Math.floor(seconds / 60)

    const remaining =
      seconds - minutes * 60

    return `${minutes}:${remaining
      .toFixed(3)
      .padStart(6, "0")}`
  }

  const formatSector = (
    seconds: number | null
  ) =>
    seconds === null ||
    !Number.isFinite(seconds)
      ? "—"
      : seconds.toFixed(3)

  // ==========================================================
  // LAP PROGRESSION
  // ==========================================================

  const progression = useMemo(
    () =>
      [...validLaps].sort(
        (a, b) =>
          a.LapNumber - b.LapNumber
      ),
    [validLaps]
  )

  // ==========================================================
  // CHART DATA
  // ==========================================================

  const chartData = useMemo(() => {
    if (progression.length < 2)
      return null

    const values = progression
      .map((lap) => lap.LapTime)
      .filter(
        (v): v is number =>
          v !== null &&
          Number.isFinite(v) &&
          v > 0
      )

    if (values.length < 2)
      return null

    const rawMin =
      Math.min(...values)

    const rawMax =
      Math.max(...values)

    const range = Math.max(
      rawMax - rawMin,
      0.5
    )

    const min =
      rawMin - range * 0.08

    const max =
      rawMax + range * 0.08

    const width = 1000
    const height = 300

    const paddingLeft = 64
    const paddingRight = 24
    const paddingTop = 28
    const paddingBottom = 44

    const plotWidth =
      width -
      paddingLeft -
      paddingRight

    const plotHeight =
      height -
      paddingTop -
      paddingBottom

    const points =
      progression.map(
        (lap, index) => {
          const value =
            lap.LapTime ??
            rawMax

          const x =
            paddingLeft +
            (index /
              Math.max(
                progression.length - 1,
                1
              )) *
              plotWidth

          const normalized =
            (value - min) /
            Math.max(
              max - min,
              0.001
            )

          const y =
            paddingTop +
            normalized *
              plotHeight

          return {
            x,
            y,
            lap,
            value,
          }
        }
      )

    const average =
      averageLap ?? rawMin

    const averageY =
      paddingTop +
      ((average - min) /
        Math.max(
          max - min,
          0.001
        )) *
        plotHeight

    const fastestIndex =
      progression.findIndex(
        (lap) =>
          lap.LapNumber ===
          fastestLap?.LapNumber
      )

    return {
      points,
      min,
      max,
      averageY,
      fastestPoint:
        fastestIndex >= 0
          ? {
              x: points[
                fastestIndex
              ].x,
              y: points[
                fastestIndex
              ].y,
              lap: points[
                fastestIndex
              ].lap,
            }
          : null,
      width,
      height,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      plotWidth,
      plotHeight,
    }
  }, [
    progression,
    averageLap,
    fastestLap,
  ])

  const chartPoints =
    chartData?.points
      .map(
        (point) =>
          `${point.x},${point.y}`
      )
      .join(" ") ?? ""

  const chartTicks = useMemo(() => {
    if (!chartData?.points.length)
      return []

    const desired = 7

    const step = Math.max(
      1,
      Math.ceil(
        chartData.points.length /
          desired
      )
    )

    return chartData.points
      .filter(
        (_, index) =>
          index % step === 0 ||
          index ===
            chartData.points.length -
              1
      )
      .map((point) => ({
        x: point.x,
        label: String(
          point.lap.LapNumber
        ),
      }))
  }, [chartData])

  const yTicks = useMemo(() => {
    if (!chartData) return []

    const count = 4

    return Array.from(
      { length: count + 1 },
      (_, index) => {
        const ratio =
          index / count

        const value =
          chartData.max -
          ratio *
            (chartData.max -
              chartData.min)

        const y =
          chartData.paddingTop +
          ratio *
            chartData.plotHeight

        return {
          y,
          value,
        }
      }
    )
  }, [chartData])

  const hoveredPoint = useMemo(
    () =>
      hoveredLapNumber === null
        ? null
        : chartData?.points.find(
            (point) =>
              point.lap.LapNumber ===
              hoveredLapNumber
          ) ?? null,
    [
      hoveredLapNumber,
      chartData,
    ]
  )

  const tyreTone: Record<
    string,
    string
  > = {
    SOFT:
      "border-red-400/30 bg-red-400/5 text-red-300",
    MEDIUM:
      "border-yellow-400/30 bg-yellow-400/5 text-yellow-300",
    HARD:
      "border-slate-500/40 bg-slate-400/5 text-slate-300",
    INTERMEDIATE:
      "border-emerald-400/30 bg-emerald-400/5 text-emerald-300",
    WET:
      "border-cyan-400/30 bg-cyan-400/5 text-cyan-300",
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <style>{`
        .lap-hover-card {
          position: relative;
          overflow: hidden;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background-color 180ms ease;
        }

        .lap-hover-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255,255,255,0.035) 43%,
            transparent 63%
          );
          transform: translateX(-120%);
          transition: transform 520ms ease;
        }

        .lap-hover-card:hover {
          transform: translateY(-3px);
          border-color: rgba(71,85,105,0.9);
          box-shadow:
            0 14px 38px rgba(0,0,0,0.28),
            0 0 24px rgba(34,211,238,0.045);
        }

        .lap-hover-card:hover::after {
          transform: translateX(120%);
        }

        .lap-hover-card:focus-within {
          border-color: rgba(34,211,238,0.45);
          box-shadow:
            0 0 0 1px rgba(34,211,238,0.12);
        }

        .lap-metric {
          transition:
            transform 180ms ease,
            filter 180ms ease;
        }

        .lap-hover-card:hover .lap-metric {
          transform: translateX(3px);
          filter: brightness(1.08);
        }

        .lap-table-row {
          transition:
            background-color 160ms ease,
            box-shadow 160ms ease;
        }

        .lap-table-row:hover {
          background-color: rgba(255,255,255,0.035);
          box-shadow:
            inset 3px 0 0
            rgba(34,211,238,0.55);
        }
      `}</style>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="relative overflow-hidden border-b border-slate-800/80 bg-[#020617]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-red-500 via-transparent to-cyan-400" />

        <div className="absolute right-0 top-0 h-24 w-1/3 bg-cyan-400/[0.025] blur-3xl" />

        <div className="relative mx-auto max-w-[1700px] px-6 py-8 lg:px-10">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-red-500" />

                <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-red-400">
                  Lap Analysis
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-400/20 bg-cyan-400/5">
                  <Timer
                    size={20}
                    className="text-cyan-300"
                  />
                </div>

                <div>
                  <h1 className="font-mono text-3xl font-black uppercase tracking-tight text-slate-100 lg:text-4xl">
                    Lap Intelligence
                  </h1>

                  <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    {year} · {grandPrix} Grand Prix ·{" "}
                    {selectedDriverName} ·{" "}
                    {sessionType === "R"
                      ? "Race"
                      : sessionType === "Q"
                        ? "Qualifying"
                        : "Sprint"}
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================================
                CONTROLS
            ================================================== */}

            <div className="flex items-center gap-3">
              <label className="relative">
                <span className="sr-only">
                  Driver
                </span>

                <select
                  value={driver}
                  onChange={(event) =>
                    setDriver(
                      event.target.value
                    )
                  }
                  disabled={
                    driversLoading ||
                    drivers.length === 0
                  }
                  className="appearance-none rounded-lg border border-cyan-400/25 bg-slate-950 px-4 py-3 pr-10 font-mono text-[10px] font-black uppercase tracking-[0.15em] text-slate-200 outline-none transition hover:border-cyan-300/50 focus:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {driversLoading ? (
                    <option value={driver}>
                      LOADING DRIVERS...
                    </option>
                  ) : drivers.length ? (
                    drivers.map(
                      (item) => (
                        <option
                          key={
                            item.abbreviation
                          }
                          value={
                            item.abbreviation
                          }
                        >
                          {item.abbreviation} ·{" "}
                          {item.full_name}
                        </option>
                      )
                    )
                  ) : (
                    <option value={driver}>
                      {driver}
                    </option>
                  )}
                </select>

                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </label>

              <label className="relative">
                <span className="sr-only">
                  Session
                </span>

                <select
                  value={sessionType}
                  onChange={(event) =>
                    setSessionType(
                      event.target.value
                    )
                  }
                  className="appearance-none rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 pr-10 font-mono text-[10px] font-black uppercase tracking-[0.15em] text-slate-200 outline-none transition hover:border-slate-600 focus:border-cyan-300"
                >
                  <option value="R">
                    RACE
                  </option>

                  <option value="Q">
                    QUALIFYING
                  </option>

                  <option value="S">
                    SPRINT
                  </option>
                </select>

                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </label>
            </div>
          </div>

          {/* Driver API status */}
          {driversError && (
            <div className="mt-4 flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-widest text-orange-300">
              <AlertTriangle size={11} />
              Driver selector unavailable — using current selection
            </div>
          )}
        </div>
      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-[1700px] px-6 py-7 lg:px-10">
        {loading && (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({
                length: 3,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-xl border border-slate-800 bg-slate-950"
                />
              ))}
            </div>

            <div className="h-80 animate-pulse rounded-xl border border-slate-800 bg-slate-950" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/[0.04] p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle
                size={16}
                className="text-red-400"
              />

              <p className="font-mono text-[10px] font-black uppercase tracking-widest text-red-300">
                Lap Data Error
              </p>
            </div>

            <p className="mt-3 font-mono text-[10px] leading-6 text-slate-500">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <section className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label:
                    "Fastest Lap",
                  value:
                    formatLapTime(
                      fastestLap?.LapTime ??
                        null
                    ),
                  meta: fastestLap
                    ? `LAP ${fastestLap.LapNumber}`
                    : "NO DATA",
                  icon: Trophy,
                  tone: "cyan",
                },
                {
                  label:
                    "Average Lap",
                  value:
                    formatLapTime(
                      averageLap
                    ),
                  meta: `${validLaps.length} VALID LAPS`,
                  icon: Activity,
                  tone: "orange",
                },
                {
                  label:
                    "Best Position",
                  value:
                    bestPosition
                      ? `P${bestPosition}`
                      : "—",
                  meta: `${laps.length} LAPS LOADED`,
                  icon: Flag,
                  tone: "emerald",
                },
              ].map(
                (card, index) => {
                  const Icon =
                    card.icon

                  const tone =
                    card.tone ===
                    "cyan"
                      ? {
                          border:
                            "border-cyan-400/25",
                          bg:
                            "bg-cyan-400/[0.035]",
                          text:
                            "text-cyan-300",
                          line:
                            "bg-cyan-400",
                        }
                      : card.tone ===
                          "orange"
                        ? {
                            border:
                              "border-orange-400/25",
                            bg:
                              "bg-orange-400/[0.035]",
                            text:
                              "text-orange-300",
                            line:
                              "bg-orange-400",
                          }
                        : {
                            border:
                              "border-emerald-400/25",
                            bg:
                              "bg-emerald-400/[0.035]",
                            text:
                              "text-emerald-300",
                            line:
                              "bg-emerald-400",
                          }

                  return (
                    <motion.div
                      key={card.label}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index *
                          0.06,
                      }}
                      className={`lap-hover-card relative overflow-hidden rounded-xl border ${tone.border} ${tone.bg} p-6`}
                    >
                      <div
                        className={`absolute left-0 top-0 h-full w-[2px] ${tone.line}`}
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon
                            size={16}
                            className={
                              tone.text
                            }
                          />

                          <span className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">
                            {card.label}
                          </span>
                        </div>

                        <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-slate-600">
                          LIVE
                        </span>
                      </div>

                      <p
                        className={`mt-5 font-mono text-4xl font-black ${tone.text}`}
                      >
                        {card.value}
                      </p>

                      <p className="mt-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        {card.meta}
                      </p>
                    </motion.div>
                  )
                }
              )}
            </section>

            {/* ==================================================
                LAP CHART
            ================================================== */}

            <section className="lap-hover-card mt-5 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-950/70 shadow-[0_0_40px_rgba(0,0,0,0.15)]">
              <div className="flex flex-col gap-4 border-b border-slate-800/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-md border border-cyan-400/20 bg-cyan-400/5">
                    <Gauge
                      size={15}
                      className="text-cyan-300"
                    />
                  </div>

                  <div>
                    <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-slate-200">
                      Lap Time Progression
                    </h2>

                    <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Lower is faster · telemetry by lap
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono text-[8px] font-bold uppercase tracking-widest">
                  <span className="text-cyan-300">
                    {progression.length} SAMPLES
                  </span>

                  <span className="h-3 w-px bg-slate-800" />

                  <span className="text-slate-500">
                    FASTEST L
                    {fastestLap?.LapNumber ??
                      "—"}
                  </span>
                </div>
              </div>

              <div className="p-5 lg:p-7">
                {chartData ? (
                  <div className="overflow-x-auto">
                    <svg
                      viewBox={`0 0 ${chartData.width} ${chartData.height}`}
                      className="h-[320px] min-w-[850px] w-full"
                      preserveAspectRatio="none"
                    >
                      {yTicks.map(
                        (tick) => (
                          <g
                            key={
                              tick.y
                            }
                          >
                            <line
                              x1={
                                chartData.paddingLeft
                              }
                              y1={
                                tick.y
                              }
                              x2={
                                chartData.width -
                                chartData.paddingRight
                              }
                              y2={
                                tick.y
                              }
                              stroke="rgba(71,85,105,0.20)"
                              strokeDasharray="3 8"
                            />

                            <text
                              x="5"
                              y={
                                tick.y +
                                3
                              }
                              fill="rgba(148,163,184,0.62)"
                              fontSize="10"
                              fontWeight="700"
                              fontFamily="monospace"
                            >
                              {formatLapTime(
                                tick.value
                              )}
                            </text>
                          </g>
                        )
                      )}

                      <line
                        x1={
                          chartData.paddingLeft
                        }
                        y1={
                          chartData.height -
                          chartData.paddingBottom
                        }
                        x2={
                          chartData.width -
                          chartData.paddingRight
                        }
                        y2={
                          chartData.height -
                          chartData.paddingBottom
                        }
                        stroke="rgba(71,85,105,0.40)"
                      />

                      {chartTicks.map(
                        (tick) => (
                          <g
                            key={`${tick.x}-${tick.label}`}
                          >
                            <line
                              x1={
                                tick.x
                              }
                              y1={
                                chartData.height -
                                chartData.paddingBottom
                              }
                              x2={
                                tick.x
                              }
                              y2={
                                chartData.height -
                                chartData.paddingBottom +
                                5
                              }
                              stroke="rgba(148,163,184,0.45)"
                            />

                            <text
                              x={
                                tick.x
                              }
                              y={
                                chartData.height -
                                12
                              }
                              textAnchor="middle"
                              fill="rgba(148,163,184,0.70)"
                              fontSize="10"
                              fontWeight="700"
                              fontFamily="monospace"
                            >
                              L
                              {
                                tick.label
                              }
                            </text>
                          </g>
                        )
                      )}

                      {chartData.averageY !==
                        null && (
                        <g>
                          <line
                            x1={
                              chartData.paddingLeft
                            }
                            y1={
                              chartData.averageY
                            }
                            x2={
                              chartData.width -
                              chartData.paddingRight
                            }
                            y2={
                              chartData.averageY
                            }
                            stroke="#f59e0b"
                            strokeWidth="1.5"
                            strokeDasharray="7 6"
                            opacity="0.75"
                          />

                          <rect
                            x={
                              chartData.width -
                              90
                            }
                            y={
                              chartData.averageY -
                              13
                            }
                            width="66"
                            height="20"
                            rx="4"
                            fill="#020617"
                            stroke="rgba(245,158,11,0.35)"
                          />

                          <text
                            x={
                              chartData.width -
                              57
                            }
                            y={
                              chartData.averageY +
                              1
                            }
                            textAnchor="middle"
                            fill="#f59e0b"
                            fontSize="9"
                            fontWeight="800"
                            fontFamily="monospace"
                          >
                            AVG
                          </text>
                        </g>
                      )}

                      <polyline
                        points={
                          chartPoints
                        }
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {chartData.points.map(
                        (point) => {
                          const isFastest =
                            point.lap
                              .LapNumber ===
                            fastestLap?.LapNumber

                          const isHovered =
                            point.lap
                              .LapNumber ===
                            hoveredLapNumber

                          return (
                            <g
                              key={
                                point
                                  .lap
                                  .LapNumber
                              }
                              onMouseEnter={() =>
                                setHoveredLapNumber(
                                  point
                                    .lap
                                    .LapNumber
                                )
                              }
                              onMouseLeave={() =>
                                setHoveredLapNumber(
                                  null
                                )
                              }
                              className="cursor-crosshair"
                            >
                              <circle
                                cx={
                                  point.x
                                }
                                cy={
                                  point.y
                                }
                                r="13"
                                fill="transparent"
                              />

                              <circle
                                cx={
                                  point.x
                                }
                                cy={
                                  point.y
                                }
                                r={
                                  isFastest ||
                                  isHovered
                                    ? 5
                                    : 2.5
                                }
                                fill="#22d3ee"
                                stroke="#020617"
                                strokeWidth="2"
                              />

                              {isFastest && (
                                <circle
                                  cx={
                                    point.x
                                  }
                                  cy={
                                    point.y
                                  }
                                  r="10"
                                  fill="none"
                                  stroke="#22d3ee"
                                  strokeWidth="1.5"
                                  opacity="0.5"
                                />
                              )}
                            </g>
                          )
                        }
                      )}

                      {chartData.fastestPoint && (
                        <g pointerEvents="none">
                          <line
                            x1={
                              chartData.fastestPoint.x
                            }
                            y1={
                              chartData.fastestPoint.y -
                              9
                            }
                            x2={
                              chartData.fastestPoint.x
                            }
                            y2={
                              chartData.fastestPoint.y -
                              30
                            }
                            stroke="#22d3ee"
                            strokeWidth="1"
                          />

                          <rect
                            x={Math.max(
                              6,
                              Math.min(
                                chartData.fastestPoint.x -
                                  46,
                                chartData.width -
                                  chartData.paddingRight -
                                  92
                              )
                            )}
                            y={Math.max(
                              4,
                              chartData.fastestPoint.y -
                                53
                            )}
                            width="92"
                            height="22"
                            rx="5"
                            fill="#020617"
                            stroke="rgba(34,211,238,0.4)"
                          />

                          <text
                            x={
                              Math.max(
                                6,
                                Math.min(
                                  chartData.fastestPoint.x -
                                    46,
                                  chartData.width -
                                    chartData.paddingRight -
                                    92
                                )
                              ) + 46
                            }
                            y={
                              Math.max(
                                4,
                                chartData.fastestPoint.y -
                                  53
                              ) + 15
                            }
                            textAnchor="middle"
                            fill="#22d3ee"
                            fontSize="8"
                            fontWeight="900"
                            fontFamily="monospace"
                          >
                            FASTEST · L
                            {
                              chartData
                                .fastestPoint
                                .lap
                                .LapNumber
                            }
                          </text>
                        </g>
                      )}

                      {hoveredPoint && (
                        <g pointerEvents="none">
                          {(() => {
                            const tooltipWidth = 190
                            const tooltipHeight = 64

                            const tooltipX =
                              Math.max(
                                8,
                                Math.min(
                                  hoveredPoint.x +
                                    14,
                                  chartData.width -
                                    chartData.paddingRight -
                                    tooltipWidth
                                )
                              )

                            const tooltipY =
                              Math.max(
                                chartData.paddingTop,
                                Math.min(
                                  hoveredPoint.y -
                                    70,
                                  chartData.height -
                                    chartData.paddingBottom -
                                    tooltipHeight
                                )
                              )

                            return (
                              <>
                                <rect
                                  x={
                                    tooltipX
                                  }
                                  y={
                                    tooltipY
                                  }
                                  width={
                                    tooltipWidth
                                  }
                                  height={
                                    tooltipHeight
                                  }
                                  rx="6"
                                  fill="#020617"
                                  stroke="rgba(34,211,238,0.35)"
                                />

                                <text
                                  x={
                                    tooltipX +
                                    12
                                  }
                                  y={
                                    tooltipY +
                                    18
                                  }
                                  fill="#e2e8f0"
                                  fontSize="9"
                                  fontWeight="900"
                                  fontFamily="monospace"
                                >
                                  LAP{" "}
                                  {
                                    hoveredPoint
                                      .lap
                                      .LapNumber
                                  }
                                </text>

                                <text
                                  x={
                                    tooltipX +
                                    12
                                  }
                                  y={
                                    tooltipY +
                                    35
                                  }
                                  fill="#22d3ee"
                                  fontSize="10"
                                  fontWeight="900"
                                  fontFamily="monospace"
                                >
                                  {formatLapTime(
                                    hoveredPoint
                                      .lap
                                      .LapTime
                                  )}
                                </text>

                                <text
                                  x={
                                    tooltipX +
                                    88
                                  }
                                  y={
                                    tooltipY +
                                    35
                                  }
                                  fill="#94a3b8"
                                  fontSize="8"
                                  fontWeight="700"
                                  fontFamily="monospace"
                                >
                                  {
                                    hoveredPoint
                                      .lap
                                      .Compound ??
                                    "—"
                                  }
                                </text>

                                <text
                                  x={
                                    tooltipX +
                                    12
                                  }
                                  y={
                                    tooltipY +
                                    52
                                  }
                                  fill="#64748b"
                                  fontSize="7"
                                  fontWeight="700"
                                  fontFamily="monospace"
                                >
                                  S1{" "}
                                  {formatSector(
                                    hoveredPoint
                                      .lap
                                      .Sector1Time
                                  )}{" "}
                                  · S2{" "}
                                  {formatSector(
                                    hoveredPoint
                                      .lap
                                      .Sector2Time
                                  )}{" "}
                                  · S3{" "}
                                  {formatSector(
                                    hoveredPoint
                                      .lap
                                      .Sector3Time
                                  )}
                                </text>
                              </>
                            )
                          })()}
                        </g>
                      )}
                    </svg>
                  </div>
                ) : (
                  <div className="flex h-[260px] items-center justify-center">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Insufficient lap data
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-5 border-t border-slate-800/80 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />

                  <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-slate-400">
                    Lap pace
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-px w-6 border-t border-dashed border-orange-400" />

                  <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-slate-400">
                    Average
                  </span>
                </div>

                <span className="ml-auto font-mono text-[8px] font-bold uppercase tracking-widest text-slate-500">
                  Hover a point for telemetry
                </span>
              </div>
            </section>

            {/* ==================================================
                STINT + ENGINEERING INSIGHTS
            ================================================== */}

            <section className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
              <section className="lap-hover-card overflow-hidden rounded-xl border border-slate-800/90 bg-slate-950/70">
                <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-md border border-orange-400/20 bg-orange-400/5">
                      <CircleDot
                        size={15}
                        className="text-orange-300"
                      />
                    </div>

                    <div>
                      <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-slate-200">
                        Stint Analysis
                      </h2>

                      <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-widest text-slate-500">
                        Tyre usage · race pace
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-slate-500">
                    {stints.length} STINTS
                  </span>
                </div>

                <div className="space-y-3 p-5">
                  {stints.length ===
                  0 ? (
                    <div className="flex min-h-[180px] items-center justify-center">
                      <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500">
                        No stint data available
                      </p>
                    </div>
                  ) : (
                    stints.map(
                      (stint) => {
                        const compound =
                          stint.compound.toUpperCase()

                        const compoundTone =
                          compound ===
                          "SOFT"
                            ? {
                                text: "text-red-300",
                                border:
                                  "border-red-400/30",
                                bg:
                                  "bg-red-400/[0.06]",
                                bar:
                                  "bg-red-400",
                              }
                            : compound ===
                                "MEDIUM"
                              ? {
                                  text: "text-yellow-300",
                                  border:
                                    "border-yellow-400/30",
                                  bg:
                                    "bg-yellow-400/[0.06]",
                                  bar:
                                    "bg-yellow-400",
                                }
                              : compound ===
                                  "HARD"
                                ? {
                                    text: "text-slate-200",
                                    border:
                                      "border-slate-500/40",
                                    bg:
                                      "bg-slate-400/[0.06]",
                                    bar:
                                      "bg-slate-300",
                                  }
                                : {
                                    text: "text-cyan-300",
                                    border:
                                      "border-cyan-400/30",
                                    bg:
                                      "bg-cyan-400/[0.06]",
                                    bar:
                                      "bg-cyan-400",
                                  }

                        const paceDelta =
                          stint.average !==
                            null &&
                          averageLap !==
                            null
                            ? stint.average -
                              averageLap
                            : null

                        const stintAverages =
                          stints
                            .map(
                              (item) =>
                                item.average
                            )
                            .filter(
                              (
                                value
                              ): value is number =>
                                value !==
                                null
                            )

                        const minStintTime =
                          stintAverages.length
                            ? Math.min(
                                ...stintAverages
                              )
                            : null

                        const maxStintTime =
                          stintAverages.length
                            ? Math.max(
                                ...stintAverages
                              )
                            : null

                        const paceWidth =
                          stint.average ===
                            null ||
                          minStintTime ===
                            null ||
                          maxStintTime ===
                            null ||
                          maxStintTime ===
                            minStintTime
                            ? 50
                            : 25 +
                              ((maxStintTime -
                                stint.average) /
                                (maxStintTime -
                                  minStintTime)) *
                                75

                        return (
                          <motion.div
                            key={
                              stint.stint
                            }
                            whileHover={{
                              y: -3,
                            }}
                            className="lap-hover-card rounded-lg border border-slate-800 bg-[#030a18] p-4"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`grid h-10 w-10 place-items-center rounded-md border ${compoundTone.border} ${compoundTone.bg} font-mono text-[10px] font-black ${compoundTone.text}`}
                                >
                                  {
                                    stint.stint
                                  }
                                </div>

                                <div>
                                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                    STINT{" "}
                                    {
                                      stint.stint
                                    }
                                  </p>

                                  <div className="mt-1 flex items-center gap-2">
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${compoundTone.bar}`}
                                    />

                                    <p
                                      className={`font-mono text-sm font-black uppercase ${compoundTone.text}`}
                                    >
                                      {
                                        stint.compound
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="lap-metric font-mono text-xl font-black text-orange-300">
                                  {formatLapTime(
                                    stint.average
                                  )}
                                </p>

                                <p className="font-mono text-[7px] font-bold uppercase tracking-widest text-slate-500">
                                  AVG LAP
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-4">
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-[7px] font-bold uppercase tracking-widest text-slate-500">
                                    LAPS
                                  </span>

                                  <span className="font-mono text-[9px] font-black text-cyan-300">
                                    {
                                      stint.laps
                                    }
                                  </span>
                                </div>

                                <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-900">
                                  <div
                                    className="h-full rounded-full bg-cyan-400"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.max(
                                          8,
                                          stint.laps *
                                            4
                                        )
                                      )}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-[7px] font-bold uppercase tracking-widest text-slate-500">
                                    TYRE LIFE
                                  </span>

                                  <span className="font-mono text-[9px] font-black text-amber-300">
                                    {
                                      stint.tyreLife ??
                                      "—"
                                    }
                                  </span>
                                </div>

                                <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-900">
                                  <div
                                    className={`h-full rounded-full ${compoundTone.bar}`}
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.max(
                                          8,
                                          (stint.tyreLife ??
                                            0) *
                                            4
                                        )
                                      )}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 rounded-md border border-slate-800/80 bg-slate-950/70 p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <TrendingDown
                                    size={11}
                                    className="text-orange-300"
                                  />

                                  <span className="font-mono text-[7px] font-bold uppercase tracking-widest text-slate-500">
                                    PACE VS SESSION AVG
                                  </span>
                                </div>

                                <span
                                  className={`font-mono text-[9px] font-black ${
                                    paceDelta ===
                                    null
                                      ? "text-slate-500"
                                      : paceDelta <=
                                          0
                                        ? "text-emerald-300"
                                        : "text-orange-300"
                                  }`}
                                >
                                  {paceDelta ===
                                  null
                                    ? "—"
                                    : `${
                                        paceDelta >
                                        0
                                          ? "+"
                                          : ""
                                      }${paceDelta.toFixed(
                                        3
                                      )}s`}
                                </span>
                              </div>

                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-900">
                                <div
                                  className={`h-full rounded-full ${
                                    paceDelta !==
                                      null &&
                                    paceDelta <=
                                      0
                                      ? "bg-emerald-400"
                                      : "bg-orange-400"
                                  }`}
                                  style={{
                                    width: `${paceWidth}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )
                      }
                    )
                  )}
                </div>
              </section>

              {/* ==================================================
                  ENGINEERING INSIGHTS
              ================================================== */}

              <section className="lap-hover-card overflow-hidden rounded-xl border border-slate-800/90 bg-slate-950/70">
                <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-5">
                  <div className="grid h-8 w-8 place-items-center rounded-md border border-cyan-400/20 bg-cyan-400/5">
                    <Target
                      size={15}
                      className="text-cyan-300"
                    />
                  </div>

                  <div>
                    <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-slate-200">
                      Engineering Insights
                    </h2>

                    <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-widest text-slate-500">
                      Performance indicators
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-2">
                  {[
                    {
                      label:
                        "Best Sectors",
                      icon: Gauge,
                      value: (
                        <div className="space-y-2">
                          {[
                            [
                              "S1",
                              bestSectors.s1,
                            ],
                            [
                              "S2",
                              bestSectors.s2,
                            ],
                            [
                              "S3",
                              bestSectors.s3,
                            ],
                          ].map(
                            ([
                              name,
                              value,
                            ]) => (
                              <div
                                key={
                                  name as string
                                }
                                className="flex justify-between"
                              >
                                <span className="font-mono text-[9px] font-bold text-slate-500">
                                  {
                                    name
                                  }
                                </span>

                                <span className="font-mono text-[10px] font-black text-cyan-300">
                                  {formatSector(
                                    value as
                                      | number
                                      | null
                                  )}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ),
                      className:
                        "border-cyan-400/15 bg-cyan-400/[0.025]",
                      iconClass:
                        "text-cyan-300",
                    },
                    {
                      label:
                        "Consistency",
                      icon: Activity,
                      value: (
                        <>
                          <p className="font-mono text-3xl font-black text-emerald-300">
                            {consistency !==
                            null
                              ? `${consistency.toFixed(
                                  1
                                )}%`
                              : "—"}
                          </p>

                          <p className="mt-1 font-mono text-[7px] font-bold uppercase tracking-widest text-slate-500">
                            LAP PACE STABILITY
                          </p>
                        </>
                      ),
                      className:
                        "border-emerald-400/15 bg-emerald-400/[0.025]",
                      iconClass:
                        "text-emerald-300",
                    },
                    {
                      label:
                        "Pace Change",
                      icon: TrendingDown,
                      value: (
                        <>
                          <p className="font-mono text-3xl font-black text-orange-300">
                            {paceChange !==
                            null
                              ? `${
                                  paceChange >=
                                  0
                                    ? "+"
                                    : ""
                                }${paceChange.toFixed(
                                  3
                                )}s`
                              : "—"}
                          </p>

                          <p className="mt-1 font-mono text-[7px] font-bold uppercase tracking-widest text-slate-500">
                            SECOND HALF VS FIRST
                          </p>
                        </>
                      ),
                      className:
                        "border-orange-400/15 bg-orange-400/[0.025]",
                      iconClass:
                        "text-orange-300",
                    },
                    {
                      label:
                        "Speed Trap",
                      icon: Zap,
                      value: (
                        <>
                          <p className="font-mono text-3xl font-black text-red-300">
                            {topSpeed !==
                            null
                              ? topSpeed.toFixed(
                                  0
                                )
                              : "—"}

                            {topSpeed !==
                              null && (
                              <span className="ml-2 text-base">
                                KM/H
                              </span>
                            )}
                          </p>

                          <p className="mt-1 font-mono text-[7px] font-bold uppercase tracking-widest text-slate-500">
                            MAXIMUM RECORDED
                          </p>
                        </>
                      ),
                      className:
                        "border-red-400/15 bg-red-400/[0.025]",
                      iconClass:
                        "text-red-300",
                    },
                  ].map(
                    (item) => {
                      const Icon =
                        item.icon

                      return (
                        <div
                          key={
                            item.label
                          }
                          className={`lap-hover-card min-h-[150px] rounded-lg border p-5 ${item.className}`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              size={14}
                              className={
                                item.iconClass
                              }
                            />

                            <span className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-slate-500">
                              {
                                item.label
                              }
                            </span>
                          </div>

                          <div className="lap-metric mt-5">
                            {
                              item.value
                            }
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>
              </section>
            </section>

            {/* ==================================================
                TELEMETRY TABLE
            ================================================== */}

            <section className="lap-hover-card mt-5 overflow-hidden rounded-xl border border-slate-800/90 bg-slate-950/70">
              <div className="flex flex-col gap-3 border-b border-slate-800/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-md border border-orange-400/20 bg-orange-400/5">
                    <Radio
                      size={15}
                      className="text-orange-300"
                    />
                  </div>

                  <div>
                    <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-slate-200">
                      Lap Telemetry
                    </h2>

                    <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-widest text-slate-500">
                      Detailed lap-by-lap analysis
                    </p>
                  </div>
                </div>

                <span className="font-mono text-[8px] font-black uppercase tracking-widest text-slate-500">
                  {laps.length} SHOWN ·{" "}
                  {driver}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80">
                      {[
                        "LAP",
                        "TIME",
                        "S1",
                        "S2",
                        "S3",
                        "TYRE",
                        "LIFE",
                        "STINT",
                        "POS",
                        "STATUS",
                      ].map(
                        (heading) => (
                          <th
                            key={
                              heading
                            }
                            className="px-5 py-4 text-left font-mono text-[8px] font-black uppercase tracking-[0.18em] text-slate-400"
                          >
                            {
                              heading
                            }
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {laps.map(
                      (lap) => {
                        const isFastest =
                          fastestLap?.LapNumber ===
                          lap.LapNumber

                        const compound =
                          lap.Compound?.toUpperCase() ??
                          "—"

                        return (
                          <tr
                            key={
                              lap.LapNumber
                            }
                            className={`lap-table-row group relative border-b border-slate-800/70 ${
                              isFastest
                                ? "bg-gradient-to-r from-cyan-400/[0.15] via-cyan-400/[0.045] to-transparent shadow-[inset_0_1px_0_rgba(34,211,238,0.18),inset_0_-1px_0_rgba(34,211,238,0.12)]"
                                : ""
                            }`}
                          >
                            <td className="relative px-5 py-4">
                              {isFastest && (
                                <span className="absolute inset-y-0 left-0 w-[3px] bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                              )}

                              <div className="flex items-center gap-3">
                                {isFastest ? (
                                  <span className="relative flex h-5 w-5 items-center justify-center rounded-full border border-cyan-300/60 bg-cyan-300/10 shadow-[0_0_14px_rgba(34,211,238,0.28)]">
                                    <Trophy
                                      size={9}
                                      className="text-cyan-200"
                                    />
                                  </span>
                                ) : (
                                  <span className="h-2 w-2 rounded-full bg-slate-700 transition group-hover:bg-slate-500" />
                                )}

                                <div className="flex items-center gap-2">
                                  <span
                                    className={`font-mono text-[10px] font-black ${
                                      isFastest
                                        ? "text-cyan-100"
                                        : "text-slate-200"
                                    }`}
                                  >
                                    {
                                      lap.LapNumber
                                    }
                                  </span>

                                  {isFastest && (
                                    <span className="rounded border border-cyan-300/30 bg-cyan-300/10 px-1.5 py-0.5 font-mono text-[6px] font-black uppercase tracking-[0.16em] text-cyan-200">
                                      Fastest
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`font-mono text-[10px] font-black ${
                                  isFastest
                                    ? "text-cyan-200"
                                    : "text-cyan-300"
                                }`}
                              >
                                {formatLapTime(
                                  lap.LapTime
                                )}
                              </span>
                            </td>

                            {[
                              lap.Sector1Time,
                              lap.Sector2Time,
                              lap.Sector3Time,
                            ].map(
                              (
                                sector,
                                index
                              ) => (
                                <td
                                  key={
                                    index
                                  }
                                  className={`px-5 py-4 font-mono text-[10px] font-bold ${
                                    index ===
                                    0
                                      ? "text-blue-300"
                                      : index ===
                                          1
                                        ? "text-violet-300"
                                        : "text-orange-300"
                                  }`}
                                >
                                  {formatSector(
                                    sector
                                  )}
                                </td>
                              )
                            )}

                            <td className="px-5 py-4">
                              <span
                                className={`rounded-md border px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-widest ${
                                  tyreTone[
                                    compound
                                  ] ??
                                  "border-slate-700 bg-slate-900 text-slate-300"
                                }`}
                              >
                                {
                                  compound
                                }
                              </span>
                            </td>

                            <td className="px-5 py-4 font-mono text-[10px] font-bold text-slate-400">
                              {lap.TyreLife ??
                                "—"}
                            </td>

                            <td className="px-5 py-4 font-mono text-[10px] font-bold text-slate-400">
                              {lap.Stint ??
                                "—"}
                            </td>

                            <td className="px-5 py-4 font-mono text-[10px] font-black text-slate-300">
                              {lap.Position
                                ? `P${lap.Position}`
                                : "—"}
                            </td>

                            <td className="px-5 py-4">
                              {lap.Deleted ? (
                                <span className="flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-widest text-red-300">
                                  <AlertTriangle
                                    size={11}
                                  />
                                  Deleted
                                </span>
                              ) : lap.IsAccurate ? (
                                <span className="flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-widest text-emerald-300">
                                  <CheckCircle2
                                    size={11}
                                  />
                                  Valid
                                </span>
                              ) : (
                                <span className="font-mono text-[8px] font-black uppercase tracking-widest text-orange-300">
                                  Incomplete
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

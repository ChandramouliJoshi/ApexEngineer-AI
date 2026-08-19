import { useMemo, useState } from "react"
import {
  Activity,
  Gauge,
  Zap,
  TrendingDown,
  Trophy,
  BarChart3,
  AlertCircle,
  RefreshCw,
  Timer,
  Target,
  ArrowUpRight,
  Flag,
} from "lucide-react"

import { useSectors } from "../hooks/useSectors"

const drivers = [
  { code: "PIA", name: "Oscar Piastri" },
  { code: "NOR", name: "Lando Norris" },
  { code: "VER", name: "Max Verstappen" },
  { code: "LEC", name: "Charles Leclerc" },
  { code: "HAM", name: "Lewis Hamilton" },
]

const sessions = [
  { value: "R", label: "Race" },
  { value: "Q", label: "Qualifying" },
  { value: "FP1", label: "Practice 1" },
  { value: "FP2", label: "Practice 2" },
  { value: "FP3", label: "Practice 3" },
]

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "--"
  }

  return `${value.toFixed(3)}s`
}

function getGap(
  fastest: number,
  average: number
) {
  if (!fastest || !average) {
    return 0
  }

  return Math.max(0, average - fastest)
}

function getPerformance(
  fastest: number,
  average: number
) {
  const gap = getGap(fastest, average)

  if (!gap) {
    return 100
  }

  return Math.min(
    100,
    Math.max(
      12,
      100 - gap * 35
    )
  )
}

export default function Sectors() {

  const [year, setYear] = useState(2025)
  const [grandPrix, setGrandPrix] =
    useState("Monaco")
  const [driver, setDriver] =
    useState("PIA")
  const [sessionType, setSessionType] =
    useState("R")

  const {
    data,
    loading,
    error,
  } = useSectors({
    year,
    grandPrix,
    driver,
    sessionType,
  })

  const sectors = useMemo(() => {

    if (!data) {
      return []
    }

    return [
      {
        id: "S1",
        label: "SECTOR 1",
        fastest: data.sector1.fastest,
        average: data.sector1.average,
        accent: "cyan",
        icon: Gauge,
        description:
          "INITIAL TRACK COMPLEX",
      },
      {
        id: "S2",
        label: "SECTOR 2",
        fastest: data.sector2.fastest,
        average: data.sector2.average,
        accent: "orange",
        icon: Activity,
        description:
          "TECHNICAL MID-SECTOR",
      },
      {
        id: "S3",
        label: "SECTOR 3",
        fastest: data.sector3.fastest,
        average: data.sector3.average,
        accent: "green",
        icon: Zap,
        description:
          "FINAL CORNER SEQUENCE",
      },
    ]

  }, [data])

  const totalFastest = useMemo(() => {

    if (!data) {
      return 0
    }

    return (
      data.sector1.fastest +
      data.sector2.fastest +
      data.sector3.fastest
    )

  }, [data])

  const totalAverage = useMemo(() => {

    if (!data) {
      return 0
    }

    return (
      data.sector1.average +
      data.sector2.average +
      data.sector3.average
    )

  }, [data])

  const overallGap =
    totalAverage > 0 &&
    totalFastest > 0
      ? totalAverage - totalFastest
      : 0

  const bestSector = useMemo(() => {

    if (!sectors.length) {
      return null
    }

    return sectors.reduce(
      (best, current) =>
        current.fastest < best.fastest
          ? current
          : best
    )

  }, [sectors])

  const weakestSector = useMemo(() => {

    if (!sectors.length) {
      return null
    }

    return sectors.reduce(
      (worst, current) =>
        getGap(
          current.fastest,
          current.average
        ) >
        getGap(
          worst.fastest,
          worst.average
        )
          ? current
          : worst
    )

  }, [sectors])

  const sortedSectors = useMemo(() => {

    return [...sectors].sort(
      (a, b) =>
        a.fastest - b.fastest
    )

  }, [sectors])

  return (
    <main className="min-h-screen bg-[#030508] text-slate-100">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-slate-800/70">

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-cyan-400 via-cyan-400/40 to-transparent" />

          <div className="absolute right-0 top-0 h-px w-1/3 bg-gradient-to-l from-red-500 via-red-500/30 to-transparent" />

          <div className="absolute left-[18%] top-1/2 h-40 w-40 rounded-full bg-cyan-400/[0.025] blur-3xl" />

          <div className="absolute right-[15%] top-1/3 h-40 w-40 rounded-full bg-orange-400/[0.02] blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-[1500px] px-8 py-12">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/5 shadow-[0_0_25px_rgba(34,211,238,0.05)]">

                  <BarChart3
                    size={18}
                    className="text-cyan-400"
                  />

                </div>

                <div>

                  <p className="font-mono text-[10px] font-bold tracking-[0.32em] text-cyan-400">
                    APEXENGINEER AI
                  </p>

                  <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-slate-600">
                    PERFORMANCE ANALYSIS SYSTEM
                  </p>

                </div>

              </div>

              <h1 className="font-mono text-4xl font-black tracking-tight text-white md:text-5xl">
                SECTOR INTELLIGENCE
              </h1>

              <p className="mt-3 font-mono text-[11px] font-semibold tracking-[0.22em] text-slate-500">
                TRACK SEGMENT PERFORMANCE · PACE ANALYSIS · ENGINEERING DATA
              </p>

            </div>

            <div className="grid grid-cols-3 gap-8">

              <div>

                <p className="font-mono text-[9px] font-bold tracking-[0.22em] text-slate-600">
                  DRIVER
                </p>

                <p className="mt-2 font-mono text-xl font-black text-cyan-400">
                  {driver}
                </p>

              </div>

              <div className="border-l border-slate-800 pl-8">

                <p className="font-mono text-[9px] font-bold tracking-[0.22em] text-slate-600">
                  SESSION
                </p>

                <p className="mt-2 font-mono text-xl font-black text-orange-400">
                  {sessionType}
                </p>

              </div>

              <div className="border-l border-slate-800 pl-8">

                <p className="font-mono text-[9px] font-bold tracking-[0.22em] text-slate-600">
                  YEAR
                </p>

                <p className="mt-2 font-mono text-xl font-black text-white">
                  {year}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      <div className="mx-auto max-w-[1500px] px-8 py-8">

        {/* =====================================================
            PARAMETERS
        ====================================================== */}

        <section className="group relative mb-8 overflow-hidden rounded-2xl border border-slate-800/80 bg-[#050914]/80 p-6 shadow-2xl shadow-black/20 transition hover:border-slate-700">

          <div className="absolute left-0 top-0 h-px w-32 bg-gradient-to-r from-cyan-400 to-transparent opacity-70" />

          <div className="mb-6 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]" />

              <h2 className="font-mono text-xs font-black tracking-[0.25em] text-white">
                ANALYSIS PARAMETERS
              </h2>

            </div>

            <div className="hidden items-center gap-2 md:flex">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

              <span className="font-mono text-[8px] font-bold tracking-[0.18em] text-slate-600">
                LIVE QUERY
              </span>

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            <label className="group/control">

              <span className="mb-2 block font-mono text-[9px] font-bold tracking-[0.2em] text-slate-500">
                SEASON
              </span>

              <select
                value={year}
                onChange={(event) =>
                  setYear(
                    Number(
                      event.target.value
                    )
                  )
                }
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#030711] px-4 py-3 font-mono text-xs font-bold text-slate-200 outline-none transition hover:border-cyan-400/40 hover:bg-slate-950 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.05)]"
              >
                <option value={2025}>
                  2025
                </option>
                <option value={2024}>
                  2024
                </option>
                <option value={2023}>
                  2023
                </option>
              </select>

            </label>

            <label>

              <span className="mb-2 block font-mono text-[9px] font-bold tracking-[0.2em] text-slate-500">
                GRAND PRIX
              </span>

              <select
                value={grandPrix}
                onChange={(event) =>
                  setGrandPrix(
                    event.target.value
                  )
                }
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#030711] px-4 py-3 font-mono text-xs font-bold text-slate-200 outline-none transition hover:border-cyan-400/40 hover:bg-slate-950 focus:border-cyan-400"
              >
                <option value="Monaco">
                  Monaco
                </option>
                <option value="Italy">
                  Italy
                </option>
                <option value="Spain">
                  Spain
                </option>
                <option value="Silverstone">
                  Great Britain
                </option>
              </select>

            </label>

            <label>

              <span className="mb-2 block font-mono text-[9px] font-bold tracking-[0.2em] text-slate-500">
                DRIVER
              </span>

              <select
                value={driver}
                onChange={(event) =>
                  setDriver(
                    event.target.value
                  )
                }
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#030711] px-4 py-3 font-mono text-xs font-bold text-slate-200 outline-none transition hover:border-cyan-400/40 hover:bg-slate-950 focus:border-cyan-400"
              >
                {drivers.map((item) => (
                  <option
                    key={item.code}
                    value={item.code}
                  >
                    {item.code} ·{" "}
                    {item.name}
                  </option>
                ))}
              </select>

            </label>

            <label>

              <span className="mb-2 block font-mono text-[9px] font-bold tracking-[0.2em] text-slate-500">
                SESSION
              </span>

              <select
                value={sessionType}
                onChange={(event) =>
                  setSessionType(
                    event.target.value
                  )
                }
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#030711] px-4 py-3 font-mono text-xs font-bold text-slate-200 outline-none transition hover:border-cyan-400/40 hover:bg-slate-950 focus:border-cyan-400"
              >
                {sessions.map(
                  (session) => (
                    <option
                      key={session.value}
                      value={
                        session.value
                      }
                    >
                      {session.label}
                    </option>
                  )
                )}
              </select>

            </label>

          </div>

        </section>

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && (

          <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-800 bg-[#050914]">

            <div className="text-center">

              <div className="relative mx-auto flex h-12 w-12 items-center justify-center">

                <div className="absolute inset-0 animate-ping rounded-full border border-cyan-400/20" />

                <RefreshCw
                  size={24}
                  className="animate-spin text-cyan-400"
                />

              </div>

              <p className="mt-5 font-mono text-xs font-bold tracking-[0.2em] text-slate-500">
                ANALYZING SECTOR DATA...
              </p>

              <p className="mt-2 font-mono text-[8px] tracking-[0.16em] text-slate-700">
                QUERYING ENGINEERING ANALYSIS ENGINE
              </p>

            </div>

          </div>

        )}

        {/* =====================================================
            ERROR
        ====================================================== */}

        {!loading && error && (

          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.03]">

            <div className="text-center">

              <AlertCircle
                size={30}
                className="mx-auto text-red-400"
              />

              <p className="mt-4 font-mono text-sm font-bold text-red-300">
                SECTOR ANALYSIS FAILED
              </p>

              <p className="mt-2 max-w-md font-mono text-xs text-slate-500">
                {error}
              </p>

            </div>

          </div>

        )}

        {/* =====================================================
            DATA
        ====================================================== */}

        {!loading &&
          !error &&
          data && (

            <>

              {/* =================================================
                  TOP SUMMARY
              ================================================== */}

              <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <div className="group relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/[0.08] to-transparent p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_15px_50px_rgba(34,211,238,0.1)]">

                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-400/5 blur-3xl transition group-hover:bg-cyan-400/10" />

                  <div className="relative">

                    <div className="flex items-center justify-between">

                      <p className="font-mono text-[9px] font-bold tracking-[0.25em] text-cyan-400">
                        BEST COMBINATION
                      </p>

                      <Trophy
                        size={18}
                        className="text-cyan-400 transition group-hover:scale-110"
                      />

                    </div>

                    <p className="mt-6 font-mono text-4xl font-black text-white">
                      {formatTime(
                        data.bestSectorCombination
                      )}
                    </p>

                    <p className="mt-2 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-600">
                      OPTIMAL S1 + S2 + S3
                    </p>

                  </div>

                </div>

                <div className="group rounded-2xl border border-slate-800 bg-[#050914] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-[0_15px_45px_rgba(167,139,250,0.05)]">

                  <div className="flex items-center justify-between">

                    <p className="font-mono text-[9px] font-bold tracking-[0.25em] text-slate-500">
                      FASTEST SUM
                    </p>

                    <Gauge
                      size={18}
                      className="text-violet-400 transition group-hover:scale-110"
                    />

                  </div>

                  <p className="mt-6 font-mono text-4xl font-black text-violet-300">
                    {formatTime(
                      totalFastest
                    )}
                  </p>

                  <p className="mt-2 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-600">
                    SECTOR BESTS ADDED
                  </p>

                </div>

                <div className="group rounded-2xl border border-orange-400/20 bg-orange-400/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-400/50 hover:shadow-[0_15px_45px_rgba(251,146,60,0.06)]">

                  <div className="flex items-center justify-between">

                    <p className="font-mono text-[9px] font-bold tracking-[0.25em] text-orange-400">
                      AVERAGE PACE
                    </p>

                    <Activity
                      size={18}
                      className="text-orange-400 transition group-hover:scale-110"
                    />

                  </div>

                  <p className="mt-6 font-mono text-4xl font-black text-orange-400">
                    {formatTime(
                      totalAverage
                    )}
                  </p>

                  <p className="mt-2 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-600">
                    SECTOR AVERAGES ADDED
                  </p>

                </div>

                <div className="group rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-[0_15px_45px_rgba(52,211,153,0.06)]">

                  <div className="flex items-center justify-between">

                    <p className="font-mono text-[9px] font-bold tracking-[0.25em] text-emerald-400">
                      PERFORMANCE GAP
                    </p>

                    <TrendingDown
                      size={18}
                      className="text-emerald-400 transition group-hover:scale-110"
                    />

                  </div>

                  <p className="mt-6 font-mono text-4xl font-black text-emerald-400">
                    +{overallGap.toFixed(3)}
                    s
                  </p>

                  <p className="mt-2 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-600">
                    AVERAGE VS FASTEST
                  </p>

                </div>

              </section>

              {/* =================================================
                  ENGINEERING READOUT
              ================================================== */}

              <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-[#050914]">

                <div className="border-b border-slate-800 px-7 py-5">

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-3">

                      <Target
                        size={15}
                        className="text-cyan-400"
                      />

                      <div>

                        <h2 className="font-mono text-sm font-black tracking-[0.2em] text-white">
                          ENGINEERING READOUT
                        </h2>

                        <p className="mt-1 font-mono text-[8px] tracking-[0.17em] text-slate-600">
                          AUTOMATED SECTOR PERFORMANCE SUMMARY
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-2">

                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

                      <span className="font-mono text-[8px] font-bold tracking-[0.18em] text-slate-600">
                        ANALYSIS READY
                      </span>

                    </div>

                  </div>

                </div>

                <div className="grid md:grid-cols-3">

                  <div className="border-b border-slate-800 p-6 md:border-b-0 md:border-r">

                    <p className="font-mono text-[8px] font-bold tracking-[0.2em] text-slate-600">
                      FASTEST SECTOR
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-4">

                      <div>

                        <p className="font-mono text-3xl font-black text-cyan-300">
                          {bestSector?.id ??
                            "--"}
                        </p>

                        <p className="mt-1 font-mono text-[8px] tracking-widest text-slate-600">
                          {bestSector?.label ??
                            "NO DATA"}
                        </p>

                      </div>

                      <p className="font-mono text-xl font-black text-white">
                        {bestSector
                          ? formatTime(
                              bestSector.fastest
                            )
                          : "--"}
                      </p>

                    </div>

                  </div>

                  <div className="border-b border-slate-800 p-6 md:border-b-0 md:border-r">

                    <p className="font-mono text-[8px] font-bold tracking-[0.2em] text-slate-600">
                      LARGEST TIME LOSS
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-4">

                      <div>

                        <p className="font-mono text-3xl font-black text-orange-300">
                          {weakestSector?.id ??
                            "--"}
                        </p>

                        <p className="mt-1 font-mono text-[8px] tracking-widest text-slate-600">
                          {weakestSector?.label ??
                            "NO DATA"}
                        </p>

                      </div>

                      <p className="font-mono text-xl font-black text-orange-400">
                        +
                        {weakestSector
                          ? getGap(
                              weakestSector.fastest,
                              weakestSector.average
                            ).toFixed(3)
                          : "0.000"}
                        s
                      </p>

                    </div>

                  </div>

                  <div className="p-6">

                    <p className="font-mono text-[8px] font-bold tracking-[0.2em] text-slate-600">
                      SESSION POTENTIAL
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-4">

                      <div>

                        <p className="font-mono text-3xl font-black text-emerald-300">
                          {totalFastest
                            ? (
                                (overallGap /
                                  totalAverage) *
                                100
                              ).toFixed(1)
                            : "0.0"}
                          %
                        </p>

                        <p className="mt-1 font-mono text-[8px] tracking-widest text-slate-600">
                          AVAILABLE PACE
                        </p>

                      </div>

                      <ArrowUpRight
                        size={18}
                        className="mb-1 text-emerald-400"
                      />

                    </div>

                  </div>

                </div>

              </section>

              {/* =================================================
                  SECTOR CARDS
              ================================================== */}

              <section className="mb-8 grid gap-5 lg:grid-cols-3">

                {sectors.map(
                  (sector) => {

                    const Icon =
                      sector.icon

                    const gap =
                      getGap(
                        sector.fastest,
                        sector.average
                      )

                    const performance =
                      getPerformance(
                        sector.fastest,
                        sector.average
                      )

                    const isBest =
                      bestSector?.id ===
                      sector.id

                    const isWeakest =
                      weakestSector?.id ===
                      sector.id

                    const accentClasses = {
                      cyan: {
                        border:
                          "border-cyan-400/30 hover:border-cyan-400/70",
                        icon:
                          "text-cyan-400",
                        value:
                          "text-cyan-300",
                        bar:
                          "bg-cyan-400",
                        glow:
                          "hover:shadow-[0_20px_60px_rgba(34,211,238,0.08)]",
                      },
                      orange: {
                        border:
                          "border-orange-400/30 hover:border-orange-400/70",
                        icon:
                          "text-orange-400",
                        value:
                          "text-orange-300",
                        bar:
                          "bg-orange-400",
                        glow:
                          "hover:shadow-[0_20px_60px_rgba(251,146,60,0.08)]",
                      },
                      green: {
                        border:
                          "border-emerald-400/30 hover:border-emerald-400/70",
                        icon:
                          "text-emerald-400",
                        value:
                          "text-emerald-300",
                        bar:
                          "bg-emerald-400",
                        glow:
                          "hover:shadow-[0_20px_60px_rgba(52,211,153,0.08)]",
                      },
                    }

                    const styles =
                      accentClasses[
                        sector.accent as keyof typeof accentClasses
                      ]

                    return (

                      <article
                        key={sector.id}
                        className={`group relative overflow-hidden rounded-2xl border bg-[#050914] p-7 transition duration-300 hover:-translate-y-1 ${styles.border} ${styles.glow}`}
                      >

                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition group-hover:opacity-100" />

                        {isBest && (

                          <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1">

                            <Trophy
                              size={9}
                              className="text-cyan-300"
                            />

                            <span className="font-mono text-[8px] font-black tracking-[0.18em] text-cyan-300">
                              BEST
                            </span>

                          </div>

                        )}

                        {isWeakest &&
                          !isBest && (

                            <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-orange-400/25 bg-orange-400/[0.06] px-3 py-1">

                              <Flag
                                size={9}
                                className="text-orange-300"
                              />

                              <span className="font-mono text-[8px] font-black tracking-[0.18em] text-orange-300">
                                FOCUS
                              </span>

                            </div>

                          )}

                        <div className="flex items-center gap-4">

                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 transition group-hover:scale-105 ${styles.icon}`}
                          >

                            <Icon size={19} />

                          </div>

                          <div>

                            <p className="font-mono text-[10px] font-black tracking-[0.25em] text-white">
                              {sector.label}
                            </p>

                            <p className="mt-1 font-mono text-[8px] font-bold tracking-[0.18em] text-slate-600">
                              {sector.description}
                            </p>

                          </div>

                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-6">

                          <div>

                            <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-slate-500">
                              FASTEST
                            </p>

                            <p
                              className={`mt-2 font-mono text-3xl font-black ${styles.value}`}
                            >
                              {formatTime(
                                sector.fastest
                              )}
                            </p>

                          </div>

                          <div>

                            <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-slate-500">
                              AVERAGE
                            </p>

                            <p className="mt-2 font-mono text-3xl font-black text-white">
                              {formatTime(
                                sector.average
                              )}
                            </p>

                          </div>

                        </div>

                        <div className="mt-7 border-t border-slate-800/80 pt-6">

                          <div className="flex items-center justify-between">

                            <span className="font-mono text-[9px] font-bold tracking-[0.18em] text-slate-500">
                              PACE GAP
                            </span>

                            <span
                              className={`font-mono text-xs font-black ${styles.value}`}
                            >
                              +{gap.toFixed(3)}
                              s
                            </span>

                          </div>

                          <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-slate-900">

                            <div
                              className={`h-full rounded-full ${styles.bar} shadow-[0_0_10px_currentColor] transition-all duration-700`}
                              style={{
                                width: `${performance}%`,
                              }}
                            />

                          </div>

                          <div className="mt-3 flex items-center justify-between">

                            <span className="font-mono text-[8px] font-bold tracking-[0.15em] text-slate-700">
                              PACE EFFICIENCY
                            </span>

                            <span className="font-mono text-[8px] font-black tracking-[0.15em] text-slate-500">
                              {performance.toFixed(
                                0
                              )}
                              %
                            </span>

                          </div>

                        </div>

                      </article>

                    )
                  }
                )}

              </section>

              {/* =================================================
                  VISUAL COMPARISON
              ================================================== */}

              <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-[#050914]">

                <div className="border-b border-slate-800 px-7 py-6">

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-400/5">

                        <BarChart3
                          size={18}
                          className="text-violet-400"
                        />

                      </div>

                      <div>

                        <h2 className="font-mono text-sm font-black tracking-[0.2em] text-white">
                          SECTOR COMPARISON
                        </h2>

                        <p className="mt-1 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-600">
                          RELATIVE PACE DISTRIBUTION
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-4">

                      <div className="flex items-center gap-2">

                        <span className="h-2 w-2 rounded-sm bg-violet-400" />

                        <span className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                          FASTEST
                        </span>

                      </div>

                      <div className="flex items-center gap-2">

                        <span className="h-2 w-2 rounded-sm bg-slate-700" />

                        <span className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                          AVERAGE
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

                <div className="space-y-7 p-7">

                  {sectors.map(
                    (sector, index) => {

                      const gap =
                        getGap(
                          sector.fastest,
                          sector.average
                        )

                      const maxTime =
                        Math.max(
                          ...sectors.map(
                            (item) =>
                              item.average
                          )
                        )

                      const fastestWidth =
                        maxTime > 0
                          ? (sector.fastest /
                              maxTime) *
                            100
                          : 0

                      const averageWidth =
                        maxTime > 0
                          ? (sector.average /
                              maxTime) *
                            100
                          : 0

                      return (

                        <div
                          key={sector.id}
                          className="group"
                        >

                          <div className="mb-3 flex items-center justify-between">

                            <div className="flex items-center gap-3">

                              <span className="font-mono text-[10px] font-black text-slate-400">
                                0{index + 1}
                              </span>

                              <span className="font-mono text-[10px] font-black tracking-[0.18em] text-white">
                                {sector.label}
                              </span>

                            </div>

                            <span className="font-mono text-[9px] font-black text-slate-500">
                              +{gap.toFixed(3)}
                              s
                            </span>

                          </div>

                          <div className="space-y-2">

                            <div className="flex items-center gap-3">

                              <span className="w-16 font-mono text-[7px] font-bold tracking-widest text-violet-400">
                                BEST
                              </span>

                              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-900">

                                <div
                                  className="h-full rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.25)] transition-all duration-700 group-hover:brightness-125"
                                  style={{
                                    width: `${fastestWidth}%`,
                                  }}
                                />

                              </div>

                              <span className="w-16 text-right font-mono text-[9px] font-black text-white">
                                {sector.fastest.toFixed(
                                  3
                                )}
                              </span>

                            </div>

                            <div className="flex items-center gap-3">

                              <span className="w-16 font-mono text-[7px] font-bold tracking-widest text-slate-600">
                                AVG
                              </span>

                              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-900">

                                <div
                                  className="h-full rounded-full bg-slate-700 transition-all duration-700 group-hover:bg-slate-600"
                                  style={{
                                    width: `${averageWidth}%`,
                                  }}
                                />

                              </div>

                              <span className="w-16 text-right font-mono text-[9px] font-black text-slate-400">
                                {sector.average.toFixed(
                                  3
                                )}
                              </span>

                            </div>

                          </div>

                        </div>

                      )
                    }
                  )}

                </div>

              </section>

              {/* =================================================
                  PERFORMANCE MATRIX
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#050914]">

                <div className="flex flex-col gap-4 border-b border-slate-800 px-7 py-6 md:flex-row md:items-center md:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-950">

                      <Timer
                        size={17}
                        className="text-slate-400"
                      />

                    </div>

                    <div>

                      <h2 className="font-mono text-sm font-black tracking-[0.2em] text-white">
                        PERFORMANCE MATRIX
                      </h2>

                      <p className="mt-1 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-600">
                        FASTEST VS SESSION AVERAGE
                      </p>

                    </div>

                  </div>

                  <div className="rounded-full border border-slate-800 bg-slate-950 px-4 py-2">

                    <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-slate-500">
                      {driver} ·{" "}
                      {grandPrix.toUpperCase()}{" "}
                      · {sessionType}
                    </span>

                  </div>

                </div>

                <div className="grid md:grid-cols-3">

                  {sortedSectors.map(
                    (sector, index) => {

                      const gap =
                        getGap(
                          sector.fastest,
                          sector.average
                        )

                      const isBest =
                        index === 0

                      return (

                        <div
                          key={sector.id}
                          className={`group border-b border-slate-800 p-6 transition duration-300 hover:bg-white/[0.015] md:border-b-0 ${
                            index <
                            sortedSectors.length -
                              1
                              ? "md:border-r"
                              : ""
                          }`}
                        >

                          <div className="flex items-center justify-between">

                            <span className="font-mono text-[10px] font-black tracking-[0.2em] text-slate-400">
                              {sector.id}
                            </span>

                            {isBest && (

                              <span className="flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.04] px-2.5 py-1">

                                <Trophy
                                  size={8}
                                  className="text-cyan-400"
                                />

                                <span className="font-mono text-[7px] font-black tracking-widest text-cyan-400">
                                  FASTEST
                                </span>

                              </span>

                            )}

                          </div>

                          <div className="mt-7">

                            <p className="font-mono text-[8px] font-bold tracking-[0.16em] text-slate-600">
                              BEST LAP CONTRIBUTION
                            </p>

                            <p className="mt-2 font-mono text-2xl font-black text-white">
                              {sector.fastest.toFixed(
                                3
                              )}
                              <span className="ml-1 text-sm text-slate-600">
                                s
                              </span>
                            </p>

                          </div>

                          <div className="mt-6 flex items-center justify-between border-t border-slate-800/70 pt-5">

                            <div>

                              <p className="font-mono text-[7px] font-bold tracking-widest text-slate-700">
                                AVERAGE
                              </p>

                              <p className="mt-1 font-mono text-sm font-black text-slate-400">
                                {sector.average.toFixed(
                                  3
                                )}
                                s
                              </p>

                            </div>

                            <div className="text-right">

                              <p className="font-mono text-[7px] font-bold tracking-widest text-slate-700">
                                GAP
                              </p>

                              <p className="mt-1 font-mono text-sm font-black text-orange-400">
                                +{gap.toFixed(3)}
                                s
                              </p>

                            </div>

                          </div>

                        </div>

                      )
                    }
                  )}

                </div>

              </section>

              {/* =================================================
                  FOOTER
              ================================================== */}

              <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-800/70 py-5 sm:flex-row">

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

                  <span className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-slate-700">
                    Sector analysis synchronized
                  </span>

                </div>

                <span className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-slate-800">
                  APX · {year} ·{" "}
                  {grandPrix} · {driver}
                </span>

              </div>

            </>

          )}

      </div>

    </main>
  )
}
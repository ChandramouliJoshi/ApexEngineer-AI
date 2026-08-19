import { useMemo, useState } from "react"
import {
  Activity,
  BarChart3,
  CircleDot,
  Gauge,
  RefreshCw,
  AlertCircle,
  Trophy,
  Timer,
  TrendingUp,
  Flag,
} from "lucide-react"

import { useTyres } from "../hooks/useTyres"

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

const compoundStyles: Record<
  string,
  {
    text: string
    border: string
    bg: string
    bar: string
    glow: string
  }
> = {
  HARD: {
    text: "text-yellow-200",
    border: "border-yellow-400/30",
    bg: "bg-yellow-400/[0.04]",
    bar: "bg-yellow-300",
    glow: "shadow-[0_0_20px_rgba(250,204,21,0.08)]",
  },

  MEDIUM: {
    text: "text-red-300",
    border: "border-red-400/30",
    bg: "bg-red-400/[0.04]",
    bar: "bg-red-400",
    glow: "shadow-[0_0_20px_rgba(248,113,113,0.08)]",
  },

  SOFT: {
    text: "text-pink-300",
    border: "border-pink-400/30",
    bg: "bg-pink-400/[0.04]",
    bar: "bg-pink-400",
    glow: "shadow-[0_0_20px_rgba(244,114,182,0.08)]",
  },
}

function getCompoundStyle(compound: string) {
  return (
    compoundStyles[
      compound.toUpperCase()
    ] ?? {
      text: "text-cyan-300",
      border: "border-cyan-400/30",
      bg: "bg-cyan-400/[0.04]",
      bar: "bg-cyan-400",
      glow: "shadow-[0_0_20px_rgba(34,211,238,0.08)]",
    }
  )
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) {
    return "--"
  }

  return `${value.toFixed(3)}s`
}

export default function Tyres() {

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
  } = useTyres({
    year,
    grandPrix,
    driver,
    sessionType,
  })

  const [selectedCompound, setSelectedCompound] =
    useState<string | null>(null)

  const totalLaps = useMemo(() => {

    if (!data) {
      return 0
    }

    return data.stints.reduce(
      (sum, stint) =>
        sum + stint.laps,
      0
    )

  }, [data])

  const longestStint = useMemo(() => {

    if (!data?.stints.length) {
      return null
    }

    return data.stints.reduce(
      (longest, stint) =>
        stint.laps > longest.laps
          ? stint
          : longest
    )

  }, [data])

  const fastestCompound = useMemo(() => {

    if (!data) {
      return null
    }

    const entries = Object.entries(
      data.fastestLapByCompound
    )

    if (!entries.length) {
      return null
    }

    return entries.reduce(
      (fastest, current) =>
        current[1] < fastest[1]
          ? current
          : fastest
    )

  }, [data])

  const slowestCompound = useMemo(() => {

    if (!data) {
      return null
    }

    const entries = Object.entries(
      data.fastestLapByCompound
    )

    if (!entries.length) {
      return null
    }

    return entries.reduce(
      (slowest, current) =>
        current[1] > slowest[1]
          ? current
          : slowest
    )

  }, [data])

  const selectedStint = useMemo(() => {

    if (!data || !selectedCompound) {
      return null
    }

    return (
      data.stints.find(
        (stint) =>
          stint.compound ===
          selectedCompound
      ) ?? null
    )

  }, [data, selectedCompound])

  const maxStintLaps = useMemo(() => {

    if (!data?.stints.length) {
      return 1
    }

    return Math.max(
      ...data.stints.map(
        (stint) => stint.laps
      )
    )

  }, [data])

  const fastestLap = fastestCompound?.[1] ?? 0

  const slowestLap = slowestCompound?.[1] ?? 0

  const tyreSpread =
    fastestLap > 0 &&
    slowestLap > 0
      ? slowestLap - fastestLap
      : 0

  return (
    <main className="min-h-screen bg-[#030508] text-slate-100">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-slate-800/70">

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-yellow-300 via-yellow-300/30 to-transparent" />

          <div className="absolute right-0 top-0 h-px w-1/3 bg-gradient-to-l from-red-500 via-red-500/30 to-transparent" />

          <div className="absolute left-[20%] top-1/2 h-48 w-48 rounded-full bg-yellow-300/[0.025] blur-3xl" />

          <div className="absolute right-[20%] top-1/3 h-48 w-48 rounded-full bg-red-500/[0.025] blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-[1500px] px-8 py-12">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-300/30 bg-yellow-300/5">

                  <CircleDot
                    size={18}
                    className="text-yellow-300"
                  />

                </div>

                <div>

                  <p className="font-mono text-[10px] font-bold tracking-[0.32em] text-yellow-300">
                    APEXENGINEER AI
                  </p>

                  <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-slate-600">
                    TYRE STRATEGY INTELLIGENCE
                  </p>

                </div>

              </div>

              <h1 className="font-mono text-4xl font-black tracking-tight text-white md:text-5xl">
                TYRE ANALYSIS
              </h1>

              <p className="mt-3 font-mono text-[11px] font-semibold tracking-[0.22em] text-slate-500">
                COMPOUND PERFORMANCE · STINT LIFE · STRATEGY ANALYSIS
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
                  STINTS
                </p>

                <p className="mt-2 font-mono text-xl font-black text-white">
                  {data?.stints.length ??
                    "--"}
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

        <section className="group relative mb-8 overflow-hidden rounded-2xl border border-slate-800/80 bg-[#050914]/80 p-6 transition hover:border-slate-700">

          <div className="absolute left-0 top-0 h-px w-32 bg-gradient-to-r from-yellow-300 to-transparent" />

          <div className="mb-6 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.7)]" />

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

            <label>

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
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#030711] px-4 py-3 font-mono text-xs font-bold text-slate-200 outline-none transition hover:border-yellow-300/40 focus:border-yellow-300"
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
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#030711] px-4 py-3 font-mono text-xs font-bold text-slate-200 outline-none transition hover:border-yellow-300/40 focus:border-yellow-300"
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
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#030711] px-4 py-3 font-mono text-xs font-bold text-slate-200 outline-none transition hover:border-yellow-300/40 focus:border-yellow-300"
              >
                {drivers.map(
                  (item) => (
                    <option
                      key={item.code}
                      value={item.code}
                    >
                      {item.code} ·{" "}
                      {item.name}
                    </option>
                  )
                )}
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
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#030711] px-4 py-3 font-mono text-xs font-bold tracking-wide text-slate-200 outline-none transition hover:border-yellow-300/40 focus:border-yellow-300"
              >
                {sessions.map(
                  (session) => (
                    <option
                      key={session.value}
                      value={session.value}
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

                <div className="absolute inset-0 animate-ping rounded-full border border-yellow-300/20" />

                <RefreshCw
                  size={24}
                  className="animate-spin text-yellow-300"
                />

              </div>

              <p className="mt-5 font-mono text-xs font-bold tracking-[0.2em] text-slate-500">
                ANALYZING TYRE DATA...
              </p>

              <p className="mt-2 font-mono text-[8px] tracking-[0.16em] text-slate-700">
                PROCESSING COMPOUND AND STINT INFORMATION
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
                TYRE ANALYSIS FAILED
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
                  SUMMARY CARDS
              ================================================== */}

              <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <div className="group relative overflow-hidden rounded-2xl border border-yellow-300/30 bg-yellow-300/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-yellow-300/60 hover:shadow-[0_20px_55px_rgba(250,204,21,0.08)]">

                  <div className="flex items-center justify-between">

                    <p className="font-mono text-[9px] font-black tracking-[0.25em] text-yellow-300">
                      FASTEST COMPOUND
                    </p>

                    <Trophy
                      size={18}
                      className="text-yellow-300 transition group-hover:scale-110"
                    />

                  </div>

                  <p className="mt-6 font-mono text-4xl font-black text-white">
                    {fastestCompound?.[0] ??
                      "--"}
                  </p>

                  <p className="mt-2 font-mono text-sm font-black text-yellow-300">
                    {fastestCompound
                      ? formatTime(
                          fastestCompound[1]
                        )
                      : "--"}
                  </p>

                  <p className="mt-2 font-mono text-[8px] tracking-[0.18em] text-slate-600">
                    BEST RECORDED LAP
                  </p>

                </div>


                <div className="group rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50">

                  <div className="flex items-center justify-between">

                    <p className="font-mono text-[9px] font-black tracking-[0.25em] text-cyan-400">
                      LONGEST STINT
                    </p>

                    <Timer
                      size={18}
                      className="text-cyan-400 transition group-hover:scale-110"
                    />

                  </div>

                  <p className="mt-6 font-mono text-4xl font-black text-white">
                    {longestStint?.laps ??
                      "--"}
                  </p>

                  <p className="mt-2 font-mono text-sm font-black text-cyan-400">
                    {longestStint?.compound ??
                      "--"}
                  </p>

                  <p className="mt-2 font-mono text-[8px] tracking-[0.18em] text-slate-600">
                    LAPS COMPLETED
                  </p>

                </div>


                <div className="group rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/50">

                  <div className="flex items-center justify-between">

                    <p className="font-mono text-[9px] font-black tracking-[0.25em] text-emerald-400">
                      TOTAL LAPS
                    </p>

                    <Flag
                      size={18}
                      className="text-emerald-400 transition group-hover:scale-110"
                    />

                  </div>

                  <p className="mt-6 font-mono text-4xl font-black text-white">
                    {totalLaps}
                  </p>

                  <p className="mt-2 font-mono text-sm font-black text-emerald-400">
                    {data.stints.length}{" "}
                    STINTS
                  </p>

                  <p className="mt-2 font-mono text-[8px] tracking-[0.18em] text-slate-600">
                    SESSION DISTANCE
                  </p>

                </div>


                <div className="group rounded-2xl border border-violet-400/20 bg-violet-400/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/50">

                  <div className="flex items-center justify-between">

                    <p className="font-mono text-[9px] font-black tracking-[0.25em] text-violet-400">
                      TYRE SPREAD
                    </p>

                    <TrendingUp
                      size={18}
                      className="text-violet-400 transition group-hover:scale-110"
                    />

                  </div>

                  <p className="mt-6 font-mono text-4xl font-black text-white">
                    {tyreSpread.toFixed(
                      3
                    )}
                    s
                  </p>

                  <p className="mt-2 font-mono text-sm font-black text-violet-400">
                    {slowestCompound?.[0] ??
                      "--"}{" "}
                    vs{" "}
                    {fastestCompound?.[0] ??
                      "--"}
                  </p>

                  <p className="mt-2 font-mono text-[8px] tracking-[0.18em] text-slate-600">
                    FASTEST LAP DIFFERENCE
                  </p>

                </div>

              </section>


              {/* =================================================
                  COMPOUND PERFORMANCE
              ================================================== */}

              <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-[#050914]">

                <div className="border-b border-slate-800 px-7 py-6">

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-300/30 bg-yellow-300/5">

                        <Gauge
                          size={17}
                          className="text-yellow-300"
                        />

                      </div>

                      <div>

                        <h2 className="font-mono text-sm font-black tracking-[0.2em] text-white">
                          COMPOUND PERFORMANCE
                        </h2>

                        <p className="mt-1 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-600">
                          FASTEST LAP BY TYRE COMPOUND
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-2">

                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />

                      <span className="font-mono text-[8px] font-bold tracking-[0.18em] text-slate-600">
                        {data.compoundsUsed.length}{" "}
                        COMPOUNDS USED
                      </span>

                    </div>

                  </div>

                </div>


                <div className="grid gap-5 p-7 lg:grid-cols-3">

                  {data.compoundsUsed.map(
                    (compound) => {

                      const style =
                        getCompoundStyle(
                          compound
                        )

                      const lap =
                        data
                          .fastestLapByCompound[
                          compound
                        ]

                      const isFastest =
                        fastestCompound?.[0] ===
                        compound

                      const isSelected =
                        selectedCompound ===
                        compound

                      const normalized =
                        fastestLap > 0 &&
                        lap
                          ? Math.min(
                              100,
                              (fastestLap /
                                lap) *
                                100
                            )
                          : 0

                      return (

                        <button
                          key={compound}
                          type="button"
                          onClick={() =>
                            setSelectedCompound(
                              isSelected
                                ? null
                                : compound
                            )
                          }
                          className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition duration-300 hover:-translate-y-1 ${style.border} ${style.bg} ${style.glow} ${
                            isSelected
                              ? "ring-1 ring-white/20"
                              : ""
                          }`}
                        >

                          {isFastest && (

                            <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/[0.06] px-3 py-1">

                              <Trophy
                                size={9}
                                className="text-emerald-400"
                              />

                              <span className="font-mono text-[7px] font-black tracking-widest text-emerald-400">
                                FASTEST
                              </span>

                            </div>

                          )}

                          <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-950">

                              <CircleDot
                                size={22}
                                className={
                                  style.text
                                }
                              />

                            </div>

                            <div>

                              <p className={`font-mono text-xl font-black ${style.text}`}>
                                {compound}
                              </p>

                              <p className="mt-1 font-mono text-[8px] font-bold tracking-[0.18em] text-slate-600">
                                COMPOUND
                              </p>

                            </div>

                          </div>


                          <div className="mt-8">

                            <p className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                              FASTEST LAP
                            </p>

                            <p className="mt-2 font-mono text-3xl font-black text-white">
                              {formatTime(
                                lap
                              )}
                            </p>

                          </div>


                          <div className="mt-6">

                            <div className="flex items-center justify-between">

                              <span className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                                RELATIVE PACE
                              </span>

                              <span className={`font-mono text-[9px] font-black ${style.text}`}>
                                {normalized.toFixed(
                                  1
                                )}
                                %
                              </span>

                            </div>

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950">

                              <div
                                className={`h-full rounded-full ${style.bar} transition-all duration-700`}
                                style={{
                                  width: `${normalized}%`,
                                }}
                              />

                            </div>

                          </div>

                        </button>

                      )

                    }
                  )}

                </div>

              </section>


              {/* =================================================
                  STINT TIMELINE
              ================================================== */}

              <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-[#050914]">

                <div className="border-b border-slate-800 px-7 py-6">

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/5">

                      <Activity
                        size={17}
                        className="text-cyan-400"
                      />

                    </div>

                    <div>

                      <h2 className="font-mono text-sm font-black tracking-[0.2em] text-white">
                        STINT STRATEGY
                      </h2>

                      <p className="mt-1 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-600">
                        TYRE LIFE AND SESSION SEQUENCE
                      </p>

                    </div>

                  </div>

                </div>


                <div className="p-7">

                  <div className="relative">

                    {/* Timeline line */}

                    <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-800" />


                    <div className="space-y-5">

                      {data.stints.map(
                        (stint, index) => {

                          const style =
                            getCompoundStyle(
                              stint.compound
                            )

                          const width =
                            Math.max(
                              8,
                              (stint.laps /
                                maxStintLaps) *
                                100
                            )

                          const isSelected =
                            selectedStint?.stint ===
                            stint.stint

                          return (

                            <button
                              key={
                                stint.stint
                              }
                              type="button"
                              onClick={() =>
                                setSelectedCompound(
                                  stint.compound
                                )
                              }
                              className={`relative block w-full rounded-2xl border bg-[#030711] p-5 pl-16 text-left transition duration-300 hover:-translate-y-0.5 hover:bg-slate-950 ${style.border} ${
                                isSelected
                                  ? "ring-1 ring-white/15"
                                  : ""
                              }`}
                            >

                              <div className={`absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border ${style.border} ${style.bg}`}>

                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${style.bar}`}
                                />

                              </div>


                              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                                <div className="w-28 shrink-0">

                                  <p className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                                    STINT
                                  </p>

                                  <p className="mt-1 font-mono text-xl font-black text-white">
                                    {stint.stint}
                                  </p>

                                </div>


                                <div className="w-32 shrink-0">

                                  <p className={`font-mono text-sm font-black ${style.text}`}>
                                    {stint.compound}
                                  </p>

                                  <p className="mt-1 font-mono text-[8px] font-bold tracking-widest text-slate-600">
                                    COMPOUND
                                  </p>

                                </div>


                                <div className="flex-1">

                                  <div className="mb-2 flex items-center justify-between">

                                    <span className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                                      STINT LENGTH
                                    </span>

                                    <span className="font-mono text-[9px] font-black text-white">
                                      {stint.laps}{" "}
                                      LAPS
                                    </span>

                                  </div>

                                  <div className="h-3 overflow-hidden rounded-full bg-slate-900">

                                    <div
                                      className={`h-full rounded-full ${style.bar} transition-all duration-700`}
                                      style={{
                                        width: `${width}%`,
                                      }}
                                    />

                                  </div>

                                </div>


                                <div className="grid grid-cols-2 gap-6 lg:w-48">

                                  <div>

                                    <p className="font-mono text-[7px] font-bold tracking-widest text-slate-700">
                                      TYRE LIFE
                                    </p>

                                    <p className="mt-1 font-mono text-xs font-black text-slate-300">
                                      {
                                        stint.tyreLifeStart
                                      }
                                      -
                                      {
                                        stint.tyreLifeEnd
                                      }
                                    </p>

                                  </div>

                                  <div>

                                    <p className="font-mono text-[7px] font-bold tracking-widest text-slate-700">
                                      RANGE
                                    </p>

                                    <p className="mt-1 font-mono text-xs font-black text-slate-300">
                                      L
                                      {index ===
                                      0
                                        ? 1
                                        : data.stints
                                            .slice(
                                              0,
                                              index
                                            )
                                            .reduce(
                                              (
                                                sum,
                                                item
                                              ) =>
                                                sum +
                                                item.laps,
                                              0
                                            ) +
                                          1}
                                      -
                                      {data.stints
                                        .slice(
                                          0,
                                          index +
                                            1
                                        )
                                        .reduce(
                                          (
                                            sum,
                                            item
                                          ) =>
                                            sum +
                                            item.laps,
                                          0
                                        )}
                                    </p>

                                  </div>

                                </div>

                              </div>

                            </button>

                          )

                        }
                      )}

                    </div>

                  </div>

                </div>

              </section>


              {/* =================================================
                  STINT TABLE
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#050914]">

                <div className="border-b border-slate-800 px-7 py-6">

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-950">

                      <BarChart3
                        size={17}
                        className="text-slate-400"
                      />

                    </div>

                    <div>

                      <h2 className="font-mono text-sm font-black tracking-[0.2em] text-white">
                        STINT MATRIX
                      </h2>

                      <p className="mt-1 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-600">
                        COMPLETE TYRE USAGE BREAKDOWN
                      </p>

                    </div>

                  </div>

                </div>


                <div className="overflow-x-auto">

                  <table className="w-full min-w-[850px] border-collapse">

                    <thead>

                      <tr className="border-b border-slate-800 bg-slate-950/60">

                        <th className="px-6 py-4 text-left font-mono text-[8px] font-black tracking-[0.18em] text-slate-600">
                          STINT
                        </th>

                        <th className="px-6 py-4 text-left font-mono text-[8px] font-black tracking-[0.18em] text-slate-600">
                          COMPOUND
                        </th>

                        <th className="px-6 py-4 text-right font-mono text-[8px] font-black tracking-[0.18em] text-cyan-400">
                          LAPS
                        </th>

                        <th className="px-6 py-4 text-right font-mono text-[8px] font-black tracking-[0.18em] text-yellow-300">
                          TYRE LIFE START
                        </th>

                        <th className="px-6 py-4 text-right font-mono text-[8px] font-black tracking-[0.18em] text-orange-400">
                          TYRE LIFE END
                        </th>

                        <th className="px-6 py-4 text-right font-mono text-[8px] font-black tracking-[0.18em] text-emerald-400">
                          FASTEST LAP
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {data.stints.map(
                        (stint) => {

                          const style =
                            getCompoundStyle(
                              stint.compound
                            )

                          const lap =
                            data
                              .fastestLapByCompound[
                              stint.compound
                            ]

                          return (

                            <tr
                              key={
                                stint.stint
                              }
                              onClick={() =>
                                setSelectedCompound(
                                  stint.compound
                                )
                              }
                              className="cursor-pointer border-b border-slate-800/60 transition hover:bg-white/[0.025]"
                            >

                              <td className="px-6 py-4">

                                <span className="font-mono text-xs font-black text-white">
                                  {stint.stint}
                                </span>

                              </td>


                              <td className="px-6 py-4">

                                <span className={`rounded-full border px-3 py-1 font-mono text-[9px] font-black tracking-widest ${style.border} ${style.bg} ${style.text}`}>
                                  {
                                    stint.compound
                                  }
                                </span>

                              </td>


                              <td className="px-6 py-4 text-right font-mono text-xs font-black text-cyan-300">
                                {stint.laps}
                              </td>


                              <td className="px-6 py-4 text-right font-mono text-xs font-black text-yellow-300">
                                {
                                  stint.tyreLifeStart
                                }
                              </td>


                              <td className="px-6 py-4 text-right font-mono text-xs font-black text-orange-400">
                                {
                                  stint.tyreLifeEnd
                                }
                              </td>


                              <td className="px-6 py-4 text-right font-mono text-xs font-black text-emerald-300">
                                {lap
                                  ? formatTime(
                                      lap
                                    )
                                  : "--"}
                              </td>

                            </tr>

                          )

                        }
                      )}

                    </tbody>

                  </table>

                </div>

              </section>


              {/* =================================================
                  FOOTER
              ================================================== */}

              <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-800/70 py-5 sm:flex-row">

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

                  <span className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-slate-700">
                    Tyre analysis synchronized
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
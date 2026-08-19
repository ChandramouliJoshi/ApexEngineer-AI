import { useMemo, useState } from "react"
import {
  Activity,
  Gauge,
  Zap,
  Trophy,
  AlertTriangle,
  MousePointer2,
  Target,
  RefreshCw,
  AlertCircle,
} from "lucide-react"

import { useCorners } from "../hooks/useCorners"

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

function formatSpeed(value: number) {
  if (!Number.isFinite(value)) {
    return "--"
  }

  return `${Math.round(value)} km/h`
}

function formatRPM(value: number) {
  if (!Number.isFinite(value)) {
    return "--"
  }

  return `${Math.round(value).toLocaleString()}`
}

function getSpeedLoss(
  entry: number,
  apex: number
) {
  return Math.max(0, entry - apex)
}

function getExitGain(
  apex: number,
  exit: number
) {
  return exit - apex
}

export default function Corners() {

  const [year, setYear] = useState(2025)

  const [grandPrix, setGrandPrix] =
    useState("Monaco")

  const [driver, setDriver] =
    useState("PIA")

  const [sessionType, setSessionType] =
    useState("R")

  const [selectedCorner, setSelectedCorner] =
    useState<number | null>(null)

  const {
    data,
    loading,
    error,
  } = useCorners({
    year,
    grandPrix,
    driver,
    sessionType,
  })

  const selectedData = useMemo(() => {

    if (!data.length) {
      return null
    }

    if (selectedCorner !== null) {
      return (
        data.find(
          (corner) =>
            corner.corner === selectedCorner
        ) ?? data[0]
      )
    }

    return data[0]

  }, [data, selectedCorner])

  const bestExit = useMemo(() => {

    if (!data.length) {
      return null
    }

    return data.reduce(
      (best, current) =>
        current.exitSpeed >
        best.exitSpeed
          ? current
          : best
    )

  }, [data])

  const biggestSpeedLoss = useMemo(() => {

    if (!data.length) {
      return null
    }

    return data.reduce(
      (worst, current) =>
        getSpeedLoss(
          current.entrySpeed,
          current.apexSpeed
        ) >
        getSpeedLoss(
          worst.entrySpeed,
          worst.apexSpeed
        )
          ? current
          : worst
    )

  }, [data])

  const strongestThrottle = useMemo(() => {

    if (!data.length) {
      return null
    }

    return data.reduce(
      (best, current) =>
        current.maxThrottle >
        best.maxThrottle
          ? current
          : best
    )

  }, [data])

  const maxSpeed = useMemo(() => {

    if (!data.length) {
      return 0
    }

    return Math.max(
      ...data.flatMap((corner) => [
        corner.entrySpeed,
        corner.apexSpeed,
        corner.exitSpeed,
      ])
    )

  }, [data])

  const averageApex = useMemo(() => {

    if (!data.length) {
      return 0
    }

    return (
      data.reduce(
        (sum, corner) =>
          sum + corner.apexSpeed,
        0
      ) / data.length
    )

  }, [data])

  const averageThrottle = useMemo(() => {

    if (!data.length) {
      return 0
    }

    return (
      data.reduce(
        (sum, corner) =>
          sum + corner.maxThrottle,
        0
      ) / data.length
    )

  }, [data])

  return (
    <main className="min-h-screen bg-[#030508] text-slate-100">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-slate-800/70">

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-red-500 via-red-500/40 to-transparent" />

          <div className="absolute right-0 top-0 h-px w-1/3 bg-gradient-to-l from-cyan-400 via-cyan-400/40 to-transparent" />

          <div className="absolute left-[20%] top-1/2 h-48 w-48 rounded-full bg-red-500/[0.025] blur-3xl" />

          <div className="absolute right-[20%] top-1/3 h-48 w-48 rounded-full bg-cyan-400/[0.025] blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-[1500px] px-8 py-12">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/30 bg-red-400/5">

                  <Target
                    size={18}
                    className="text-red-400"
                  />

                </div>

                <div>

                  <p className="font-mono text-[10px] font-bold tracking-[0.32em] text-red-400">
                    APEXENGINEER AI
                  </p>

                  <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-slate-600">
                    CORNER PERFORMANCE SYSTEM
                  </p>

                </div>

              </div>

              <h1 className="font-mono text-4xl font-black tracking-tight text-white md:text-5xl">
                CORNER INTELLIGENCE
              </h1>

              <p className="mt-3 font-mono text-[11px] font-semibold tracking-[0.22em] text-slate-500">
                ENTRY · APEX · EXIT · BRAKING · THROTTLE · RPM
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
                  CORNERS
                </p>

                <p className="mt-2 font-mono text-xl font-black text-white">
                  {data.length || "--"}
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

          <div className="absolute left-0 top-0 h-px w-32 bg-gradient-to-r from-red-400 to-transparent" />

          <div className="mb-6 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.7)]" />

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
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#030711] px-4 py-3 font-mono text-xs font-bold text-slate-200 outline-none transition hover:border-cyan-400/40 focus:border-cyan-400"
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
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#030711] px-4 py-3 font-mono text-xs font-bold text-slate-200 outline-none transition hover:border-cyan-400/40 focus:border-cyan-400"
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
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#030711] px-4 py-3 font-mono text-xs font-bold text-slate-200 outline-none transition hover:border-cyan-400/40 focus:border-cyan-400"
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
                className="w-full cursor-pointer rounded-xl border border-slate-800 bg-[#030711] px-4 py-3 font-mono text-xs font-bold tracking-wide text-slate-200 outline-none transition hover:border-cyan-400/40 focus:border-cyan-400"
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

                <div className="absolute inset-0 animate-ping rounded-full border border-red-400/20" />

                <RefreshCw
                  size={24}
                  className="animate-spin text-red-400"
                />

              </div>

              <p className="mt-5 font-mono text-xs font-bold tracking-[0.2em] text-slate-500">
                ANALYZING CORNER DATA...
              </p>

              <p className="mt-2 font-mono text-[8px] tracking-[0.16em] text-slate-700">
                PROCESSING DRIVER INPUT TELEMETRY
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
                CORNER ANALYSIS FAILED
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
          data.length > 0 && (

            <>

              {/* =================================================
                  SUMMARY
              ================================================== */}

              <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <div className="group relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-cyan-400/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_20px_55px_rgba(34,211,238,0.08)]">

                  <div className="flex items-center justify-between">

                    <p className="font-mono text-[9px] font-black tracking-[0.25em] text-cyan-400">
                      BEST EXIT
                    </p>

                    <Trophy
                      size={18}
                      className="text-cyan-400 transition group-hover:scale-110"
                    />

                  </div>

                  <p className="mt-6 font-mono text-4xl font-black text-white">
                    C
                    {bestExit?.corner ??
                      "--"}
                  </p>

                  <p className="mt-2 font-mono text-sm font-black text-cyan-300">
                    {bestExit
                      ? formatSpeed(
                          bestExit.exitSpeed
                        )
                      : "--"}
                  </p>

                  <p className="mt-2 font-mono text-[8px] tracking-[0.18em] text-slate-600">
                    STRONGEST CORNER EXIT
                  </p>

                </div>

                <div className="group rounded-2xl border border-orange-400/20 bg-orange-400/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-400/50">

                  <div className="flex items-center justify-between">

                    <p className="font-mono text-[9px] font-black tracking-[0.25em] text-orange-400">
                      SPEED LOSS
                    </p>

                    <AlertTriangle
                      size={18}
                      className="text-orange-400 transition group-hover:scale-110"
                    />

                  </div>

                  <p className="mt-6 font-mono text-4xl font-black text-white">
                    C
                    {biggestSpeedLoss?.corner ??
                      "--"}
                  </p>

                  <p className="mt-2 font-mono text-sm font-black text-orange-400">
                    -
                    {biggestSpeedLoss
                      ? getSpeedLoss(
                          biggestSpeedLoss.entrySpeed,
                          biggestSpeedLoss.apexSpeed
                        ).toFixed(0)
                      : "0"}{" "}
                    km/h
                  </p>

                  <p className="mt-2 font-mono text-[8px] tracking-[0.18em] text-slate-600">
                    ENTRY → APEX
                  </p>

                </div>

                <div className="group rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/50">

                  <div className="flex items-center justify-between">

                    <p className="font-mono text-[9px] font-black tracking-[0.25em] text-emerald-400">
                      THROTTLE
                    </p>

                    <Zap
                      size={18}
                      className="text-emerald-400 transition group-hover:scale-110"
                    />

                  </div>

                  <p className="mt-6 font-mono text-4xl font-black text-white">
                    {averageThrottle.toFixed(
                      0
                    )}
                    %
                  </p>

                  <p className="mt-2 font-mono text-sm font-black text-emerald-400">
                    C
                    {strongestThrottle?.corner ??
                      "--"}
                  </p>

                  <p className="mt-2 font-mono text-[8px] tracking-[0.18em] text-slate-600">
                    AVERAGE MAX THROTTLE
                  </p>

                </div>

                <div className="group rounded-2xl border border-violet-400/20 bg-violet-400/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/50">

                  <div className="flex items-center justify-between">

                    <p className="font-mono text-[9px] font-black tracking-[0.25em] text-violet-400">
                      APEX PACE
                    </p>

                    <Gauge
                      size={18}
                      className="text-violet-400 transition group-hover:scale-110"
                    />

                  </div>

                  <p className="mt-6 font-mono text-4xl font-black text-white">
                    {Math.round(
                      averageApex
                    )}
                  </p>

                  <p className="mt-2 font-mono text-sm font-black text-violet-400">
                    km/h
                  </p>

                  <p className="mt-2 font-mono text-[8px] tracking-[0.18em] text-slate-600">
                    AVERAGE APEX SPEED
                  </p>

                </div>

              </section>

              {/* =================================================
                  CORNER SELECTOR + DETAIL
              ================================================== */}

              <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-[#050914]">

                <div className="border-b border-slate-800 px-7 py-6">

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/30 bg-red-400/5">

                        <MousePointer2
                          size={17}
                          className="text-red-400"
                        />

                      </div>

                      <div>

                        <h2 className="font-mono text-sm font-black tracking-[0.2em] text-white">
                          CORNER SELECTOR
                        </h2>

                        <p className="mt-1 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-600">
                          SELECT A CORNER TO INSPECT
                        </p>

                      </div>

                    </div>

                    <div className="rounded-full border border-slate-800 bg-slate-950 px-4 py-2">

                      <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-slate-500">
                        {grandPrix.toUpperCase()} ·{" "}
                        {driver}
                      </span>

                    </div>

                  </div>

                </div>

                <div className="p-7">

                  <div className="flex flex-wrap gap-2">

                    {data.map(
                      (corner) => {

                        const selected =
                          selectedData?.corner ===
                          corner.corner

                        const highLoss =
                          biggestSpeedLoss?.corner ===
                          corner.corner

                        return (

                          <button
                            key={corner.corner}
                            type="button"
                            onClick={() =>
                              setSelectedCorner(
                                corner.corner
                              )
                            }
                            className={`group/corner relative flex h-12 min-w-12 items-center justify-center rounded-xl border px-3 font-mono text-xs font-black transition duration-200 ${
                              selected
                                ? "border-red-400 bg-red-400/10 text-red-300 shadow-[0_0_25px_rgba(248,113,113,0.08)]"
                                : "border-slate-800 bg-[#030711] text-slate-500 hover:-translate-y-0.5 hover:border-slate-600 hover:text-white"
                            }`}
                          >

                            C
                            {corner.corner}

                            {highLoss && (
                              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.7)]" />
                            )}

                          </button>

                        )

                      }
                    )}

                  </div>

                  {selectedData && (

                    <div className="mt-8 rounded-2xl border border-slate-800/80 bg-[#030711] p-7">

                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                        <div>

                          <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-red-400">
                            SELECTED CORNER
                          </p>

                          <div className="mt-2 flex items-end gap-4">

                            <h3 className="font-mono text-5xl font-black text-white">
                              C
                              {
                                selectedData.corner
                              }
                            </h3>

                            <span className="mb-1 rounded-full border border-slate-800 px-3 py-1 font-mono text-[8px] font-bold tracking-widest text-slate-500">
                              {selectedData.samples}{" "}
                              SAMPLES
                            </span>

                          </div>

                        </div>

                        <div className="grid grid-cols-3 gap-8">

                          <div>

                            <p className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                              ENTRY
                            </p>

                            <p className="mt-2 font-mono text-xl font-black text-cyan-300">
                              {
                                selectedData.entrySpeed
                              }
                            </p>

                          </div>

                          <div>

                            <p className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                              APEX
                            </p>

                            <p className="mt-2 font-mono text-xl font-black text-orange-300">
                              {
                                selectedData.apexSpeed
                              }
                            </p>

                          </div>

                          <div>

                            <p className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                              EXIT
                            </p>

                            <p className="mt-2 font-mono text-xl font-black text-emerald-300">
                              {
                                selectedData.exitSpeed
                              }
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* SPEED PROFILE */}

                      <div className="mt-8">

                        <div className="mb-3 flex items-center justify-between">

                          <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-slate-600">
                            SPEED PROFILE
                          </span>

                          <span className="font-mono text-[8px] font-bold tracking-widest text-slate-700">
                            KM/H
                          </span>

                        </div>

                        <div className="relative h-24 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">

                          <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-1 px-5 py-4">

                            {[
                              {
                                label: "ENTRY",
                                value:
                                  selectedData.entrySpeed,
                              },
                              {
                                label: "APEX",
                                value:
                                  selectedData.apexSpeed,
                              },
                              {
                                label: "EXIT",
                                value:
                                  selectedData.exitSpeed,
                              },
                            ].map(
                              (point) => {

                                const height =
                                  maxSpeed > 0
                                    ? Math.max(
                                        10,
                                        (point.value /
                                          maxSpeed) *
                                          100
                                      )
                                    : 10

                                return (

                                  <div
                                    key={
                                      point.label
                                    }
                                    className="flex h-full flex-1 items-end"
                                  >

                                    <div
                                      className={`w-full rounded-t-md transition-all duration-500 ${
                                        point.label ===
                                        "ENTRY"
                                          ? "bg-cyan-400"
                                          : point.label ===
                                              "APEX"
                                            ? "bg-orange-400"
                                            : "bg-emerald-400"
                                      }`}
                                      style={{
                                        height: `${height}%`,
                                      }}
                                    />

                                  </div>

                                )

                              }
                            )}

                          </div>

                        </div>

                        <div className="mt-3 grid grid-cols-3 text-center">

                          <span className="font-mono text-[8px] font-bold tracking-widest text-cyan-400">
                            ENTRY
                          </span>

                          <span className="font-mono text-[8px] font-bold tracking-widest text-orange-400">
                            APEX
                          </span>

                          <span className="font-mono text-[8px] font-bold tracking-widest text-emerald-400">
                            EXIT
                          </span>

                        </div>

                      </div>

                      {/* DETAIL METRICS */}

                      <div className="mt-8 grid gap-4 md:grid-cols-4">

                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

                          <p className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                            SPEED LOSS
                          </p>

                          <p className="mt-3 font-mono text-2xl font-black text-orange-400">
                            -
                            {getSpeedLoss(
                              selectedData.entrySpeed,
                              selectedData.apexSpeed
                            ).toFixed(0)}
                            <span className="ml-1 text-xs text-slate-600">
                              km/h
                            </span>
                          </p>

                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

                          <p className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                            EXIT GAIN
                          </p>

                          <p className="mt-3 font-mono text-2xl font-black text-emerald-400">
                            +
                            {getExitGain(
                              selectedData.apexSpeed,
                              selectedData.exitSpeed
                            ).toFixed(0)}
                            <span className="ml-1 text-xs text-slate-600">
                              km/h
                            </span>
                          </p>

                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

                          <p className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                            THROTTLE
                          </p>

                          <p className="mt-3 font-mono text-2xl font-black text-cyan-400">
                            {
                              selectedData.maxThrottle
                            }
                            %
                          </p>

                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

                          <p className="font-mono text-[8px] font-bold tracking-widest text-slate-600">
                            RPM
                          </p>

                          <p className="mt-3 font-mono text-2xl font-black text-violet-400">
                            {formatRPM(
                              selectedData.averageRPM
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                  )}

                </div>

              </section>

              {/* =================================================
                  CORNER TABLE
              ================================================== */}

              <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#050914]">

                <div className="border-b border-slate-800 px-7 py-6">

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-950">

                      <Activity
                        size={17}
                        className="text-slate-400"
                      />

                    </div>

                    <div>

                      <h2 className="font-mono text-sm font-black tracking-[0.2em] text-white">
                        CORNER TELEMETRY MATRIX
                      </h2>

                      <p className="mt-1 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-600">
                        COMPLETE CORNER-BY-CORNER BREAKDOWN
                      </p>

                    </div>

                  </div>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[950px] border-collapse">

                    <thead>

                      <tr className="border-b border-slate-800 bg-slate-950/60">

                        <th className="px-6 py-4 text-left font-mono text-[8px] font-black tracking-[0.18em] text-slate-600">
                          CORNER
                        </th>

                        <th className="px-6 py-4 text-right font-mono text-[8px] font-black tracking-[0.18em] text-cyan-500">
                          ENTRY
                        </th>

                        <th className="px-6 py-4 text-right font-mono text-[8px] font-black tracking-[0.18em] text-orange-500">
                          APEX
                        </th>

                        <th className="px-6 py-4 text-right font-mono text-[8px] font-black tracking-[0.18em] text-emerald-500">
                          EXIT
                        </th>

                        <th className="px-6 py-4 text-right font-mono text-[8px] font-black tracking-[0.18em] text-red-400">
                          BRAKE
                        </th>

                        <th className="px-6 py-4 text-right font-mono text-[8px] font-black tracking-[0.18em] text-cyan-400">
                          THROTTLE
                        </th>

                        <th className="px-6 py-4 text-right font-mono text-[8px] font-black tracking-[0.18em] text-violet-400">
                          AVG RPM
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {data.map(
                        (corner) => {

                          const isSelected =
                            selectedData?.corner ===
                            corner.corner

                          const isBestExit =
                            bestExit?.corner ===
                            corner.corner

                          const isLargestLoss =
                            biggestSpeedLoss?.corner ===
                            corner.corner

                          return (

                            <tr
                              key={
                                corner.corner
                              }
                              onClick={() =>
                                setSelectedCorner(
                                  corner.corner
                                )
                              }
                              className={`cursor-pointer border-b border-slate-800/60 transition hover:bg-white/[0.025] ${
                                isSelected
                                  ? "bg-red-400/[0.035]"
                                  : ""
                              }`}
                            >

                              <td className="px-6 py-4">

                                <div className="flex items-center gap-3">

                                  <span className="font-mono text-xs font-black text-white">
                                    C
                                    {
                                      corner.corner
                                    }
                                  </span>

                                  {isBestExit && (

                                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.04] px-2 py-0.5 font-mono text-[7px] font-black tracking-widest text-emerald-400">
                                      BEST EXIT
                                    </span>

                                  )}

                                  {isLargestLoss && (

                                    <span className="rounded-full border border-orange-400/20 bg-orange-400/[0.04] px-2 py-0.5 font-mono text-[7px] font-black tracking-widest text-orange-400">
                                      HIGH LOSS
                                    </span>

                                  )}

                                </div>

                              </td>

                              <td className="px-6 py-4 text-right font-mono text-xs font-black text-cyan-300">
                                {
                                  corner.entrySpeed
                                }
                              </td>

                              <td className="px-6 py-4 text-right font-mono text-xs font-black text-orange-300">
                                {
                                  corner.apexSpeed
                                }
                              </td>

                              <td className="px-6 py-4 text-right font-mono text-xs font-black text-emerald-300">
                                {
                                  corner.exitSpeed
                                }
                              </td>

                              <td className="px-6 py-4 text-right">

                                <span
                                  className={`font-mono text-xs font-black ${
                                    corner.maxBrake
                                      ? "text-red-400"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {corner.maxBrake
                                    ? "ACTIVE"
                                    : "—"}
                                </span>

                              </td>

                              <td className="px-6 py-4 text-right font-mono text-xs font-black text-cyan-300">

                                {
                                  corner.maxThrottle
                                }
                                %

                              </td>

                              <td className="px-6 py-4 text-right font-mono text-xs font-black text-violet-300">

                                {formatRPM(
                                  corner.averageRPM
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

              {/* =================================================
                  FOOTER
              ================================================== */}

              <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-800/70 py-5 sm:flex-row">

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

                  <span className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-slate-700">
                    Corner analysis synchronized
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
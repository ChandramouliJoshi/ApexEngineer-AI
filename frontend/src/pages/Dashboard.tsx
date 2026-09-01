/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { useEffect, useMemo, useState } from "react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import axios from "axios"

import { useTelemetry } from "../hooks/useTelemetry"
import { useEngineerReport } from "../hooks/useEngineerReport"
import { useLaps } from "../hooks/useLaps"
import { useDriverComparison } from "../hooks/useDriverComparison"

import RacingPanel from "../components/f1/RacingPanel"
import SectionHeader from "../components/f1/SectionHeader"
import StatusLight from "../components/f1/StatusLight"
import TelemetryBar from "../components/f1/TelemetryBar"

type DriverOption = {
  code: string
  name: string
  number?: string
  team?: string
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000"
  
const CHAMPIONSHIP_YEARS = [
  2025,
  2024,
  2023,
  2022,
  2021,
]

const RACE_CALENDARS: Record<number, string[]> = {
  2025: [
    "Australia",
    "China",
    "Japan",
    "Bahrain",
    "Saudi Arabia",
    "Miami",
    "Emilia-Romagna",
    "Monaco",
    "Spain",
    "Canada",
    "Austria",
    "Great Britain",
    "Belgium",
    "Hungary",
    "Netherlands",
    "Italy",
    "Azerbaijan",
    "Singapore",
    "United States",
    "Mexico",
    "São Paulo",
    "Las Vegas",
    "Qatar",
    "Abu Dhabi",
  ],

  2024: [
    "Bahrain",
    "Saudi Arabia",
    "Australia",
    "Japan",
    "China",
    "Miami",
    "Emilia-Romagna",
    "Monaco",
    "Canada",
    "Spain",
    "Austria",
    "Great Britain",
    "Hungary",
    "Belgium",
    "Netherlands",
    "Italy",
    "Azerbaijan",
    "Singapore",
    "United States",
    "Mexico",
    "São Paulo",
    "Las Vegas",
    "Qatar",
    "Abu Dhabi",
  ],

  2023: [
    "Bahrain",
    "Saudi Arabia",
    "Australia",
    "Azerbaijan",
    "Miami",
    "Monaco",
    "Spain",
    "Canada",
    "Austria",
    "Great Britain",
    "Hungary",
    "Belgium",
    "Netherlands",
    "Italy",
    "Singapore",
    "Japan",
    "Qatar",
    "United States",
    "Mexico",
    "São Paulo",
    "Las Vegas",
    "Abu Dhabi",
  ],

  2022: [
    "Bahrain",
    "Saudi Arabia",
    "Australia",
    "Emilia-Romagna",
    "Miami",
    "Spain",
    "Monaco",
    "Azerbaijan",
    "Canada",
    "Great Britain",
    "Austria",
    "France",
    "Hungary",
    "Belgium",
    "Netherlands",
    "Italy",
    "Singapore",
    "Japan",
    "United States",
    "Mexico",
    "São Paulo",
    "Abu Dhabi",
  ],

  2021: [
    "Bahrain",
    "Emilia-Romagna",
    "Portugal",
    "Spain",
    "Monaco",
    "Azerbaijan",
    "France",
    "Styria",
    "Austria",
    "Great Britain",
    "Hungary",
    "Belgium",
    "Netherlands",
    "Italy",
    "Russia",
    "Turkey",
    "United States",
    "Mexico",
    "São Paulo",
    "Qatar",
    "Saudi Arabia",
    "Abu Dhabi",
  ],
}

const SESSION_OPTIONS = [
  { value: "R", label: "Race" },
  { value: "Q", label: "Qualifying" },
  { value: "S", label: "Sprint" },
  { value: "FP1", label: "Free Practice 1" },
  { value: "FP2", label: "Free Practice 2" },
  { value: "FP3", label: "Free Practice 3" },
]

function sessionLabel(session: string) {
  return (
    SESSION_OPTIONS.find(
      (option) => option.value === session
    )?.label ?? session
  )
}

function Dashboard() {
  const [selectedYear, setSelectedYear] =
    useState(2025)

  const [selectedGrandPrix, setSelectedGrandPrix] =
    useState("Monaco")

  const [selectedDriver, setSelectedDriver] =
    useState("VER")

  const [comparisonDriverSelection, setComparisonDriverSelection] =
    useState("VER")

  const [comparisonOpponentSelection, setComparisonOpponentSelection] =
    useState("NOR")

  const [comparisonRequested, setComparisonRequested] =
    useState(false)

  const [selectedSession, setSelectedSession] =
    useState("R")

  const [drivers, setDrivers] =
    useState<DriverOption[]>([])

  const [driversLoading, setDriversLoading] =
    useState(true)

  const raceOptions = useMemo(
    () => RACE_CALENDARS[selectedYear] ?? [],
    [selectedYear]
  )

  useEffect(() => {
    if (
      raceOptions.length > 0 &&
      !raceOptions.includes(selectedGrandPrix)
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedGrandPrix(raceOptions[0])
    }
  }, [selectedYear, selectedGrandPrix, raceOptions])

  const {
    data,
    loading,
    error,
  } = useEngineerReport({
    year: selectedYear,
    grandPrix: selectedGrandPrix,
    driver: selectedDriver,
    sessionType: selectedSession,
  })

  const {
    data: telemetry,
    loading: telemetryLoading,
    error: telemetryError,
  } = useTelemetry({
    year: selectedYear,
    grandPrix: selectedGrandPrix,
    driver: selectedDriver,
    sessionType: selectedSession,
  })

  const {
    laps,
    loading: lapsLoading,
    error: lapsError,
  } = useLaps({
    year: selectedYear,
    grandPrix: selectedGrandPrix,
    driver: selectedDriver,
    sessionType: selectedSession,
    limit: 20,
  })

  const {
    primary,
    secondary,
    loading: comparisonLoading,
    error: comparisonError,
    compare,
    clear: clearComparison,
  } = useDriverComparison({
    year: selectedYear,
    grandPrix: selectedGrandPrix,
    sessionType: selectedSession,
  })

  useEffect(() => {
    let cancelled = false

    async function fetchDrivers() {
      try {
        setDriversLoading(true)

        const response = await axios.get(
          `${API_URL}/drivers/`,
          {
            params: {
              year: selectedYear,
            },
          }
        )

        if (cancelled) return

        const payload = response.data

        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.drivers)
            ? payload.drivers
            : Array.isArray(payload?.data)
              ? payload.data
              : []

        const normalised: DriverOption[] =
          rows
            .map((driver: any) => ({
              code:
                driver.code ??
                driver.Driver ??
                driver.driver ??
                driver.abbreviation ??
                driver.Abbreviation ??
                "",

              name:
                driver.name ??
                driver.Name ??
                driver.full_name ??
                driver.fullName ??
                driver.driver_name ??
                driver.code ??
                driver.Driver ??
                "",

              number:
                driver.number ??
                driver.DriverNumber ??
                driver.driver_number,

              team:
                driver.team ??
                driver.Team,
            }))
            .filter(
              (driver: DriverOption) =>
                driver.code.length > 0
            )

        setDrivers(normalised)

        if (
          normalised.length > 0 &&
          !normalised.some(
            (driver) =>
              driver.code === comparisonDriverSelection
          )
        ) {
          setComparisonDriverSelection(
            normalised[0].code
          )
        }

        if (
          normalised.length > 1 &&
          !normalised.some(
            (driver) =>
              driver.code === comparisonOpponentSelection
          )
        ) {
          const fallbackOpponent =
            normalised.find(
              (driver) =>
                driver.code !== comparisonDriverSelection
            )?.code ?? normalised[1].code

          setComparisonOpponentSelection(
            fallbackOpponent
          )
        }

        if (
          normalised.length > 0 &&
          !normalised.some(
            (driver) =>
              driver.code === selectedDriver
          )
        ) {
          setSelectedDriver(
            normalised[0].code
          )
        }
      } catch (driverError) {
        console.error(
          "Driver list fetch failed:",
          driverError
        )

        if (!cancelled) {
          setDrivers([
            {
              code: "VER",
              name: "Max Verstappen",
              number: "1",
              team: "Red Bull Racing",
            },
            {
              code: "NOR",
              name: "Lando Norris",
              number: "4",
              team: "McLaren",
            },
            {
              code: "LEC",
              name: "Charles Leclerc",
              number: "16",
              team: "Ferrari",
            },
            {
              code: "PIA",
              name: "Oscar Piastri",
              number: "81",
              team: "McLaren",
            },
            {
              code: "HAM",
              name: "Lewis Hamilton",
              number: "44",
              team: "Ferrari",
            },
            {
              code: "RUS",
              name: "George Russell",
              number: "63",
              team: "Mercedes",
            },
            {
              code: "SAI",
              name: "Carlos Sainz",
              number: "55",
              team: "Williams",
            },
            {
              code: "ALO",
              name: "Fernando Alonso",
              number: "14",
              team: "Aston Martin",
            },
            {
              code: "GAS",
              name: "Pierre Gasly",
              number: "10",
              team: "Alpine",
            },
            {
              code: "ALB",
              name: "Alexander Albon",
              number: "23",
              team: "Williams",
            },
          ])
        }
      } finally {
        if (!cancelled) {
          setDriversLoading(false)
        }
      }
    }

    fetchDrivers()

    return () => {
      cancelled = true
    }
    // Driver fallbacks are recalculated from the freshly fetched list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear])

  const [telemetryMetric, setTelemetryMetric] =
    useState<
      | "Speed"
      | "Throttle"
      | "Brake"
      | "RPM"
      | "Gear"
      | "DRS"
    >("Speed")

  const telemetryTabs = [
    {
      key: "Speed",
      label: "SPEED",
      icon: Gauge,
      text: "text-cyan-300",
      border: "border-cyan-400/70",
      bg: "bg-cyan-400/10",
      glow:
        "shadow-[0_0_16px_rgba(34,211,238,0.16)]",
      chart: "#22d3ee",
    },
    {
      key: "Throttle",
      label: "THROTTLE",
      icon: Zap,
      text: "text-yellow-300",
      border: "border-yellow-400/70",
      bg: "bg-yellow-400/10",
      glow:
        "shadow-[0_0_16px_rgba(250,204,21,0.14)]",
      chart: "#facc15",
    },
    {
      key: "Brake",
      label: "BRAKE",
      icon: CircleStop,
      text: "text-red-400",
      border: "border-red-500/70",
      bg: "bg-red-500/10",
      glow:
        "shadow-[0_0_16px_rgba(239,68,68,0.16)]",
      chart: "#ef4444",
    },
    {
      key: "RPM",
      label: "RPM",
      icon: RotateCw,
      text: "text-orange-300",
      border: "border-orange-400/70",
      bg: "bg-orange-400/10",
      glow:
        "shadow-[0_0_16px_rgba(251,146,60,0.15)]",
      chart: "#fb923c",
    },
    {
      key: "Gear",
      label: "GEAR",
      icon: Settings2,
      text: "text-purple-300",
      border: "border-purple-400/70",
      bg: "bg-purple-400/10",
      glow:
        "shadow-[0_0_16px_rgba(192,132,252,0.14)]",
      chart: "#c084fc",
    },
    {
      key: "DRS",
      label: "DRS",
      icon: Wind,
      text: "text-emerald-300",
      border: "border-emerald-400/70",
      bg: "bg-emerald-400/10",
      glow:
        "shadow-[0_0_16px_rgba(52,211,153,0.14)]",
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
      {/* =====================================================
          API CONNECTION STATUS
      ===================================================== */}

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

      {/* =====================================================
          RACE CONTROL
      ===================================================== */}

      <div className="grid gap-3 rounded-xl border border-slate-800/80 bg-[#050912]/80 p-3 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Championship
          </label>

          <select
            value={selectedYear}
            onChange={(event) =>
              setSelectedYear(
                Number(event.target.value)
              )
            }
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs font-bold text-slate-300 outline-none transition focus:border-cyan-400/60"
          >
            {CHAMPIONSHIP_YEARS.map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Grand Prix
          </label>

          <select
            value={selectedGrandPrix}
            onChange={(event) =>
              setSelectedGrandPrix(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs font-bold text-slate-300 outline-none transition focus:border-[#e10600]/60 disabled:cursor-wait disabled:opacity-50"
          >
            {(
              RACE_CALENDARS[selectedYear] ?? []
            ).map((race) => (
              <option
                key={race}
                value={race}
              >
                {race}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Driver
          </label>

          <select
            value={selectedDriver}
            onChange={(event) =>
              setSelectedDriver(
                event.target.value
              )
            }
            disabled={driversLoading}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs font-bold text-slate-300 outline-none transition focus:border-cyan-400/60 disabled:cursor-wait disabled:opacity-50"
          >
            {drivers.map((driver) => (
              <option
                key={driver.code}
                value={driver.code}
              >
                {driver.code}
                {driver.name
                  ? ` · ${driver.name}`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Session
          </label>

          <select
            value={selectedSession}
            onChange={(event) =>
              setSelectedSession(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs font-bold text-slate-300 outline-none transition focus:border-yellow-400/60"
          >
            {SESSION_OPTIONS.map((session) => (
              <option
                key={session.value}
                value={session.value}
              >
                {session.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =====================================================
          SESSION HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <SectionHeader
          eyebrow="Race Intelligence"
          title="Driver Performance"
          description={`${selectedYear} ${selectedGrandPrix} Grand Prix · ${sessionLabel(selectedSession)}`}
        />

        <div className="mb-7 flex items-center gap-4">
          <div className="hidden border-l border-slate-800 pl-4 sm:block">
            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
              Session
            </p>

            <p className="mt-1 font-mono text-xs font-bold text-slate-300">
              {sessionLabel(
                selectedSession
              ).toUpperCase()}
            </p>
          </div>

          <StatusLight
            label={
              loading
                ? "CONNECTING"
                : error
                  ? "OFFLINE"
                  : "FASTF1 DATA FEED"
            }
          />
        </div>
      </div>

      {/* =====================================================
          DRIVER HERO
      ===================================================== */}

      <RacingPanel
        className="carbon"
        accent="red"
      >
        <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative overflow-hidden border-b border-slate-800/70 p-6 lg:border-b-0 lg:border-r">
            <div className="pointer-events-none absolute -right-4 -top-14 select-none font-black text-[180px] leading-none text-white/[0.025]">
              {drivers.find(
                (driver) =>
                  driver.code === selectedDriver
              )?.number ?? ""}
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
                  {selectedDriver}
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-400">
                  {drivers.find(
                    (driver) =>
                      driver.code === selectedDriver
                  )?.name ??
                    selectedDriver}
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700">
                  {drivers.find(
                    (driver) =>
                      driver.code === selectedDriver
                  )?.team ??
                    "F1 DRIVER"}

                  {drivers.find(
                    (driver) =>
                      driver.code === selectedDriver
                  )?.number
                    ? ` · #${
                        drivers.find(
                          (driver) =>
                            driver.code ===
                            selectedDriver
                        )?.number
                      }`
                    : ""}
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
                  {data?.performance_score
                    .overall_score
                    .toFixed(2) ?? "--"}
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
                value={
                  data?.performance_score
                    .speed_score ?? 0
                }
                color="#00b8ff"
              />

              <TelemetryBar
                label="Throttle"
                value={
                  data?.performance_score
                    .throttle_score ?? 0
                }
                suffix="%"
                color="#ffb800"
              />

              <TelemetryBar
                label="Braking"
                value={
                  data?.performance_score
                    .braking_score ?? 0
                }
                color="#e10600"
              />

              <TelemetryBar
                label="Consistency"
                value={
                  data?.performance_score
                    .consistency_score ?? 0
                }
                color="#ffb800"
              />
            </div>
          </div>
        </div>
      </RacingPanel>

      {/* =====================================================
          TELEMETRY + TRACK
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.8fr]">
        <RacingPanel
          title="Telemetry Overview"
          accent="cyan"
        >
          <div className="p-5">
            <div className="mb-5 flex flex-wrap gap-2">
              {telemetryTabs.map((tab) => {
                const Icon = tab.icon
                const active =
                  telemetryMetric === tab.key

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

                    <span>
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>

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
                  opacity: [
                    0.35,
                    0.8,
                    0.35,
                  ],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                }}
                style={{
                  backgroundColor:
                    telemetryColor,
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
                    !telemetryLoading &&
                    !telemetryError
                      ? {
                          backgroundColor:
                            telemetryColor,
                          color: telemetryColor,
                        }
                      : undefined
                  }
                />

                <span
                  className={`
                    text-[9px] font-bold uppercase tracking-widest
                    ${
                      telemetryLoading
                        ? "text-yellow-300"
                        : telemetryError
                          ? "text-red-400"
                          : activeTelemetryTab?.text ??
                            "text-cyan-300"
                    }
                  `}
                >
                  {selectedDriver} ·{" "}
                  {activeTelemetryTab?.label ??
                    telemetryMetric}
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
                        borderTopColor:
                          telemetryColor,
                      }}
                    />

                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                      Loading FastF1 telemetry...
                    </p>
                  </div>
                </div>
              )}

              {!telemetryLoading &&
                telemetryError && (
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
                            fontFamily:
                              "monospace",
                          }}
                          tickFormatter={(value) =>
                            `${Math.round(
                              Number(value)
                            )}`
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
                            fontFamily:
                              "monospace",
                          }}
                          axisLine={false}
                          tickLine={false}
                          width={38}
                          domain={[
                            "auto",
                            "auto",
                          ]}
                        />

                        <Tooltip
                          contentStyle={{
                            background:
                              "#050912",
                            border:
                              "1px solid rgba(0,184,255,0.25)",
                            borderRadius:
                              "6px",
                            fontFamily:
                              "monospace",
                            fontSize: "10px",
                          }}
                          labelStyle={{
                            color: "#64748b",
                          }}
                          itemStyle={{
                            color: telemetryColor,
                          }}
                          labelFormatter={(value) =>
                            `DIST ${Number(
                              value
                            ).toFixed(1)}m`
                          }
                          formatter={(value) => [
                            Number(value).toFixed(
                              telemetryMetric ===
                                "RPM"
                                ? 0
                                : 2
                            ),
                            telemetryMetric,
                          ]}
                        />

                        <Line
                          type="monotone"
                          dataKey={
                            telemetryMetric
                          }
                          stroke={
                            telemetryColor
                          }
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{
                            r: 4,
                            fill:
                              telemetryColor,
                            stroke:
                              "#ffffff",
                            strokeWidth: 1,
                          }}
                          isAnimationActive
                          animationDuration={
                            900
                          }
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
            </div>
          </div>
        </RacingPanel>

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
                {selectedGrandPrix.toUpperCase()}
              </p>

              <p className="text-[8px] font-bold uppercase tracking-widest text-[#e10600]">
                {selectedGrandPrix} Circuit
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
                  filter:
                    "drop-shadow(0 0 8px rgba(225,6,0,.7))",
                }}
              />

              <motion.circle
                cx="205"
                cy="240"
                r="6"
                fill="#00b8ff"
                animate={{
                  opacity: [
                    1,
                    0.5,
                    1,
                  ],
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
                time={
                  data?.sectors.sector_1
                    .fastest ?? 0
                }
                average={
                  data?.sectors.sector_1
                    .average ?? 0
                }
              />

              <SectorBox
                sector="S2"
                time={
                  data?.sectors.sector_2
                    .fastest ?? 0
                }
                average={
                  data?.sectors.sector_2
                    .average ?? 0
                }
              />

              <SectorBox
                sector="S3"
                time={
                  data?.sectors.sector_3
                    .fastest ?? 0
                }
                average={
                  data?.sectors.sector_3
                    .average ?? 0
                }
              />
            </div>
          </div>
        </RacingPanel>
      </div>

      {/* =====================================================
          TELEMETRY METRICS
      ===================================================== */}

      <RacingPanel
        title="Telemetry Metrics"
        accent="cyan"
      >
        <div className="grid grid-cols-2 gap-px bg-slate-800/60 md:grid-cols-4">
          <Metric
            label="DISTANCE"
            value={`${formatNumber(data?.telemetry.distance, 2)} m`}
          />

          <Metric
            label="FULL THROTTLE"
            value={`${formatNumber(data?.telemetry.throttle?.full_throttle, 1)}%`}
          />

          <Metric
            label="BRAKE USAGE"
            value={`${formatNumber(data?.telemetry.braking?.usage, 2)}%`}
          />

          <Metric
            label="DRS USAGE"
            value={`${formatNumber(data?.telemetry.drs_usage, 1)}%`}
          />
        </div>
      </RacingPanel>

      {/* =====================================================
          LOWER ANALYTICS
      ===================================================== */}

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
                {lapsLoading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-800 border-t-[#e10600]" />

                        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                          Loading FastF1 lap data...
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

                {!lapsLoading &&
                  lapsError && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center"
                      >
                        <span className="font-mono text-[9px] uppercase tracking-widest text-red-500">
                          {lapsError}
                        </span>
                      </td>
                    </tr>
                  )}

                {!lapsLoading &&
                  !lapsError &&
                  laps.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center"
                      >
                        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                          No lap data available
                        </span>
                      </td>
                    </tr>
                  )}

                {!lapsLoading &&
                  !lapsError &&
                  laps.map((lap, index) => {
                    const fastestLapTime =
                      laps
                        .filter(
                          (item) =>
                            item.LapTime !==
                              null &&
                            !item.Deleted
                        )
                        .reduce<
                          number | null
                        >(
                          (
                            fastest,
                            item
                          ) =>
                            fastest ===
                            null
                              ? item.LapTime
                              : Math.min(
                                  fastest,
                                  item.LapTime!
                                ),
                          null
                        )

                    const isFastest =
                      lap.LapTime !==
                        null &&
                      fastestLapTime !==
                        null &&
                      lap.LapTime ===
                        fastestLapTime

                    return (
                      <motion.tr
                        key={`${lap.LapNumber}-${lap.Stint ?? "na"}`}
                        initial={{
                          opacity: 0,
                          x: -8,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.04,
                        }}
                        className={`
                          border-b border-slate-900
                          text-[10px]
                          transition-colors
                          hover:bg-slate-900/40
                          ${
                            isFastest
                              ? "bg-[#e10600]/5"
                              : ""
                          }
                        `}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-300">
                              {lap.LapNumber}
                            </span>

                            {isFastest && (
                              <span className="rounded bg-[#e10600]/10 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest text-[#e10600]">
                                BEST
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 font-mono text-slate-500">
                          {formatLapSector(
                            lap.Sector1Time
                          )}
                        </td>

                        <td className="py-3 font-mono text-slate-500">
                          {formatLapSector(
                            lap.Sector2Time
                          )}
                        </td>

                        <td className="py-3 font-mono text-slate-500">
                          {formatLapSector(
                            lap.Sector3Time
                          )}
                        </td>

                        <td
                          className={`
                            py-3 font-mono font-bold
                            ${
                              isFastest
                                ? "text-[#e10600]"
                                : "text-slate-300"
                            }
                          `}
                        >
                          {formatLapTime(
                            lap.LapTime
                          )}
                        </td>
                      </motion.tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </RacingPanel>

        {/* DRIVER COMPARISON */}

        <RacingPanel
          title="Driver Comparison"
          accent="cyan"
        >
          <div className="p-5">
            <div className="mb-5 space-y-3">
              <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
                <div>
                  <label className="mb-2 block text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    Primary Driver
                  </label>

                  <select
                    value={
                      comparisonDriverSelection
                    }
                    onChange={(event) => {
                      setComparisonDriverSelection(
                        event.target.value
                      )
                      setComparisonRequested(
                        false
                      )
                      clearComparison()
                    }}
                    disabled={
                      driversLoading ||
                      comparisonLoading
                    }
                    className="w-full rounded-lg border border-cyan-400/20 bg-slate-950 px-3 py-2 font-mono text-[10px] font-bold text-slate-300 outline-none transition focus:border-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {drivers.map(
                      (driver) => (
                        <option
                          key={driver.code}
                          value={
                            driver.code
                          }
                        >
                          {driver.code}
                          {driver.name
                            ? ` · ${driver.name}`
                            : ""}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="hidden items-center justify-center pb-1 md:flex">
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.25em] text-slate-700">
                    VS
                  </span>
                </div>

                <div>
                  <label className="mb-2 block text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    Compare Against
                  </label>

                  <select
                    value={
                      comparisonOpponentSelection
                    }
                    onChange={(event) => {
                      setComparisonOpponentSelection(
                        event.target.value
                      )
                      setComparisonRequested(
                        false
                      )
                      clearComparison()
                    }}
                    disabled={
                      driversLoading ||
                      comparisonLoading
                    }
                    className="w-full rounded-lg border border-orange-400/20 bg-slate-950 px-3 py-2 font-mono text-[10px] font-bold text-slate-300 outline-none transition focus:border-orange-400/60 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {drivers
                      .filter(
                        (driver) =>
                          driver.code !==
                          comparisonDriverSelection
                      )
                      .map(
                        (driver) => (
                          <option
                            key={
                              driver.code
                            }
                            value={
                              driver.code
                            }
                          >
                            {driver.code}
                            {driver.name
                              ? ` · ${driver.name}`
                              : ""}
                          </option>
                        )
                      )}
                  </select>
                </div>
              </div>

              <button
                type="button"
                disabled={
                  driversLoading ||
                  comparisonLoading ||
                  drivers.length < 2 ||
                  comparisonDriverSelection ===
                    comparisonOpponentSelection
                }
                onClick={async () => {
                  if (
                    comparisonDriverSelection ===
                    comparisonOpponentSelection
                  ) {
                    return
                  }

                  const success =
                    await compare(
                      comparisonDriverSelection,
                      comparisonOpponentSelection,
                      drivers
                    )

                  setComparisonRequested(
                    success
                  )
                }}
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-lg border border-cyan-400/40
                  bg-cyan-400/10 px-4 py-2.5
                  font-mono text-[9px] font-black uppercase tracking-[0.2em]
                  text-cyan-300
                  shadow-[0_0_14px_rgba(34,211,238,0.08)]
                  transition-all duration-200
                  hover:border-cyan-300/70 hover:bg-cyan-400/15
                  hover:text-cyan-200
                  disabled:cursor-not-allowed disabled:border-slate-800
                  disabled:bg-slate-950 disabled:text-slate-700
                  disabled:shadow-none
                "
              >
                {comparisonLoading ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
                    ANALYZING...
                  </>
                ) : (
                  <>
                    <Zap size={12} />
                    RUN COMPARISON
                  </>
                )}
              </button>
            </div>

            {comparisonLoading && (
              <div className="flex items-center justify-center gap-3 py-10">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-800 border-t-cyan-400" />

                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                  Comparing telemetry...
                </span>
              </div>
            )}

            {!comparisonLoading &&
              comparisonError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                  <p className="text-[8px] font-black uppercase tracking-widest text-red-400">
                    Comparison Feed Error
                  </p>

                  <p className="mt-1 font-mono text-[9px] leading-4 text-slate-600">
                    {comparisonError}
                  </p>
                </div>
              )}

            {!comparisonLoading &&
              !comparisonError &&
              comparisonRequested &&
              primary &&
              secondary && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    <ComparisonDriverCard
                      driver={primary}
                      accent="#22d3ee"
                      selected
                    />

                    <ComparisonDriverCard
                      driver={secondary}
                      accent="#fb923c"
                    />
                  </div>

                  <ComparisonMetric
                    label="Overall"
                    primary={primary.overall}
                    secondary={
                      secondary.overall
                    }
                  />

                  <ComparisonMetric
                    label="Speed"
                    primary={primary.speed}
                    secondary={
                      secondary.speed
                    }
                  />

                  <ComparisonMetric
                    label="Throttle"
                    primary={
                      primary.throttle
                    }
                    secondary={
                      secondary.throttle
                    }
                  />

                  <ComparisonMetric
                    label="Braking"
                    primary={
                      primary.braking
                    }
                    secondary={
                      secondary.braking
                    }
                  />

                  <ComparisonMetric
                    label="Consistency"
                    primary={
                      primary.consistency
                    }
                    secondary={
                      secondary.consistency
                    }
                  />
                </div>
              )}

            {!comparisonLoading &&
              !comparisonError &&
              (!comparisonRequested ||
                !primary ||
                !secondary) && (
                <div className="py-8 text-center">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                    Select two drivers,
                    then run the
                    comparison
                  </p>
                </div>
              )}
          </div>
        </RacingPanel>

        {/* ENGINEER INSIGHTS */}

        <RacingPanel
          title="Engineer Insights"
          accent="yellow"
        >
          <div className="space-y-3 p-5">
            {data?.recommendations?.map(
              (
                recommendation,
                index
              ) => (
                <Insight
                  key={`${recommendation.area}-${index}`}
                  icon={
                    recommendation.priority.toLowerCase() ===
                    "high"
                      ? AlertTriangle
                      : BrainCircuit
                  }
                  priority={recommendation.priority.toUpperCase()}
                  area={recommendation.area.toUpperCase()}
                  message={
                    recommendation.message
                  }
                  color={
                    recommendation.priority.toLowerCase() ===
                    "high"
                      ? "#e10600"
                      : "#ffb800"
                  }
                />
              )
            )}
          </div>
        </RacingPanel>
      </div>

      {/* =====================================================
          BOTTOM STRIP
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">
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
                {data?.telemetry.speed
                  .max ?? "--"}
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
                {data?.recommendations?.[0]
                  ?.message ??
                  "Waiting for engineering instructions."}
              </p>
            </div>
          </div>
        </RacingPanel>
      </div>
    </div>
  )
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function formatLapSector(
  seconds: number | null
): string {
  if (
    seconds === null ||
    !Number.isFinite(seconds)
  ) {
    return "—"
  }

  return seconds.toFixed(3)
}

function formatNumber(
  value: number | null | undefined,
  decimals: number
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "--"
  }

  return value.toFixed(decimals)
}

function formatLapTime(
  seconds: number | null
): string {
  if (
    seconds === null ||
    !Number.isFinite(seconds)
  ) {
    return "—"
  }

  const minutes = Math.floor(
    seconds / 60
  )

  const remaining =
    seconds - minutes * 60

  return `${minutes}:${remaining
    .toFixed(3)
    .padStart(6, "0")}`
}

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

function ComparisonDriverCard({
  driver,
  accent,
  selected = false,
}: {
  driver: {
    code: string
    name: string
    team?: string
    overall: number
  }
  accent: string
  selected?: boolean
}) {
  return (
    <div
      className="rounded-lg border p-3"
      style={{
        borderColor: `${accent}33`,
        background: `${accent}08`,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="font-mono text-lg font-black"
            style={{
              color: accent,
            }}
          >
            {driver.code}
          </p>

          <p className="mt-0.5 text-[9px] font-medium text-slate-500">
            {driver.name}
          </p>

          {driver.team && (
            <p className="mt-1 text-[7px] font-bold uppercase tracking-widest text-slate-700">
              {driver.team}
            </p>
          )}
        </div>

        {selected && (
          <span
            className="rounded px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest"
            style={{
              color: accent,
              background: `${accent}12`,
            }}
          >
            PRIMARY
          </span>
        )}
      </div>
    </div>
  )
}

function ComparisonMetric({
  label,
  primary,
  secondary,
}: {
  label: string
  primary: number
  secondary: number
}) {
  const primaryValue = Math.min(
    100,
    Math.max(
      0,
      Number(primary) || 0
    )
  )

  const secondaryValue = Math.min(
    100,
    Math.max(
      0,
      Number(secondary) || 0
    )
  )

  const delta =
    primaryValue - secondaryValue

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
          {label}
        </span>

        <span
          className={`
            font-mono
            text-[8px]
            ${
              delta > 0
                ? "text-cyan-400"
                : delta < 0
                  ? "text-orange-400"
                  : "text-slate-700"
            }
          `}
        >
          Δ {delta >= 0 ? "+" : ""}
          {delta.toFixed(2)}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div>
          <div className="mb-1 text-right font-mono text-[9px] font-bold text-cyan-400">
            {primaryValue.toFixed(2)}
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-900">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${primaryValue}%`,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="ml-auto h-full rounded-full"
              style={{
                background: "#22d3ee",
                boxShadow:
                  "0 0 8px rgba(34,211,238,0.35)",
              }}
            />
          </div>
        </div>

        <span className="font-mono text-[8px] font-bold text-slate-800">
          VS
        </span>

        <div>
          <div className="mb-1 font-mono text-[9px] font-bold text-orange-400">
            {secondaryValue.toFixed(2)}
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-900">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${secondaryValue}%`,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="h-full rounded-full"
              style={{
                background: "#fb923c",
                boxShadow:
                  "0 0 8px rgba(251,146,60,0.35)",
              }}
            />
          </div>
        </div>
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

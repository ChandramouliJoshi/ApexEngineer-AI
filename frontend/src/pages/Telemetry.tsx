import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  Gauge,
  Zap,
  CircleStop,
  RotateCw,
  Radio,
  Flag,
  TrendingUp,
  ArrowDown,
  Timer,
  Settings2,
  Crosshair,
  Cpu,
  ChevronRight,
  Signal,
} from "lucide-react"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

import { useTelemetry } from "../hooks/useTelemetry"

const YEARS = [2025, 2024, 2023, 2022, 2021]

const GRAND_PRIXES = [
  "Bahrain",
  "Saudi Arabia",
  "Australia",
  "Japan",
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
]

const DRIVERS = [
  { code: "VER", name: "Max Verstappen" },
  { code: "NOR", name: "Lando Norris" },
  { code: "PIA", name: "Oscar Piastri" },
  { code: "LEC", name: "Charles Leclerc" },
  { code: "HAM", name: "Lewis Hamilton" },
  { code: "RUS", name: "George Russell" },
  { code: "ANT", name: "Kimi Antonelli" },
  { code: "ALO", name: "Fernando Alonso" },
  { code: "GAS", name: "Pierre Gasly" },
  { code: "ALB", name: "Alexander Albon" },
  { code: "SAI", name: "Carlos Sainz" },
  { code: "OCO", name: "Esteban Ocon" },
  { code: "BEA", name: "Oliver Bearman" },
]

const SESSIONS = [
  { value: "R", label: "Race" },
  { value: "Q", label: "Qualifying" },
  { value: "S", label: "Sprint" },
  { value: "FP1", label: "Free Practice 1" },
  { value: "FP2", label: "Free Practice 2" },
  { value: "FP3", label: "Free Practice 3" },
]

type MetricKey =
  | "Speed"
  | "Throttle"
  | "Brake"
  | "RPM"
  | "Gear"
  | "DRS"

const METRICS: {
  key: MetricKey
  label: string
  unit: string
  color: string
  border: string
  bg: string
  icon: typeof Gauge
}[] = [
  {
    key: "Speed",
    label: "SPEED",
    unit: "km/h",
    color: "#22d3ee",
    border: "border-cyan-400/50",
    bg: "bg-cyan-400/[0.07]",
    icon: Gauge,
  },
  {
    key: "Throttle",
    label: "THROTTLE",
    unit: "%",
    color: "#facc15",
    border: "border-yellow-400/50",
    bg: "bg-yellow-400/[0.07]",
    icon: Zap,
  },
  {
    key: "Brake",
    label: "BRAKE",
    unit: "%",
    color: "#f87171",
    border: "border-red-400/50",
    bg: "bg-red-400/[0.07]",
    icon: CircleStop,
  },
  {
    key: "RPM",
    label: "RPM",
    unit: "rpm",
    color: "#a78bfa",
    border: "border-violet-400/50",
    bg: "bg-violet-400/[0.07]",
    icon: RotateCw,
  },
  {
    key: "Gear",
    label: "GEAR",
    unit: "",
    color: "#34d399",
    border: "border-emerald-400/50",
    bg: "bg-emerald-400/[0.07]",
    icon: Settings2,
  },
  {
    key: "DRS",
    label: "DRS",
    unit: "",
    color: "#fb923c",
    border: "border-orange-400/50",
    bg: "bg-orange-400/[0.07]",
    icon: Radio,
  },
]

function formatNumber(value: number | null, decimals = 0) {
  if (value === null || !Number.isFinite(value)) {
    return "—"
  }

  return value.toFixed(decimals)
}

function formatDistance(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} km`
  }

  return `${value.toFixed(0)} m`
}

function TelemetryTooltip({
  active,
  payload,
  label,
  metric,
}: any) {
  if (!active || !payload?.length) {
    return null
  }

  const point = payload[0]?.payload

  return (
    <div className="min-w-[180px] rounded-xl border border-cyan-400/30 bg-[#020617]/95 p-4 shadow-[0_0_35px_rgba(34,211,238,0.12)] backdrop-blur-xl">

      <div className="flex items-center justify-between gap-5">

        <span className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-slate-600">
          TRACK DISTANCE
        </span>

        <Crosshair
          size={11}
          className="text-cyan-400"
        />

      </div>

      <p className="mt-1 font-mono text-sm font-black text-slate-100">
        {formatDistance(Number(label))}
      </p>

      <div className="my-3 h-px bg-slate-800" />

      <p
        className="font-mono text-xl font-black"
        style={{ color: metric.color }}
      >
        {formatNumber(
          Number(point?.[metric.key]),
          1
        )}

        <span className="ml-2 text-[8px] uppercase tracking-widest text-slate-600">
          {metric.unit}
        </span>
      </p>

      <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.15em] text-slate-600">
        TELEMETRY SAMPLE
      </p>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  accent = "cyan",
  right,
}: {
  icon: typeof Activity
  title: string
  subtitle?: string
  accent?: "cyan" | "orange"
  right?: React.ReactNode
}) {
  const accentClass =
    accent === "orange"
      ? "text-orange-300"
      : "text-cyan-300"

  return (
    <div className="flex items-start justify-between gap-4">

      <div className="flex items-start gap-3">

        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
            accent === "orange"
              ? "border-orange-400/30 bg-orange-400/[0.05]"
              : "border-cyan-400/30 bg-cyan-400/[0.05]"
          }`}
        >
          <Icon
            size={14}
            className={accentClass}
          />
        </div>

        <div>

          <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-slate-100">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.15em] text-slate-600">
              {subtitle}
            </p>
          )}

        </div>

      </div>

      {right}
    </div>
  )
}

export default function Telemetry() {

  const [year, setYear] = useState(2025)
  const [grandPrix, setGrandPrix] =
    useState("Monaco")
  const [driver, setDriver] =
    useState("VER")
  const [sessionType, setSessionType] =
    useState("R")

  const [metric, setMetric] =
    useState<MetricKey>("Speed")

  const {
    data,
    loading,
    error,
  } = useTelemetry({
    year,
    grandPrix,
    driver,
    sessionType,
  })

  const selectedMetric =
    METRICS.find(
      (item) => item.key === metric
    ) ?? METRICS[0]

  const stats = useMemo(() => {

    if (!data.length) {
      return {
        maxSpeed: null,
        avgSpeed: null,
        maxRPM: null,
        throttle: null,
        braking: null,
        drs: null,
        maxSpeedPoint: null,
        distance: 0,
      }
    }

    const speeds = data
      .map((point) => point.Speed)
      .filter(Number.isFinite)

    const rpms = data
      .map((point) => point.RPM)
      .filter(Number.isFinite)

    const maxSpeed = speeds.length
      ? Math.max(...speeds)
      : null

    const avgSpeed = speeds.length
      ? speeds.reduce(
          (sum, value) => sum + value,
          0
        ) / speeds.length
      : null

    const maxRPM = rpms.length
      ? Math.max(...rpms)
      : null

    const throttleUsage =
      data.length > 0
        ? (data.filter(
            (point) =>
              point.Throttle >= 95
          ).length /
            data.length) *
          100
        : null

    const brakingUsage =
      data.length > 0
        ? (data.filter(
            (point) =>
              point.Brake > 10
          ).length /
            data.length) *
          100
        : null

    const drsUsage =
      data.length > 0
        ? (data.filter(
            (point) =>
              point.DRS > 0
          ).length /
            data.length) *
          100
        : null

    const maxSpeedPoint =
      maxSpeed !== null
        ? data.find(
            (point) =>
              point.Speed === maxSpeed
          )
        : null

    return {
      maxSpeed,
      avgSpeed,
      maxRPM,
      throttle: throttleUsage,
      braking: brakingUsage,
      drs: drsUsage,
      maxSpeedPoint,
      distance:
        data[data.length - 1]?.Distance ??
        0,
    }

  }, [data])

  const chartData = useMemo(() => {

    if (data.length <= 700) {
      return data
    }

    const step =
      Math.ceil(data.length / 700)

    return data.filter(
      (_, index) =>
        index % step === 0
    )

  }, [data])

  const driverName =
    DRIVERS.find(
      (item) => item.code === driver
    )?.name ?? driver

  const sessionName =
    SESSIONS.find(
      (item) =>
        item.value === sessionType
    )?.label ?? sessionType

  const insights = useMemo(() => {

    if (!data.length) {
      return []
    }

    const heavyBrakingPoints =
      data.filter(
        (point) =>
          point.Brake >= 80
      ).length

    const fullThrottlePoints =
      data.filter(
        (point) =>
          point.Throttle >= 95
      ).length

    const drsPoints =
      data.filter(
        (point) =>
          point.DRS > 0
      ).length

    const gears = data
      .map((point) => point.Gear)
      .filter(
        (gear) =>
          Number.isFinite(gear) &&
          gear > 0
      )

    const highestGear = gears.length
      ? Math.max(...gears)
      : null

    return [
      {
        icon: Gauge,
        label: "TOP SPEED",
        value:
          stats.maxSpeed !== null
            ? `${stats.maxSpeed.toFixed(0)} km/h`
            : "—",
        detail:
          stats.maxSpeedPoint
            ? `PEAK @ ${formatDistance(
                stats.maxSpeedPoint.Distance
              )}`
            : "NO SPEED PEAK",
        tone: "cyan",
      },
      {
        icon: ArrowDown,
        label: "HEAVY BRAKING",
        value:
          heavyBrakingPoints.toString(),
        detail:
          "HIGH BRAKE-LOAD SAMPLES",
        tone: "red",
      },
      {
        icon: Zap,
        label: "FULL THROTTLE",
        value:
          data.length > 0
            ? `${(
                (fullThrottlePoints /
                  data.length) *
                100
              ).toFixed(1)}%`
            : "—",
        detail:
          "TRACK SAMPLE COVERAGE",
        tone: "yellow",
      },
      {
        icon: Radio,
        label: "DRS ACTIVE",
        value:
          data.length > 0
            ? `${(
                (drsPoints /
                  data.length) *
                100
              ).toFixed(1)}%`
            : "—",
        detail:
          highestGear !== null
            ? `PEAK GEAR ${highestGear}`
            : "NO GEAR DATA",
        tone: "orange",
      },
    ]

  }, [data, stats])

  const toneMap: Record<
    string,
    {
      border: string
      bg: string
      text: string
      glow: string
      iconBg: string
    }
  > = {
    cyan: {
      border: "border-cyan-400/30",
      bg: "bg-cyan-400/[0.035]",
      text: "text-cyan-300",
      glow:
        "hover:shadow-[0_0_35px_rgba(34,211,238,0.10)]",
      iconBg:
        "border-cyan-400/20 bg-cyan-400/[0.05]",
    },
    red: {
      border: "border-red-400/30",
      bg: "bg-red-400/[0.035]",
      text: "text-red-300",
      glow:
        "hover:shadow-[0_0_35px_rgba(248,113,113,0.08)]",
      iconBg:
        "border-red-400/20 bg-red-400/[0.05]",
    },
    yellow: {
      border:
        "border-yellow-400/30",
      bg: "bg-yellow-400/[0.035]",
      text: "text-yellow-300",
      glow:
        "hover:shadow-[0_0_35px_rgba(250,204,21,0.08)]",
      iconBg:
        "border-yellow-400/20 bg-yellow-400/[0.05]",
    },
    orange: {
      border:
        "border-orange-400/30",
      bg: "bg-orange-400/[0.035]",
      text: "text-orange-300",
      glow:
        "hover:shadow-[0_0_35px_rgba(251,146,60,0.08)]",
      iconBg:
        "border-orange-400/20 bg-orange-400/[0.05]",
    },
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-slate-200">

      {/* =====================================================
          TOP SESSION BAR
      ====================================================== */}

      <div className="relative border-b border-slate-800/80 bg-[#020617]">

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-cyan-400/30 via-transparent to-orange-400/20" />

        <div className="flex items-center justify-between px-6 py-4">

          <div>

            <p className="font-mono text-[8px] font-black uppercase tracking-[0.25em] text-slate-600">
              SESSION
            </p>

            <p className="mt-1 text-sm font-bold text-slate-300">
              {year} {grandPrix} Grand Prix ·{" "}
              {sessionName}
            </p>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.035] px-4 py-2">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

            <span className="font-mono text-[9px] font-black uppercase tracking-wider text-slate-400">
              Engineering System Online
            </span>

          </div>

        </div>
      </div>

      <main className="mx-auto max-w-[1700px] px-6 py-8">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative mb-7 overflow-hidden rounded-2xl border border-slate-800/90 bg-[#030817]">

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.08),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(251,146,60,0.05),transparent_25%)]" />

          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 border-l border-b border-cyan-400/10" />

          <div className="relative flex flex-col gap-8 p-7 xl:flex-row xl:items-end xl:justify-between">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/[0.05]">

                  <Activity
                    size={13}
                    className="text-cyan-300"
                  />

                </div>

                <span className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400">
                  ApexEngineer AI
                </span>

              </div>

              <h1 className="font-mono text-3xl font-black uppercase tracking-tight text-slate-100 md:text-4xl">
                Telemetry Intelligence
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-slate-600">

                <span>{year}</span>

                <span className="text-slate-800">
                  /
                </span>

                <span>{grandPrix}</span>

                <span className="text-slate-800">
                  /
                </span>

                <span className="text-cyan-400/70">
                  {driver}
                </span>

                <span className="text-slate-800">
                  /
                </span>

                <span>{sessionType}</span>

              </div>

              <p className="mt-3 max-w-xl font-mono text-[8px] uppercase tracking-[0.13em] text-slate-600">
                DRIVER TELEMETRY · SPEED · THROTTLE · BRAKE · POWERTRAIN
              </p>

            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-800/80 rounded-xl border border-slate-800/80 bg-slate-950/50">

              <div className="min-w-[90px] px-5 py-4">

                <p className="font-mono text-[7px] font-black uppercase tracking-widest text-slate-600">
                  DRIVER
                </p>

                <p className="mt-1 font-mono text-xl font-black text-cyan-300">
                  {driver}
                </p>

              </div>

              <div className="min-w-[100px] px-5 py-4">

                <p className="font-mono text-[7px] font-black uppercase tracking-widest text-slate-600">
                  SAMPLES
                </p>

                <p className="mt-1 font-mono text-xl font-black text-slate-100">
                  {data.length.toLocaleString()}
                </p>

              </div>

              <div className="min-w-[115px] px-5 py-4">

                <p className="font-mono text-[7px] font-black uppercase tracking-widest text-slate-600">
                  DISTANCE
                </p>

                <p className="mt-1 font-mono text-xl font-black text-orange-300">
                  {formatDistance(
                    stats.distance
                  )}
                </p>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            PARAMETERS
        ====================================================== */}

        <section className="group relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950/65 shadow-[0_10px_50px_rgba(0,0,0,0.18)]">

          <div className="absolute left-0 top-0 h-px w-32 bg-gradient-to-r from-cyan-400 to-transparent" />

          <div className="p-6">

            <SectionHeader
              icon={Settings2}
              title="Telemetry Parameters"
              subtitle="Configure analysis target"
              right={
                <div className="hidden items-center gap-2 md:flex">

                  <Signal
                    size={11}
                    className="text-emerald-400"
                  />

                  <span className="font-mono text-[7px] font-black uppercase tracking-widest text-slate-600">
                    STREAM READY
                  </span>

                </div>
              }
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              {[
                {
                  label: "SEASON",
                  value: year,
                  setter: (
                    value: string
                  ) =>
                    setYear(
                      Number(value)
                    ),
                  options: YEARS.map(
                    (item) => ({
                      value: item,
                      label: item,
                    })
                  ),
                },
                {
                  label: "GRAND PRIX",
                  value: grandPrix,
                  setter:
                    setGrandPrix,
                  options:
                    GRAND_PRIXES.map(
                      (item) => ({
                        value: item,
                        label: item,
                      })
                    ),
                },
                {
                  label: "DRIVER",
                  value: driver,
                  setter: setDriver,
                  options:
                    DRIVERS.map(
                      (item) => ({
                        value: item.code,
                        label: `${item.code} · ${item.name}`,
                      })
                    ),
                },
                {
                  label: "SESSION",
                  value: sessionType,
                  setter:
                    setSessionType,
                  options:
                    SESSIONS.map(
                      (item) => ({
                        value: item.value,
                        label: item.label,
                      })
                    ),
                },
              ].map((control) => (

                <label
                  key={control.label}
                  className="group/control"
                >

                  <span className="mb-2 flex items-center justify-between font-mono text-[7px] font-black uppercase tracking-[0.18em] text-slate-600">

                    {control.label}

                    <span className="opacity-0 transition group-hover/control:opacity-100">
                      <ChevronRight
                        size={9}
                        className="text-cyan-400"
                      />
                    </span>

                  </span>

                  <div className="relative">

                    <select
                      value={control.value}
                      onChange={(event) =>
                        control.setter(
                          event.target.value
                        )
                      }
                      className="w-full appearance-none rounded-lg border border-slate-800 bg-[#020617] px-4 py-3.5 pr-10 font-mono text-[10px] font-bold text-slate-200 outline-none transition hover:border-cyan-400/30 hover:bg-slate-950 focus:border-cyan-400/60 focus:shadow-[0_0_20px_rgba(34,211,238,0.06)]"
                    >

                      {control.options.map(
                        (option) => (
                          <option
                            key={String(
                              option.value
                            )}
                            value={
                              option.value
                            }
                          >
                            {option.label}
                          </option>
                        )
                      )}

                    </select>

                    <ChevronRight
                      size={12}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-600"
                    />

                  </div>

                </label>

              ))}

            </div>

          </div>
        </section>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-5 rounded-xl border border-red-500/30 bg-red-500/[0.045] p-5"
          >

            <div className="flex items-start gap-3">

              <Flag
                size={15}
                className="mt-0.5 text-red-400"
              />

              <div>

                <p className="font-mono text-[9px] font-black uppercase tracking-widest text-red-300">
                  Telemetry Unavailable
                </p>

                <p className="mt-2 font-mono text-[9px] text-red-200/70">
                  {error}
                </p>

              </div>

            </div>

          </motion.div>
        )}

        {/* =====================================================
            KPI
        ====================================================== */}

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6">

          {[
            {
              label: "MAX SPEED",
              value:
                stats.maxSpeed !== null
                  ? `${stats.maxSpeed.toFixed(0)}`
                  : "—",
              unit: "KM/H",
              icon: Gauge,
              color: "text-cyan-300",
              border:
                "border-cyan-400/25",
              glow:
                "hover:shadow-[0_0_30px_rgba(34,211,238,0.10)]",
            },
            {
              label: "AVG SPEED",
              value:
                stats.avgSpeed !== null
                  ? `${stats.avgSpeed.toFixed(0)}`
                  : "—",
              unit: "KM/H",
              icon: TrendingUp,
              color: "text-blue-300",
              border:
                "border-blue-400/25",
              glow:
                "hover:shadow-[0_0_30px_rgba(96,165,250,0.08)]",
            },
            {
              label: "MAX RPM",
              value:
                stats.maxRPM !== null
                  ? `${Math.round(
                      stats.maxRPM
                    ).toLocaleString()}`
                  : "—",
              unit: "RPM",
              icon: RotateCw,
              color: "text-violet-300",
              border:
                "border-violet-400/25",
              glow:
                "hover:shadow-[0_0_30px_rgba(167,139,250,0.08)]",
            },
            {
              label: "FULL THROTTLE",
              value:
                stats.throttle !== null
                  ? `${stats.throttle.toFixed(1)}`
                  : "—",
              unit: "%",
              icon: Zap,
              color: "text-yellow-300",
              border:
                "border-yellow-400/25",
              glow:
                "hover:shadow-[0_0_30px_rgba(250,204,21,0.08)]",
            },
            {
              label: "BRAKING",
              value:
                stats.braking !== null
                  ? `${stats.braking.toFixed(1)}`
                  : "—",
              unit: "%",
              icon: CircleStop,
              color: "text-red-300",
              border:
                "border-red-400/25",
              glow:
                "hover:shadow-[0_0_30px_rgba(248,113,113,0.08)]",
            },
            {
              label: "DRS ACTIVE",
              value:
                stats.drs !== null
                  ? `${stats.drs.toFixed(1)}`
                  : "—",
              unit: "%",
              icon: Radio,
              color: "text-orange-300",
              border:
                "border-orange-400/25",
              glow:
                "hover:shadow-[0_0_30px_rgba(251,146,60,0.08)]",
            },
          ].map((card, index) => {

            const Icon = card.icon

            return (
              <motion.div
                key={card.label}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.04,
                }}
                whileHover={{
                  y: -4,
                }}
                className={`group relative overflow-hidden rounded-xl border ${card.border} bg-slate-950/75 p-5 transition duration-300 hover:bg-slate-900/80 ${card.glow}`}
              >

                <div className="absolute bottom-0 left-0 h-px w-0 bg-current opacity-50 transition-all duration-500 group-hover:w-full" />

                <div className="flex items-center justify-between">

                  <span className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-slate-600">
                    {card.label}
                  </span>

                  <Icon
                    size={14}
                    className={`${card.color} opacity-60 transition duration-300 group-hover:scale-110 group-hover:opacity-100`}
                  />

                </div>

                <div className="mt-5 flex items-end gap-2">

                  <span
                    className={`font-mono text-2xl font-black tracking-tight ${card.color}`}
                  >
                    {card.value}
                  </span>

                  <span className="pb-1 font-mono text-[7px] font-black uppercase tracking-widest text-slate-600">
                    {card.unit}
                  </span>

                </div>

              </motion.div>
            )
          })}

        </div>

        {/* =====================================================
            TELEMETRY TRACE
        ====================================================== */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950/70 shadow-[0_15px_60px_rgba(0,0,0,0.2)]">

          <div className="relative border-b border-slate-800/80 p-6">

            <div className="absolute left-0 top-0 h-px w-40 bg-gradient-to-r from-cyan-400 to-transparent" />

            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/[0.05]">

                    <Activity
                      size={14}
                      className="text-cyan-300"
                    />

                  </div>

                  <div>

                    <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-slate-100">
                      Telemetry Trace
                    </h2>

                    <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.16em] text-slate-600">
                      {driverName} ·{" "}
                      {grandPrix} ·{" "}
                      {sessionName}
                    </p>

                  </div>

                </div>

              </div>

              <div className="flex flex-wrap gap-2">

                {METRICS.map((item) => {

                  const Icon = item.icon
                  const active =
                    item.key === metric

                  return (
                    <motion.button
                      key={item.key}
                      type="button"
                      whileHover={{
                        y: -2,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={() =>
                        setMetric(item.key)
                      }
                      className={`relative flex items-center gap-2 overflow-hidden rounded-lg border px-3.5 py-2.5 font-mono text-[7px] font-black uppercase tracking-widest transition ${
                        active
                          ? `${item.border} ${item.bg}`
                          : "border-slate-800 bg-slate-950 text-slate-600 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-300"
                      }`}
                      style={
                        active
                          ? {
                              color:
                                item.color,
                            }
                          : undefined
                      }
                    >

                      {active && (
                        <span
                          className="absolute bottom-0 left-0 right-0 h-px"
                          style={{
                            background:
                              item.color,
                          }}
                        />
                      )}

                      <Icon size={10} />

                      {item.label}

                    </motion.button>
                  )
                })}

              </div>

            </div>

          </div>

          <div className="p-4 md:p-6">

            {loading ? (
              <div className="flex h-[460px] items-center justify-center">

                <div className="text-center">

                  <div className="relative mx-auto h-10 w-10">

                    <div className="absolute inset-0 animate-ping rounded-full border border-cyan-400/20" />

                    <div className="absolute inset-1 animate-spin rounded-full border-2 border-slate-800 border-t-cyan-400" />

                    <Activity
                      size={12}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400"
                    />

                  </div>

                  <p className="mt-5 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
                    Loading telemetry stream
                  </p>

                </div>

              </div>
            ) : data.length === 0 ? (
              <div className="flex h-[460px] items-center justify-center">

                <div className="text-center">

                  <Activity
                    size={30}
                    className="mx-auto text-slate-700"
                  />

                  <p className="mt-4 font-mono text-[9px] font-black uppercase tracking-widest text-slate-500">
                    No telemetry samples
                  </p>

                  <p className="mt-2 font-mono text-[8px] text-slate-700">
                    Try another driver, session or Grand Prix.
                  </p>

                </div>

              </div>
            ) : (
              <div className="h-[460px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 20,
                      left: 5,
                      bottom: 15,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="4 6"
                      stroke="rgba(148,163,184,0.065)"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="Distance"
                      type="number"
                      domain={[
                        "dataMin",
                        "dataMax",
                      ]}
                      tickFormatter={(value) =>
                        `${Math.round(
                          value
                        )}m`
                      }
                      tick={{
                        fill: "#64748b",
                        fontSize: 9,
                        fontFamily:
                          "monospace",
                        fontWeight: 700,
                      }}
                      axisLine={{
                        stroke:
                          "rgba(148,163,184,0.12)",
                      }}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fill: "#64748b",
                        fontSize: 9,
                        fontFamily:
                          "monospace",
                        fontWeight: 700,
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={60}
                      domain={[
                        "auto",
                        "auto",
                      ]}
                    />

                    <Tooltip
                      cursor={{
                        stroke:
                          "rgba(34,211,238,0.25)",
                        strokeDasharray:
                          "4 4",
                      }}
                      content={
                        <TelemetryTooltip
                          metric={
                            selectedMetric
                          }
                        />
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey={metric}
                      stroke={
                        selectedMetric.color
                      }
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{
                        r: 5,
                        strokeWidth: 2,
                        stroke:
                          "#020617",
                        fill:
                          selectedMetric.color,
                      }}
                      isAnimationActive={false}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>
            )}

          </div>

          {!loading &&
            data.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/70 px-6 py-3">

                <div className="flex items-center gap-5">

                  <div className="flex items-center gap-2">

                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background:
                          selectedMetric.color,
                        boxShadow: `0 0 8px ${selectedMetric.color}`,
                      }}
                    />

                    <span className="font-mono text-[7px] font-black uppercase tracking-widest text-slate-600">
                      {selectedMetric.label}
                    </span>

                  </div>

                  <div className="hidden items-center gap-2 sm:flex">

                    <span className="h-px w-5 border-t border-dashed border-slate-600" />

                    <span className="font-mono text-[7px] font-black uppercase tracking-widest text-slate-700">
                      TRACK DISTANCE
                    </span>

                  </div>

                </div>

                <span className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-slate-700">
                  HOVER FOR TELEMETRY
                </span>

              </div>
            )}

        </section>

        {/* =====================================================
            ENGINEERING INSIGHTS
        ====================================================== */}

        <section className="mt-6">

          <div className="mb-4 flex items-end justify-between">

            <div>

              <div className="flex items-center gap-2">

                <Cpu
                  size={13}
                  className="text-orange-300"
                />

                <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-slate-100">
                  Engineering Insights
                </h2>

              </div>

              <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.16em] text-slate-600">
                Derived from telemetry samples
              </p>

            </div>

            <span className="hidden rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-[7px] font-black uppercase tracking-widest text-slate-600 md:block">
              LIVE ANALYSIS
            </span>

          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            {insights.map(
              (item, index) => {

                const Icon = item.icon
                const tone =
                  toneMap[item.tone]

                return (
                  <motion.div
                    key={item.label}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.05,
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    className={`group relative overflow-hidden rounded-xl border ${tone.border} ${tone.bg} p-5 transition duration-300 ${tone.glow}`}
                  >

                    <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full border-b border-l border-white/[0.02]" />

                    <div className="flex items-center justify-between">

                      <span className="font-mono text-[7px] font-black uppercase tracking-[0.16em] text-slate-600">
                        {item.label}
                      </span>

                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border ${tone.iconBg}`}
                      >

                        <Icon
                          size={13}
                          className={`${tone.text} transition group-hover:scale-110`}
                        />

                      </div>

                    </div>

                    <p
                      className={`mt-6 font-mono text-2xl font-black ${tone.text}`}
                    >
                      {item.value}
                    </p>

                    <p className="mt-2 font-mono text-[7px] font-bold uppercase tracking-widest text-slate-600">
                      {item.detail}
                    </p>

                  </motion.div>
                )
              }
            )}

          </div>

        </section>

        {/* =====================================================
            BREAKDOWN
        ====================================================== */}

        <section className="mt-6 grid gap-5 lg:grid-cols-2">

          {/* Coverage */}

          <div className="rounded-2xl border border-slate-800/90 bg-slate-950/65 p-6 transition hover:border-cyan-400/15">

            <SectionHeader
              icon={Timer}
              title="Telemetry Coverage"
              subtitle="Control input distribution"
            />

            <div className="mt-7 space-y-6">

              {[
                {
                  label: "THROTTLE",
                  value:
                    stats.throttle ?? 0,
                  color:
                    "bg-yellow-400",
                  glow:
                    "shadow-[0_0_12px_rgba(250,204,21,0.4)]",
                },
                {
                  label: "BRAKE",
                  value:
                    stats.braking ?? 0,
                  color:
                    "bg-red-400",
                  glow:
                    "shadow-[0_0_12px_rgba(248,113,113,0.4)]",
                },
                {
                  label: "DRS",
                  value:
                    stats.drs ?? 0,
                  color:
                    "bg-orange-400",
                  glow:
                    "shadow-[0_0_12px_rgba(251,146,60,0.4)]",
                },
              ].map((item) => (

                <div
                  key={item.label}
                >

                  <div className="mb-2 flex items-center justify-between">

                    <span className="font-mono text-[8px] font-black uppercase tracking-widest text-slate-500">
                      {item.label}
                    </span>

                    <span className="font-mono text-[9px] font-black text-slate-300">
                      {item.value.toFixed(
                        1
                      )}
                      %
                    </span>

                  </div>

                  <div className="relative h-2 overflow-hidden rounded-full bg-slate-900">

                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            item.value
                          )
                        )}%`,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      className={`h-full rounded-full ${item.color} ${item.glow}`}
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Snapshot */}

          <div className="rounded-2xl border border-slate-800/90 bg-slate-950/65 p-6 transition hover:border-orange-400/15">

            <SectionHeader
              icon={Gauge}
              title="Session Snapshot"
              subtitle="Current analysis context"
              accent="orange"
            />

            <div className="mt-6 grid grid-cols-2 gap-3">

              {[
                {
                  label: "DRIVER",
                  value: driver,
                  detail: driverName,
                  color:
                    "text-cyan-300",
                },
                {
                  label: "SESSION",
                  value:
                    sessionType,
                  detail:
                    sessionName,
                  color:
                    "text-orange-300",
                },
                {
                  label: "TRACK",
                  value:
                    grandPrix,
                  detail:
                    `${year} SEASON`,
                  color:
                    "text-slate-100",
                },
                {
                  label: "MAX GEAR",
                  value: data.length
                    ? Math.max(
                        ...data.map(
                          (point) =>
                            point.Gear
                        )
                      )
                    : "—",
                  detail:
                    "HIGHEST RECORDED",
                  color:
                    "text-emerald-300",
                },
              ].map((item) => (

                <motion.div
                  key={item.label}
                  whileHover={{
                    y: -2,
                  }}
                  className="group rounded-xl border border-slate-800 bg-[#020617] p-4 transition hover:border-slate-700 hover:bg-slate-900/60"
                >

                  <div className="flex items-center justify-between">

                    <p className="font-mono text-[7px] font-black uppercase tracking-widest text-slate-600">
                      {item.label}
                    </p>

                    <ChevronRight
                      size={10}
                      className="text-slate-800 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
                    />

                  </div>

                  <p
                    className={`mt-3 truncate font-mono text-lg font-black ${item.color}`}
                  >
                    {item.value}
                  </p>

                  <p className="mt-1 truncate font-mono text-[7px] uppercase tracking-wider text-slate-600">
                    {item.detail}
                  </p>

                </motion.div>

              ))}

            </div>

          </div>

        </section>

        {/* =====================================================
            FOOTER STATUS
        ====================================================== */}

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-800/70 py-5 sm:flex-row">

          <div className="flex items-center gap-2">

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

            <span className="font-mono text-[7px] font-black uppercase tracking-[0.2em] text-slate-700">
              Telemetry stream synchronized
            </span>

          </div>

          <span className="font-mono text-[7px] font-black uppercase tracking-[0.18em] text-slate-800">
            APX · {year} · {grandPrix} ·{" "}
            {driver}
          </span>

        </div>

      </main>
    </div>
  )
}
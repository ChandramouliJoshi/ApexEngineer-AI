import { useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  Gauge,
  Lightbulb,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
  CheckCircle2,
  Radio,
} from "lucide-react"
import type { ElementType } from "react"

import { useEngineer } from "../hooks/useEngineer"


function Engineer() {

  const [year, setYear] = useState(2025)
  const [grandPrix, setGrandPrix] = useState("Monaco")
  const [driver, setDriver] = useState("PIA")
  const [sessionType, setSessionType] = useState("Race")

  const {
    data,
    loading,
    error,
  } = useEngineer({
    year,
    grandPrix,
    driver,
    sessionType,
  })

  const score = data?.performance_score


  /*
   * ============================================================
   * DERIVED ENGINEERING INTELLIGENCE
   * ============================================================
   */

  const performanceDiagnosis = useMemo(() => {

    if (!score) {
      return null
    }

    const metrics = [
      {
        name: "Speed",
        value: score.speed_score,
      },
      {
        name: "Throttle",
        value: score.throttle_score,
      },
      {
        name: "Braking",
        value: score.braking_score,
      },
      {
        name: "Consistency",
        value: score.consistency_score,
      },
    ]

    const sorted = [...metrics].sort(
      (a, b) => a.value - b.value
    )

    const weakest = sorted[0]
    const secondWeakest = sorted[1]

    const strongest = [...metrics].sort(
      (a, b) => b.value - a.value
    )[0]

    return {
      weakest,
      secondWeakest,
      strongest,
    }

  }, [score])


  const sectorAnalysis = useMemo(() => {

    if (!data?.sectors) {
      return null
    }

    const sectors = [
      {
        name: "Sector 1",
        fastest: data.sectors.sector_1.fastest,
        average: data.sectors.sector_1.average,
      },
      {
        name: "Sector 2",
        fastest: data.sectors.sector_2.fastest,
        average: data.sectors.sector_2.average,
      },
      {
        name: "Sector 3",
        fastest: data.sectors.sector_3.fastest,
        average: data.sectors.sector_3.average,
      },
    ].map((sector) => ({
      ...sector,
      gap: Math.max(
        0,
        sector.average - sector.fastest
      ),
    }))

    const largestGap = [...sectors].sort(
      (a, b) => b.gap - a.gap
    )[0]

    const bestSector = [...sectors].sort(
      (a, b) => a.average - b.average
    )[0]

    return {
      sectors,
      largestGap,
      bestSector,
    }

  }, [data])


  const actionPlan = useMemo(() => {

    if (!performanceDiagnosis || !sectorAnalysis) {
      return []
    }

    const weakest =
      performanceDiagnosis.weakest.name

    const secondWeakest =
      performanceDiagnosis.secondWeakest.name

    return [
      {
        priority: "01",
        label: "PRIMARY FOCUS",
        title: `Improve ${weakest} performance`,
        message:
          `${weakest} is currently the driver's weakest performance metric at ` +
          `${performanceDiagnosis.weakest.value.toFixed(2)}/100. ` +
          `This should be the main focus of the next run.`,
      },
      {
        priority: "02",
        label: "NEXT RUN",
        title: `Target ${sectorAnalysis.largestGap.name}`,
        message:
          `${sectorAnalysis.largestGap.name} has the largest average-to-best gap ` +
          `at +${sectorAnalysis.largestGap.gap.toFixed(3)}s. ` +
          `Focus on repeatability through this sector.`,
      },
      {
        priority: "03",
        label: "MONITOR",
        title: `Protect ${performanceDiagnosis.strongest.name} strength`,
        message:
          `${performanceDiagnosis.strongest.name} is currently the strongest area ` +
          `at ${performanceDiagnosis.strongest.value.toFixed(2)}/100. ` +
          `Do not sacrifice this performance while addressing ${secondWeakest}.`,
      },
    ]

  }, [
    performanceDiagnosis,
    sectorAnalysis,
  ])


  return (
    <div className="space-y-8">


      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col gap-5 border-b border-slate-800 pb-7 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="mb-3 flex items-center gap-2">

            <Lightbulb
              size={16}
              className="text-amber-400"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
              ApexEngineer AI
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            ENGINEER REPORT
          </h1>

          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
            Driver performance intelligence & recommendations
          </p>

        </div>


        {data && score && (

          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] px-5 py-4">

            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
              Overall Performance
            </p>

            <div className="mt-1 flex items-end gap-2">

              <span className="text-3xl font-black text-amber-300">
                {score.overall_score.toFixed(2)}
              </span>

              <span className="mb-1 text-[10px] text-slate-500">
                / 100
              </span>

            </div>

          </div>

        )}

      </div>


      {/* ========================================================
          PARAMETERS
      ======================================================== */}

      <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">

        <div className="mb-5 flex items-center gap-2">

          <Gauge
            size={15}
            className="text-amber-400"
          />

          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            Report Parameters
          </h2>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          <ParameterSelect
            label="Season"
            value={String(year)}
            onChange={(value) =>
              setYear(Number(value))
            }
            options={[
              "2025",
              "2024",
              "2023",
            ]}
          />


          <ParameterSelect
            label="Grand Prix"
            value={grandPrix}
            onChange={setGrandPrix}
            options={[
              "Monaco",
              "Bahrain",
              "Australia",
              "Japan",
              "China",
              "Miami",
              "Emilia-Romagna",
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
            ]}
          />


          <ParameterSelect
            label="Driver"
            value={driver}
            onChange={setDriver}
            options={[
              "PIA",
              "NOR",
              "VER",
              "LEC",
              "HAM",
              "RUS",
              "ANT",
              "ALO",
              "STR",
              "GAS",
              "OCO",
              "BEA",
              "TSU",
              "LAW",
              "HAD",
              "SAI",
              "ALB",
              "COL",
              "HUL",
              "BOR",
            ]}
          />


          <ParameterSelect
            label="Session"
            value={sessionType}
            onChange={setSessionType}
            options={[
              "Race",
              "Qualifying",
              "Sprint",
            ]}
          />

        </div>

      </section>


      {/* ========================================================
          LOADING
      ======================================================== */}

      {loading && (

        <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60">

          <div className="text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-amber-400" />

            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Generating engineer report
            </p>

          </div>

        </div>

      )}


      {/* ========================================================
          ERROR
      ======================================================== */}

      {!loading && error && (

        <div className="rounded-xl border border-red-400/20 bg-red-400/[0.04] p-6">

          <div className="flex items-center gap-2">

            <AlertTriangle
              size={16}
              className="text-red-400"
            />

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-400">
              Engineer report unavailable
            </p>

          </div>

          <p className="mt-2 text-sm text-slate-400">
            {error}
          </p>

        </div>

      )}


      {/* ========================================================
          REPORT
      ======================================================== */}

      {!loading && !error && data && score && (

        <>


          {/* ====================================================
              PERFORMANCE SCORE
          ==================================================== */}

          <section>

            <SectionHeading
              icon={Target}
              title="Performance Score"
              subtitle="Normalized driver performance metrics"
            />


            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

              <ScoreCard
                label="Overall"
                value={score.overall_score}
                icon={ShieldCheck}
                emphasis
              />

              <ScoreCard
                label="Speed"
                value={score.speed_score}
                icon={Zap}
              />

              <ScoreCard
                label="Throttle"
                value={score.throttle_score}
                icon={Activity}
              />

              <ScoreCard
                label="Braking"
                value={score.braking_score}
                icon={Gauge}
              />

              <ScoreCard
                label="Consistency"
                value={score.consistency_score}
                icon={Target}
              />

            </div>

          </section>


          {/* ====================================================
              PERFORMANCE DIAGNOSIS
          ==================================================== */}

          {performanceDiagnosis && (

            <section>

              <SectionHeading
                icon={TrendingDown}
                title="Performance Diagnosis"
                subtitle="Automatically derived from the current performance profile"
              />


              <div className="grid gap-4 lg:grid-cols-3">


                {/* Primary weakness */}

                <DiagnosisCard
                  label="Primary Weakness"
                  title={
                    performanceDiagnosis.weakest.name
                  }
                  value={
                    performanceDiagnosis.weakest.value
                  }
                  icon={AlertTriangle}
                  tone="red"
                  message={
                    `${performanceDiagnosis.weakest.name} is the weakest ` +
                    `performance area and should receive the highest ` +
                    `attention during the next run.`
                  }
                />


                {/* Secondary weakness */}

                <DiagnosisCard
                  label="Secondary Focus"
                  title={
                    performanceDiagnosis.secondWeakest.name
                  }
                  value={
                    performanceDiagnosis.secondWeakest.value
                  }
                  icon={Target}
                  tone="amber"
                  message={
                    `${performanceDiagnosis.secondWeakest.name} is the ` +
                    `next-largest performance limitation and should be ` +
                    `monitored after the primary issue.`
                  }
                />


                {/* Strength */}

                <DiagnosisCard
                  label="Strongest Area"
                  title={
                    performanceDiagnosis.strongest.name
                  }
                  value={
                    performanceDiagnosis.strongest.value
                  }
                  icon={TrendingUp}
                  tone="emerald"
                  message={
                    `${performanceDiagnosis.strongest.name} is currently ` +
                    `the driver's strongest measured area. Protect this ` +
                    `performance while improving weaker metrics.`
                  }
                />

              </div>

            </section>

          )}


          {/* ====================================================
              TELEMETRY OVERVIEW
          ==================================================== */}

          <section>

            <SectionHeading
              icon={Activity}
              title="Telemetry Overview"
              subtitle="Session-level driving characteristics"
            />


            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

              <MetricCard
                label="Maximum Speed"
                value={
                  data.telemetry.speed.max.toFixed(1)
                }
                unit="km/h"
              />

              <MetricCard
                label="Average Speed"
                value={
                  data.telemetry.speed.average.toFixed(1)
                }
                unit="km/h"
              />

              <MetricCard
                label="Maximum RPM"
                value={
                  data.telemetry.rpm.max.toFixed(0)
                }
                unit="RPM"
              />

              <MetricCard
                label="Average RPM"
                value={
                  data.telemetry.rpm.average.toFixed(0)
                }
                unit="RPM"
              />

              <MetricCard
                label="Maximum Gear"
                value={
                  data.telemetry.gear.max.toFixed(0)
                }
                unit="GEAR"
              />

              <MetricCard
                label="Distance"
                value={
                  data.telemetry.distance.toFixed(1)
                }
                unit="m"
              />

              <MetricCard
                label="Full Throttle"
                value={
                  data.telemetry.full_throttle.toFixed(1)
                }
                unit="%"
              />

              <MetricCard
                label="Brake Usage"
                value={
                  data.telemetry.brake_usage.toFixed(1)
                }
                unit="%"
              />

            </div>

          </section>


          {/* ====================================================
              SECTOR PERFORMANCE
          ==================================================== */}

          <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">

            <div className="border-b border-slate-800 px-6 py-5">

              <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
                Sector Performance
              </h2>

              <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-600">
                Fastest, average and consistency gap
              </p>

            </div>


            <div className="grid grid-cols-1 divide-y divide-slate-800 md:grid-cols-3 md:divide-x md:divide-y-0">

              <SectorCard
                name="Sector 1"
                fastest={data.sectors.sector_1.fastest}
                average={data.sectors.sector_1.average}
              />

              <SectorCard
                name="Sector 2"
                fastest={data.sectors.sector_2.fastest}
                average={data.sectors.sector_2.average}
              />

              <SectorCard
                name="Sector 3"
                fastest={data.sectors.sector_3.fastest}
                average={data.sectors.sector_3.average}
              />

            </div>


            <div className="border-t border-slate-800 bg-slate-900/30 px-6 py-5">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Best Sector Combination
                  </span>

                  <p className="mt-1 text-[9px] uppercase tracking-widest text-slate-700">
                    Theoretical best from individual sector bests
                  </p>

                </div>

                <span className="text-2xl font-bold text-emerald-300">
                  {data.sectors.best_sector_combination.toFixed(3)}s
                </span>

              </div>

            </div>

          </section>


          {/* ====================================================
              SECTOR LOSS ANALYSIS
          ==================================================== */}

          {sectorAnalysis && (

            <section>

              <SectionHeading
                icon={TrendingDown}
                title="Sector Loss Analysis"
                subtitle="Average pace versus the driver's best sector performance"
              />


              <div className="grid gap-4 lg:grid-cols-3">

                {sectorAnalysis.sectors.map(
                  (sector) => {

                    const isLargest =
                      sector.name ===
                      sectorAnalysis.largestGap.name

                    const maxGap = Math.max(
                      ...sectorAnalysis.sectors.map(
                        (item) => item.gap
                      ),
                      0.001
                    )

                    const width =
                      Math.max(
                        8,
                        Math.min(
                          100,
                          (sector.gap / maxGap) * 100
                        )
                      )

                    return (

                      <div
                        key={sector.name}
                        className={[
                          "rounded-xl border p-5",
                          isLargest
                            ? "border-red-400/30 bg-red-400/[0.04]"
                            : "border-slate-800 bg-slate-950/60",
                        ].join(" ")}
                      >

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                              {sector.name}
                            </p>

                            {isLargest && (
                              <span className="mt-1 inline-block text-[8px] font-bold uppercase tracking-widest text-red-400">
                                Largest Gap
                              </span>
                            )}

                          </div>


                          <span
                            className={
                              isLargest
                                ? "text-lg font-black text-red-300"
                                : "text-lg font-black text-slate-200"
                            }
                          >
                            +{sector.gap.toFixed(3)}s
                          </span>

                        </div>


                        <div className="mt-5">

                          <div className="mb-2 flex justify-between text-[8px] uppercase tracking-widest">

                            <span className="text-slate-600">
                              Consistency Gap
                            </span>

                            <span className="text-slate-500">
                              {sector.average.toFixed(3)}s avg
                            </span>

                          </div>


                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

                            <div
                              className={[
                                "h-full rounded-full transition-all",
                                isLargest
                                  ? "bg-red-400"
                                  : "bg-amber-400",
                              ].join(" ")}
                              style={{
                                width: `${width}%`,
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    )
                  }
                )}

              </div>


              <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-5">

                <div className="flex items-start gap-3">

                  <Target
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-400"
                  />

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300">
                      Engineering Finding
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">

                      {sectorAnalysis.largestGap.name}
                      {" "}shows the largest gap between the driver's
                      best and average performance at{" "}
                      <span className="font-semibold text-white">
                        +{sectorAnalysis.largestGap.gap.toFixed(3)}s
                      </span>
                      . This is the first sector to target for
                      consistency improvement.

                    </p>

                  </div>

                </div>

              </div>

            </section>

          )}


          {/* ====================================================
              ENGINEER RECOMMENDATIONS
          ==================================================== */}

          <section>

            <SectionHeading
              icon={Lightbulb}
              title="Engineer Recommendations"
              subtitle="Prioritized guidance from the engineering analysis"
            />


            <div className="space-y-3">

              {data.recommendations.map(
                (recommendation, index) => {

                  const highPriority =
                    recommendation.priority.toLowerCase() ===
                    "high"

                  return (

                    <div
                      key={`${recommendation.area}-${index}`}
                      className={[
                        "rounded-xl border p-5",
                        highPriority
                          ? "border-red-400/20 bg-red-400/[0.04]"
                          : "border-amber-400/20 bg-amber-400/[0.04]",
                      ].join(" ")}
                    >

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

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
                              {recommendation.area}
                            </p>

                            <span
                              className={[
                                "text-[9px] font-semibold uppercase tracking-[0.18em]",
                                highPriority
                                  ? "text-red-400"
                                  : "text-amber-400",
                              ].join(" ")}
                            >
                              {recommendation.priority} Priority
                            </span>

                          </div>

                        </div>

                      </div>


                      <p className="mt-4 text-sm leading-6 text-slate-400">
                        {recommendation.message}
                      </p>

                    </div>

                  )
                }
              )}

            </div>

          </section>


          {/* ====================================================
              ENGINEERING ACTION PLAN
          ==================================================== */}

          {actionPlan.length > 0 && (

            <section>

              <SectionHeading
                icon={CheckCircle2}
                title="Engineering Action Plan"
                subtitle="Recommended sequence for the next driving run"
              />


              <div className="grid gap-4 lg:grid-cols-3">

                {actionPlan.map(
                  (action) => (

                    <div
                      key={action.priority}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-5"
                    >

                      <div className="flex items-start justify-between">

                        <div>

                          <span className="font-mono text-2xl font-black text-amber-400">
                            {action.priority}
                          </span>

                          <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">
                            {action.label}
                          </p>

                        </div>


                        <CheckCircle2
                          size={17}
                          className="text-emerald-400"
                        />

                      </div>


                      <h3 className="mt-5 text-sm font-bold text-white">
                        {action.title}
                      </h3>


                      <p className="mt-3 text-xs leading-6 text-slate-500">
                        {action.message}
                      </p>

                    </div>

                  )
                )}

              </div>

            </section>

          )}


          {/* ====================================================
              RACE ENGINEER RADIO
          ==================================================== */}

          <section className="rounded-xl border border-red-400/20 bg-red-400/[0.025]">

            <div className="flex items-center gap-4 p-5">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-red-400">

                <Radio size={20} />

              </div>


              <div>

                <div className="flex items-center gap-2">

                  <span className="text-[9px] font-bold uppercase tracking-widest text-red-400">
                    ENGINEER RADIO
                  </span>

                  <span className="text-[9px] text-slate-700">
                    ·
                  </span>

                  <span className="text-[9px] uppercase tracking-widest text-slate-600">
                    PRIORITY MESSAGE
                  </span>

                </div>


                <p className="mt-2 text-xs leading-5 text-slate-400">

                  {data.recommendations?.[0]?.message ??
                    "No engineering instruction available."}

                </p>

              </div>

            </div>

          </section>


        </>

      )}

    </div>
  )
}


/* ================================================================
   PARAMETER SELECT
================================================================ */

interface ParameterSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}


function ParameterSelect({
  label,
  value,
  onChange,
  options,
}: ParameterSelectProps) {

  return (

    <div>

      <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-slate-600">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-medium text-slate-200 outline-none transition focus:border-amber-400"
      >

        {options.map(
          (option) => (

            <option
              key={option}
              value={option}
            >
              {option}
            </option>

          )
        )}

      </select>

    </div>

  )
}


/* ================================================================
   SECTION HEADING
================================================================ */

interface SectionHeadingProps {
  icon: ElementType
  title: string
  subtitle: string
}


function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: SectionHeadingProps) {

  return (

    <div className="mb-4 flex items-start gap-2">

      <Icon
        size={15}
        className="mt-0.5 text-amber-400"
      />

      <div>

        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
          {title}
        </h2>

        <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-600">
          {subtitle}
        </p>

      </div>

    </div>

  )
}


/* ================================================================
   SCORE CARD
================================================================ */

interface ScoreCardProps {
  label: string
  value: number
  icon: ElementType
  emphasis?: boolean
}


function ScoreCard({
  label,
  value,
  icon: Icon,
  emphasis = false,
}: ScoreCardProps) {

  const safeValue = Number.isFinite(value)
    ? value
    : 0

  return (

    <div
      className={[
        "rounded-xl border p-5",
        emphasis
          ? "border-amber-400/30 bg-amber-400/[0.06]"
          : "border-slate-800 bg-slate-950/60",
      ].join(" ")}
    >

      <div className="flex items-center justify-between">

        <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>

        <Icon
          size={15}
          className={
            emphasis
              ? "text-amber-400"
              : "text-slate-600"
          }
        />

      </div>


      <p
        className={[
          "mt-4 font-bold",
          emphasis
            ? "text-3xl text-amber-300"
            : "text-2xl text-slate-200",
        ].join(" ")}
      >
        {safeValue.toFixed(2)}
      </p>


      <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{
            width: `${Math.min(
              Math.max(safeValue, 0),
              100
            )}%`,
          }}
        />

      </div>

    </div>

  )
}


/* ================================================================
   DIAGNOSIS CARD
================================================================ */

interface DiagnosisCardProps {
  label: string
  title: string
  value: number
  icon: ElementType
  tone: "red" | "amber" | "emerald"
  message: string
}


function DiagnosisCard({
  label,
  title,
  value,
  icon: Icon,
  tone,
  message,
}: DiagnosisCardProps) {

  const toneClasses = {
    red: {
      border: "border-red-400/25",
      bg: "bg-red-400/[0.04]",
      iconBg: "bg-red-400/10",
      icon: "text-red-400",
      value: "text-red-300",
    },

    amber: {
      border: "border-amber-400/25",
      bg: "bg-amber-400/[0.04]",
      iconBg: "bg-amber-400/10",
      icon: "text-amber-400",
      value: "text-amber-300",
    },

    emerald: {
      border: "border-emerald-400/25",
      bg: "bg-emerald-400/[0.04]",
      iconBg: "bg-emerald-400/10",
      icon: "text-emerald-400",
      value: "text-emerald-300",
    },
  }[tone]

  return (

    <div
      className={[
        "rounded-xl border p-5",
        toneClasses.border,
        toneClasses.bg,
      ].join(" ")}
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">
            {label}
          </p>

          <div className="mt-3 flex items-center gap-3">

            <div
              className={[
                "flex h-9 w-9 items-center justify-center rounded-lg",
                toneClasses.iconBg,
              ].join(" ")}
            >

              <Icon
                size={17}
                className={toneClasses.icon}
              />

            </div>

            <h3 className="text-lg font-bold text-white">
              {title}
            </h3>

          </div>

        </div>


        <span
          className={[
            "text-xl font-black",
            toneClasses.value,
          ].join(" ")}
        >
          {value.toFixed(2)}
        </span>

      </div>


      <p className="mt-5 text-xs leading-6 text-slate-500">
        {message}
      </p>

    </div>

  )
}


/* ================================================================
   METRIC CARD
================================================================ */

interface MetricCardProps {
  label: string
  value: string
  unit: string
}


function MetricCard({
  label,
  value,
  unit,
}: MetricCardProps) {

  return (

    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">

      <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
        {label}
      </p>

      <div className="mt-3 flex items-end gap-2">

        <span className="text-2xl font-bold text-slate-200">
          {value}
        </span>

        <span className="mb-1 text-[9px] text-slate-600">
          {unit}
        </span>

      </div>

    </div>

  )
}


/* ================================================================
   SECTOR CARD
================================================================ */

interface SectorCardProps {
  name: string
  fastest: number
  average: number
}


function SectorCard({
  name,
  fastest,
  average,
}: SectorCardProps) {

  const gap = Math.max(
    0,
    average - fastest
  )

  return (

    <div className="p-6">

      <div className="flex items-center justify-between">

        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {name}
        </p>

        <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400">
          +{gap.toFixed(3)}s
        </span>

      </div>


      <div className="mt-4 grid grid-cols-2 gap-4">

        <div>

          <p className="text-[9px] uppercase tracking-[0.15em] text-slate-600">
            Fastest
          </p>

          <p className="mt-1 text-xl font-bold text-emerald-300">
            {fastest.toFixed(3)}s
          </p>

        </div>


        <div>

          <p className="text-[9px] uppercase tracking-[0.15em] text-slate-600">
            Average
          </p>

          <p className="mt-1 text-xl font-bold text-slate-300">
            {average.toFixed(3)}s
          </p>

        </div>

      </div>

    </div>

  )
}


export default Engineer
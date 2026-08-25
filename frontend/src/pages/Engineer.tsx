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
  CheckCircle2,
  Radio,
  Flag,
  CircleDot,
} from "lucide-react"
import type { ElementType } from "react"

import { useEngineer } from "../hooks/useEngineer"


// ================================================================
// TYPES
// ================================================================

type SessionCode = "R" | "Q" | "S"

interface SessionOption {
  label: string
  value: SessionCode
}

function safeNumber(
  value: number | null | undefined,
  fallback = 0,
) {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : fallback
}


// ================================================================
// MAIN ENGINEER PAGE
// ================================================================

function Engineer() {

  const [year, setYear] = useState(2025)
  const [grandPrix, setGrandPrix] = useState("Monaco")
  const [driver] = useState("PIA")

  // Backend uses R / Q / S
  const [sessionType, setSessionType] =
    useState<SessionCode>("R")


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


  // ============================================================
  // SESSION OPTIONS
  // ============================================================

  const sessionOptions: SessionOption[] = [
    {
      label: "Race",
      value: "R",
    },
    {
      label: "Qualifying",
      value: "Q",
    },
    {
      label: "Sprint",
      value: "S",
    },
  ]


  // ============================================================
  // SESSION LABEL
  // ============================================================

  const sessionLabel =
    sessionOptions.find(
      (option) =>
        option.value === sessionType
    )?.label ?? sessionType


  // ============================================================
  // PERFORMANCE DIAGNOSIS
  // ============================================================

  const performanceDiagnosis = useMemo(() => {

    if (!score) {
      return null
    }


    const metrics = [
      {
        name: "Speed",
        value: safeNumber(
          score.speed_score
        ),
      },
      {
        name: "Throttle",
        value: safeNumber(
          score.throttle_score
        ),
      },
      {
        name: "Braking",
        value: safeNumber(
          score.braking_score
        ),
      },
      {
        name: "Consistency",
        value: safeNumber(
          score.consistency_score
        ),
      },
    ]


    const validMetrics =
      metrics.filter(
        (metric) =>
          Number.isFinite(
            metric.value
          )
      )


    if (!validMetrics.length) {
      return null
    }


    const ascending =
      [...validMetrics].sort(
        (a, b) =>
          a.value - b.value
      )


    const descending =
      [...validMetrics].sort(
        (a, b) =>
          b.value - a.value
      )


    return {

      weakest:
        ascending[0],

      secondWeakest:
        ascending[1] ??
        ascending[0],

      strongest:
        descending[0],
    }

  }, [score])


  // ============================================================
  // SECTOR ANALYSIS
  // ============================================================

  const sectorAnalysis = useMemo(() => {

    if (!data?.sectors) {
      return null
    }


    const sectors = [

      {
        name: "Sector 1",

        fastest: safeNumber(
          data.sectors.sector_1?.fastest
        ),

        average: safeNumber(
          data.sectors.sector_1?.average
        ),
      },

      {
        name: "Sector 2",

        fastest: safeNumber(
          data.sectors.sector_2?.fastest
        ),

        average: safeNumber(
          data.sectors.sector_2?.average
        ),
      },

      {
        name: "Sector 3",

        fastest: safeNumber(
          data.sectors.sector_3?.fastest
        ),

        average: safeNumber(
          data.sectors.sector_3?.average
        ),
      },

    ].map((sector) => ({

      ...sector,

      gap: Math.max(
        0,
        sector.average -
        sector.fastest
      ),

    }))


    const largestGap =
      [...sectors].sort(
        (a, b) =>
          b.gap - a.gap
      )[0]


    const bestSector =
      [...sectors].sort(
        (a, b) =>
          a.average - b.average
      )[0]


    return {
      sectors,
      largestGap,
      bestSector,
    }

  }, [data])


  // ============================================================
  // CORNER ANALYSIS
  // ============================================================

  const cornerAnalysis = useMemo(() => {

    if (!data?.corners?.length) {
      return null
    }


    const corners =
      [...data.corners]


    const priorityRank = {
      High: 3,
      Medium: 2,
      Low: 1,
    }


    const highestPriority =
      [...corners].sort(
        (a, b) => {

          const aRank =
            priorityRank[
              a.priority as keyof
              typeof priorityRank
            ] ?? 0

          const bRank =
            priorityRank[
              b.priority as keyof
              typeof priorityRank
            ] ?? 0


          if (aRank !== bRank) {
            return bRank - aRank
          }


          return (
            safeNumber(
              a.corner_score
            ) -
            safeNumber(
              b.corner_score
            )
          )

        }
      )[0]


    const weakestCorner =
      [...corners].sort(
        (a, b) =>
          safeNumber(
            a.corner_score
          ) -
          safeNumber(
            b.corner_score
          )
      )[0]


    const strongestCorner =
      [...corners].sort(
        (a, b) =>
          safeNumber(
            b.corner_score
          ) -
          safeNumber(
            a.corner_score
          )
      )[0]


    const largestSpeedLoss =
      [...corners].sort(
        (a, b) =>
          safeNumber(
            b.entry_to_apex_loss
          ) -
          safeNumber(
            a.entry_to_apex_loss
          )
      )[0]


    const bestAcceleration =
      [...corners].sort(
        (a, b) =>
          safeNumber(
            b.apex_to_exit_gain
          ) -
          safeNumber(
            a.apex_to_exit_gain
          )
      )[0]


    const highPriority =
      corners.filter(
        (corner) =>
          String(
            corner.priority
          ).toLowerCase() ===
          "high"
      )


    return {

      corners,

      highestPriority,

      weakestCorner,

      strongestCorner,

      largestSpeedLoss,

      bestAcceleration,

      highPriority,

    }

  }, [data])


  // ============================================================
  // ENGINEERING ACTION PLAN
  // ============================================================

  const actionPlan = useMemo(() => {

    if (!performanceDiagnosis) {
      return []
    }


    const weakest =
      performanceDiagnosis.weakest


    const secondWeakest =
      performanceDiagnosis.secondWeakest


    const strongest =
      performanceDiagnosis.strongest


    const plan: Array<{
      priority: string
      label: string
      title: string
      message: string
    }> = []


    // ----------------------------------------------------------
    // PRIORITY 01
    // PRIMARY PERFORMANCE LIMITATION
    // ----------------------------------------------------------

    plan.push({

      priority: "01",

      label: "PRIMARY FOCUS",

      title:
        `Improve ${weakest.name} performance`,

      message:
        `${weakest.name} is currently the driver's weakest ` +
        `performance metric at ` +
        `${weakest.value.toFixed(2)}/100. ` +
        `This should be the main focus of the next run.`,

    })


    // ----------------------------------------------------------
    // PRIORITY 02
    // SECTOR LOSS
    // ----------------------------------------------------------

    if (
      sectorAnalysis?.largestGap
    ) {

      const largestGap =
        sectorAnalysis.largestGap


      plan.push({

        priority: "02",

        label: "SECTOR TARGET",

        title:
          `Target ${largestGap.name}`,

        message:
          `${largestGap.name} has the largest ` +
          `average-to-best gap at ` +
          `+${largestGap.gap.toFixed(3)}s. ` +
          `Focus on repeatability and reducing the ` +
          `performance spread through this sector.`,

      })

    }


    // ----------------------------------------------------------
    // PRIORITY 03
    // CORNER TARGET
    // ----------------------------------------------------------

    if (
      cornerAnalysis?.weakestCorner
    ) {

      const corner =
        cornerAnalysis.weakestCorner


      const cornerNumber =
        safeNumber(
          corner.corner
        )


      const speedLoss =
        safeNumber(
          corner.entry_to_apex_loss
        )


      plan.push({

        priority: "03",

        label: "CORNER TARGET",

        title:
          `Attack Turn ${cornerNumber}`,

        message:
          `Turn ${cornerNumber} is the driver's ` +
          `lowest-scoring corner at ` +
          `${safeNumber(
            corner.corner_score
          ).toFixed(2)}/100. ` +
          `Entry-to-apex speed loss is ` +
          `${speedLoss.toFixed(1)} km/h. ` +
          `Prioritize braking release, rotation and apex speed.`,

      })

    }


    // ----------------------------------------------------------
    // PRIORITY 04
    // STRONGEST AREA
    // ----------------------------------------------------------

    if (
      plan.length < 4
    ) {

      plan.push({

        priority: "03",

        label: "MONITOR",

        title:
          `Protect ${strongest.name} strength`,

        message:
          `${strongest.name} is currently the driver's ` +
          `strongest area at ` +
          `${strongest.value.toFixed(2)}/100. ` +
          `Do not sacrifice this performance while addressing ` +
          `${secondWeakest.name}.`,

      })

    }


    return plan.slice(0, 3)

  }, [
    performanceDiagnosis,
    sectorAnalysis,
    cornerAnalysis,
  ])


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-[#020617] px-6 py-10 text-slate-200">

        <div className="mx-auto max-w-7xl">

          <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60">

            <div className="text-center">

              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-amber-400" />

              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Generating engineer report
              </p>

            </div>

          </div>

        </div>

      </div>

    )

  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error) {

    return (

      <div className="min-h-screen bg-[#020617] px-6 py-10 text-slate-200">

        <div className="mx-auto max-w-7xl">

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

        </div>

      </div>

    )

  }


  // ============================================================
  // NO DATA
  // ============================================================

  if (!data || !score) {

    return (

      <div className="min-h-screen bg-[#020617] px-6 py-10 text-slate-200">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-10 text-center">

            <AlertTriangle
              size={20}
              className="mx-auto mb-4 text-slate-600"
            />

            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              No engineering data available
            </p>

          </div>

        </div>

      </div>

    )

  }


  // ============================================================
  // MAIN REPORT
  // ============================================================

  return (

    <div className="min-h-screen bg-[#020617] px-4 py-8 text-slate-200 sm:px-6">

      <div className="mx-auto max-w-7xl space-y-8">


        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="flex flex-col gap-6 border-b border-slate-800/80 pb-7 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2">

              <Activity
                size={15}
                className="text-amber-400"
              />

              <span className="font-mono text-[9px] font-black uppercase tracking-[0.25em] text-amber-400">
                ApexEngineer AI
              </span>

            </div>


            <h1 className="font-mono text-3xl font-black uppercase tracking-tight text-white">
              Race Engineer
            </h1>


            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">
              {grandPrix.toUpperCase()}
              {" · "}
              {driver}
              {" · "}
              {sessionLabel.toUpperCase()}
              {" · "}
              {year}
            </p>

          </div>


          <div className="grid grid-cols-3 gap-2 sm:flex">

            <ParameterSelect
              label="YEAR"
              value={String(year)}
              onChange={(value) =>
                setYear(
                  Number(value)
                )
              }
              options={[
                "2025",
                "2024",
                "2023",
              ]}
            />


            <ParameterSelect
              label="GRAND PRIX"
              value={grandPrix}
              onChange={setGrandPrix}
              options={[
                "Monaco",
                "Bahrain",
                "Australia",
                "Japan",
                "Miami",
                "Imola",
                "Spain",
                "Canada",
                "Austria",
                "Britain",
                "Belgium",
                "Hungary",
                "Netherlands",
                "Italy",
                "Azerbaijan",
                "Singapore",
                "United States",
                "Mexico",
                "Brazil",
                "Las Vegas",
                "Qatar",
                "Abu Dhabi",
              ]}
            />


            <ParameterSelect
              label="SESSION"
              value={sessionType}
              onChange={(value) =>
                setSessionType(
                  value as SessionCode
                )
              }
              options={sessionOptions}
            />

          </div>

        </header>


        {/* ======================================================
            DRIVER / PERFORMANCE SCORE
        ====================================================== */}

        <section className="overflow-hidden rounded-xl border border-amber-400/20 bg-amber-400/[0.025]">

          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

            <div className="border-b border-slate-800 p-6 lg:border-b-0 lg:border-r">

              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                Driver
              </p>

              <h2 className="mt-2 font-mono text-4xl font-black text-white">
                {driver}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                {grandPrix} · {sessionLabel}
              </p>


              {data.engineering_summary && (

                <div className="mt-6">

                  <div className="flex items-center gap-2">

                    <Lightbulb
                      size={15}
                      className="text-amber-400"
                    />

                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-400">
                      Engineering Priority
                    </span>

                  </div>


                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {data.engineering_summary.message}
                  </p>

                </div>

              )}

            </div>


            <div className="p-6">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    Overall Performance
                  </p>

                  <p className="mt-1 font-mono text-5xl font-black text-white">
                    {safeNumber(
                      score.overall_score
                    ).toFixed(2)}
                  </p>

                </div>


                <ShieldCheck
                  size={22}
                  className="text-emerald-400"
                />

              </div>


              <div className="mt-6 space-y-4">

                <ScoreBar
                  label="Speed"
                  value={score.speed_score}
                />

                <ScoreBar
                  label="Throttle"
                  value={score.throttle_score}
                />

                <ScoreBar
                  label="Braking"
                  value={score.braking_score}
                />

                <ScoreBar
                  label="Consistency"
                  value={score.consistency_score}
                />

              </div>

            </div>

          </div>

        </section>


        {/* ======================================================
            PERFORMANCE DIAGNOSIS
        ====================================================== */}

        {performanceDiagnosis && (

          <section>

            <SectionHeading
              icon={Target}
              title="Performance Diagnosis"
              subtitle="The engineering profile extracted from the current session"
            />


            <div className="grid gap-4 md:grid-cols-3">

              <DiagnosisCard
                title="Weakest Area"
                label={
                  performanceDiagnosis
                    .weakest.name
                }
                value={
                  performanceDiagnosis
                    .weakest.value
                }
                tone="red"
                icon={TrendingDown}
              />


              <DiagnosisCard
                title="Secondary Limitation"
                label={
                  performanceDiagnosis
                    .secondWeakest.name
                }
                value={
                  performanceDiagnosis
                    .secondWeakest.value
                }
                tone="amber"
                icon={AlertTriangle}
              />


              <DiagnosisCard
                title="Strongest Area"
                label={
                  performanceDiagnosis
                    .strongest.name
                }
                value={
                  performanceDiagnosis
                    .strongest.value
                }
                tone="emerald"
                icon={TrendingUp}
              />

            </div>

          </section>

        )}


        {/* ======================================================
            TELEMETRY SUMMARY
        ====================================================== */}

        {data.telemetry && (

          <section>

            <SectionHeading
              icon={Gauge}
              title="Telemetry Summary"
              subtitle="Key driving metrics from the analysed telemetry"
            />


            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <MetricCard
                label="Average Speed"
                value={safeNumber(
                  data.telemetry.speed?.average
                ).toFixed(1)}
                unit="km/h"
              />


              <MetricCard
                label="Maximum Speed"
                value={safeNumber(
                  data.telemetry.speed?.max
                ).toFixed(1)}
                unit="km/h"
              />


              <MetricCard
                label="Maximum RPM"
                value={safeNumber(
                  data.telemetry.rpm?.max
                ).toFixed(0)}
                unit="rpm"
              />


              <MetricCard
                label="Maximum Gear"
                value={safeNumber(
                  data.telemetry.gear?.max
                ).toFixed(0)}
                unit=""
              />

            </div>

          </section>

        )}


        {/* ======================================================
            SECTOR PERFORMANCE
        ====================================================== */}

        {data.sectors && (

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
                fastest={safeNumber(
                  data.sectors.sector_1?.fastest
                )}
                average={safeNumber(
                  data.sectors.sector_1?.average
                )}
              />


              <SectorCard
                name="Sector 2"
                fastest={safeNumber(
                  data.sectors.sector_2?.fastest
                )}
                average={safeNumber(
                  data.sectors.sector_2?.average
                )}
              />


              <SectorCard
                name="Sector 3"
                fastest={safeNumber(
                  data.sectors.sector_3?.fastest
                )}
                average={safeNumber(
                  data.sectors.sector_3?.average
                )}
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

                  {data.sectors.best_sector_combination !== null &&
                  data.sectors.best_sector_combination !== undefined

                    ? `${safeNumber(
                        data.sectors
                          .best_sector_combination
                      ).toFixed(3)}s`

                    : "N/A"}

                </span>

              </div>

            </div>

          </section>

        )}


        {/* ======================================================
            SECTOR LOSS ANALYSIS
        ====================================================== */}

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
                    sectorAnalysis
                      .largestGap.name


                  const maxGap =
                    Math.max(
                      ...sectorAnalysis
                        .sectors
                        .map(
                          (item) =>
                            item.gap
                        ),
                      0.001,
                    )


                  const width =
                    Math.max(
                      8,
                      Math.min(
                        100,
                        (
                          sector.gap /
                          maxGap
                        ) * 100,
                      ),
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
                              width:
                                `${width}%`,
                            }}
                          />

                        </div>

                      </div>

                    </div>

                  )

                },
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

                    {sectorAnalysis
                      .largestGap.name}
                    {" "}shows the largest gap between
                    the driver's best and average
                    performance at{" "}

                    <span className="font-semibold text-white">
                      +
                      {sectorAnalysis
                        .largestGap.gap
                        .toFixed(3)}s
                    </span>

                    . This is the first sector to target
                    for consistency improvement.

                  </p>

                </div>

              </div>

            </div>

          </section>

        )}


        {/* ======================================================
            CORNER ANALYSIS
        ====================================================== */}

        {cornerAnalysis && (

          <section>

            <SectionHeading
              icon={CircleDot}
              title="Corner Analysis"
              subtitle="Corner-level driving behaviour and performance"
            />


            <div className="grid gap-4 lg:grid-cols-3">

              {cornerAnalysis.highestPriority && (

                <CornerInsightCard
                  label="Highest Priority Corner"
                  corner={
                    cornerAnalysis
                      .highestPriority.corner
                  }
                  value={
                    cornerAnalysis
                      .highestPriority.corner_score
                  }
                  unit="score"
                  icon={AlertTriangle}
                  tone="red"
                />

              )}


              {cornerAnalysis.largestSpeedLoss && (

                <CornerInsightCard
                  label="Largest Speed Loss"
                  corner={
                    cornerAnalysis
                      .largestSpeedLoss.corner
                  }
                  value={
                    cornerAnalysis
                      .largestSpeedLoss.entry_to_apex_loss
                  }
                  unit="km/h"
                  icon={TrendingDown}
                  tone="amber"
                />

              )}


              {cornerAnalysis.bestAcceleration && (

                <CornerInsightCard
                  label="Best Acceleration"
                  corner={
                    cornerAnalysis
                      .bestAcceleration.corner
                  }
                  value={
                    cornerAnalysis
                      .bestAcceleration.apex_to_exit_gain
                  }
                  unit="km/h"
                  icon={TrendingUp}
                  tone="emerald"
                />

              )}

            </div>


            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">

              <div className="border-b border-slate-800 px-6 py-5">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
                      Corner Performance
                    </h3>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-600">
                      Lowest scoring corners require attention
                    </p>

                  </div>


                  {cornerAnalysis
                    .highPriority.length > 0 && (

                    <span className="text-[9px] font-bold uppercase tracking-widest text-red-400">
                      {
                        cornerAnalysis
                          .highPriority
                          .length
                      }{" "}
                      High Priority
                    </span>

                  )}

                </div>

              </div>


              <div className="divide-y divide-slate-800">

                {cornerAnalysis.corners
                  .slice()
                  .sort(
                    (a, b) =>
                      safeNumber(
                        a.corner_score
                      ) -
                      safeNumber(
                        b.corner_score
                      )
                  )
                  .slice(0, 8)
                  .map(
                    (corner) => (

                      <CornerRow
                        key={
                          corner.corner
                        }
                        corner={corner}
                      />

                    ),
                  )}

              </div>

            </div>


            {data.corner_summary && (

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5">

                <div className="flex items-start gap-3">

                  <Flag
                    size={17}
                    className="mt-0.5 shrink-0 text-amber-400"
                  />

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300">
                      Corner Summary
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {data.corner_summary.summary}
                    </p>

                  </div>

                </div>

              </div>

            )}

          </section>

        )}


        {/* ======================================================
            ENGINEER RECOMMENDATIONS
        ====================================================== */}

        <section>

          <SectionHeading
            icon={Lightbulb}
            title="Engineer Recommendations"
            subtitle="Prioritized guidance from the engineering analysis"
          />


          <div className="space-y-3">

            {data.recommendations?.length > 0 ? (

              data.recommendations.map(
                (recommendation, index) => {

                  const highPriority =
                    String(
                      recommendation.priority
                    ).toLowerCase() ===
                    "high"


                  return (

                    <div
                      key={
                        `${recommendation.area}-${index}`
                      }
                      className={[
                        "rounded-xl border p-5",
                        highPriority
                          ? "border-red-400/20 bg-red-400/[0.04]"
                          : "border-amber-400/20 bg-amber-400/[0.04]",
                      ].join(" ")}
                    >

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


                          <PriorityBadge
                            priority={
                              recommendation.priority
                            }
                          />

                        </div>

                      </div>


                      <p className="mt-4 text-sm leading-6 text-slate-400">
                        {recommendation.message}
                      </p>

                    </div>

                  )

                },
              )

            ) : (

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-500">

                No engineering recommendations
                were returned for this session.

              </div>

            )}

          </div>

        </section>


        {/* ======================================================
            ENGINEERING ACTION PLAN
        ====================================================== */}

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

                ),
              )}

            </div>

          </section>

        )}


        {/* ======================================================
            RACE ENGINEER RADIO
        ====================================================== */}

        <section className="rounded-xl border border-red-400/20 bg-red-400/[0.025]">

          <div className="flex items-center gap-4 p-5">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-red-400">

              <Radio
                size={20}
              />

            </div>


            <div>

              <div className="flex flex-wrap items-center gap-2">

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
                  data.engineering_summary?.message ??
                  "No engineering instruction available."}

              </p>

            </div>

          </div>

        </section>


      </div>

    </div>

  )
}


// ================================================================
// SCORE BAR
// ================================================================

function ScoreBar({
  label,
  value,
}: {
  label: string
  value: number
}) {

  const safe =
    Math.max(
      0,
      Math.min(
        100,
        Number.isFinite(value)
          ? value
          : 0
      )
    )


  return (

    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </span>

        <span className="font-mono text-[10px] font-bold text-slate-300">
          {safe.toFixed(2)}
        </span>

      </div>


      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-500"
          style={{
            width: `${safe}%`,
          }}
        />

      </div>

    </div>

  )
}


// ================================================================
// DIAGNOSIS CARD
// ================================================================

function DiagnosisCard({
  title,
  label,
  value,
  tone,
  icon: Icon,
}: {
  title: string
  label: string
  value: number
  tone: "red" | "amber" | "emerald"
  icon: ElementType
}) {

  const classes = {

    red: {
      border:
        "border-red-400/20",
      bg:
        "bg-red-400/[0.035]",
      icon:
        "text-red-400",
      value:
        "text-red-300",
    },

    amber: {
      border:
        "border-amber-400/20",
      bg:
        "bg-amber-400/[0.035]",
      icon:
        "text-amber-400",
      value:
        "text-amber-300",
    },

    emerald: {
      border:
        "border-emerald-400/20",
      bg:
        "bg-emerald-400/[0.035]",
      icon:
        "text-emerald-400",
      value:
        "text-emerald-300",
    },

  }[tone]


  return (

    <div
      className={[
        "rounded-xl border p-5",
        classes.border,
        classes.bg,
      ].join(" ")}
    >

      <div className="flex items-center justify-between">

        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
          {title}
        </p>

        <Icon
          size={16}
          className={classes.icon}
        />

      </div>


      <div className="mt-4 flex items-end justify-between">

        <div>

          <p className="text-[9px] uppercase tracking-widest text-slate-600">
            Area
          </p>

          <p className="mt-1 text-2xl font-black text-white">
            {label}
          </p>

        </div>


        <p
          className={[
            "text-xl font-black",
            classes.value,
          ].join(" ")}
        >
          {safeNumber(
            value
          ).toFixed(2)}
        </p>

      </div>

    </div>

  )
}


// ================================================================
// METRIC CARD
// ================================================================

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


// ================================================================
// SECTOR CARD
// ================================================================

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

  const gap =
    Math.max(
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


// ================================================================
// CORNER INSIGHT CARD
// ================================================================

function CornerInsightCard({
  label,
  corner,
  value,
  unit,
  icon: Icon,
  tone,
}: {
  label: string
  corner: number
  value: number
  unit: string
  icon: ElementType
  tone: "red" | "amber" | "emerald"
}) {

  const toneClasses = {

    red: {
      border:
        "border-red-400/20",
      bg:
        "bg-red-400/[0.025]",
      icon:
        "text-red-400",
      value:
        "text-red-300",
    },

    amber: {
      border:
        "border-amber-400/20",
      bg:
        "bg-amber-400/[0.025]",
      icon:
        "text-amber-400",
      value:
        "text-amber-300",
    },

    emerald: {
      border:
        "border-emerald-400/20",
      bg:
        "bg-emerald-400/[0.025]",
      icon:
        "text-emerald-400",
      value:
        "text-emerald-300",
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

      <div className="flex items-center justify-between">

        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
          {label}
        </p>


        <Icon
          size={16}
          className={toneClasses.icon}
        />

      </div>


      <div className="mt-4 flex items-end justify-between">

        <div>

          <p className="text-[9px] uppercase tracking-widest text-slate-600">
            Turn
          </p>

          <p className="mt-1 text-2xl font-black text-white">
            {safeNumber(
              corner
            )}
          </p>

        </div>


        <p
          className={[
            "text-xl font-black",
            toneClasses.value,
          ].join(" ")}
        >
          {safeNumber(
            value
          ).toFixed(2)}

          <span className="ml-1 text-[9px] font-normal text-slate-600">
            {unit}
          </span>

        </p>

      </div>

    </div>

  )
}


// ================================================================
// CORNER ROW
// ================================================================

function CornerRow({
  corner,
}: {
  corner: {
    corner: number
    entry_speed: number
    apex_speed: number
    exit_speed: number
    max_brake: number
    max_throttle: number
    average_rpm: number
    samples: number
    entry_to_apex_loss: number
    apex_to_exit_gain: number
    braking_intensity: number
    throttle_application: number
    corner_score: number
    priority: string
    diagnosis: string[]
  }
}) {

  const highPriority =
    String(
      corner.priority
    ).toLowerCase() ===
    "high"


  return (

    <div className="px-6 py-5">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-4">

          <div
            className={[
              "flex h-10 w-10 items-center justify-center rounded-lg",
              highPriority
                ? "bg-red-400/10 text-red-400"
                : "bg-slate-800 text-slate-400",
            ].join(" ")}
          >

            <span className="font-mono text-sm font-black">
              {corner.corner}
            </span>

          </div>


          <div>

            <div className="flex items-center gap-2">

              <p className="text-sm font-bold text-white">
                Turn {corner.corner}
              </p>


              <PriorityBadge
                priority={
                  corner.priority
                }
              />

            </div>


            <p className="mt-1 text-[9px] uppercase tracking-widest text-slate-600">
              Corner score{" "}
              {safeNumber(
                corner.corner_score
              ).toFixed(2)}
            </p>

          </div>

        </div>


        <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">

          <CornerMetric
            label="Entry"
            value={
              corner.entry_speed
            }
            unit="km/h"
          />


          <CornerMetric
            label="Apex"
            value={
              corner.apex_speed
            }
            unit="km/h"
          />


          <CornerMetric
            label="Exit"
            value={
              corner.exit_speed
            }
            unit="km/h"
          />


          <CornerMetric
            label="Throttle"
            value={
              corner.throttle_application
            }
            unit="%"
          />

        </div>

      </div>


      {corner.diagnosis?.length > 0 && (

        <div className="mt-4 border-l border-amber-400/20 pl-4">

          <p className="text-xs leading-5 text-slate-500">
            {corner.diagnosis[0]}
          </p>

        </div>

      )}

    </div>

  )
}


// ================================================================
// CORNER METRIC
// ================================================================

function CornerMetric({
  label,
  value,
  unit,
}: {
  label: string
  value: number
  unit: string
}) {

  return (

    <div>

      <p className="text-[8px] uppercase tracking-widest text-slate-600">
        {label}
      </p>


      <p className="mt-1 text-sm font-bold text-slate-300">

        {safeNumber(
          value
        ).toFixed(1)}

        <span className="ml-1 text-[8px] font-normal text-slate-600">
          {unit}
        </span>

      </p>

    </div>

  )
}


// ================================================================
// PRIORITY BADGE
// ================================================================

function PriorityBadge({
  priority,
}: {
  priority: string
}) {

  const normalized =
    String(
      priority
    ).toLowerCase()


  const high =
    normalized === "high"


  const medium =
    normalized === "medium"


  const classes =
    high
      ? "border-red-400/30 bg-red-400/10 text-red-400"
      : medium
        ? "border-amber-400/30 bg-amber-400/10 text-amber-400"
        : "border-slate-700 bg-slate-800 text-slate-500"


  return (

    <span
      className={[
        "rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest",
        classes,
      ].join(" ")}
    >
      {priority}
    </span>

  )
}


// ================================================================
// PARAMETER SELECT
// ================================================================

interface ParameterSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options:
    | string[]
    | SessionOption[]
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
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-medium text-slate-200 outline-none transition focus:border-amber-400"
      >

        {options.map(
          (option) => {

            const normalized =
              typeof option === "string"
                ? {
                    label: option,
                    value: option,
                  }
                : option


            return (

              <option
                key={
                  normalized.value
                }
                value={
                  normalized.value
                }
              >
                {normalized.label}
              </option>

            )

          }
        )}

      </select>

    </div>

  )
}


// ================================================================
// SECTION HEADING
// ================================================================

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

        <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
          {title}
        </h2>


        <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-600">
          {subtitle}
        </p>

      </div>

    </div>

  )
}


export default Engineer

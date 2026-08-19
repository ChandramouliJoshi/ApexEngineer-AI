import { useState } from "react"
import {
  ArrowRight,
  BarChart3,
  Gauge,
  Minus,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react"

import { useSectorComparison } from "../hooks/useSectorComparison"


function SectorComparison() {

  const [year, setYear] = useState(2025)
  const [grandPrix, setGrandPrix] = useState("Monaco")
  const [driver1, setDriver1] = useState("VER")
  const [driver2, setDriver2] = useState("NOR")
  const [sessionType, setSessionType] = useState("Race")


  const {
    data,
    loading,
    error,
  } = useSectorComparison({
    year,
    grandPrix,
    driver1,
    driver2,
    sessionType,
  })


  const sectors = data
    ? [
        {
          name: "S1",
          ...data.sector_1,
        },
        {
          name: "S2",
          ...data.sector_2,
        },
        {
          name: "S3",
          ...data.sector_3,
        },
      ]
    : []


  const totalDriver1 = sectors.reduce(
    (sum, sector) => sum + sector.driver_1,
    0
  )

  const totalDriver2 = sectors.reduce(
    (sum, sector) => sum + sector.driver_2,
    0
  )

  const totalDelta =
    totalDriver1 - totalDriver2


  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 border-b border-slate-800 pb-7 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="mb-3 flex items-center gap-2">

            <BarChart3
              size={16}
              className="text-purple-400"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-purple-400">
              ApexEngineer AI
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            SECTOR COMPARISON
          </h1>

          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
            Sector-by-sector performance analysis
          </p>

        </div>


        {/* Driver badges */}

        <div className="flex items-center gap-3">

          <div className="rounded-lg border border-indigo-400/30 bg-indigo-400/[0.06] px-4 py-3">

            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
              Driver 1
            </p>

            <p className="mt-1 text-lg font-bold text-indigo-300">
              {data?.driver_1 ?? driver1}
            </p>

          </div>


          <ArrowRight
            size={16}
            className="text-slate-600"
          />


          <div className="rounded-lg border border-cyan-400/30 bg-cyan-400/[0.06] px-4 py-3">

            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
              Driver 2
            </p>

            <p className="mt-1 text-lg font-bold text-cyan-300">
              {data?.driver_2 ?? driver2}
            </p>

          </div>

        </div>

      </div>


      {/* Parameters */}

      <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">

        <div className="mb-5 flex items-center gap-2">

          <Gauge
            size={15}
            className="text-purple-400"
          />

          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            Comparison Parameters
          </h2>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

          {/* Year */}

          <div>
            <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Season
            </label>

            <select
              value={year}
              onChange={(e) =>
                setYear(Number(e.target.value))
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-medium text-slate-200 outline-none transition focus:border-purple-400"
            >
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>


          {/* Grand Prix */}

          <div>
            <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Grand Prix
            </label>

            <select
              value={grandPrix}
              onChange={(e) =>
                setGrandPrix(e.target.value)
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-medium text-slate-200 outline-none transition focus:border-purple-400"
            >
              <option value="Monaco">Monaco</option>
              <option value="Italy">Italy</option>
              <option value="Belgium">Belgium</option>
              <option value="Austria">Austria</option>
            </select>
          </div>


          {/* Driver 1 */}

          <div>
            <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Driver 1
            </label>

            <input
              value={driver1}
              onChange={(e) =>
                setDriver1(e.target.value.toUpperCase())
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-bold text-indigo-300 uppercase outline-none transition focus:border-indigo-400"
              placeholder="VER"
            />
          </div>


          {/* Driver 2 */}

          <div>
            <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Driver 2
            </label>

            <input
              value={driver2}
              onChange={(e) =>
                setDriver2(e.target.value.toUpperCase())
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-bold text-cyan-300 uppercase outline-none transition focus:border-cyan-400"
              placeholder="NOR"
            />
          </div>


          {/* Session */}

          <div>
            <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Session
            </label>

            <select
              value={sessionType}
              onChange={(e) =>
                setSessionType(e.target.value)
              }
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-sm font-medium text-slate-200 outline-none transition focus:border-purple-400"
            >
              <option value="Race">Race</option>
              <option value="Qualifying">Qualifying</option>
              <option value="Sprint">Sprint</option>
            </select>
          </div>

        </div>

      </section>


      {/* Loading */}

      {loading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60">

          <div className="text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-purple-400" />

            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Loading sector comparison
            </p>

          </div>

        </div>
      )}


      {/* Error */}

      {!loading && error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/[0.04] p-6">

          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-400">
            Comparison unavailable
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {error}
          </p>

        </div>
      )}


      {/* Results */}

      {!loading && !error && data && (

        <>

          {/* Summary cards */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/[0.04] p-5">

              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                {data.driver_1} sector total
              </p>

              <p className="mt-3 text-3xl font-bold text-indigo-300">
                {totalDriver1.toFixed(3)}
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                TOTAL SECTOR TIME
              </p>

            </div>


            <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5">

              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                {data.driver_2} sector total
              </p>

              <p className="mt-3 text-3xl font-bold text-cyan-300">
                {totalDriver2.toFixed(3)}
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                TOTAL SECTOR TIME
              </p>

            </div>


            <div
              className={[
                "rounded-xl border p-5",
                totalDelta > 0
                  ? "border-orange-400/20 bg-orange-400/[0.04]"
                  : "border-emerald-400/20 bg-emerald-400/[0.04]",
              ].join(" ")}
            >

              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Overall Delta
              </p>

              <div className="mt-3 flex items-center gap-2">

                {totalDelta > 0 ? (
                  <TrendingUp
                    size={20}
                    className="text-orange-400"
                  />
                ) : (
                  <TrendingDown
                    size={20}
                    className="text-emerald-400"
                  />
                )}

                <p
                  className={[
                    "text-3xl font-bold",
                    totalDelta > 0
                      ? "text-orange-300"
                      : "text-emerald-300",
                  ].join(" ")}
                >
                  {Math.abs(totalDelta).toFixed(3)}s
                </p>

              </div>

              <p className="mt-1 text-[10px] text-slate-600">
                {totalDelta > 0
                  ? `${data.driver_2} advantage`
                  : `${data.driver_1} advantage`}
              </p>

            </div>

          </div>


          {/* Sector table */}

          <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">

            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

              <div>

                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
                  Sector Breakdown
                </h2>

                <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-600">
                  Direct sector performance comparison
                </p>

              </div>

              <Trophy
                size={18}
                className="text-yellow-400"
              />

            </div>


            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>

                  <tr className="border-b border-slate-800 text-[9px] uppercase tracking-[0.18em] text-slate-600">

                    <th className="px-6 py-4">
                      Sector
                    </th>

                    <th className="px-6 py-4">
                      {data.driver_1}
                    </th>

                    <th className="px-6 py-4">
                      {data.driver_2}
                    </th>

                    <th className="px-6 py-4">
                      Delta
                    </th>

                    <th className="px-6 py-4">
                      Advantage
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {sectors.map((sector) => {

                    const driver1Faster =
                      sector.driver_1 <
                      sector.driver_2

                    const delta =
                      Math.abs(sector.delta)


                    return (
                      <tr
                        key={sector.name}
                        className="border-b border-slate-800/70 transition-colors hover:bg-slate-900/60"
                      >

                        <td className="px-6 py-5">

                          <span className="rounded-md border border-purple-400/20 bg-purple-400/[0.05] px-3 py-1.5 text-xs font-bold text-purple-300">
                            {sector.name}
                          </span>

                        </td>


                        <td className="px-6 py-5">

                          <span
                            className={
                              driver1Faster
                                ? "font-bold text-emerald-300"
                                : "text-slate-300"
                            }
                          >
                            {sector.driver_1.toFixed(3)}s
                          </span>

                        </td>


                        <td className="px-6 py-5">

                          <span
                            className={
                              !driver1Faster
                                ? "font-bold text-emerald-300"
                                : "text-slate-300"
                            }
                          >
                            {sector.driver_2.toFixed(3)}s
                          </span>

                        </td>


                        <td className="px-6 py-5">

                          <span className="font-semibold text-orange-300">
                            {delta.toFixed(3)}s
                          </span>

                        </td>


                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            {sector.driver_1 ===
                            sector.driver_2 ? (
                              <>
                                <Minus
                                  size={14}
                                  className="text-slate-600"
                                />

                                <span className="text-xs text-slate-500">
                                  Even
                                </span>
                              </>
                            ) : (
                              <>
                                {driver1Faster ? (
                                  <TrendingDown
                                    size={14}
                                    className="text-emerald-400"
                                  />
                                ) : (
                                  <TrendingUp
                                    size={14}
                                    className="text-emerald-400"
                                  />
                                )}

                                <span className="text-xs font-semibold text-emerald-300">
                                  {driver1Faster
                                    ? data.driver_1
                                    : data.driver_2}
                                </span>

                              </>
                            )}

                          </div>

                        </td>

                      </tr>
                    )
                  })}

                </tbody>

              </table>

            </div>

          </section>

        </>

      )}

    </div>
  )
}


export default SectorComparison
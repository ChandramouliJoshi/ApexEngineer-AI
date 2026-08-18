import { useMemo, useState } from "react"
import {
  Search,
  Users,
  ChevronRight,
  Radio,
  Trophy,
  Activity,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { useDrivers } from "../hooks/useDrivers"

interface TeamStyle {
  border: string
  text: string
  bg: string
  glow: string
}

export default function Drivers() {
  const {
    drivers,
    loading,
    error,
  } = useDrivers()

  const [search, setSearch] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("ALL")
  const [selectedDriver, setSelectedDriver] =
    useState<string | null>(null)

  /*
   * ============================================================
   * TEAM STYLES
   * ============================================================
   */

  const teamStyles: Record<string, TeamStyle> = {
    McLaren: {
      border: "border-orange-400/40",
      text: "text-orange-400",
      bg: "bg-orange-400",
      glow: "hover:shadow-orange-400/10",
    },

    Ferrari: {
      border: "border-red-500/40",
      text: "text-red-400",
      bg: "bg-red-500",
      glow: "hover:shadow-red-500/10",
    },

    "Red Bull Racing": {
      border: "border-blue-500/40",
      text: "text-blue-400",
      bg: "bg-blue-500",
      glow: "hover:shadow-blue-500/10",
    },

    Mercedes: {
      border: "border-cyan-400/40",
      text: "text-cyan-400",
      bg: "bg-cyan-400",
      glow: "hover:shadow-cyan-400/10",
    },

    Williams: {
      border: "border-blue-400/40",
      text: "text-blue-300",
      bg: "bg-blue-400",
      glow: "hover:shadow-blue-400/10",
    },

    "Aston Martin": {
      border: "border-emerald-400/40",
      text: "text-emerald-400",
      bg: "bg-emerald-400",
      glow: "hover:shadow-emerald-400/10",
    },

    Alpine: {
      border: "border-pink-400/40",
      text: "text-pink-400",
      bg: "bg-pink-400",
      glow: "hover:shadow-pink-400/10",
    },

    "Haas F1 Team": {
      border: "border-slate-400/30",
      text: "text-slate-300",
      bg: "bg-slate-300",
      glow: "hover:shadow-slate-400/10",
    },

    "Racing Bulls": {
      border: "border-sky-400/40",
      text: "text-sky-400",
      bg: "bg-sky-400",
      glow: "hover:shadow-sky-400/10",
    },

    "Kick Sauber": {
      border: "border-green-400/40",
      text: "text-green-400",
      bg: "bg-green-400",
      glow: "hover:shadow-green-400/10",
    },
  }

  const defaultTeamStyle: TeamStyle = {
    border: "border-cyan-400/30",
    text: "text-cyan-400",
    bg: "bg-cyan-400",
    glow: "hover:shadow-cyan-400/10",
  }

  const getTeamStyle = (team: string): TeamStyle => {
    return teamStyles[team] ?? defaultTeamStyle
  }

  /*
   * ============================================================
   * TEAM LIST
   * ============================================================
   */

  const teams = useMemo(() => {
    const uniqueTeams = Array.from(
      new Set(
        drivers.map((driver) => driver.team)
      )
    ).sort()

    return ["ALL", ...uniqueTeams]
  }, [drivers])

  /*
   * ============================================================
   * FILTERED DRIVERS
   * ============================================================
   */

  const filteredDrivers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase()

    return drivers.filter((driver) => {
      const matchesSearch =
        query === "" ||
        driver.full_name
          .toLowerCase()
          .includes(query) ||
        driver.abbreviation
          .toLowerCase()
          .includes(query) ||
        driver.driver_number.includes(query)

      const matchesTeam =
        selectedTeam === "ALL" ||
        driver.team === selectedTeam

      return matchesSearch && matchesTeam
    })
  }, [
    drivers,
    search,
    selectedTeam,
  ])

  /*
   * ============================================================
   * SELECTED DRIVER
   * ============================================================
   */

  const selectedDriverData = drivers.find(
    (driver) =>
      driver.abbreviation === selectedDriver
  )

  /*
   * ============================================================
   * RESET FILTERS
   * ============================================================
   */

  const resetFilters = () => {
    setSearch("")
    setSelectedTeam("ALL")
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">

      <style>{`
        .driver-hover-card {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background-color 180ms ease;
        }

        .driver-hover-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          background:
            radial-gradient(
              circle at 85% 12%,
              rgba(34,211,238,0.08),
              transparent 30%
            ),
            linear-gradient(
              115deg,
              transparent 0%,
              rgba(255,255,255,0.035) 44%,
              transparent 63%
            );
          transform: translateX(-120%);
          transition: transform 600ms ease;
        }

        .driver-hover-card:hover {
          transform: translateY(-5px);
          box-shadow:
            0 18px 45px rgba(0,0,0,0.30),
            0 0 28px rgba(34,211,238,0.055);
        }

        .driver-hover-card:hover::after {
          transform: translateX(120%);
        }

        .driver-number {
          transition:
            transform 220ms ease,
            color 220ms ease,
            text-shadow 220ms ease;
        }

        .driver-hover-card:hover .driver-number {
          transform: translateX(4px);
          color: rgb(15 23 42);
          text-shadow: 0 0 18px rgba(34,211,238,0.08);
        }

        .driver-chip {
          transition:
            transform 180ms ease,
            background-color 180ms ease,
            border-color 180ms ease;
        }

        .driver-hover-card:hover .driver-chip {
          transform: translateY(-1px);
          background-color: rgba(15,23,42,0.95);
        }

        .driver-footer {
          transition:
            border-color 180ms ease,
            color 180ms ease;
        }

        .driver-hover-card:hover .driver-footer {
          border-color: rgba(51,65,85,0.85);
        }

        .filter-shell {
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .filter-shell:focus-within {
          border-color: rgba(34,211,238,0.24);
          box-shadow: 0 0 32px rgba(34,211,238,0.035);
        }

        .team-chip {
          transition:
            transform 150ms ease,
            border-color 150ms ease,
            background-color 150ms ease,
            color 150ms ease;
        }

        .team-chip:hover {
          transform: translateY(-1px);
        }

        .selected-driver-panel {
          box-shadow:
            inset 0 1px 0 rgba(34,211,238,0.08),
            0 16px 40px rgba(0,0,0,0.18);
        }
      `}</style>


      {/* ========================================================
          HEADER
      ========================================================= */}

      <header className="relative overflow-hidden border-b border-slate-800/70 bg-[#020617] px-6 py-7">

        {/* Engineering lines */}

        <div className="absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-red-500 via-red-500/40 to-transparent" />

        <div className="absolute right-0 top-0 h-px w-1/4 bg-gradient-to-l from-cyan-400/50 to-transparent" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

          {/* Title */}

          <div>

            <div className="mb-3 flex items-center gap-3">

              <span className="h-px w-9 bg-red-500" />

              <span className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-red-500">
                Driver Database
              </span>

            </div>

            <div className="flex items-center gap-3">

              <Users
                size={18}
                className="text-cyan-400"
              />

              <h1 className="font-mono text-3xl font-black uppercase tracking-tight text-slate-100">
                Driver Intelligence
              </h1>

            </div>

            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Formula 1 grid · driver identification · engineering analysis
            </p>

          </div>

          {/* Statistics */}

          <div className="flex items-center gap-7">

            {/* Drivers */}

            <div>

              <div className="flex items-center gap-2">

                <Activity
                  size={11}
                  className="text-cyan-400"
                />

                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-700">
                  Drivers
                </p>

              </div>

              <p className="mt-1 font-mono text-2xl font-black text-cyan-400">
                {drivers.length}
              </p>

            </div>

            <div className="h-10 w-px bg-slate-800" />

            {/* Teams */}

            <div>

              <div className="flex items-center gap-2">

                <Trophy
                  size={11}
                  className="text-orange-400"
                />

                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-700">
                  Teams
                </p>

              </div>

              <p className="mt-1 font-mono text-2xl font-black text-orange-400">
                {Math.max(
                  teams.length - 1,
                  0
                )}
              </p>

            </div>

            <div className="hidden h-10 w-px bg-slate-800 lg:block" />

            {/* Backend */}

            <div className="hidden lg:block">

              <div className="flex items-center gap-2">

                <Radio
                  size={10}
                  className="text-emerald-400"
                />

                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-slate-700">
                  Data Feed
                </p>

              </div>

              <p className="mt-1 font-mono text-[9px] font-black uppercase tracking-widest text-emerald-400">
                ONLINE
              </p>

            </div>

          </div>

        </div>

      </header>


      <main className="px-6 py-6">

        {/* ========================================================
            SELECTED DRIVER
        ========================================================= */}

        <AnimatePresence>

          {selectedDriverData && (

            <motion.section
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="selected-driver-panel relative mb-6 overflow-hidden rounded-xl border border-cyan-400/20 bg-cyan-400/[0.025]"
            >

              <div className="absolute left-0 top-0 h-full w-px bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />

              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-5">

                  <div>

                    <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-cyan-400">
                      Selected Driver
                    </p>

                    <div className="mt-1 flex items-baseline gap-3">

                      <span className="font-mono text-3xl font-black text-slate-100">
                        {selectedDriverData.abbreviation}
                      </span>

                      <span className="font-mono text-[10px] font-bold uppercase text-slate-500">
                        {selectedDriverData.full_name}
                      </span>

                    </div>

                  </div>

                  <div className="hidden h-9 w-px bg-slate-800 sm:block" />

                  <div className="hidden sm:block">

                    <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-slate-700">
                      Team
                    </p>

                    <p className="mt-1 font-mono text-[9px] font-bold uppercase text-slate-400">
                      {selectedDriverData.team}
                    </p>

                  </div>

                </div>

                <div className="flex flex-wrap items-center gap-2 sm:ml-auto sm:mr-3">
                  <div className="rounded-md border border-cyan-400/20 bg-cyan-400/[0.04] px-3 py-2">
                    <p className="font-mono text-[6px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      NUMBER
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-black text-cyan-300">
                      {selectedDriverData.driver_number}
                    </p>
                  </div>

                  <div className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">
                    <p className="font-mono text-[6px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      CODE
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-black text-slate-200">
                      {selectedDriverData.abbreviation}
                    </p>
                  </div>

                  <div className="rounded-md border border-emerald-400/15 bg-emerald-400/[0.025] px-3 py-2">
                    <p className="font-mono text-[6px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      PROFILE
                    </p>
                    <p className="mt-0.5 font-mono text-[8px] font-black uppercase tracking-widest text-emerald-300">
                      ACTIVE
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedDriver(null)
                  }
                  className="flex w-fit items-center gap-2 rounded-md border border-slate-800 px-3 py-2 font-mono text-[8px] font-black uppercase tracking-widest text-slate-500 transition hover:border-red-500/30 hover:text-red-400"
                >

                  <X size={12} />

                  Clear Selection

                </button>

              </div>

            </motion.section>

          )}

        </AnimatePresence>


        {/* ========================================================
            FILTER PANEL
        ========================================================= */}

        <section className="filter-shell relative mb-7 overflow-hidden rounded-xl border border-slate-800/70 bg-slate-950/60 p-4">

          {/* Corner accents */}

          <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-cyan-400/40" />

          <div className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-red-500/30" />

          {/* Search + select */}

          <div className="flex flex-col gap-4 lg:flex-row">

            <div className="relative flex-1">

              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="SEARCH DRIVER / CODE / NUMBER..."
                className="w-full rounded-lg border border-slate-800 bg-[#020617] py-3 pl-9 pr-3 font-mono text-[9px] uppercase tracking-widest text-slate-300 outline-none transition placeholder:text-slate-800 focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(34,211,238,0.05)]"
              />

            </div>

            <select
              value={selectedTeam}
              onChange={(event) =>
                setSelectedTeam(
                  event.target.value
                )
              }
              className="rounded-lg border border-slate-800 bg-[#020617] px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-slate-400 outline-none transition hover:border-cyan-400/30 focus:border-cyan-400/50"
            >

              {teams.map((team) => (
                <option
                  key={team}
                  value={team}
                >
                  {team === "ALL"
                    ? "ALL TEAMS"
                    : team}
                </option>
              ))}

            </select>

          </div>


          {/* Team chips */}

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">

            {teams.map((team) => {

              const active =
                selectedTeam === team

              const style =
                team === "ALL"
                  ? defaultTeamStyle
                  : getTeamStyle(team)

              return (
                <button
                  key={team}
                  type="button"
                  onClick={() =>
                    setSelectedTeam(team)
                  }
                  className={`
                    shrink-0
                    rounded-md
                    border
                    px-3
                    py-1.5
                    font-mono
                    text-[7px]
                    font-black
                    uppercase
                    tracking-widest
                    team-chip
                    ${
                      active
                        ? `${style.border} ${style.text} bg-white/[0.025]`
                        : "border-slate-900 text-slate-700 hover:border-slate-700 hover:text-slate-500"
                    }
                  `}
                >
                  {team === "ALL"
                    ? "ALL"
                    : team}
                </button>
              )
            })}

          </div>

        </section>


        {/* ========================================================
            RESULT STATUS
        ========================================================= */}

        {!loading &&
          !error &&
          filteredDrivers.length > 0 && (

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />

                <span className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Grid Entries
                </span>

              </div>

              <span className="font-mono text-[8px] uppercase tracking-widest text-slate-700">
                Showing {filteredDrivers.length} / {drivers.length}
              </span>

            </div>

          )}


        {/* ========================================================
            LOADING
        ========================================================= */}

        {loading && (

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {Array.from({
              length: 8,
            }).map((_, index) => (

              <div
                key={index}
                className="h-56 animate-pulse rounded-xl border border-slate-800/60 bg-slate-950"
              />

            ))}

          </div>

        )}


        {/* ========================================================
            ERROR
        ========================================================= */}

        {!loading && error && (

          <div className="rounded-xl border border-red-500/20 bg-red-500/[0.035] p-6">

            <div className="flex items-center gap-3">

              <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />

              <p className="font-mono text-[9px] font-black uppercase tracking-widest text-red-400">
                Engineering System Error
              </p>

            </div>

            <p className="mt-3 font-mono text-[9px] text-slate-600">
              {error}
            </p>

          </div>

        )}


        {/* ========================================================
            EMPTY STATE
        ========================================================= */}

        {!loading &&
          !error &&
          filteredDrivers.length === 0 && (

            <div className="rounded-xl border border-slate-800/70 bg-slate-950/50 py-20 text-center">

              <Search
                size={22}
                className="mx-auto mb-4 text-slate-800"
              />

              <p className="font-mono text-[9px] font-black uppercase tracking-widest text-slate-600">
                No drivers match query
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 font-mono text-[8px] uppercase tracking-widest text-cyan-400 hover:text-cyan-300"
              >
                Reset Filters
              </button>

            </div>

          )}


        {/* ========================================================
            DRIVER GRID
        ========================================================= */}

        {!loading &&
          !error &&
          filteredDrivers.length > 0 && (

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {filteredDrivers.map(
                (driver, index) => {

                  const style =
                    getTeamStyle(
                      driver.team
                    )

                  const isSelected =
                    selectedDriver ===
                    driver.abbreviation

                  return (

                    <motion.button
                      key={driver.abbreviation}
                      type="button"
                      initial={{
                        opacity: 0,
                        y: 18,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.35,
                        delay:
                          index * 0.025,
                      }}
                      onClick={() =>
                        setSelectedDriver(
                          isSelected
                            ? null
                            : driver.abbreviation
                        )
                      }
                      className={`
                        driver-hover-card
                        group
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                        bg-slate-950/70
                        p-5
                        text-left
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:bg-slate-950
                        ${style.border}
                        ${style.glow}
                        ${
                          isSelected
                            ? "ring-1 ring-cyan-400/50 border-cyan-400/60 shadow-[0_0_34px_rgba(34,211,238,0.10)]"
                            : ""
                        }
                      `}
                    >

                      {/* Top scan line */}

                      <div className="absolute left-0 top-0 h-px w-full -translate-x-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-transform duration-700 group-hover:translate-x-full" />


                      {/* Team accent */}

                      <div
                        className={`
                          absolute
                          left-0
                          top-0
                          h-16
                          w-px
                          opacity-80
                          ${style.bg}
                        `}
                      />


                      {/* Corner decoration */}

                      <div className="absolute right-0 top-0 h-9 w-9 border-r border-t border-cyan-400/20 transition group-hover:border-cyan-400/60" />


                      {/* Selected indicator */}

                      {isSelected && (
                        <div className="absolute left-0 top-0 flex items-center gap-2 rounded-br-md bg-cyan-400 px-2 py-1">

                          <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />

                          <span className="font-mono text-[6px] font-black uppercase tracking-widest text-slate-950">
                            SELECTED
                          </span>

                        </div>
                      )}


                      {/* Number + abbreviation */}

                      <div className="flex items-start justify-between">

                        <span className="driver-number select-none font-mono text-6xl font-black leading-none tracking-tighter text-slate-900">
                          {driver.driver_number}
                        </span>

                        <span
                          className={`
                            driver-chip
                            rounded-md
                            border
                            bg-slate-900/70
                            px-2.5
                            py-1.5
                            font-mono
                            text-[9px]
                            font-black
                            tracking-widest
                            ${style.border}
                            ${style.text}
                          `}
                        >
                          {driver.abbreviation}
                        </span>

                      </div>


                      {/* Driver information */}

                      <div className="relative mt-8">

                        <p className="font-mono text-[15px] font-black uppercase tracking-tight text-slate-200 transition group-hover:text-white">
                          {driver.full_name}
                        </p>

                        <div className="mt-2 flex items-center gap-2">

                          <span
                            className={`
                              h-1.5
                              w-1.5
                              rounded-full
                              ${style.bg}
                            `}
                          />

                          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-slate-600">
                            {driver.team}
                          </p>

                        </div>

                      </div>


                      {/* Footer */}

                      <div className="driver-footer mt-7 flex items-center justify-between border-t border-slate-900 pt-3">

                        <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-slate-700 transition group-hover:text-slate-500">
                          {isSelected
                            ? "Driver selected"
                            : "Select driver"}
                        </span>

                        <ChevronRight
                          size={14}
                          className="text-slate-800 transition-all group-hover:translate-x-1 group-hover:text-cyan-400"
                        />

                      </div>


                      {/* Bottom engineering line */}

                      <div className="absolute bottom-0 left-5 h-px w-10 bg-red-500/60 transition-all duration-300 group-hover:w-20 group-hover:bg-red-500" />

                    </motion.button>

                  )
                }
              )}

            </div>

          )}

      </main>

    </div>
  )
}
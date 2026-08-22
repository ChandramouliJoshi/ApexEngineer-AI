import {
  Activity,
  BarChart3,
  CircleDot,
  CloudSun,
  Gauge,
  GitCompare,
  GitCompareArrows,
  Home,
  Lightbulb,
  Radio,
  Route,
  Zap,
} from "lucide-react"

import { NavLink } from "react-router-dom"


const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: Home,
    color: "text-blue-400",
    active: "bg-blue-400/[0.08] border-blue-400",
    hover: "hover:text-blue-300",
  },
  {
    name: "Telemetry",
    path: "/telemetry",
    icon: Activity,
    color: "text-cyan-400",
    active: "bg-cyan-400/[0.08] border-cyan-400",
    hover: "hover:text-cyan-300",
  },
  {
    name: "Laps",
    path: "/laps",
    icon: Gauge,
    color: "text-orange-400",
    active: "bg-orange-400/[0.08] border-orange-400",
    hover: "hover:text-orange-300",
  },
  {
    name: "Corners",
    path: "/corners",
    icon: Route,
    color: "text-violet-400",
    active: "bg-violet-400/[0.08] border-violet-400",
    hover: "hover:text-violet-300",
  },
  {
    name: "Corner Compare",
    path: "/corner-comparison",
    icon: GitCompareArrows,
    color: "text-purple-400",
    active: "bg-purple-400/[0.08] border-purple-400",
    hover: "hover:text-purple-300",
  },
  {
    name: "Sectors",
    path: "/sectors",
    icon: BarChart3,
    color: "text-emerald-400",
    active: "bg-emerald-400/[0.08] border-emerald-400",
    hover: "hover:text-emerald-300",
  },
  {
    name: "Sector Compare",
    path: "/sector-comparison",
    icon: GitCompare,
    color: "text-teal-400",
    active: "bg-teal-400/[0.08] border-teal-400",
    hover: "hover:text-teal-300",
  },
  {
    name: "Tyres",
    path: "/tyres",
    icon: CircleDot,
    color: "text-yellow-300",
    active: "bg-yellow-300/[0.08] border-yellow-300",
    hover: "hover:text-yellow-200",
  },
  {
    name: "Weather",
    path: "/weather",
    icon: CloudSun,
    color: "text-sky-400",
    active: "bg-sky-400/[0.08] border-sky-400",
    hover: "hover:text-sky-300",
  },
  {
    name: "Delta",
    path: "/delta",
    icon: Zap,
    color: "text-fuchsia-400",
    active: "bg-fuchsia-400/[0.08] border-fuchsia-400",
    hover: "hover:text-fuchsia-300",
  },
  {
    name: "Drivers",
    path: "/drivers",
    icon: GitCompare,
    color: "text-indigo-400",
    active: "bg-indigo-400/[0.08] border-indigo-400",
    hover: "hover:text-indigo-300",
  },
  {
    name: "Engineer",
    path: "/engineer",
    icon: Lightbulb,
    color: "text-amber-400",
    active: "bg-amber-400/[0.08] border-amber-400",
    hover: "hover:text-amber-300",
  },
  {
    name: "Engineer Compare",
    path: "/engineer-comparison",
    icon: GitCompareArrows,
    color: "text-rose-400",
    active: "bg-rose-400/[0.08] border-rose-400",
    hover: "hover:text-rose-300",
  },
]


function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">

      {/* Brand */}

      <div className="border-b border-slate-800 px-6 py-6">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-black text-slate-950">
            AE
          </div>

          <div>

            <h1 className="text-sm font-bold tracking-[0.18em] text-white">
              APEXENGINEER
            </h1>

            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-slate-500">
              AI Race Engineering
            </p>

          </div>

        </div>

      </div>


      {/* Navigation */}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">

        <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          Analysis
        </p>

        {navigation.map((item) => {

          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm transition-all duration-200",
                  isActive
                    ? `${item.active} text-white`
                    : `border-transparent text-slate-500 hover:bg-slate-900 ${item.hover}`,
                ].join(" ")
              }
            >

              <Icon
                size={17}
                strokeWidth={1.8}
                className={`${item.color} transition-transform duration-200 group-hover:scale-110`}
              />

              <span className="font-medium">
                {item.name}
              </span>

            </NavLink>
          )
        })}

      </nav>


      {/* Status */}

      <div className="border-t border-slate-800 p-4">

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">

          <div className="flex items-center gap-2">

            <Radio
              size={13}
              className="text-emerald-400"
            />

            <span className="text-xs font-medium text-slate-300">
              Backend Online
            </span>

          </div>          

        </div>

      </div>

    </aside>
  )
}


export default Sidebar
import {
  Activity,
  BarChart3,
  Gauge,
  GitCompare,
  Home,
  Lightbulb,
  Radio,
  Route,
  Settings,
} from "lucide-react"

import { NavLink } from "react-router-dom"


const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    name: "Telemetry",
    path: "/telemetry",
    icon: Activity,
  },
  {
    name: "Laps",
    path: "/laps",
    icon: Gauge,
  },
  {
    name: "Corners",
    path: "/corners",
    icon: Route,
  },
  {
    name: "Sectors",
    path: "/sectors",
    icon: BarChart3,
  },
  {
    name: "Drivers",
    path: "/drivers",
    icon: GitCompare,
  },
  {
    name: "Engineer",
    path: "/engineer",
    icon: Lightbulb,
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
      <nav className="flex-1 space-y-1 px-3 py-6">

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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:bg-slate-900 hover:text-slate-200",
                ].join(" ")
              }
            >
              <Icon size={17} strokeWidth={1.8} />

              <span>
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

          <p className="mt-1 pl-5 text-[10px] text-slate-600">
            FastAPI · 127.0.0.1:8000
          </p>

        </div>

      </div>

    </aside>
  )
}


export default Sidebar
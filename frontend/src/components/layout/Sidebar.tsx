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

import { motion } from "framer-motion"
import { NavLink } from "react-router-dom"

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

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


function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <motion.button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        initial={false}
        animate={{ opacity: mobileOpen ? 1 : 0 }}
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      />
      <motion.aside
      initial={{
        x: -24,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950/95 shadow-[18px_0_60px_rgba(0,0,0,0.24)] backdrop-blur-xl ${mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"}`}
      >

      {/* Brand */}

      <div className="border-b border-slate-800 px-6 py-6">

        <div className="flex items-center gap-3">

          <motion.div
            whileHover={{
              rotate: -6,
              scale: 1.06,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 24,
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-black text-slate-950 shadow-[0_0_24px_rgba(255,255,255,0.14)]"
          >
            AE
          </motion.div>

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

        {navigation.map((item, index) => {

          const Icon = item.icon

          return (
            <motion.div
              key={item.path}
              initial={{
                opacity: 0,
                x: -10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.05 + index * 0.025,
                duration: 0.28,
              }}
            >
              <NavLink
                onClick={onClose}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "group relative flex items-center gap-3 overflow-hidden rounded-lg border-l-2 px-3 py-2.5 text-sm transition-all duration-200",
                    isActive
                      ? `${item.active} text-white shadow-[0_0_22px_rgba(15,23,42,0.55)]`
                      : `border-transparent text-slate-500 hover:bg-slate-900 ${item.hover}`,
                  ].join(" ")
                }
              >

                <span className="absolute inset-y-0 left-0 w-px -translate-y-full bg-current opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-40" />

                <Icon
                  size={17}
                  strokeWidth={1.8}
                  className={`${item.color} transition-transform duration-200 group-hover:scale-110`}
                />

                <span className="font-medium">
                  {item.name}
                </span>

              </NavLink>
            </motion.div>
          )
        })}

      </nav>


      {/* Status */}

      <div className="border-t border-slate-800 p-4">

        <motion.div
          whileHover={{
            y: -2,
            borderColor: "rgba(52,211,153,0.36)",
          }}
          className="rounded-lg border border-slate-800 bg-slate-900/50 p-3"
        >

          <div className="flex items-center gap-2">

            <motion.div
              animate={{
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
              }}
            >
              <Radio
                size={13}
                className="text-emerald-400"
              />
            </motion.div>

            <span className="text-xs font-medium text-slate-300">
              Backend Online
            </span>

          </div>          

        </motion.div>

      </div>

      </motion.aside>
    </>
  )
}


export default Sidebar

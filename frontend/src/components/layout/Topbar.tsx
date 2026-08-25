import { Circle, Menu } from "lucide-react"
import { motion } from "framer-motion"

interface TopbarProps {
  onMenu: () => void
}

function Topbar({ onMenu }: TopbarProps) {
  return (
    <motion.header
      initial={{
        y: -12,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.36,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/85 px-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:px-6 lg:px-8"
    >

      <motion.button
        type="button"
        aria-label="Open navigation"
        onClick={onMenu}
        whileTap={{ scale: 0.92 }}
        className="mr-3 rounded-lg border border-slate-800 p-2 text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400 lg:hidden"
      >
        <Menu size={18} />
      </motion.button>

      <div>

        <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
          Session
        </p>

        <p className="mt-0.5 text-sm font-medium text-slate-300">
          2025 Monaco Grand Prix · Race
        </p>

      </div>


      <motion.div
        whileHover={{
          scale: 1.02,
          borderColor: "rgba(52,211,153,0.38)",
        }}
        className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5"
      >

        <motion.span
          animate={{
            scale: [1, 1.45, 1],
            opacity: [1, 0.55, 1],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
          }}
        >
          <Circle
            size={7}
            fill="currentColor"
            className="text-emerald-400"
          />
        </motion.span>

        <span className="text-xs font-medium text-slate-400">
          ENGINEERING SYSTEM ONLINE
        </span>

      </motion.div>

    </motion.header>
  )
}


export default Topbar

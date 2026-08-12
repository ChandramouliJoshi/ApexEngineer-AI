import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface RacingPanelProps {
  title?: string
  children: ReactNode
  className?: string
  accent?: "red" | "cyan" | "yellow" | "green"
}

const accents = {
  red: "#e10600",
  cyan: "#00b8ff",
  yellow: "#ffb800",
  green: "#00e676",
}

function RacingPanel({
  title,
  children,
  className = "",
  accent = "red",
}: RacingPanelProps) {
  const color = accents[accent]

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      whileHover={{
        y: -2,
      }}
      className={`
        relative overflow-hidden
        rounded-xl
        border border-slate-800/80
        bg-[#080d18]/90
        shadow-[0_10px_40px_rgba(0,0,0,0.25)]
        ${className}
      `}
    >

      {/* Top racing line */}
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${color},
            transparent
          )`,
          boxShadow: `0 0 14px ${color}`,
        }}
      />

      {/* Left aerodynamic accent */}
      <div
        className="absolute left-0 top-0 h-16 w-[2px]"
        style={{
          background: color,
          boxShadow: `0 0 15px ${color}`,
        }}
      />

      {/* Corner cut */}
      <div
        className="absolute right-0 top-0 h-8 w-8"
        style={{
          background: `
            linear-gradient(
              135deg,
              transparent 48%,
              ${color} 50%,
              ${color} 54%,
              transparent 56%
            )
          `,
          opacity: 0.65,
        }}
      />

      {/* Scanline */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0"
        animate={{
          y: ["0%", "10000%"],
          opacity: [0, 0.25, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: color,
          boxShadow: `0 0 12px ${color}`,
        }}
      />

      {title && (
        <div className="relative flex items-center justify-between border-b border-slate-800/70 px-5 py-4">

          <div className="flex items-center gap-3">

            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />

            <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-300">
              {title}
            </h2>

          </div>

          <div className="font-mono text-[9px] uppercase tracking-widest text-slate-700">
            APEX / DATA
          </div>

        </div>
      )}

      <div className="relative">
        {children}
      </div>

    </motion.section>
  )
}

export default RacingPanel
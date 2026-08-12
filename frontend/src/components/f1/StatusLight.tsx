import { motion } from "framer-motion"

interface StatusLightProps {
  label: string
  status?: "online" | "warning" | "offline"
}

function StatusLight({
  label,
  status = "online",
}: StatusLightProps) {

  const colors = {
    online: "#00e676",
    warning: "#ffb800",
    offline: "#e10600",
  }

  const color = colors[status]

  return (
    <div className="flex items-center gap-2">

      <div className="relative flex h-2 w-2 items-center justify-center">

        <motion.div
          className="absolute h-2 w-2 rounded-full"
          style={{
            background: color,
          }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
          }}
        />

        <div
          className="relative h-1.5 w-1.5 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />

      </div>

      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>

    </div>
  )
}

export default StatusLight
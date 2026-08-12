import { motion } from "framer-motion"

interface TelemetryBarProps {
  label: string
  value: number
  suffix?: string
  color?: string
}

function TelemetryBar({
  label,
  value,
  suffix = "",
  color = "#00b8ff",
}: TelemetryBarProps) {

  return (
    <div className="space-y-2">

      <div className="flex items-end justify-between">

        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </span>

        <span className="font-mono text-sm font-bold text-white">
          {value.toFixed(2)}
          <span className="ml-1 text-[9px] text-slate-600">
            {suffix}
          </span>
        </span>

      </div>

      <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-900">

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${Math.min(value, 100)}%`,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(
              90deg,
              ${color},
              ${color}aa
            )`,
            boxShadow: `0 0 10px ${color}`,
          }}
        />

      </div>

    </div>
  )
}

export default TelemetryBar
import { motion } from "framer-motion"

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -15,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      className="mb-7"
    >

      <div className="flex items-center gap-3">

        <div className="h-px w-8 bg-[#e10600] shadow-[0_0_10px_#e10600]" />

        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e10600]">
          {eyebrow}
        </span>

      </div>

      <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
        {title}
      </h1>

      {description && (
        <p className="mt-2 text-sm text-slate-500">
          {description}
        </p>
      )}

    </motion.div>
  )
}

export default SectionHeader
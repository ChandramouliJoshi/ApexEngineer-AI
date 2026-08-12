import { Circle } from "lucide-react"


function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-8 backdrop-blur">

      <div>

        <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
          Session
        </p>

        <p className="mt-0.5 text-sm font-medium text-slate-300">
          2025 Monaco Grand Prix · Race
        </p>

      </div>


      <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">

        <Circle
          size={7}
          fill="currentColor"
          className="text-emerald-400"
        />

        <span className="text-xs font-medium text-slate-400">
          ENGINEERING SYSTEM ONLINE
        </span>

      </div>

    </header>
  )
}


export default Topbar
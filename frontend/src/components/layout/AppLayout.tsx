import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"


function AppLayout() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,6,0,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(0,184,255,0.10),transparent_30%)]" />
        <div className="absolute inset-0 ae-speed-lines" />
      </div>

      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="relative min-h-screen lg:ml-64">

        <Topbar onMenu={() => setMobileNavOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{
                opacity: 0,
                y: 16,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -8,
                filter: "blur(6px)",
              }}
              transition={{
                duration: 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

    </div>
  )
}


export default AppLayout

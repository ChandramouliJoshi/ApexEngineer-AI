import { Outlet } from "react-router-dom"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"


function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <div className="ml-64 min-h-screen">

        <Topbar />

        <main className="p-8">
          <Outlet />
        </main>

      </div>

    </div>
  )
}


export default AppLayout
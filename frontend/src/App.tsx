import { lazy, Suspense } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import AppLayout from "./components/layout/AppLayout"

const Dashboard = lazy(() => import("./pages/Dashboard"))
const Drivers = lazy(() => import("./pages/Drivers"))
const Laps = lazy(() => import("./pages/Laps"))
const Telemetry = lazy(() => import("./pages/Telemetry"))
const Sectors = lazy(() => import("./pages/Sectors"))
const Corners = lazy(() => import("./pages/Corners"))
const Tyres = lazy(() => import("./pages/Tyres"))
const Weather = lazy(() => import("./pages/Weather"))
const Delta = lazy(() => import("./pages/Delta"))
const CornerComparison = lazy(() => import("./pages/CornerComparison"))
const SectorComparison = lazy(() => import("./pages/SectorComparison"))
const Engineer = lazy(() => import("./pages/Engineer"))
const EngineerComparison = lazy(() => import("./pages/EngineerComparison"))

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-sm text-slate-400">
        Loading...
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<AppLayout />}>

            <Route path="/" element={<Dashboard />} />

            <Route path="/drivers" element={<Drivers />} />

            <Route path="/laps" element={<Laps />} />

            <Route path="/telemetry" element={<Telemetry />} />

            <Route path="/sectors" element={<Sectors />} />

            <Route path="/corners" element={<Corners />} />

            <Route
              path="/corner-comparison"
              element={<CornerComparison />}
            />

            <Route
              path="/sector-comparison"
              element={<SectorComparison />}
            />

            <Route path="/tyres" element={<Tyres />} />

            <Route path="/weather" element={<Weather />} />

            <Route path="/delta" element={<Delta />} />

            <Route path="/engineer" element={<Engineer />} />

            <Route
              path="/engineer-comparison"
              element={<EngineerComparison />}
            />

          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
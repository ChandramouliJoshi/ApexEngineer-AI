import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import AppLayout from "./components/layout/AppLayout"

import Dashboard from "./pages/Dashboard"
import Drivers from "./pages/Drivers"
import Laps from "./pages/Laps"
import Telemetry from "./pages/Telemetry"
import Sectors from "./pages/Sectors"
import Corners from "./pages/Corners"
import Tyres from "./pages/Tyres"
import Weather from "./pages/Weather"
import Delta from "./pages/Delta"
import CornerComparison from "./pages/CornerComparison"
import SectorComparison from "./pages/SectorComparison"
import Engineer from "./pages/Engineer"
import EngineerComparison from "./pages/EngineerComparison"


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          element={<AppLayout />}
        >

          {/* Dashboard */}

          <Route
            path="/"
            element={<Dashboard />}
          />


          {/* Drivers */}

          <Route
            path="/drivers"
            element={<Drivers />}
          />


          {/* Laps */}

          <Route
            path="/laps"
            element={<Laps />}
          />


          {/* Telemetry */}

          <Route
            path="/telemetry"
            element={<Telemetry />}
          />


          {/* Sectors */}

          <Route
            path="/sectors"
            element={<Sectors />}
          />


          {/* Corners */}

          <Route
            path="/corners"
            element={<Corners />}
          />


          {/* Corner Comparison */}

          <Route
            path="/corner-comparison"
            element={<CornerComparison />}
          />


          {/* Sector Comparison */}

          <Route
            path="/sector-comparison"
            element={<SectorComparison />}
          />


          {/* Tyres */}

          <Route
            path="/tyres"
            element={<Tyres />}
          />


          {/* Weather */}

          <Route
            path="/weather"
            element={<Weather />}
          />


          {/* Delta */}

          <Route
            path="/delta"
            element={<Delta />}
          />


          {/* Engineer */}

          <Route
            path="/engineer"
            element={<Engineer />}
          />


          {/* Engineer Comparison */}

          <Route
            path="/engineer-comparison"
            element={<EngineerComparison />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}


export default App
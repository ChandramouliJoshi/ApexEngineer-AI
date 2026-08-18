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

        </Route>

      </Routes>

    </BrowserRouter>
  )
}


export default App
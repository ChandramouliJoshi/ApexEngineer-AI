import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import AppLayout from "./components/layout/AppLayout"

import Dashboard from "./pages/Dashboard"
import Drivers from "./pages/Drivers"


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

        </Route>

      </Routes>

    </BrowserRouter>
  )
}


export default App
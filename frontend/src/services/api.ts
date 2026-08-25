import axios from "axios"

import type {
  EngineerReport,
} from "../types/api"


export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
})


// ==========================================================
// SESSION
// ==========================================================

export async function getSessionInfo(
  year: number,
  grandPrix: string,
  sessionType: string = "R",
) {
  const response = await api.get("/sessions/info", {
    params: {
      year,
      grand_prix: grandPrix,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// DRIVERS
// ==========================================================

export async function getDrivers(
  year: number,
  grandPrix: string,
  sessionType: string = "R",
) {
  const response = await api.get("/drivers/", {
    params: {
      year,
      grand_prix: grandPrix,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// TELEMETRY
// ==========================================================

export async function getTelemetry(
  year: number,
  grandPrix: string,
  driver: string,
  sessionType: string = "R",
) {
  const response = await api.get("/telemetry/", {
    params: {
      year,
      grand_prix: grandPrix,
      driver,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// TELEMETRY ANALYSIS
// ==========================================================

export async function getTelemetryAnalysis(
  year: number,
  grandPrix: string,
  driver: string,
  sessionType: string = "R",
) {
  const response = await api.get("/analysis/telemetry", {
    params: {
      year,
      grand_prix: grandPrix,
      driver,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// CORNERS
// ==========================================================

export async function getCorners(
  year: number,
  grandPrix: string,
  driver: string,
  sessionType: string = "R",
) {
  const response = await api.get("/analysis/corners", {
    params: {
      year,
      grand_prix: grandPrix,
      driver,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// CORNER COMPARISON
// ==========================================================

export async function getCornerComparison(
  year: number,
  grandPrix: string,
  driver1: string,
  driver2: string,
  sessionType: string = "R",
) {
  const response = await api.get("/analysis/corner-comparison", {
    params: {
      year,
      grand_prix: grandPrix,
      driver_1: driver1,
      driver_2: driver2,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// DELTA
// ==========================================================

export async function getDelta(
  year: number,
  grandPrix: string,
  driver1: string,
  driver2: string,
  sessionType: string = "R",
) {
  const response = await api.get("/analysis/delta", {
    params: {
      year,
      grand_prix: grandPrix,
      driver_1: driver1,
      driver_2: driver2,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// SECTORS
// ==========================================================

export async function getSectors(
  year: number,
  grandPrix: string,
  driver: string,
  sessionType: string = "R",
) {
  const response = await api.get("/analysis/sectors", {
    params: {
      year,
      grand_prix: grandPrix,
      driver,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// SECTOR COMPARISON
// ==========================================================

export async function getSectorComparison(
  year: number,
  grandPrix: string,
  driver1: string,
  driver2: string,
  sessionType: string = "R",
) {
  const response = await api.get("/analysis/sector-comparison", {
    params: {
      year,
      grand_prix: grandPrix,
      driver_1: driver1,
      driver_2: driver2,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// TYRES
// ==========================================================

export async function getTyres(
  year: number,
  grandPrix: string,
  driver: string,
  sessionType: string = "R",
) {
  const response = await api.get("/analysis/tyres", {
    params: {
      year,
      grand_prix: grandPrix,
      driver,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// WEATHER
// ==========================================================

export async function getWeather(
  year: number,
  grandPrix: string,
  sessionType: string = "R",
) {
  const response = await api.get("/analysis/weather", {
    params: {
      year,
      grand_prix: grandPrix,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// ENGINEER REPORT
// ==========================================================

export async function getEngineerReport(
  year: number,
  grandPrix: string,
  driver: string,
  sessionType: string = "R",
): Promise<EngineerReport> {

  const response = await api.get<EngineerReport>(
    "/analysis/engineer",
    {
      params: {
        year,
        grand_prix: grandPrix,
        driver,
        session_type: sessionType,
      },
    },
  )

  return response.data
}


// ==========================================================
// ENGINEER COMPARISON
// ==========================================================

export async function getEngineerComparison(
  year: number,
  grandPrix: string,
  driver1: string,
  driver2: string,
  sessionType: string = "R",
) {
  const response = await api.get("/analysis/engineer-comparison", {
    params: {
      year,
      grand_prix: grandPrix,
      driver_1: driver1,
      driver_2: driver2,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// LAPS
// ==========================================================

export async function getLaps(
  year: number,
  grandPrix: string,
  sessionType: string = "R",
  limit: number = 20,
  offset: number = 0,
) {
  const response = await api.get("/laps/", {
    params: {
      year,
      grand_prix: grandPrix,
      session_type: sessionType,
      limit,
      offset,
    },
  })

  return response.data
}


// ==========================================================
// DRIVER LAPS
// ==========================================================

export async function getDriverLaps(
  year: number,
  grandPrix: string,
  driver: string,
  sessionType: string = "R",
) {
  const response = await api.get("/laps/driver", {
    params: {
      year,
      grand_prix: grandPrix,
      driver,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// FASTEST LAP
// ==========================================================

export async function getFastestLap(
  year: number,
  grandPrix: string,
  driver: string,
  sessionType: string = "R",
) {
  const response = await api.get("/laps/fastest", {
    params: {
      year,
      grand_prix: grandPrix,
      driver,
      session_type: sessionType,
    },
  })

  return response.data
}


// ==========================================================
// STINTS
// ==========================================================

export async function getStints(
  year: number,
  grandPrix: string,
  driver: string,
  sessionType: string = "R",
) {
  const response = await api.get("/laps/stints", {
    params: {
      year,
      grand_prix: grandPrix,
      driver,
      session_type: sessionType,
    },
  })

  return response.data
}
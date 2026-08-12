import axios from "axios"

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function getSessionInfo(
  year: number,
  grandPrix: string,
  sessionType: string,
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

export async function getEngineerReport(
  year: number,
  grandPrix: string,
  driver: string,
  sessionType: string = "R",
) {
  const response = await api.get("/analysis/engineer", {
    params: {
      year,
      grand_prix: grandPrix,
      driver,
      session_type: sessionType,
    },
  })

  return response.data
}
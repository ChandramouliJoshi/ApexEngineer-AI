export interface TelemetrySummary {
  speed: {
    max: number
    average: number
    minimum: number
  }

  rpm: {
    max: number
    average: number
  }

  gear: {
    max: number
    average: number
  }

  distance: number
  full_throttle: number
  brake_usage: number
  drs_usage: number
}

export interface SectorData {
  fastest: number
  average: number
}

export interface Sectors {
  sector_1: SectorData
  sector_2: SectorData
  sector_3: SectorData
  best_sector_combination: number
}

export interface PerformanceScore {
  speed_score: number
  throttle_score: number
  braking_score: number
  consistency_score: number
  overall_score: number
}

export interface Recommendation {
  area: string
  priority: "High" | "Medium" | "Low" | string
  message: string
}

export interface EngineerReport {
  telemetry: TelemetrySummary
  sectors: Sectors
  performance_score: PerformanceScore
  recommendations: Recommendation[]
}

export interface SessionInfo {
  year: number
  grand_prix: string
  session_type: string
  [key: string]: unknown
}
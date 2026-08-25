// ==========================================================
// SESSION
// ==========================================================

export interface SessionInfo {
  event: string
  country: string
  location: string
  round: number
  drivers: number
  laps: number
}


// ==========================================================
// DRIVER
// ==========================================================

export interface Driver {
  driver_number: string
  abbreviation: string
  full_name: string
  team: string
}

export interface DriversResponse {
  drivers: Driver[]
}


// ==========================================================
// TELEMETRY
// ==========================================================

export interface TelemetryPoint {
  Time?: string
  Speed?: number
  RPM?: number
  nGear?: number
  Throttle?: number
  Brake?: boolean | number
  DRS?: number
  Distance?: number
  [key: string]: unknown
}


// ==========================================================
// TELEMETRY SUMMARY
// ==========================================================

export interface TelemetrySummary {
  speed: {
    max: number
    average: number
    minimum: number
    range: number
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

  throttle: {
    full_throttle: number
    average: number
  }

  braking: {
    usage: number
    samples: number
  }

  drs_usage: number

  engineering_indicators: {
    speed_consistency: number
    average_throttle: number
    braking_samples: number
    speed_range: number
  }
}


// ==========================================================
// SECTORS
// ==========================================================

export interface SectorData {
  fastest: number | null
  average: number | null
  consistency: number | null
  performance_gap: number | null
}

export interface SectorPerformance {
  strongest_sector: string
  weakest_sector: string
  strongest_gap: number
  weakest_gap: number
}

export interface Sectors {
  sector_1: SectorData
  sector_2: SectorData
  sector_3: SectorData
  best_sector_combination: number | null
  best_sector: string | null
  sector_performance: SectorPerformance | null
}


// ==========================================================
// CORNERS
// ==========================================================

export type Priority =
  | "High"
  | "Medium"
  | "Low"
  | string

export interface CornerAnalysis {
  corner: number

  entry_speed: number
  apex_speed: number
  exit_speed: number

  max_brake: number
  max_throttle: number
  average_rpm: number
  samples: number

  entry_to_apex_loss: number
  apex_to_exit_gain: number

  braking_intensity: number
  throttle_application: number

  corner_score: number

  priority: Priority

  diagnosis: string[]
}


export interface CornerSummary {
  total_corners: number

  highest_braking_corner: {
    corner: number
    braking_intensity: number
  } | null

  largest_speed_loss_corner: {
    corner: number
    speed_loss: number
  } | null

  best_acceleration_corner: {
    corner: number
    speed_gain: number
  } | null

  summary: string
}


// ==========================================================
// PERFORMANCE
// ==========================================================

export interface PerformanceScore {
  speed_score: number
  throttle_score: number
  braking_score: number
  consistency_score: number
  overall_score: number
}


export interface PerformanceBreakdown {
  speed: number
  throttle: number
  braking: number
  consistency: number
}


// ==========================================================
// ENGINEERING SUMMARY
// ==========================================================

export interface EngineeringSummary {
  overall_score: number

  strongest_area: string
  strongest_score: number

  weakest_area: string
  weakest_score: number

  priority: Priority

  message: string
}


// ==========================================================
// RECOMMENDATIONS
// ==========================================================

export interface Recommendation {
  area: string
  priority: Priority
  message: string
}


// ==========================================================
// ENGINEER REPORT
// ==========================================================

export interface EngineerReport {
  telemetry: TelemetrySummary

  sectors: Sectors

  corners: CornerAnalysis[]

  corner_summary: CornerSummary

  performance_score: PerformanceScore

  performance_breakdown: PerformanceBreakdown

  engineering_summary: EngineeringSummary

  recommendations: Recommendation[]
}


// ==========================================================
// LAP
// ==========================================================

export interface Lap {
  [key: string]: unknown
}


export interface LapsResponse {
  total: number
  limit: number
  offset: number
  laps: Lap[]
}


// ==========================================================
// FASTEST LAP
// ==========================================================

export interface FastestLap {
  driver: string
  lap_number: number | null
  lap_time: string | null
  compound: string | null
  tyre_life: number | null
  position: number | null
}


// ==========================================================
// STINT
// ==========================================================

export interface Stint {
  stint: number
  laps: number
  compound: string | null
  tyre_life_start: number | null
  tyre_life_end: number | null
}


// ==========================================================
// COMPARISON
// ==========================================================

export interface DriverComparison {
  driver_1: string
  driver_2: string
  [key: string]: unknown
}


// ==========================================================
// GENERIC API RESPONSE
// ==========================================================

export interface ApiError {
  detail?: string
  message?: string
}
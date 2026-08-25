F1 Telemetry & Race Analysis Dashboard
A full-stack Formula 1 telemetry and performance-analysis platform built to turn raw session data into something that can actually be explored from an engineering perspective.
The project combines a React + TypeScript frontend with a FastAPI backend and FastF1 data. Instead of presenting telemetry as isolated numbers, the dashboard connects lap performance, sector pace, driver comparisons, tyre stints and car telemetry in one workflow.
---
What this project does
The application lets a user select a season, Grand Prix, driver and session, then inspect the resulting data through dedicated analysis views.
Current analysis areas include:
•	Driver and session selection
•	Lap-by-lap performance
•	Telemetry traces
•	Sector performance
•	Driver-vs-driver sector comparison
•	Tyre compounds and stint analysis
•	Speed, throttle, braking, RPM, gear and DRS data
•	Personal-best, deleted and accurate-lap information
The frontend does not directly depend on FastF1. Data is obtained through the backend API, keeping data processing and presentation separate.
---
The idea behind the project
Raw F1 data is useful, but raw data does not immediately answer engineering questions.
For example:
> Where did one driver actually gain the time?
That question can be broken down into:
Lap Time
   ↓
Sector Delta
   ↓
Track Position
   ↓
Speed Trace
   ↓
Braking
   ↓
Throttle
   ↓
Gear / DRS
   ↓
Tyre State
The project is being built around that drill-down approach. A lap-time difference should eventually be traceable to the parts of the lap that produced it.
---
Architecture
┌─────────────────────────────────────┐
│          React / TypeScript         │
│                                     │
│ Dashboard • Engineer • Charts       │
│ Selection • Comparisons             │
└──────────────────┬──────────────────┘
                   │ HTTP / REST
                   ▼
┌─────────────────────────────────────┐
│              FastAPI                │
│                                     │
│ Drivers • Laps • Telemetry          │
│ Sectors • Tyres • Comparisons       │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│              FastF1                 │
│                                     │
│ Session • Timing • Lap • Telemetry  │
└─────────────────────────────────────┘
The frontend handles interaction and visualisation. The backend handles data acquisition, processing and API responses.
---
Frontend
The frontend is written in React and TypeScript. API access is isolated into custom hooks so UI components do not need to contain request and normalisation logic.
Current hooks include:
useDrivers
useLaps
useTelemetry
useTyres
useSectors
useSectorComparison
Each hook follows the same basic lifecycle:
1. Receive the current analysis parameters.
2. Request the appropriate API endpoint.
3. Handle loading and errors.
4. Normalise backend data into a predictable TypeScript model.
5. Expose the result to the dashboard.
6. Prevent stale requests from updating unmounted components.
This keeps the presentation layer considerably cleaner as the number of analysis modules grows.
---
Telemetry model
Telemetry is represented as a distance-based time series:
interface TelemetryPoint {
  Distance: number
  Speed: number
  Throttle: number
  Brake: number
  RPM: number
  Gear: number
  DRS: number
}
Samples are sorted by track distance before they reach the visualisation layer, allowing traces to progress naturally from the beginning to the end of a lap.
The frontend also accepts common FastF1/backend naming variations such as `nGear`, `Gear`, `gear`, `DRS`, `drs`, `nDRS` and `DRSState` and converts them into a single internal representation.
---
Lap analysis
Lap data currently supports:
Field	Description
Lap number	Sequential lap identifier
Lap time	Complete lap duration
Sector 1 / 2 / 3	Individual sector times
Compound	Tyre compound used
Tyre life	Age of the tyre
Stint	Current tyre stint
Position	Track position
Speed FL	Finish-line speed
Speed ST	Speed-trap value
Personal best	Whether the lap is a personal best
Deleted	Whether the lap was deleted
Accurate	Whether the lap is marked accurate
The hook also supports pagination parameters through `limit` and `offset`.
---
Sector analysis
The sector endpoint provides the driver's fastest and average performance in all three sectors, along with the theoretical best-sector combination.
Sector 1 → fastest / average
Sector 2 → fastest / average
Sector 3 → fastest / average

Best Sector Combination → S1 + S2 + S3 bests
This gives the dashboard a useful distinction between the driver's actual lap time and the lap time that could theoretically have been achieved by combining their best sectors.
---
Driver comparison
Two drivers can be compared sector by sector.
For every sector the API provides:
Driver 1 time
Driver 2 time
Delta
The comparison layer is intended to evolve into a deeper driver-performance analysis rather than remaining a simple timing table.
---
Tyre analysis
Tyre analysis is organised around compounds and stints.
The current model tracks:
•	Compounds used
•	Stint number
•	Laps completed in a stint
•	Tyre life at stint start
•	Tyre life at stint end
•	Fastest lap by compound
This provides the foundation for future degradation, pace-over-stint and strategy analysis.
---
API
The frontend currently communicates with:
http://127.0.0.1:8000
Endpoints
Endpoint	Purpose
`/drivers/`	Available drivers
`/laps/`	Lap-level data
`/telemetry/`	Telemetry samples
`/analysis/tyres`	Tyre and stint analysis
`/analysis/sectors`	Sector statistics
`/analysis/sector-comparison`	Two-driver sector comparison
Common parameters:
year
grand_prix
driver
session_type
The comparison endpoint additionally accepts:
driver_1
driver_2
---
Example API requests
Drivers
GET /drivers/
Laps
GET /laps/?year=2026&grand_prix=Belgian%20Grand%20Prix&driver=NOR&session_type=Race
Telemetry
GET /telemetry/?year=2026&grand_prix=Belgian%20Grand%20Prix&driver=NOR&session_type=Race
Sector comparison
GET /analysis/sector-comparison?year=2026&grand_prix=Belgian%20Grand%20Prix&driver_1=NOR&driver_2=VER&session_type=Race
---
Defensive API handling
The frontend deliberately normalises backend responses instead of assuming that every response will always have exactly the same structure.
For example, a telemetry response can be handled as:
[
  { "Distance": 0, "Speed": 280 }
]
or:
{
  "data": [
    { "Distance": 0, "Speed": 280 }
  ]
}
or:
{
  "telemetry": [
    { "Distance": 0, "Speed": 280 }
  ]
}
The hook converts these into the same frontend model.
This is particularly useful while the backend API is still evolving.
---
Error and loading states
The data hooks expose a consistent interface:
{
  data,
  loading,
  error
}
API errors are captured and surfaced to the UI instead of allowing undefined response data to propagate through the component tree.
Requests are also protected against stale state updates when the component is unmounted or when the selected session changes.
---
Project structure
A simplified structure is:
project/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   │   ├── useDrivers.ts
│   │   │   ├── useLaps.ts
│   │   │   ├── useTelemetry.ts
│   │   │   ├── useTyres.ts
│   │   │   ├── useSectors.ts
│   │   │   └── useSectorComparison.ts
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── ...
│   └── ...
│
└── README.md
The structure can change as the dashboard grows; the important separation is between UI, data hooks and backend services.
---
Running locally
Backend
Install the Python dependencies and start FastAPI:
uvicorn main:app --reload
The API should be available at:
http://127.0.0.1:8000
FastAPI's Swagger documentation is normally available at:
http://127.0.0.1:8000/docs
Frontend
From the frontend directory:
npm install
npm run dev
Open the local URL printed by Vite.
---
Development checks
Before committing frontend changes:
npm run lint
npm run build
Linting catches issues such as unused imports, variables and other code-quality problems. The production build verifies that the TypeScript/React application can be compiled successfully.
---
Tech stack
Frontend
•	React
•	TypeScript
•	Axios
•	Vite
•	Data visualisation components
Backend
•	Python
•	FastAPI
•	FastF1
•	REST API
Data
•	Formula 1 session data
•	Lap timing
•	Sector timing
•	Car telemetry
•	Tyre and stint information
---
Roadmap
The next stage is to push the project from a telemetry dashboard towards an actual driver-engineering tool.
Planned analysis includes:
•	Two-driver telemetry overlays
•	Speed-trace delta graphs
•	Track-map telemetry
•	Corner-by-corner analysis
•	Braking-point comparison
•	Throttle application comparison
•	Gear and DRS comparison
•	Tyre degradation curves
•	Pace consistency analysis
•	Race-pace comparison
•	Sector heatmaps
•	Stint strategy visualisation
•	Automatic fastest-lap selection
•	Session-wide driver ranking
•	Automated performance summaries
The longer-term goal is for a user to select two drivers and move from **"who was faster?"** to **"where, why and by how much?"** without leaving the dashboard.
---
Data source
The backend uses FastF1 to obtain Formula 1 timing and telemetry-related data. FastF1 acts as the underlying data layer while the project's API exposes the subset required by the application.
---
Disclaimer
This project is an independent educational and engineering project. It is not affiliated with or endorsed by Formula 1, the FIA or any Formula 1 team.
Formula 1 and related trademarks belong to their respective owners.
---
Status
**Active development**
The core data pipeline and analysis hooks are being developed incrementally, with the frontend and backend API evolving together as new telemetry and race-analysis capabilities are added.
---
Author
Built as an engineering and data-analysis project focused on Formula 1 telemetry, performance analysis and interactive visualisation.

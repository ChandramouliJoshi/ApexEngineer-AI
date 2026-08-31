# ApexEngineer-AI Project Structure

Complete project structure for the ApexEngineer-AI application - a Formula 1 analysis and telemetry dashboard.

## Root Directory

```
ApexEngineer-AI/
├── .git/                          # Git version control
├── .gitignore                      # Git ignore rules
├── .pytest_cache/                  # Pytest cache
├── backend/                        # Backend services (Python/FastAPI)
├── frontend/                       # Frontend application (React/TypeScript)
├── f1ven/                          # Python virtual environment
├── docker-compose.yml              # Docker compose configuration
├── pyproject.toml                  # Python project configuration
├── README.md                       # Project documentation
├── requirements.txt                # Python dependencies
└── FILE_STRUCTURE.md               # This file
```

## Backend Structure

```
backend/
├── app/                            # Main application package
│   ├── __init__.py
│   ├── main.py                     # FastAPI application entry point
│   │
│   ├── analytics/                  # Analysis modules
│   │   ├── __init__.py
│   │   ├── base_analysis.py       # Base analysis class
│   │   ├── comparison_analysis.py # Comparison analysis
│   │   ├── corner_analysis.py     # Corner-specific analysis
│   │   ├── corner_comparison.py   # Corner comparison logic
│   │   ├── delta_analysis.py      # Delta/lap time analysis
│   │   ├── sector_analysis.py     # Sector analysis
│   │   ├── sector_comparison.py   # Sector comparison
│   │   ├── telemetry_analysis.py  # Telemetry data analysis
│   │   ├── tyre_analysis.py       # Tyre/tire analysis
│   │   └── weather_analysis.py    # Weather data analysis
│   │
│   ├── api/                        # API endpoints
│   │   ├── __init__.py
│   │   ├── analysis.py            # Analysis endpoints
│   │   ├── drivers.py             # Driver endpoints
│   │   ├── laps.py                # Lap data endpoints
│   │   ├── sessions.py            # Session endpoints
│   │   └── telemetry.py           # Telemetry endpoints
│   │
│   ├── core/                       # Core utilities
│   │   ├── __init__.py
│   │   ├── cache.py               # Caching logic
│   │   ├── config.py              # Configuration
│   │   ├── constants.py           # Application constants
│   │   └── logging.py             # Logging setup
│   │
│   ├── database/                   # Database layer
│   │   ├── __init__.py
│   │   ├── database.py            # Database connection/setup
│   │   ├── models.py              # SQLAlchemy/ORM models
│   │   └── schemas.py             # Pydantic schemas
│   │
│   ├── ml/                         # Machine learning modules
│   │   ├── __init__.py
│   │   ├── driver_scoring.py      # Driver performance scoring
│   │   ├── recommendation.py      # ML recommendations
│   │   └── models/                # Pre-trained ML models
│   │
│   ├── services/                   # Business logic services
│   │   ├── __init__.py
│   │   ├── ai_engineer.py         # AI engineer service
│   │   ├── comparison_service.py  # Comparison logic
│   │   ├── fastf1_service.py      # FastF1 API integration
│   │   ├── lap_service.py         # Lap data service
│   │   ├── session_service.py     # Session management
│   │   └── telemetry_service.py   # Telemetry data service
│   │
│   ├── utils/                      # Utility functions
│   │   ├── calculations.py        # Mathematical calculations
│   │   ├── helpers.py             # Helper functions
│   │   └── validators.py          # Data validation
│   │
│   └── visualization/              # Visualization/plotting
│       ├── __init__.py
│       ├── delta_plot.py          # Delta/lap comparison plots
│       └── telemetry_plot.py      # Telemetry visualization
│
├── cache/                          # F1 data cache
│   ├── 2023/                       # 2023 season races
│   │   ├── 2023-03-19_Saudi_Arabian_Grand_Prix/
│   │   ├── 2023-04-02_Australian_Grand_Prix/
│   │   ├── 2023-04-30_Azerbaijan_Grand_Prix/
│   │   ├── 2023-05-28_Monaco_Grand_Prix/
│   │   └── ... (other races)
│   │
│   ├── 2024/                       # 2024 season races
│   │   ├── 2024-03-02_Bahrain_Grand_Prix/
│   │   └── ... (other races)
│   │
│   └── 2025/                       # 2025 season races
│       └── ... (upcoming races)
│
├── data/                           # Data files/datasets
│
├── output/                         # Output files (reports, exports)
│
└── tests/                          # Test suite
    ├── test_analysis.py
    ├── test_car_data.py
    ├── test_comparison.py
    ├── test_corner_analysis.py
    ├── test_corner_comparison.py
    ├── test_corners.py
    ├── test_delta_plot.py
    ├── test_delta.py
    ├── test_driver_scoring.py
    ├── test_lap_service.py
    ├── test_plot.py
    ├── test_recommendation.py
    ├── test_session.py
    ├── test_telemetry.py
    └── test_utils.py
```

## Frontend Structure

```
frontend/
├── .env                            # Environment variables
├── .gitignore                      # Git ignore rules
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML entry point
├── package.json                    # NPM dependencies
├── package-lock.json               # Dependency lock file
├── README.md                       # Frontend documentation
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.app.json              # TypeScript app-specific config
├── tsconfig.node.json             # TypeScript node config
├── vite.config.ts                  # Vite build configuration
├── dist/                           # Build output (generated)
├── node_modules/                   # NPM packages (generated)
│
├── public/                         # Static assets
│   ├── favicon.svg
│   └── icons.svg
│
└── src/                            # Source code
    ├── App.css                     # Main app styles
    ├── App.tsx                     # Root component
    ├── index.css                   # Global styles
    ├── main.tsx                    # React entry point
    │
    ├── assets/                     # Image/media assets
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    │
    ├── components/                 # React components
    │   ├── charts/                 # Chart/data visualization components
    │   ├── dashboard/              # Dashboard layout components
    │   ├── f1/                     # F1-specific components
    │   │   ├── RacingPanel.tsx
    │   │   ├── SectionHeader.tsx
    │   │   ├── StatusLight.tsx
    │   │   └── TelemetryBar.tsx
    │   └── layout/                 # Layout components
    │       ├── AppLayout.tsx       # Main app layout
    │       ├── Sidebar.tsx         # Navigation sidebar
    │       └── Topbar.tsx          # Top navigation bar
    │
    ├── hooks/                      # Custom React hooks
    │   ├── useCornerComparison.ts  # Corner comparison hook
    │   ├── useCorners.ts           # Corners data hook
    │   ├── useDelta.ts             # Delta analysis hook
    │   ├── useDriverComparison.ts  # Driver comparison hook
    │   ├── useDrivers.ts           # Drivers data hook
    │   ├── useEngineer.ts          # Engineer analysis hook
    │   ├── useEngineerComparison.ts # Engineer comparison hook
    │   ├── useEngineerReport.ts    # Engineer report hook
    │   ├── useLaps.ts              # Laps data hook
    │   ├── useSectorComparison.ts  # Sector comparison hook
    │   └── useSectors.ts           # Sectors data hook
    │
    ├── pages/                      # Page components
    │   └── (Route pages)
    │
    ├── services/                   # API/data services
    │   └── (API integration services)
    │
    └── types/                      # TypeScript type definitions
        └── (TypeScript interfaces/types)
```

## Python Virtual Environment

```
f1ven/                             # Python 3.x virtual environment
├── pyvenv.cfg                     # Virtual env configuration
├── Include/                       # C headers for Python extensions
├── Lib/
│   ├── site-packages/            # Third-party packages
│   └── (Standard library)
├── Scripts/                       # Executable scripts
│   ├── activate                  # Unix activation script
│   ├── activate.bat              # Windows batch activation
│   ├── activate.fish             # Fish shell activation
│   ├── Activate.ps1              # PowerShell activation
│   ├── deactivate.bat            # Deactivation script
│   └── (Python executables)
└── share/
    ├── jupyter/                  # Jupyter configuration
    └── man/                      # Manual pages
```

## Key Configuration Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Docker container orchestration configuration |
| `pyproject.toml` | Python project metadata and build configuration |
| `requirements.txt` | Python package dependencies and versions |
| `package.json` | Node.js/npm package dependencies |
| `tsconfig.json` | TypeScript compiler configuration |
| `vite.config.ts` | Frontend build tool (Vite) configuration |
| `eslint.config.js` | Code linting rules |

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy ORM
- **Data Processing**: FastF1, NumPy, Pandas
- **ML/AI**: Driver scoring, recommendations
- **Testing**: Pytest

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3
- **Linting**: ESLint
- **Type Checking**: TypeScript

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Package Management**: NPM (frontend), Pip (backend)

## Development Workflow

1. **Backend**: Run `python backend/app/main.py` or use FastAPI dev server
2. **Frontend**: Run `npm run dev` in frontend directory
3. **Testing**: Run `pytest` in backend directory
4. **Database**: Configured through SQLAlchemy models
5. **Caching**: F1 data cached in `backend/cache/` directory

---

**Last Updated**: 2026-08-31

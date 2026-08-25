# Frontend File Structure

```text
frontend/
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── charts/
│   │   ├── dashboard/
│   │   ├── f1/
│   │   │   ├── RacingPanel.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── StatusLight.tsx
│   │   │   └── TelemetryBar.tsx
│   │   └── layout/
│   │       ├── AppLayout.tsx
│   │       ├── Sidebar.tsx
│   │       └── Topbar.tsx
│   ├── hooks/
│   │   ├── useCornerComparison.ts
│   │   ├── useCorners.ts
│   │   ├── useDelta.ts
│   │   ├── useDriverComparison.ts
│   │   ├── useDrivers.ts
│   │   ├── useEngineer.ts
│   │   ├── useEngineerComparison.ts
│   │   ├── useEngineerReport.ts
│   │   ├── useLaps.ts
│   │   ├── useSectorComparison.ts
│   │   ├── useSectors.ts
│   │   ├── useTelemetry.ts
│   │   ├── useTyres.ts
│   │   └── useWeather.ts
│   ├── pages/
│   │   ├── CornerComparison.tsx
│   │   ├── Corners.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Delta.tsx
│   │   ├── Drivers.tsx
│   │   ├── Engineer.tsx
│   │   ├── EngineerComparison.tsx
│   │   ├── Laps.tsx
│   │   ├── SectorComparison.tsx
│   │   ├── Sectors.tsx
│   │   ├── Telemetry.tsx
│   │   ├── Tyres.tsx
│   │   └── Weather.tsx
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── api.ts
├── dist/
│   └── build output
└── node_modules/
    └── installed dependencies
```

`dist/` and `node_modules/` are generated directories and are usually not edited directly.

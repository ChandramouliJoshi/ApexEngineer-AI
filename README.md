# F1 Telemetry & Race Analytics

A full-stack Formula 1 telemetry analysis platform for exploring session data, lap performance, tyre usage, sector performance, and driver-to-driver comparisons.

The project is built around a FastAPI backend that processes F1 session data and exposes it through a REST API, with a React/TypeScript frontend responsible for querying, transforming, and visualising the data.

The main objective is to make detailed F1 session data easier to analyse from an engineering perspective rather than simply presenting basic race statistics.

---

## Overview

Formula 1 session data contains a large amount of information about how a car and driver perform around a circuit. Raw telemetry on its own, however, is difficult to interpret without filtering, aggregation, and comparison.

This project provides a structured interface for analysing that data.

A typical workflow is:

```text
Season
   ↓
Grand Prix
   ↓
Session
   ↓
Driver
   ↓
┌──────────────────────────────────────┐
│                                      │
│  Lap Analysis                        │
│  Telemetry                           │
│  Tyre Analysis                       │
│  Sector Analysis                     │
│  Driver Comparison                   │
│                                      │
└──────────────────────────────────────┘
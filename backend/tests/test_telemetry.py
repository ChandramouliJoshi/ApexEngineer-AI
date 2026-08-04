from app.services.telemetry_service import TelemetryService

telemetry = TelemetryService()

lap = telemetry.get_fastest_lap(
    2025,
    "Monaco",
    "VER"
)

print(lap)
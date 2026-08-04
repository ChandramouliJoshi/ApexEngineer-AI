from app.services.telemetry_service import TelemetryService

telemetry_service = TelemetryService()

telemetry = telemetry_service.get_telemetry(
    year=2025,
    grand_prix="Monaco",
    driver="VER",
    session_type="R"
)

print(telemetry.head())
print("\nColumns:\n")
print(telemetry.columns)
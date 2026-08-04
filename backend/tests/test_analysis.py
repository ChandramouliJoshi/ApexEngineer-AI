from pprint import pprint

from app.services.telemetry_service import TelemetryService
from app.analytics.telemetry_analysis import TelemetryAnalysis


def main():
    telemetry_service = TelemetryService()

    telemetry = telemetry_service.get_telemetry(
        year=2025,
        grand_prix="Monaco",
        driver="VER"
    )

    analysis = TelemetryAnalysis(telemetry)

    pprint(analysis.get_summary())


if __name__ == "__main__":
    main()
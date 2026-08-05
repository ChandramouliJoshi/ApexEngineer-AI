from app.analytics.corner_comparison import CornerComparison
from app.services.session_service import SessionService
from app.services.telemetry_service import TelemetryService


def main():

    telemetry_service = TelemetryService()
    session_service = SessionService()

    telemetry_1 = telemetry_service.get_telemetry(
        2025,
        "Monaco",
        "VER"
    )

    telemetry_2 = telemetry_service.get_telemetry(
        2025,
        "Monaco",
        "NOR"
    )

    session = session_service.get_session(
        2025,
        "Monaco"
    )

    comparison = CornerComparison()

    results = comparison.compare_drivers(
        telemetry_1,
        telemetry_2,
        session.get_circuit_info(),
        "VER",
        "NOR"
    )

    print("=" * 70)
    print("Driver Corner Comparison")
    print("=" * 70)

    for corner in results[:5]:

        print(f"\nCorner {corner['corner']}")

        print(
            f"Entry Delta : {corner['entry_speed_delta']:.1f} km/h"
        )

        print(
            f"Apex Delta  : {corner['apex_speed_delta']:.1f} km/h"
        )

        print(
            f"Exit Delta  : {corner['exit_speed_delta']:.1f} km/h"
        )


if __name__ == "__main__":
    main()
from app.analytics.corner_analysis import CornerAnalysis
from app.services.session_service import SessionService
from app.services.telemetry_service import TelemetryService


def main():

    telemetry_service = TelemetryService()
    session_service = SessionService()

    telemetry = telemetry_service.get_telemetry(
        2025,
        "Monaco",
        "VER"
    )

    session = session_service.get_session(
        2025,
        "Monaco"
    )

    analysis = CornerAnalysis(
        telemetry,
        session.get_circuit_info()
    )

    results = analysis.analyze_all_corners()

    print("=" * 60)
    print("Corner Analysis")
    print("=" * 60)

    for corner in results:

        print(f"\nCorner {corner['corner']}")
        print("-" * 40)

        print(f"Entry Speed     : {corner['entry_speed']:.1f} km/h")
        print(f"Apex Speed      : {corner['apex_speed']:.1f} km/h")
        print(f"Exit Speed      : {corner['exit_speed']:.1f} km/h")
        print(f"Max Brake       : {corner['max_brake']}")
        print(f"Max Throttle    : {corner['max_throttle']:.1f}%")
        print(f"Average RPM     : {corner['average_rpm']:.1f}")
        print(f"Samples         : {corner['samples']}")

    print("=" * 60)


if __name__ == "__main__":
    main()
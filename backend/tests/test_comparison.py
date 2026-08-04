from app.services.comparison_service import ComparisonService
from app.analytics.comparison_analysis import ComparisonAnalysis


def main():

    comparison_service = ComparisonService()

    telemetry_1, telemetry_2 = comparison_service.compare_drivers(
        year=2025,
        grand_prix="Monaco",
        driver_1="VER",
        driver_2="NOR"
    )

    analysis = ComparisonAnalysis(
        telemetry_1,
        telemetry_2
    )

    print("=" * 60)
    print("Driver Comparison")
    print("=" * 60)

    print(f"Max Speed Difference : {analysis.max_speed_difference():.2f} km/h")
    print(f"Average Speed Difference : {analysis.average_speed_difference():.2f} km/h")
    print(f"Throttle Difference : {analysis.throttle_difference():.2f}%")
    print(f"Brake Difference : {analysis.brake_difference():.2f}%")
    print("=" * 60)


if __name__ == "__main__":
    main()
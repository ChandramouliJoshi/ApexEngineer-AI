from app.services.lap_service import LapService


def main():

    lap_service = LapService()

    fastest = lap_service.get_fastest_lap(
        2025,
        "Monaco",
        "VER"
    )

    print("=" * 60)
    print("Fastest Lap")
    print("=" * 60)

    print(f"Driver      : {fastest.Driver}")
    print(f"Lap Number  : {fastest.LapNumber}")
    print(f"Lap Time    : {fastest.LapTime}")
    print(f"Compound    : {fastest.Compound}")
    print(f"Tyre Life   : {fastest.TyreLife}")
    print(f"Position    : {fastest.Position}")

    print("=" * 60)


if __name__ == "__main__":
    main()
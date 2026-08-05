from app.services.session_service import SessionService


def main():

    service = SessionService()

    session = service.get_session(
        2025,
        "Monaco",
        "R"
    )

    circuit = session.get_circuit_info()

    print("=" * 70)
    print("Circuit Information")
    print("=" * 70)

    print(circuit.corners)


if __name__ == "__main__":
    main()
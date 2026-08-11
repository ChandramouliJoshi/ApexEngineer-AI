from app.services.session_service import SessionService


def test_circuit_corners():

    service = SessionService()

    session = service.get_session(
        2025,
        "Monaco",
        "R"
    )

    circuit = session.get_circuit_info()

    assert circuit is not None
    assert circuit.corners is not None
    assert not circuit.corners.empty

    # Monaco should have multiple corners
    assert len(circuit.corners) > 0

    # Verify the expected corner information exists
    assert "Distance" in circuit.corners.columns
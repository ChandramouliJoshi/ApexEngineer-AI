from app.services.session_service import SessionService


def test_get_session_info():

    service = SessionService()

    info = service.get_session_info(
        2025,
        "Monaco",
        "R"
    )

    assert info is not None
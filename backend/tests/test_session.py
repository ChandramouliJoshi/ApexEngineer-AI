from app.services.session_service import SessionService

service = SessionService()

info = service.get_session_info(
    2025,
    "Monaco",
    "R"
)

print(info)
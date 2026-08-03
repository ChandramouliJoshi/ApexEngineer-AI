from fastapi import FastAPI

from app.services.fastf1_service import FastF1Service

app = FastAPI(
    title="ApexEngineer AI"
)

service = FastF1Service()


@app.get("/")
def root():
    return {
        "message": "ApexEngineer AI Backend"
    }


@app.get("/session")
def load_session():

    session = service.get_session(
        2025,
        "Monaco",
        "R"
    )

    return {
        "event": session.event.EventName,
        "year": session.event.EventDate.year,
        "drivers": len(session.drivers),
        "laps": len(session.laps)
    }
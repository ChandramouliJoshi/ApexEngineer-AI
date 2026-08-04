from fastapi import FastAPI

from app.services.fastf1_service import FastF1Service

app = FastAPI(
    title="ApexEngineer AI",
    version="1.0.0"
)

fastf1_service = FastF1Service()


@app.get("/")
def root():
    return {
        "project": "ApexEngineer AI",
        "status": "Running"
    }


@app.get("/session")
def get_session():

    session = fastf1_service.load_session(
        year=2025,
        grand_prix="Monaco",
        session_type="R"
    )

    return {
        "event": session.event.EventName,
        "country": session.event.Country,
        "drivers": len(session.drivers),
        "laps": len(session.laps)
    }
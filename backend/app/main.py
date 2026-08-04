from fastapi import FastAPI

from app.api.sessions import router as session_router
from app.api.telemetry import router as telemetry_router
from app.api.analysis import router as analysis_router

app = FastAPI(
    title="ApexEngineer AI",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "project": "ApexEngineer AI",
        "status": "Running"
    }


app.include_router(session_router)
app.include_router(telemetry_router)
app.include_router(analysis_router)
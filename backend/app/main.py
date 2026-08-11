from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.sessions import router as session_router
from app.api.telemetry import router as telemetry_router
from app.api.analysis import router as analysis_router
from app.api.drivers import router as drivers_router


app = FastAPI(
    title="ApexEngineer AI",
    version="1.0.0"
)


# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(drivers_router)
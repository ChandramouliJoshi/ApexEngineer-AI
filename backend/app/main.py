from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.sessions import router as session_router
from app.api.telemetry import router as telemetry_router
from app.api.analysis import router as analysis_router
from app.api.drivers import router as drivers_router
from app.api.laps import router as laps_router


app = FastAPI(
    title="ApexEngineer AI",
    version="1.0.0"
)


# ==========================================================
# CORS
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://apex-engineer-ai.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# GLOBAL ERROR HANDLER
# ==========================================================

@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception
):
    """
    Converts unexpected backend exceptions into
    a consistent JSON response.

    The full traceback will still appear in the
    Uvicorn console for debugging.
    """

    print(
        f"\n[ERROR] {request.method} {request.url}"
    )
    print(
        f"[ERROR] {type(exc).__name__}: {str(exc)}"
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": str(exc)
            }
        }
    )


# ==========================================================
# ROOT
# ==========================================================

@app.get("/")
def root():
    return {
        "project": "ApexEngineer AI",
        "status": "Running"
    }


# ==========================================================
# HEALTH CHECK
# ==========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "ApexEngineer AI"
    }


# ==========================================================
# API ROUTERS
# ==========================================================

app.include_router(session_router)
app.include_router(telemetry_router)
app.include_router(analysis_router)
app.include_router(drivers_router)
app.include_router(laps_router)
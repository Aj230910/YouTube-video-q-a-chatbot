import os
import time
import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Import routers
from app.routers import video, qa
from app.models.schemas import HealthResponse

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("backend.log", encoding="utf-8")
    ]
)
logger = logging.getLogger("app.main")

# Initialize FastAPI App
app = FastAPI(
    title="YouTube Video Q&A Assistant Backend",
    description="A FastAPI RAG pipeline using FAISS and Google Gemini to answer questions on YouTube transcripts",
    version="1.0.0"
)

# Configure CORS Middleware
# Allows the React frontend to communicate with the FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to specific origins
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware to measure request execution time
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response

# Include routers
app.include_router(video.router)
app.include_router(qa.router)

@app.get("/health", response_model=HealthResponse, tags=["health"])
async def health_check():
    """
    Health check endpoint returning system status and service checks.
    """
    gemini_key_configured = bool(os.getenv("GEMINI_API_KEY"))
    
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        services={
            "database": "ready" if os.path.exists(os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")) else "initialized",
            "gemini_api": "configured" if gemini_key_configured else "missing_api_key",
            "faiss": "available"
        }
    )

@app.get("/", tags=["root"])
async def root():
    """
    Root endpoint returning welcome message and API metadata.
    """
    return {
        "message": "Welcome to the YouTube Video Q&A Assistant API!",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "status": "online"
    }

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception occurred: {str(exc)}")
    response = JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"Internal Server Error: {str(exc)}"}
    )
    # Ensure CORS headers are present even on internal server errors
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

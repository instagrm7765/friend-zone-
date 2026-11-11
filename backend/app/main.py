
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import User
from app.routers.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Social Platform",
    description="Our own social media and messaging platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "app": "Social Platform",
        "status": "running",
        "message": "Welcome to our social network!"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


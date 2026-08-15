from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
import os

app = FastAPI(
    title="AI Interview Coach API",
    version="1.0.0"
)

# -----------------------------
# Environment variables
# -----------------------------

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-20b"
)

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000"
)

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY environment variable is missing"
    )


# -----------------------------
# LLM
# -----------------------------

llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model=GROQ_MODEL,
    temperature=0.2,
    max_tokens=1024
)


# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Schemas
# -----------------------------

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str


# -----------------------------
# Health
# -----------------------------

@app.get("/")
def root():
    return {
        "service": "AI Interview Coach",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# -----------------------------
# AI chat
# -----------------------------

@app.post(
    "/chat",
    response_model=ChatResponse
)
def chat(request: ChatRequest):

    response = llm.invoke(
        request.message
    )

    return ChatResponse(
        answer=response.content
    )
from database import Base, engine
import models


Base.metadata.create_all(
    bind=engine
)

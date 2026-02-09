from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import todos, chatbot
from models import init_db
import os
from dotenv import load_dotenv

load_dotenv()
WEB_URL = os.getenv("WEB_URL", "http://localhost:3000")

app = FastAPI()

@app.on_event("startup")
def on_startup():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[WEB_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(todos.router)
app.include_router(chatbot.router)

@app.get("/")
async def health():
    return {"status": "healthy", "web_url": WEB_URL}

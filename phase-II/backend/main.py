from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, create_engine, Session, select
from enum import Enum
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
WEB_URL = os.getenv("WEB_URL", "http://localhost:3000")  # Default to localhost:3000 if not set

engine = create_engine(DATABASE_URL)

class Category(str, Enum):
    backlog = "backlog"
    todo = "todo"
    doing = "doing"
    done = "done"

class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    title: str = Field(index=True)
    category: Category = Field(default=Category.backlog)

class TodoCreate(SQLModel):
    title: str
    category: Category = Category.backlog

SQLModel.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware to allow only the specified frontend URL to make API calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=[WEB_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
def get_api():
    return {"message": "API is running"}


@app.get("/todos")
def get_todos() -> list[Todo]:
    with Session(engine) as session:
        todos = session.exec(select(Todo)).all()
        return todos


@app.post("/todos")
def create_todo(todo: TodoCreate):
    with Session(engine) as session:
        # Find the smallest missing ID
        existing_ids = session.exec(select(Todo.id)).all()
        existing_ids_set = set(existing_ids)
        next_id = 1
        while next_id in existing_ids_set:
            next_id += 1

        # Create todo with the found ID
        db_todo = Todo(id=next_id, title=todo.title, category=todo.category)
        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)
        return db_todo


@app.put("/todos/{id}")
def update_todo(id: int, update_todo: Todo) -> Todo | dict:
    with Session(engine) as session:
        db_todo = session.exec(select(Todo).where(Todo.id == id)).first()
        if db_todo:
            db_todo.title = update_todo.title
            db_todo.category = update_todo.category
            session.commit()
            session.refresh(db_todo)
            return db_todo
        return {"error": "Todo not found"}


@app.delete("/todos/{id}")
def delete_todo(id: int) -> dict:
    with Session(engine) as session:
        db_todo = session.exec(select(Todo).where(Todo.id == id)).first()
        if db_todo:
            session.delete(db_todo)
            session.commit()
            return {"message": "Todo deleted"}
        return {"error": "Todo not found"}

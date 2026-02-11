from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from models import Todo, TodoCreate, engine
from auth import get_current_user
from websocket_manager import manager
import json

router = APIRouter(
    prefix="/todos",
    tags=["Todos"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/", response_model=List[Todo])
def get_todos(user_email: str = Depends(get_current_user)):
    with Session(engine) as session:
        return session.exec(
            select(Todo).where(Todo.user_id == user_email)
        ).all()

@router.post("/", response_model=Todo)
async def create_todo(todo: TodoCreate, user_email: str = Depends(get_current_user)):
    with Session(engine) as session:
        db_todo = Todo(
            title=todo.title,
            category=todo.category,
            user_id=user_email,
        )
        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)

        # Broadcast the new todo to connected clients
        message = json.dumps({
            "action": "create",
            "todo": {
                "id": db_todo.id,
                "title": db_todo.title,
                "category": db_todo.category,
                "user_id": db_todo.user_id
            }
        })
        await manager.broadcast(message, user_email)

        return db_todo

@router.put("/{id}", response_model=Todo)
async def update_todo(id: int, update_todo: Todo, user_email: str = Depends(get_current_user)):
    with Session(engine) as session:
        db_todo = session.exec(
            select(Todo).where(Todo.id == id, Todo.user_id == user_email)
        ).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found or unauthorized")
        db_todo.title = update_todo.title
        db_todo.category = update_todo.category
        session.commit()
        session.refresh(db_todo)

        # Broadcast the updated todo to connected clients
        message = json.dumps({
            "action": "update",
            "todo": {
                "id": db_todo.id,
                "title": db_todo.title,
                "category": db_todo.category,
                "user_id": db_todo.user_id
            }
        })
        await manager.broadcast(message, user_email)

        return db_todo

@router.delete("/{id}")
def delete_todo(id: int, user_email: str = Depends(get_current_user)):
    with Session(engine) as session:
        db_todo = session.exec(
            select(Todo).where(Todo.id == id, Todo.user_id == user_email)
        ).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        session.delete(db_todo)
        session.commit()
        return {"message": "Todo deleted"}

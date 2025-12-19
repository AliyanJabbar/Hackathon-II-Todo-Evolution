from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal

app = FastAPI()

todos = []


class TodoItem(BaseModel):
    id: int
    title: str
    category: Literal["backlog", "todo", "doing", "done"] = "backlog"


# Root endpoint
@app.get("/")
def get_api():
    return {"message": "API is running"}


@app.get("/todos")
def get_todos():
    return todos


@app.post("/todos")
def create_todo(todo: TodoItem):
    todos.append(todo)
    return todo


@app.put("/todos/{id}")
def update_todo(id: int, updateTodoItem: TodoItem):
    todo_to_update = [todo for todo in todos if todo.id == id][0]
    todo_to_update.title = updateTodoItem.title 
    return todo_to_update


@app.delete("/todos/{id}")
def delete_todo(id: int):
    todo_to_delete = [todo for todo in todos if todo.id == id][0]
    todos.remove(todo_to_delete)
    return todos

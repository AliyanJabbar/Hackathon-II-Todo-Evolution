// frontend/src/services/api.ts
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

interface Todo {
  id: number;
  title: string;
  category: 'backlog' | 'todo' | 'doing' | 'done';
}

interface TodoCreate {
  title: string;
  category: 'backlog' | 'todo' | 'doing' | 'done';
}

class TodoAPI {
  // Get all todos
  static async getTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/todos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }

  // Create a new todo
  static async createTodo(todo: TodoCreate): Promise<Todo> {
    try {
      const response = await fetch(`${BACKEND_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  // Update a todo
  static async updateTodo(id: number, todo: Todo): Promise<Todo> {
    try {
      const response = await fetch(`${BACKEND_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  // Delete a todo
  static async deleteTodo(id: number): Promise<{ message: string } | { error: string }> {
    try {
      const response = await fetch(`${BACKEND_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  // Check if backend is running
  static async checkBackend(): Promise<boolean> {
    try {
      const response = await fetch(`${BACKEND_URL}/`);
      return response.ok;
    } catch (error) {
      console.error('Error checking backend:', error);
      return false;
    }
  }
}

export default TodoAPI;
export type { Todo, TodoCreate };
'use client';

import { useState, useEffect, useCallback } from 'react';
import AddTodoForm from './AddTodoForm';
import TodoItem, { TodoData } from './TodoItem';

export default function TodoList() {
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to fetch todos');
      }
      const data: TodoData[] = await res.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (title: string) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || 'Failed to add todo');
    }
    const newTodo: TodoData = await res.json();
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggle = async (id: number, completed: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || 'Failed to update todo');
    }
    const updated: TodoData = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || 'Failed to delete todo');
    }
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const remaining = total - completed;

  return (
    <div>
      <AddTodoForm onAdd={handleAdd} />

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="spinner">
          <div className="spinner-circle" />
        </div>
      ) : (
        <div className="card">
          {total > 0 && (
            <div className="stats">
              <span><strong>{total}</strong> total</span>
              <span><strong>{remaining}</strong> remaining</span>
              <span><strong>{completed}</strong> completed</span>
            </div>
          )}
          {todos.length === 0 ? (
            <div className="todo-empty">
              <span className="emoji">🎉</span>
              No todos yet. Add one above!
            </div>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

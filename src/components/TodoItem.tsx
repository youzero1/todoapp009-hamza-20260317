'use client';

import { useState } from 'react';

export interface TodoData {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: TodoData;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(todo.id, !todo.completed);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={toggling || deleting}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <span className="todo-title">{todo.title}</span>
      <span className="todo-meta">{formatDate(todo.createdAt)}</span>
      <button
        className="btn btn-danger"
        onClick={handleDelete}
        disabled={deleting || toggling}
        aria-label={`Delete "${todo.title}"`}
        title="Delete todo"
      >
        {deleting ? '…' : '🗑'}
      </button>
    </li>
  );
}

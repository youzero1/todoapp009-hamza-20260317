'use client';

import { useState, FormEvent } from 'react';

interface AddTodoFormProps {
  onAdd: (title: string) => Promise<void>;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a todo title.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onAdd(trimmed);
      setTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      {error && <div className="error-msg">{error}</div>}
      <form className="add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          maxLength={255}
          aria-label="New todo title"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !title.trim()}
        >
          {loading ? 'Adding…' : '+ Add Todo'}
        </button>
      </form>
    </div>
  );
}

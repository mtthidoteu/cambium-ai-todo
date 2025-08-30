import { Check, Trash2 } from 'lucide-react';
import type React from 'react';
import { formatTaskDate } from '@/utils/dateUtils';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: Date;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  className?: string;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  className = '',
}) => {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : 'active'} animate-slide-in ${className}`}>
      <button
        onClick={() => onToggle(todo.id)}
        className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
      >
        {todo.completed && (
          <Check size={14} className="text-primary-foreground animate-check" />
        )}
      </button>
      <div className="flex-1 flex flex-col">
        <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
          {todo.title}
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          {todo.completed ? 'completed' : 'added'} {formatTaskDate(todo.created_at)}
        </span>
      </div>
      <button onClick={() => onDelete(todo.id)} className="todo-delete">
        <Trash2 size={16} />
      </button>
    </div>
  );
};
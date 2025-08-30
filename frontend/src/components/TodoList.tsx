import type React from 'react';
import { TodoItem } from './TodoItem';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: Date;
}

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  className?: string;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  className = '',
}) => {
  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Active Todos */}
      {activeTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
        />
      ))}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <>
          <div className="pt-4 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Completed ({completedTodos.length})
            </h3>
          </div>
          {completedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggleTodo}
              onDelete={onDeleteTodo}
            />
          ))}
        </>
      )}
    </div>
  );
};
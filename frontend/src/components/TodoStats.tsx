import type React from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: Date;
}

interface TodoStatsProps {
  todos: Todo[];
  className?: string;
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos, className = '' }) => {
  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className={className}>
      <div className="flex justify-between items-center p-4 bg-muted/30 rounded-[calc(var(--radius)-0.25rem)]">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{activeTodosCount}</span> active
          {activeTodosCount !== 1 ? ' tasks' : ' task'}
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{completedTodos.length}</span> completed
        </div>
      </div>

      {/* Progress Bar */}
      {todos.length > 0 && (
        <div className="mt-3 px-4">
          <div className="w-full bg-muted/50 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${todos.length > 0 ? (completedTodos.length / todos.length) * 100 : 0}%`,
                background: 'var(--gradient-primary)',
              }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1 text-center">
            {todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0}%
            complete
          </div>
        </div>
      )}
    </div>
  );
};
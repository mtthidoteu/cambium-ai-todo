import type React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="todo-container min-h-screen py-8">
      <div className="todo-card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Loading tasks...</h3>
        </div>
      </div>
    </div>
  );
};
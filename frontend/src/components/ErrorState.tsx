import type React from 'react';

export const ErrorState: React.FC = () => {
  return (
    <div className="todo-container min-h-screen py-8">
      <div className="todo-card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Error loading tasks</h3>
          <p className="text-muted-foreground">
            Please make sure the backend server is running on http://localhost:8000
          </p>
        </div>
      </div>
    </div>
  );
};
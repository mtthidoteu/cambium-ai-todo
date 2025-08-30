import type React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No tasks yet</h3>
      <p className="text-muted-foreground">Add your first task above to get started!</p>
    </div>
  );
};
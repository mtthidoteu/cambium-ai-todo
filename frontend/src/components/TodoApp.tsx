import type React from 'react';
import { useTasks, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import type { Task } from '@/lib/api';
import { parseTaskDate } from '@/utils/dateUtils';
import { TodoInput } from './TodoInput';
import { TodoStats } from './TodoStats';
import { TodoList } from './TodoList';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

interface Todo extends Omit<Task, 'created_at'> {
  created_at: Date;
}

const TodoApp = () => {
  const { data: tasks = [], isLoading, error } = useTasks();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // Convert API tasks to local format with proper timezone handling
  const todos: Todo[] = tasks.map((task) => ({
    ...task,
    created_at: parseTaskDate(task.created_at),
  }));

  const toggleTodo = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      updateTaskMutation.mutate({
        id,
        data: { completed: !todo.completed },
      });
    }
  };

  const deleteTodo = (id: number) => {
    deleteTaskMutation.mutate(id);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="todo-container min-h-screen py-8">
      <div className="todo-card">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[hsl(262_83%_58%)] to-[hsl(252_83%_58%)] bg-clip-text text-transparent mb-2">
            My Tasks
          </h1>
          <p className="text-muted-foreground text-lg">Stay organized and get things done</p>
        </div>

        {/* Add Todo Input */}
        <TodoInput className="mb-8" />

        {/* Stats & Progress */}
        <TodoStats todos={todos} className="mb-6" />

        {/* Todo List */}
        {todos.length === 0 ? (
          <EmptyState />
        ) : (
          <TodoList
            todos={todos}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
          />
        )}
      </div>
    </div>
  );
};

export default TodoApp;

import { Plus } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCreateTask } from '@/hooks/useTasks';

interface TodoInputProps {
  className?: string;
}

export const TodoInput: React.FC<TodoInputProps> = ({ className = '' }) => {
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();
  const createTaskMutation = useCreateTask();

  const addTodo = () => {
    if (inputValue.trim() === '') {
      toast({
        title: 'Task is empty',
        description: 'Please enter a task before adding it.',
        variant: 'destructive',
      });
      return;
    }

    createTaskMutation.mutate({
      title: inputValue.trim(),
    });
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Add a new task..."
        className="todo-input"
      />
      <button
        onClick={addTodo}
        className="todo-button-primary flex items-center gap-2 shrink-0"
      >
        <Plus size={18} />
        Add Task
      </button>
    </div>
  );
};
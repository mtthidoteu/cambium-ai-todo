import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiClient, type CreateTaskRequest, Task, type UpdateTaskRequest } from '@/lib/api';

const QUERY_KEY = ['tasks'];

export const useTasks = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => apiClient.getTasks(),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => apiClient.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast({
        title: 'Error adding task',
        description: 'Failed to add your task. Please try again.',
        variant: 'destructive',
      });
      console.error('Error creating task:', error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskRequest }) =>
      apiClient.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast({
        title: 'Error updating task',
        description: 'Failed to update your task. Please try again.',
        variant: 'destructive',
      });
      console.error('Error updating task:', error);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting task',
        description: 'Failed to delete your task. Please try again.',
        variant: 'destructive',
      });
      console.error('Error deleting task:', error);
    },
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../services/tasksApi";

/**
 * Hook to fetch all tasks
 */
export const useGetTasks = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  return {
    tasks: data?.data || data || [],
    isLoading,
    error,
  };
};

/**
 * Hook to fetch a single task by ID
 */
export const useGetTaskById = (taskId) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById(taskId),
    enabled: !!taskId,
  });

  return {
    task: data?.data || data,
    isLoading,
    error,
  };
};

/**
 * Hook to create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createTaskFn, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create task"
      );
    },
  });

  return {
    createTaskFn,
    isPending,
  };
};

/**
 * Hook to update a task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateTaskFn, isPending } = useMutation({
    mutationFn: ({ taskId, body }) => updateTask(taskId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update task"
      );
    },
  });

  return {
    updateTaskFn,
    isPending,
  };
};

/**
 * Hook to delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteTaskFn, isPending } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete task"
      );
    },
  });

  return {
    deleteTaskFn,
    isPending,
  };
};


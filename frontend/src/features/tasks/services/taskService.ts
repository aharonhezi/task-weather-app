import api from '../../../shared/services/api';

export interface Task {
  id: string;
  userId: string;
  title: string;
  isCompleted: boolean;
  dueDate?: string | null;
  tag?: string | null;
  note?: string | null;
  weatherCity?: string | null;
  weatherData?: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  dueDate?: string | null;
  tag?: string | null;
  note?: string | null;
}

export interface UpdateTaskData {
  title?: string;
  dueDate?: string | null;
  tag?: string | null;
  note?: string | null;
}

export interface GetTasksParams {
  search?: string;
  isCompleted?: boolean;
  tag?: string;
}

export const getTasks = async (params?: GetTasksParams): Promise<Task[]> => {
  const response = await api.get<{ success: boolean; data: Task[] }>('/tasks', { params });
  return response.data.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const response = await api.get<{ success: boolean; data: Task }>(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const response = await api.post<{ success: boolean; data: Task }>('/tasks', data);
  return response.data.data;
};

export const updateTask = async (id: string, data: UpdateTaskData): Promise<Task> => {
  const response = await api.put<{ success: boolean; data: Task }>(`/tasks/${id}`, data);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const toggleTask = async (id: string): Promise<Task> => {
  const response = await api.patch<{ success: boolean; data: Task }>(`/tasks/${id}/toggle`);
  return response.data.data;
};


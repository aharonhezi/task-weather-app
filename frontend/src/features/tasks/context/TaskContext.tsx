import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, getTasks, createTask, updateTask, deleteTask, toggleTask, GetTasksParams } from '../services/taskService';
import { getErrorMessage } from '../../../shared/utils/errorMessages';

interface TaskContextType {
  tasks: Task[];
  tasksToDo: Task[];
  tasksDone: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (params?: GetTasksParams) => Promise<void>;
  addTask: (data: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTaskById: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTaskById: (id: string) => Promise<void>;
  toggleTaskById: (id: string) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async (params?: GetTasksParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTasks = await getTasks(params);
      setTasks(fetchedTasks);
    } catch (err: any) {
      const message = err.userMessage || getErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (data: any) => {
    try {
      const newTask = await createTask(data);
      setTasks((prev) => [...prev, newTask]);
      setError(null); // Clear error on success
    } catch (err: any) {
      const message = err.userMessage || getErrorMessage(err);
      setError(message);
      throw err;
    }
  };

  const updateTaskById = async (id: string, data: Partial<Task>) => {
    try {
      const updatedTask = await updateTask(id, data);
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
      setError(null); // Clear error on success
    } catch (err: any) {
      const message = err.userMessage || getErrorMessage(err);
      setError(message);
      throw err;
    }
  };

  const deleteTaskById = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setError(null); // Clear error on success
    } catch (err: any) {
      const message = err.userMessage || getErrorMessage(err);
      setError(message);
      throw err;
    }
  };

  const toggleTaskById = async (id: string) => {
    try {
      const updatedTask = await toggleTask(id);
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
      setError(null); // Clear error on success
    } catch (err: any) {
      const message = err.userMessage || getErrorMessage(err);
      setError(message);
      throw err;
    }
  };

  const tasksToDo = tasks.filter((task) => !task.isCompleted);
  const tasksDone = tasks.filter((task) => task.isCompleted);

  const filteredTasksToDo = searchQuery
    ? tasksToDo.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasksToDo;

  const filteredTasksDone = searchQuery
    ? tasksDone.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasksDone;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        tasksToDo: filteredTasksToDo,
        tasksDone: filteredTasksDone,
        isLoading,
        error,
        fetchTasks,
        addTask,
        updateTaskById,
        deleteTaskById,
        toggleTaskById,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

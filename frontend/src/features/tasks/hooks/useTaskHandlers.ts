import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useSnackbar } from '../../../shared/context/SnackbarContext';
import { Task } from '../services/taskService';
import { getErrorMessage } from '../../../shared/utils/errorMessages';

interface UseTaskHandlersReturn {
  showTaskForm: boolean;
  editingTask: Task | null;
  openAddTaskForm: () => void;
  openEditTaskForm: (task: Task) => void;
  closeTaskForm: () => void;
  handleAddTask: (data: any) => Promise<void>;
  handleEditTask: (data: any) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleToggle: (id: string) => Promise<void>;
}

export const useTaskHandlers = (): UseTaskHandlersReturn => {
  const {
    addTask,
    updateTaskById,
    deleteTaskById,
    toggleTaskById,
  } = useTasks();
  const { showSnackbar } = useSnackbar();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openAddTaskForm = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const openEditTaskForm = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const closeTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleAddTask = async (data: any) => {
    try {
      await addTask(data);
      setShowTaskForm(false);
      showSnackbar('Task created successfully!', 'success');
    } catch (error: any) {
      const message = error.userMessage || getErrorMessage(error);
      showSnackbar(message, 'error');
    }
  };

  const handleEditTask = async (data: any) => {
    if (editingTask) {
      try {
        await updateTaskById(editingTask.id, data);
        setEditingTask(null);
        setShowTaskForm(false);
        showSnackbar('Task updated successfully!', 'success');
      } catch (error: any) {
        const message = error.userMessage || getErrorMessage(error);
        showSnackbar(message, 'error');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskById(id);
        showSnackbar('Task deleted successfully!', 'success');
      } catch (error: any) {
        const message = error.userMessage || getErrorMessage(error);
        showSnackbar(message, 'error');
      }
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTaskById(id);
      showSnackbar('Task status updated!', 'success');
    } catch (error: any) {
      const message = error.userMessage || getErrorMessage(error);
      showSnackbar(message, 'error');
    }
  };

  return {
    showTaskForm,
    editingTask,
    openAddTaskForm,
    openEditTaskForm,
    closeTaskForm,
    handleAddTask,
    handleEditTask,
    handleDelete,
    handleToggle,
  };
};


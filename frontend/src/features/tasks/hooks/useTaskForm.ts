import { useState, useEffect } from 'react';
import { Task } from '../services/taskService';
import { getErrorMessage, getFieldErrors } from '../../../shared/utils/errorMessages';

interface UseTaskFormProps {
  task?: Task | null;
  onSave: (data: any) => Promise<void>;
}

interface UseTaskFormReturn {
  title: string;
  dueDate: string;
  tag: string;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]>;
  setTitle: (value: string) => void;
  setDueDate: (value: string) => void;
  setTag: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useTaskForm = ({ task, onSave }: UseTaskFormProps): UseTaskFormReturn => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tag, setTag] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setTag(task.tag || '');
    } else {
      setTitle('');
      setDueDate('');
      setTag('');
    }
    setError(null);
    setFieldErrors({});
  }, [task]);

  useEffect(() => {
    if (fieldErrors.title && title) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.title;
        return newErrors;
      });
    }
  }, [title, fieldErrors.title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      await onSave({
        title,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        tag: tag || null,
      });
    } catch (err: any) {
      const fieldErrs = getFieldErrors(err);
      if (Object.keys(fieldErrs).length > 0) {
        setFieldErrors(fieldErrs);
      }
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    title,
    dueDate,
    tag,
    isLoading,
    error,
    fieldErrors,
    setTitle,
    setDueDate,
    setTag,
    handleSubmit,
  };
};


import React, { useState, useEffect } from 'react';
import { Task } from '../services/taskService';
import { Button } from '../../../shared/components/common/Button';
import { Input } from '../../../shared/components/common/Input';
import { getErrorMessage, getFieldErrors } from '../../../shared/utils/errorMessages';
import styles from './TaskForm.module.css';

interface TaskFormProps {
  task?: Task | null;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const TAGS = ['Low', 'Medium', 'High', 'Not urgent', 'Urgent'] as const;

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tag, setTag] = useState<string>('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setTag(task.tag || '');
      setNote(task.note || '');
    } else {
      // Reset form when creating new task
      setTitle('');
      setDueDate('');
      setTag('');
      setNote('');
    }
    // Clear errors when task changes
    setError(null);
    setFieldErrors({});
  }, [task]);

  // Clear field errors when user types
  useEffect(() => {
    if (fieldErrors.title && title) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.title;
        return newErrors;
      });
    }
  }, [title, fieldErrors.title]);

  useEffect(() => {
    if (fieldErrors.note && note) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.note;
        return newErrors;
      });
    }
  }, [note, fieldErrors.note]);

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
        note: note || null,
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

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{task ? 'Edit Task' : 'Add Task'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && !Object.keys(fieldErrors).length && (
            <div className={styles.errorMessage}>{error}</div>
          )}
          
          <div>
            <Input
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter task title"
            />
            {fieldErrors.title && (
              <div className={styles.fieldError}>{fieldErrors.title[0]}</div>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label}>Due Date</label>
            <input
              type="date"
              className={styles.dateInput}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0]}
            />
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label}>Tag</label>
            <select
              className={styles.select}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">None</option>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label}>Note</label>
            <textarea
              className={styles.textarea}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter note (optional)"
              rows={2}
            />
            {fieldErrors.note && (
              <div className={styles.fieldError}>{fieldErrors.note[0]}</div>
            )}
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {task ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


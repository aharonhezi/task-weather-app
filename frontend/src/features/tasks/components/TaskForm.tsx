import React, { useState, useEffect } from 'react';
import { Task } from '../services/taskService';
import { Button } from '../../../shared/components/common/Button';
import { Input } from '../../../shared/components/common/Input';
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

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setTag(task.tag || '');
      setNote(task.note || '');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave({
        title,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        tag: tag || null,
        note: note || null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{task ? 'Edit Task' : 'Add Task'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter task title"
          />

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


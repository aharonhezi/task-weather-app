import React from 'react';
import { Task } from '../services/taskService';
import { Checkbox } from '../../../shared/components/common/Checkbox';
import { Tag } from '../../../shared/components/common/Tag';
import { formatDate, getWeatherDisplay } from '../utils/taskUtils';
import { WeatherDisplay } from './WeatherDisplay';
import styles from './TaskCardMobile.module.css';

interface TaskCardMobileProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCardMobile: React.FC<TaskCardMobileProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const weatherNote = getWeatherDisplay(task);

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            checked={task.isCompleted}
            onChange={() => onToggle(task.id)}
          />
        </div>
        <div className={styles.taskInfo}>
          <div className={styles.taskName}>{task.title}</div>
          {task.dueDate && (
            <div className={styles.dueDate}>{formatDate(task.dueDate)}</div>
          )}
          {(weatherNote || task.note) && (
            <div className={styles.note}>
              Note: {weatherNote ? (
                <WeatherDisplay icon={weatherNote.icon} temperature={weatherNote.temperature} />
              ) : (
                task.note
              )}
            </div>
          )}
          {task.tag && (
            <div className={styles.tagWrapper}>
              <Tag variant={task.tag as any}>{task.tag}</Tag>
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={() => onEdit(task)}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className={styles.actionButton}
            onClick={() => onDelete(task.id)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};


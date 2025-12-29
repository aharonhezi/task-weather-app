import React from 'react';
import { Task } from '../services/taskService';
import { Checkbox } from '../../../shared/components/common/Checkbox';
import { Tag } from '../../../shared/components/common/Tag';
import { formatDate, getWeatherDisplay } from '../utils/taskUtils';
import { WeatherDisplay } from './WeatherDisplay';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const weather = getWeatherDisplay(task);
  
  return (
    <tr className={styles.taskRow}>
      <td>
        <Checkbox
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
        />
      </td>
      <td className={styles.taskName}>{task.title}</td>
      <td className={styles.dueDate}>{formatDate(task.dueDate)}</td>
      <td>
        {task.tag && (
          <Tag variant={task.tag as any}>{task.tag}</Tag>
        )}
      </td>
      <td className={styles.note}>
        {weather && (
          <WeatherDisplay icon={weather.icon} temperature={weather.temperature} />
        )}
      </td>
      <td className={styles.actions}>
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
      </td>
    </tr>
  );
};


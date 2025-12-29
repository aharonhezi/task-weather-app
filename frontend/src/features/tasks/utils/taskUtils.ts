import { Task } from '../services/taskService';

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

export const getWeatherDisplay = (task: Task): { temperature: number; icon?: string } | null => {
  if (!task.weatherData || !task.weatherCity) return null;
  const temp = task.weatherData.temperature;
  if (temp !== null && temp !== undefined) {
    return {
      temperature: temp,
      icon: task.weatherData.icon, // Icon URL from WeatherAPI.com
    };
  }
  return null;
};


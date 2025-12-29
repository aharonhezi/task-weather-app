import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  isCompleted: boolean;
  dueDate?: Date | null;
  tag?: string | null;
  note?: string | null;
  weatherCity?: string | null;
  weatherData?: any | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherData {
  temperature?: number;
  condition?: string;
  icon?: string;
  [key: string]: any;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

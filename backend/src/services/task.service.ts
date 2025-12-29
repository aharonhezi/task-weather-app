import { PrismaClient, Task, Prisma } from '@prisma/client';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { detectCity, GeocodingResult } from './geocoding.service';
import { fetchWeatherData } from './weather.service';
import { WeatherData } from '../types';

const prisma = new PrismaClient();

export interface CreateTaskData {
  title: string;
  dueDate?: Date | null;
  tag?: string | null;
}

export interface UpdateTaskData {
  title?: string;
  dueDate?: Date | null;
  tag?: string | null;
}

const processTaskWeather = async (title: string): Promise<{
  weatherCity: string | null;
  weatherData: WeatherData | null;
}> => {
  const geocodingResult = await detectCity(title);
  
  if (!geocodingResult || !geocodingResult.city) {
    return { weatherCity: null, weatherData: null };
  }

  const weatherData = await fetchWeatherData(geocodingResult);

  return {
    weatherCity: geocodingResult.city,
    weatherData: weatherData,
  };
};

export const getTasks = async (userId: string): Promise<Task[]> => {
  return prisma.task.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getTaskById = async (taskId: string, userId: string): Promise<Task> => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new NotFoundError('Task');
  }

  if (task.userId !== userId) {
    throw new ForbiddenError('You do not have access to this task');
  }

  return task;
};

export const createTask = async (
  userId: string,
  data: CreateTaskData
): Promise<Task> => {
  const { weatherCity, weatherData } = await processTaskWeather(data.title);

  return prisma.task.create({
    data: {
      ...data,
      userId,
      weatherCity,
      weatherData: weatherData ? (weatherData as Prisma.InputJsonValue) : Prisma.JsonNull,
    },
  });
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: UpdateTaskData
): Promise<Task> => {
  const existingTask = await getTaskById(taskId, userId);

  let weatherCity = existingTask.weatherCity;
  let weatherData: Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined = existingTask.weatherData as Prisma.InputJsonValue;

  if (data.title) {
    const newTitle = data.title;
    const { weatherCity: detectedCity, weatherData: fetchedWeather } = await processTaskWeather(newTitle);
    
    weatherCity = detectedCity;
    weatherData = fetchedWeather ? (fetchedWeather as Prisma.InputJsonValue) : Prisma.JsonNull;
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...data,
      weatherCity,
      weatherData,
    },
  });
};

export const deleteTask = async (taskId: string, userId: string): Promise<void> => {
  await getTaskById(taskId, userId);

  await prisma.task.delete({
    where: { id: taskId },
  });
};

export const toggleTaskCompletion = async (
  taskId: string,
  userId: string
): Promise<Task> => {
  const task = await getTaskById(taskId, userId);

  return prisma.task.update({
    where: { id: taskId },
    data: {
      isCompleted: !task.isCompleted,
    },
  });
};


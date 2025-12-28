import api from '../../../shared/services/api';

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data);
  return response.data.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', data);
  return response.data.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


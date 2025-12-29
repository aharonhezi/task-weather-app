import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UseLoginFormReturn {
  email: string;
  password: string;
  rememberMe: boolean;
  error: string;
  isLoading: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setRememberMe: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useLoginForm = (): UseLoginFormReturn => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    rememberMe,
    error,
    isLoading,
    setEmail,
    setPassword,
    setRememberMe,
    handleSubmit,
  };
};


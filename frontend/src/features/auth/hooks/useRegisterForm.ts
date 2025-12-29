import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UseRegisterFormReturn {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  error: string;
  isLoading: boolean;
  setEmail: (value: string) => void;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useRegisterForm = (): UseRegisterFormReturn => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    username,
    password,
    confirmPassword,
    error,
    isLoading,
    setEmail,
    setUsername,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  };
};


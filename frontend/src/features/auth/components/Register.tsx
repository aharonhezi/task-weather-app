import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../../../shared/components/common/Button';
import { Input } from '../../../shared/components/common/Input';
import illustration from '../../../assets/task-management-illustration.svg';
import styles from '../styles/Auth.module.css';

const Register: React.FC = () => {
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

  return (
    <div className={styles.container}>
      <div className={styles.branding}>Checked</div>
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <div className={styles.welcome}>
            <h2>Welcome !</h2>
            <p>
              <strong>Sign up to</strong> get things done ✨
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Enter your email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="yours@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Enter your user name"
              type="text"
              name="username"
              autoComplete="username"
              placeholder="task master"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              label="Enter your password"
              type="password"
              showPasswordToggle
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm your password"
              type="password"
              showPasswordToggle
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && <div className={styles.error}>{error}</div>}

            <Button type="submit" variant="primary" disabled={isLoading} className={styles.submitButton}>
              Register
            </Button>

            <div className={styles.linkContainer}>
              Already have an Account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>

        <div className={styles.illustration}>
          <img 
            src={illustration} 
            alt="Task Management Illustration" 
            className={styles.illustrationImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../../../shared/components/common/Button';
import { Input } from '../../../shared/components/common/Input';
import { Checkbox } from '../../../shared/components/common/Checkbox';
import illustration from '../../../assets/task-management-illustration.svg';
import styles from '../styles/Auth.module.css';

const Login: React.FC = () => {
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

  return (
    <div className={styles.container}>
      <div className={styles.branding}>Checked</div>
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <div className={styles.welcome}>
            <h2>Welcome !</h2>
            <p>
              <strong>Sign in to</strong> get things done ✨
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Enter your email"
              type="email"
              placeholder="yours@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

            <div className={styles.options}>
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot Password ?
              </Link>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <Button type="submit" variant="primary" disabled={isLoading} className={styles.submitButton}>
              Login
            </Button>

            <div className={styles.linkContainer}>
              Don't have an Account? <Link to="/register">Register</Link>
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

export default Login;


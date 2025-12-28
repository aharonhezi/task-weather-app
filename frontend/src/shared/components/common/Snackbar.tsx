import React, { useEffect } from 'react';
import styles from './Snackbar.module.css';

export type SnackbarVariant = 'success' | 'error' | 'info';

interface SnackbarProps {
  message: string;
  variant?: SnackbarVariant;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  variant = 'info',
  isOpen,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.snackbar} ${styles[variant]}`}>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
    </div>
  );
};


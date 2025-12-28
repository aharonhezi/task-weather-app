import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, SnackbarVariant } from '../components/common/Snackbar';

interface SnackbarContextType {
  showSnackbar: (message: string, variant?: SnackbarVariant) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<{
    message: string;
    variant: SnackbarVariant;
    isOpen: boolean;
  }>({
    message: '',
    variant: 'info',
    isOpen: false,
  });

  const showSnackbar = (message: string, variant: SnackbarVariant = 'info') => {
    setSnackbar({ message, variant, isOpen: true });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        message={snackbar.message}
        variant={snackbar.variant}
        isOpen={snackbar.isOpen}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};


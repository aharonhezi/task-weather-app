import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { SnackbarProvider } from './shared/context/SnackbarContext';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import Login from './features/auth/components/Login';
import Register from './features/auth/components/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SnackbarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Dashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

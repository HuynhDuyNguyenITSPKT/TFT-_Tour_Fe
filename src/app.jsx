import { Router } from 'preact-router';
import Login from './pages/Login';
import OAuthCallbackPage from './pages/OAuthCallback';
import DashboardPage from './pages/Dashboard';
import ProjectsPage from './pages/Projects';
import AdminPage from './pages/Admin';
import NotFoundPage from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalErrorHandler from './components/GlobalErrorHandler';
import { AuthProvider } from './store/AuthContext';
import { ToastProvider } from './store/ToastContext';
import ToastViewport from './components/ToastViewport';
import './app.css';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <GlobalErrorHandler />
        <Router>
          <Login path="/login" />
          <OAuthCallbackPage path="/auth/callback" />
          <ProtectedRoute path="/" component={DashboardPage} />
          <ProtectedRoute path="/dashboard" component={DashboardPage} />
          <ProtectedRoute path="/projects" component={ProjectsPage} />
          <ProtectedRoute path="/admin" component={AdminPage} roles={['ADMIN']} />
          <NotFoundPage default />
        </Router>
        <ToastViewport />
      </AuthProvider>
    </ToastProvider>
  );
}

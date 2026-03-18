import { route } from 'preact-router';
import { useEffect } from 'preact/hooks';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { userHasRole } from '../utils/auth';
import { FullPageLoader } from './LoadingSkeleton';

export default function ProtectedRoute({ component: Component, roles = [], ...props }) {
  const { isAuthenticated, isBootstrapping, user } = useAuth();
  const { t } = useI18n();

  const isAllowed =
    isAuthenticated &&
    (!roles.length || roles.some((role) => userHasRole(user, role)));

  useEffect(() => {
    if (isBootstrapping) return;

    if (!isAuthenticated) {
      route('/login', true);
      return;
    }

    if (!isAllowed) {
      route('/dashboard', true);
    }
  }, [isAuthenticated, isAllowed, isBootstrapping]);

  if (isBootstrapping) {
    return <FullPageLoader message={t('auth.verifyingSession')} />;
  }

  if (!isAllowed) {
    return <FullPageLoader message={t('auth.redirecting')} />;
  }

  return <Component {...props} />;
}

import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { clearTokenParamsFromUrl, readOAuthTokensFromLocation } from '../utils/tokenStorage';

export default function OAuthCallbackPage() {
  const { fetchUser } = useAuth();
  const { t } = useI18n();
  const toast = useToast();

  useEffect(() => {
    async function handleOAuthResult() {
      const tokens = readOAuthTokensFromLocation();

      if (!tokens?.accessToken || !tokens?.refreshToken) {
        toast.error(t('auth.missingToken'));
        route('/login', true);
        return;
      }

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      window.dispatchEvent(new CustomEvent('auth:tokenRefreshed'));
      clearTokenParamsFromUrl();

      try {
        await fetchUser();
        toast.success(t('auth.loginSuccess'));
        route('/', true);
      } catch {
        toast.error(t('auth.loadUserFailed'));
        route('/login', true);
      }
    }

    handleOAuthResult();
  }, [fetchUser, toast]);

  return (
    <div class="fullpage-loader">
      <div class="loader-spinner" />
      <p>{t('auth.processingOAuth')}</p>
    </div>
  );
}

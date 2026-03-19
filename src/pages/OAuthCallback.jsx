import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { clearTokenParamsFromUrl, readOAuthTokensFromLocation } from '../utils/tokenStorage';

export default function OAuthCallbackPage() {
  const { fetchUser, syncTokens } = useAuth();
  const { t } = useI18n();
  const toast = useToast();

  useEffect(() => {
    async function handleOAuthResult() {
      const tokens = readOAuthTokensFromLocation();

      if (!tokens?.accessToken) {
        toast.error(t('auth.missingToken'));
        route('/login', true);
        return;
      }

      syncTokens(tokens);
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
  }, [fetchUser, syncTokens, toast, t]);

  return (
    <div class="fullpage-loader">
      <div class="loader-spinner" />
      <p>{t('auth.processingOAuth')}</p>
    </div>
  );
}

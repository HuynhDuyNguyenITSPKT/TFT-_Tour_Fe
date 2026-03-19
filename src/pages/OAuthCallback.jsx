import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { sendLoginSuccessEmail } from '../api/authApi';
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
        const currentUser = await fetchUser();

        if (currentUser?.email) {
          const displayName = currentUser?.name || t('topbar.guest');

          await sendLoginSuccessEmail({
            to: currentUser.email,
            subject: t('auth.loginEmailSubject', { appName: t('app.name') }),
            content: t('auth.loginEmailContent', {
              name: displayName,
              appName: t('app.name')
            })
          }).catch(() => {
            console.log('Login error email sent to', currentUser.email);
          });

          console.log('Login success email sent to', currentUser.email);
        }

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

import { route } from 'preact-router';
import { useEffect } from 'preact/hooks';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';

export default function LoginPage() {
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const { language, toggleLanguage, t } = useI18n();

  useEffect(() => {
    if (isAuthenticated) {
      route('/', true);
    }
  }, [isAuthenticated]);

  return (
    <div class="login-page">
      <div class="login-bg-orb orb-left" />
      <div class="login-bg-orb orb-right" />

      <div class="login-card glass-card">
        <button class="ghost-btn" onClick={toggleLanguage}>
          {t('topbar.language')}: {language.toUpperCase()}
        </button>
        <p class="chip">{t('login.welcome')}</p>
        <h1>{t('login.title', { appName: t('app.name') })}</h1>
        <p class="login-caption">
          {t('login.caption')}
        </p>

        <button class="google-btn" onClick={loginWithGoogle}>
          {t('login.googleButton')}
        </button>
      </div>
    </div>
  );
}

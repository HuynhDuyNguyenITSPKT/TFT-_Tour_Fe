import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';

export default function Topbar({ title }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useI18n();

  return (
    <header class="topbar">
      <div>
        <p class="topbar-title">{title}</p>
        <p class="topbar-subtitle">
          {t('topbar.welcomeBack', { name: user?.name || t('topbar.guest') })}
        </p>
      </div>

      <div class="topbar-actions">
        <button class="ghost-btn" onClick={toggleLanguage}>
          {t('topbar.language')}: {language.toUpperCase()}
        </button>
        <button class="ghost-btn" onClick={toggleTheme}>
          {theme === 'dark' ? t('topbar.lightMode') : t('topbar.darkMode')}
        </button>
        <button class="danger-btn" onClick={() => logout(true)}>
          {t('topbar.logout')}
        </button>
      </div>
    </header>
  );
}

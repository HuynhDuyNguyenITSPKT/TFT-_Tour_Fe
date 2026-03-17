import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export default function Topbar({ title }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header class="topbar">
      <div>
        <p class="topbar-title">{title}</p>
        <p class="topbar-subtitle">Welcome back, {user?.name || 'User'}</p>
      </div>

      <div class="topbar-actions">
        <button class="ghost-btn" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light' : 'Dark'} mode
        </button>
        <button class="danger-btn" onClick={() => logout(true)}>
          Logout
        </button>
      </div>
    </header>
  );
}

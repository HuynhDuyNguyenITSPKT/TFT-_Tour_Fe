import { route } from 'preact-router';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { userHasRole } from '../utils/auth';

function SidebarItem({ href, activePath, label }) {
  const active = activePath === href;

  return (
    <button class={`sidebar-item ${active ? 'active' : ''}`} onClick={() => route(href)}>
      {label}
    </button>
  );
}

export default function Sidebar({ currentPath }) {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <aside class="sidebar">
      <div class="brand-block">
        <p class="brand-eyebrow">{t('app.eyebrow')}</p>
        <h2>{t('app.name')}</h2>
      </div>

      <nav class="sidebar-nav">
        <SidebarItem href="/dashboard" activePath={currentPath} label={t('nav.dashboard')} />
        {userHasRole(user, 'ADMIN') ? (
          <SidebarItem href="/admin" activePath={currentPath} label={t('nav.admin')} />
        ) : null}
      </nav>
    </aside>
  );
}

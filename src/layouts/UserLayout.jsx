import { route } from 'preact-router';
import Topbar from '../components/Topbar';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { userHasRole } from '../utils/auth';

export default function UserLayout({ title, currentPath, children }) {
  const { t } = useI18n();
  const { user } = useAuth();

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/dashboard', label: t('nav.dashboard') },
    { href: '/posts/me', label: t('nav.myPosts') }
  ];

  if (userHasRole(user, 'ADMIN')) {
    navItems.push({ href: '/admin', label: t('nav.admin') });
  }

  return (
    <div class="storefront-shell">
      <header class="storefront-header">
        <div class="storefront-brand" onClick={() => route('/', true)}>
          <p class="brand-eyebrow">{t('app.eyebrow')}</p>
          <h2>{t('app.name')}</h2>
        </div>
        <nav class="storefront-nav">
          {navItems.map((item) => (
            <button
              key={item.href}
              class={`storefront-nav-item ${currentPath === item.href ? 'active' : ''}`}
              onClick={() => route(item.href, true)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main class="storefront-main">
        <Topbar title={title} />
        <section class="storefront-content">{children}</section>
      </main>
    </div>
  );
}


import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useI18n } from '../hooks/useI18n';

export default function AdminLayout({ title, currentPath, children }) {
  const { t } = useI18n();

  const items = [
    { href: '/admin', label: t('nav.admin') },
    { href: '/admin/categories', label: t('nav.adminCategories') },
    { href: '/admin/products', label: t('nav.adminProducts') },
    { href: '/', label: t('nav.home') }
  ];

  return (
    <div class="dashboard-shell">
      <Sidebar
        currentPath={currentPath}
        items={items}
        brandEyebrow={t('admin.title')}
        brandName={t('app.name')}
        variant="admin"
      />
      <main class="dashboard-main">
        <Topbar title={title} />
        <section class="dashboard-content">{children}</section>
      </main>
    </div>
  );
}


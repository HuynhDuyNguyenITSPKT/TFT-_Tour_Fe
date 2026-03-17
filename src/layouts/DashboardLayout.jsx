import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout({ title, currentPath, children }) {
  return (
    <div class="dashboard-shell">
      <Sidebar currentPath={currentPath} />
      <main class="dashboard-main">
        <Topbar title={title} />
        <section class="dashboard-content">{children}</section>
      </main>
    </div>
  );
}

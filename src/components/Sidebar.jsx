import { route } from 'preact-router';
import { useAuth } from '../hooks/useAuth';
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

  return (
    <aside class="sidebar">
      <div class="brand-block">
        <p class="brand-eyebrow">SaaS Workspace</p>
        <h2>TFT Manager</h2>
      </div>

      <nav class="sidebar-nav">
        <SidebarItem href="/dashboard" activePath={currentPath} label="Dashboard" />
        <SidebarItem href="/projects" activePath={currentPath} label="Projects" />
        {userHasRole(user, 'ADMIN') ? (
          <SidebarItem href="/admin" activePath={currentPath} label="Admin" />
        ) : null}
      </nav>
    </aside>
  );
}

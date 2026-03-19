import { route } from 'preact-router';

function SidebarItem({ href, activePath, label }) {
  const active = activePath === href;

  return (
    <button class={`sidebar-item ${active ? 'active' : ''}`} onClick={() => route(href)}>
      {label}
    </button>
  );
}

export default function Sidebar({
  currentPath,
  items = [],
  brandEyebrow,
  brandName,
  variant = 'user'
}) {

  return (
    <aside class={`sidebar sidebar-${variant}`}>
      <div class="brand-block">
        <p class="brand-eyebrow">{brandEyebrow}</p>
        <h2>{brandName}</h2>
      </div>

      <nav class="sidebar-nav">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            activePath={currentPath}
            label={item.label}
          />
        ))}
      </nav>
    </aside>
  );
}

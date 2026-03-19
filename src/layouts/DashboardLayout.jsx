import UserLayout from './UserLayout';

export default function DashboardLayout({ title, currentPath, children }) {
  return <UserLayout title={title} currentPath={currentPath}>{children}</UserLayout>;
}

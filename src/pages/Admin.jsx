import { useEffect, useState } from 'preact/hooks';
import DashboardLayout from '../layouts/DashboardLayout';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { changeUserRole, deleteUser, getUsers } from '../api/adminApi';
import { getErrorMessage } from '../utils/httpError';

const ROLE_OPTIONS = ['ROLE_USER', 'ROLE_ADMIN'];

export default function AdminPage() {
  const { t } = useI18n();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);

  async function loadUsers() {
    setLoading(true);

    try {
      const response = await getUsers();
      setUsers(response.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error, t('admin.usersLoadFailed')));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function onChangeRole(userId, roleName) {
    setSavingUserId(userId);

    try {
      await changeUserRole(userId, roleName);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: roleName } : user))
      );
      toast.success(t('admin.roleUpdated'));
    } catch (error) {
      toast.error(getErrorMessage(error, t('admin.roleUpdateFailed')));
    } finally {
      setSavingUserId(null);
    }
  }

  async function onDeleteUser(userId) {
    const ok = window.confirm(t('admin.confirmDelete'));
    if (!ok) return;

    setSavingUserId(userId);

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success(t('admin.userDeleted'));
    } catch (error) {
      toast.error(getErrorMessage(error, t('admin.userDeleteFailed')));
    } finally {
      setSavingUserId(null);
    }
  }

  return (
    <DashboardLayout title={t('admin.title')} currentPath="/admin">
      <div class="section-head">
        <div>
          <h3>{t('admin.userManagement')}</h3>
          <p class="muted">{t('admin.userManagementDesc')}</p>
        </div>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>{t('admin.name')}</th>
              <th>{t('admin.email')}</th>
              <th>{t('admin.role')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>{t('admin.loadingUsers')}</td>
              </tr>
            ) : users.length ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name || '-'}</td>
                  <td>{user.email || '-'}</td>
                  <td>
                    <select
                      value={user.role || 'ROLE_USER'}
                      onChange={(event) => onChangeRole(user.id, event.target.value)}
                      disabled={savingUserId === user.id}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      class="danger-btn"
                      onClick={() => onDeleteUser(user.id)}
                      disabled={savingUserId === user.id}
                    >
                      {t('admin.delete')}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>{t('admin.noUsers')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

import { useEffect, useState } from 'preact/hooks';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../hooks/useToast';
import { changeUserRole, deleteUser, getUsers } from '../api/adminApi';
import { getErrorMessage } from '../utils/httpError';

const ROLE_OPTIONS = ['ROLE_USER', 'ROLE_ADMIN'];

export default function AdminPage() {
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
      toast.error(getErrorMessage(error, 'Khong the tai danh sach user.'));
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
      toast.success('Cap nhat role thanh cong.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Khong the cap nhat role.'));
    } finally {
      setSavingUserId(null);
    }
  }

  async function onDeleteUser(userId) {
    const ok = window.confirm('Ban co chac chan muon xoa user nay?');
    if (!ok) return;

    setSavingUserId(userId);

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success('Da xoa user.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Khong the xoa user.'));
    } finally {
      setSavingUserId(null);
    }
  }

  return (
    <DashboardLayout title="Admin" currentPath="/admin">
      <div class="section-head">
        <div>
          <h3>User Management</h3>
          <p class="muted">Quan ly tai khoan nguoi dung trong he thong.</p>
        </div>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>Dang tai user...</td>
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
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Khong co user nao.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

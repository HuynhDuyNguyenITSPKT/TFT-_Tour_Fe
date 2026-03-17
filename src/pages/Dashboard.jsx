import { useState } from 'preact/hooks';
import DashboardLayout from '../layouts/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { updateCurrentUser } from '../api/userApi';
import { getErrorMessage } from '../utils/httpError';

export default function DashboardPage() {
  const { user, fetchUser, setUser } = useAuth();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  async function onSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await updateCurrentUser(form);
      setUser(response.data);
      toast.success('Cap nhat profile thanh cong.');
      setIsModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Cap nhat profile that bai.'));
    } finally {
      setIsSaving(false);
    }
  }

  async function reloadProfile() {
    try {
      await fetchUser();
      toast.success('Da tai lai thong tin user.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Khong the tai profile.'));
    }
  }

  return (
    <DashboardLayout title="Dashboard" currentPath="/dashboard">
      <div class="panel-grid">
        <article class="panel profile-panel">
          <div class="profile-avatar-wrap">
            <img
              class="profile-avatar"
              src={user?.avatar || 'https://api.dicebear.com/9.x/glass/svg?seed=tft-manager'}
              alt="avatar"
            />
          </div>
          <div class="profile-body">
            <h3>{user?.name || 'Unknown user'}</h3>
            <p>{user?.email || 'No email'}</p>
          </div>
          <div class="inline-actions">
            <button
              class="primary-btn"
              onClick={() => {
                setForm({
                  name: user?.name || '',
                  email: user?.email || '',
                  avatar: user?.avatar || ''
                });
                setIsModalOpen(true);
              }}
            >
              Edit Profile
            </button>
            <button class="ghost-btn" onClick={reloadProfile}>
              Reload
            </button>
          </div>
        </article>

        <article class="panel metric-panel">
          <p class="muted">Tong quan</p>
          <h3>Welcome to your workspace</h3>
          <p>
            Chao mung ban quay lai. Tai day ban co the quan ly profile, du an va cac tinh nang
            lien quan den giai dau.
          </p>
        </article>
      </div>

      <Modal
        open={isModalOpen}
        title="Update profile"
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button class="ghost-btn" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button class="primary-btn" onClick={onSubmit} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </>
        }
      >
        <form class="stack-form" onSubmit={onSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onInput={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onInput={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </label>
          <label>
            Avatar URL
            <input
              value={form.avatar}
              onInput={(event) => setForm((prev) => ({ ...prev, avatar: event.target.value }))}
            />
          </label>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

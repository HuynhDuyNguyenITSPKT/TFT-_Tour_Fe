import { useState } from 'preact/hooks';
import UserLayout from '../layouts/UserLayout';
import Modal from '../components/Modal';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { updateCurrentUser } from '../api/userApi';
import { getErrorMessage } from '../utils/httpError';

export default function DashboardPage() {
  const { user, fetchUser, setUser } = useAuth();
  const { t } = useI18n();
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
      toast.success(t('dashboard.profileUpdated'));
      setIsModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, t('dashboard.profileUpdateFailed')));
    } finally {
      setIsSaving(false);
    }
  }

  async function reloadProfile() {
    try {
      await fetchUser();
      toast.success(t('dashboard.profileReloaded'));
    } catch (error) {
      toast.error(getErrorMessage(error, t('dashboard.profileReloadFailed')));
    }
  }

  return (
    <UserLayout title={t('dashboard.title')} currentPath="/dashboard">
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
            <h3>{user?.name || t('dashboard.unknownUser')}</h3>
            <p>{user?.email || t('dashboard.noEmail')}</p>
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
              {t('dashboard.editProfile')}
            </button>
            <button class="ghost-btn" onClick={reloadProfile}>
              {t('dashboard.reload')}
            </button>
          </div>
        </article>

        <article class="panel metric-panel">
          <p class="muted">{t('dashboard.overview')}</p>
          <h3>{t('dashboard.workspaceTitle')}</h3>
          <p>
            {t('dashboard.workspaceDesc')}
          </p>
        </article>
      </div>

      <Modal
        open={isModalOpen}
        title={t('dashboard.updateProfileTitle')}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button class="ghost-btn" onClick={() => setIsModalOpen(false)}>
              {t('dashboard.cancel')}
            </button>
            <button class="primary-btn" onClick={onSubmit} disabled={isSaving}>
              {isSaving ? t('dashboard.saving') : t('dashboard.saveChanges')}
            </button>
          </>
        }
      >
        <form class="stack-form" onSubmit={onSubmit}>
          <label>
            {t('dashboard.name')}
            <input
              value={form.name}
              onInput={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </label>
          <label>
            {t('dashboard.email')}
            <input
              type="email"
              value={form.email}
              onInput={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </label>
          <label>
            {t('dashboard.avatarUrl')}
            <input
              value={form.avatar}
              onInput={(event) => setForm((prev) => ({ ...prev, avatar: event.target.value }))}
            />
          </label>
        </form>
      </Modal>
    </UserLayout>
  );
}

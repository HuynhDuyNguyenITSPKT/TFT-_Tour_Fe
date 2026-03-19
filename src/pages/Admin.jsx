import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import AdminLayout from '../layouts/AdminLayout';
import Modal from '../components/Modal';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { changeUserRole, deleteUser, getUsers } from '../api/adminApi';
import {
  createTopic,
  deleteTopic,
  getTopics,
  updateTopic
} from '../api/topicApi';
import { getErrorMessage } from '../utils/httpError';

const ROLE_OPTIONS = ['ROLE_USER', 'ROLE_ADMIN'];
const initialTopicForm = { name: '', description: '' };

export default function AdminPage() {
  const { t } = useI18n();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicSaving, setTopicSaving] = useState(false);
  const [topicDeletingId, setTopicDeletingId] = useState(null);
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicForm, setTopicForm] = useState(initialTopicForm);

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

  async function loadTopics() {
    setTopicsLoading(true);

    try {
      const response = await getTopics();
      setTopics(response.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error, t('admin.topicsLoadFailed')));
    } finally {
      setTopicsLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    loadTopics();
  }, []);

  function openCreateTopicModal() {
    setEditingTopic(null);
    setTopicForm(initialTopicForm);
    setTopicModalOpen(true);
  }

  function openEditTopicModal(topic) {
    setEditingTopic(topic);
    setTopicForm({
      name: topic.name || '',
      description: topic.description || ''
    });
    setTopicModalOpen(true);
  }

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

  async function onSubmitTopic(event) {
    event.preventDefault();

    const name = topicForm.name.trim();
    const description = topicForm.description.trim();

    if (name.length < 2 || name.length > 120) {
      toast.error(t('admin.topicNameInvalid'));
      return;
    }

    if (description.length < 10 || description.length > 2000) {
      toast.error(t('admin.topicDescriptionInvalid'));
      return;
    }

    setTopicSaving(true);

    try {
      const payload = { name, description };

      if (editingTopic?.id) {
        await updateTopic(editingTopic.id, payload);
        toast.success(t('admin.topicUpdated'));
      } else {
        await createTopic(payload);
        toast.success(t('admin.topicCreated'));
      }

      setTopicModalOpen(false);
      await loadTopics();
    } catch (error) {
      toast.error(getErrorMessage(error, t('admin.topicSaveFailed')));
    } finally {
      setTopicSaving(false);
    }
  }

  async function onDeleteTopic(topicId) {
    const ok = window.confirm(t('admin.confirmDeleteTopic'));
    if (!ok) return;

    setTopicDeletingId(topicId);

    try {
      await deleteTopic(topicId);
      setTopics((prev) => prev.filter((topic) => topic.id !== topicId));
      toast.success(t('admin.topicDeleted'));
    } catch (error) {
      toast.error(getErrorMessage(error, t('admin.topicDeleteFailed')));
    } finally {
      setTopicDeletingId(null);
    }
  }

  return (
    <AdminLayout title={t('admin.title')} currentPath="/admin">
      <div class="admin-shortcuts">
        <button class="ghost-btn" onClick={() => route('/admin/categories', true)}>
          {t('admin.goCategories')}
        </button>
        <button class="ghost-btn" onClick={() => route('/admin/products', true)}>
          {t('admin.goProducts')}
        </button>
      </div>

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

      <div class="section-head">
        <div>
          <h3>{t('admin.topicManagement')}</h3>
          <p class="muted">{t('admin.topicManagementDesc')}</p>
        </div>
        <button class="primary-btn" onClick={openCreateTopicModal}>
          {t('admin.newTopic')}
        </button>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>{t('admin.topicName')}</th>
              <th>{t('admin.topicDescription')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {topicsLoading ? (
              <tr>
                <td colSpan={3}>{t('admin.loadingTopics')}</td>
              </tr>
            ) : topics.length ? (
              topics.map((topic) => (
                <tr key={topic.id}>
                  <td>{topic.name}</td>
                  <td>{topic.description}</td>
                  <td>
                    <div class="inline-actions">
                      <button class="ghost-btn" onClick={() => openEditTopicModal(topic)}>
                        {t('admin.edit')}
                      </button>
                      <button
                        class="danger-btn"
                        onClick={() => onDeleteTopic(topic.id)}
                        disabled={topicDeletingId === topic.id}
                      >
                        {t('admin.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>{t('admin.noTopics')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={topicModalOpen}
        title={editingTopic ? t('admin.editTopic') : t('admin.createTopic')}
        onClose={() => setTopicModalOpen(false)}
        footer={
          <>
            <button class="ghost-btn" onClick={() => setTopicModalOpen(false)}>
              {t('admin.cancel')}
            </button>
            <button class="primary-btn" onClick={onSubmitTopic} disabled={topicSaving}>
              {topicSaving ? t('admin.saving') : t('admin.save')}
            </button>
          </>
        }
      >
        <form class="stack-form" onSubmit={onSubmitTopic}>
          <label>
            {t('admin.topicName')}
            <input
              value={topicForm.name}
              onInput={(event) => setTopicForm((prev) => ({ ...prev, name: event.target.value }))}
              minLength={2}
              maxLength={120}
              required
            />
          </label>

          <label>
            {t('admin.topicDescription')}
            <textarea
              rows={5}
              value={topicForm.description}
              onInput={(event) =>
                setTopicForm((prev) => ({ ...prev, description: event.target.value }))
              }
              minLength={10}
              maxLength={2000}
              required
            />
          </label>
        </form>
      </Modal>
    </AdminLayout>
  );
}

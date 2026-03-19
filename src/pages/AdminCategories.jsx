import { useEffect, useState } from 'preact/hooks';
import AdminLayout from '../layouts/AdminLayout';
import Modal from '../components/Modal';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from '../api/categoryApi';
import { getErrorMessage } from '../utils/httpError';

const initialForm = {
  name: '',
  description: ''
};

export default function AdminCategoriesPage() {
  const { t } = useI18n();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(initialForm);

  async function loadCategories() {
    setLoading(true);

    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error, t('adminCategories.loadFailed')));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openCreateModal() {
    setEditingCategory(null);
    setForm(initialForm);
    setIsModalOpen(true);
  }

  function openEditModal(category) {
    setEditingCategory(category);
    setForm({
      name: category.name || '',
      description: category.description || ''
    });
    setIsModalOpen(true);
  }

  function validateForm() {
    const name = form.name.trim();
    const description = form.description.trim();

    if (name.length < 2 || name.length > 120) {
      toast.error(t('adminCategories.nameInvalid'));
      return null;
    }

    if (description.length > 500) {
      toast.error(t('adminCategories.descriptionInvalid'));
      return null;
    }

    return { name, description };
  }

  async function onSubmit(event) {
    event.preventDefault();
    const payload = validateForm();
    if (!payload) return;

    setSaving(true);

    try {
      if (editingCategory?.id) {
        await updateCategory(editingCategory.id, payload);
        toast.success(t('adminCategories.updated'));
      } else {
        await createCategory(payload);
        toast.success(t('adminCategories.created'));
      }

      setIsModalOpen(false);
      await loadCategories();
    } catch (error) {
      toast.error(getErrorMessage(error, t('adminCategories.saveFailed')));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(categoryId) {
    if (!window.confirm(t('adminCategories.confirmDelete'))) return;

    setDeletingId(categoryId);

    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((item) => item.id !== categoryId));
      toast.success(t('adminCategories.deleted'));
    } catch (error) {
      toast.error(getErrorMessage(error, t('adminCategories.deleteFailed')));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout title={t('adminCategories.title')} currentPath="/admin/categories">
      <div class="section-head">
        <div>
          <h3>{t('adminCategories.heading')}</h3>
          <p class="muted">{t('adminCategories.description')}</p>
        </div>
        <button class="primary-btn" onClick={openCreateModal}>
          {t('adminCategories.newCategory')}
        </button>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('adminCategories.name')}</th>
              <th>{t('adminCategories.descriptionLabel')}</th>
              <th>{t('adminCategories.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>{t('adminCategories.loading')}</td>
              </tr>
            ) : categories.length ? (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description || '-'}</td>
                  <td>
                    <div class="inline-actions">
                      <button class="ghost-btn" onClick={() => openEditModal(category)}>
                        {t('adminCategories.edit')}
                      </button>
                      <button
                        class="danger-btn"
                        onClick={() => onDelete(category.id)}
                        disabled={deletingId === category.id}
                      >
                        {t('adminCategories.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>{t('adminCategories.empty')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={isModalOpen}
        title={editingCategory ? t('adminCategories.editCategory') : t('adminCategories.createCategory')}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button class="ghost-btn" onClick={() => setIsModalOpen(false)}>
              {t('adminCategories.cancel')}
            </button>
            <button class="primary-btn" onClick={onSubmit} disabled={saving}>
              {saving ? t('adminCategories.saving') : t('adminCategories.save')}
            </button>
          </>
        }
      >
        <form class="stack-form" onSubmit={onSubmit}>
          <label>
            {t('adminCategories.name')}
            <input
              value={form.name}
              onInput={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              minLength={2}
              maxLength={120}
              required
            />
          </label>

          <label>
            {t('adminCategories.descriptionLabel')}
            <textarea
              rows={4}
              value={form.description}
              onInput={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              maxLength={500}
            />
          </label>
        </form>
      </Modal>
    </AdminLayout>
  );
}


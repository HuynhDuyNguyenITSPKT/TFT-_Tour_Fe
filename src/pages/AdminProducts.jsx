import { useEffect, useMemo, useState } from 'preact/hooks';
import AdminLayout from '../layouts/AdminLayout';
import Modal from '../components/Modal';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { getCategories } from '../api/categoryApi';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from '../api/productApi';
import { uploadProductImage } from '../api/uploadApi';
import { getErrorMessage } from '../utils/httpError';

const initialForm = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  categoryId: '',
  quantity: '',
  status: 'ACTIVE',
  sku: ''
};

function toCurrency(value) {
  if (value === null || value === undefined || value === '') return '-';

  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(Number(value));
  } catch {
    return String(value);
  }
}

export default function AdminProductsPage() {
  const { t } = useI18n();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialForm);

  const statusOptions = useMemo(() => ['ACTIVE', 'INACTIVE'], []);

  async function loadData() {
    setLoading(true);

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error, t('adminProducts.loadFailed')));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateModal() {
    setEditingProduct(null);
    setForm(initialForm);
    setIsModalOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId ?? '',
      quantity: product.quantity ?? '',
      status: product.status || 'ACTIVE',
      sku: product.sku || ''
    });
    setIsModalOpen(true);
  }

  function validateForm() {
    const payload = {
      name: String(form.name || '').trim(),
      description: String(form.description || '').trim(),
      price: Number(form.price),
      imageUrl: String(form.imageUrl || '').trim(),
      categoryId: Number(form.categoryId),
      quantity: Number(form.quantity),
      status: String(form.status || '').trim(),
      sku: String(form.sku || '').trim()
    };

    if (payload.name.length < 2 || payload.name.length > 120) {
      toast.error(t('adminProducts.nameInvalid'));
      return null;
    }

    if (payload.description.length < 5 || payload.description.length > 2000) {
      toast.error(t('adminProducts.descriptionInvalid'));
      return null;
    }

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      toast.error(t('adminProducts.priceInvalid'));
      return null;
    }

    if (!Number.isFinite(payload.categoryId)) {
      toast.error(t('adminProducts.categoryInvalid'));
      return null;
    }

    if (!Number.isFinite(payload.quantity) || payload.quantity < 0) {
      toast.error(t('adminProducts.quantityInvalid'));
      return null;
    }

    if (!payload.status || payload.status.length > 30) {
      toast.error(t('adminProducts.statusInvalid'));
      return null;
    }

    if (payload.sku.length < 2 || payload.sku.length > 80) {
      toast.error(t('adminProducts.skuInvalid'));
      return null;
    }

    if (!payload.imageUrl) {
      toast.error(t('adminProducts.imageRequired'));
      return null;
    }

    return payload;
  }

  async function onSubmit(event) {
    event.preventDefault();
    const payload = validateForm();
    if (!payload) return;

    setSaving(true);

    try {
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, payload);
        toast.success(t('adminProducts.updated'));
      } else {
        await createProduct(payload);
        toast.success(t('adminProducts.created'));
      }

      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error, t('adminProducts.saveFailed')));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(productId) {
    if (!window.confirm(t('adminProducts.confirmDelete'))) return;

    setDeletingId(productId);

    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((item) => item.id !== productId));
      toast.success(t('adminProducts.deleted'));
    } catch (error) {
      toast.error(getErrorMessage(error, t('adminProducts.deleteFailed')));
    } finally {
      setDeletingId(null);
    }
  }

  async function onSelectImage(event) {
    const file = event.target?.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const response = await uploadProductImage(file);
      const imageUrl = response?.data?.imageUrl || '';

      if (!imageUrl) {
        toast.error(t('adminProducts.uploadNoUrl'));
        return;
      }

      setForm((prev) => ({ ...prev, imageUrl }));
      toast.success(t('adminProducts.uploadSuccess'));
    } catch (error) {
      toast.error(getErrorMessage(error, t('adminProducts.uploadFailed')));
    } finally {
      event.target.value = '';
      setUploading(false);
    }
  }

  return (
    <AdminLayout title={t('adminProducts.title')} currentPath="/admin/products">
      <div class="section-head">
        <div>
          <h3>{t('adminProducts.heading')}</h3>
          <p class="muted">{t('adminProducts.description')}</p>
        </div>
        <button class="primary-btn" onClick={openCreateModal}>
          {t('adminProducts.newProduct')}
        </button>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('adminProducts.name')}</th>
              <th>{t('adminProducts.category')}</th>
              <th>{t('adminProducts.price')}</th>
              <th>{t('adminProducts.quantity')}</th>
              <th>{t('adminProducts.status')}</th>
              <th>{t('adminProducts.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>{t('adminProducts.loading')}</td>
              </tr>
            ) : products.length ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.categoryName || '-'}</td>
                  <td>{toCurrency(product.price)}</td>
                  <td>{product.quantity}</td>
                  <td>{product.status || '-'}</td>
                  <td>
                    <div class="inline-actions">
                      <button class="ghost-btn" onClick={() => openEditModal(product)}>
                        {t('adminProducts.edit')}
                      </button>
                      <button
                        class="danger-btn"
                        onClick={() => onDelete(product.id)}
                        disabled={deletingId === product.id}
                      >
                        {t('adminProducts.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>{t('adminProducts.empty')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={isModalOpen}
        title={editingProduct ? t('adminProducts.editProduct') : t('adminProducts.createProduct')}
        onClose={() => setIsModalOpen(false)}
        className="modal-product-form"
        footer={
          <>
            <button class="ghost-btn" onClick={() => setIsModalOpen(false)}>
              {t('adminProducts.cancel')}
            </button>
            <button class="primary-btn" onClick={onSubmit} disabled={saving || uploading}>
              {saving ? t('adminProducts.saving') : t('adminProducts.save')}
            </button>
          </>
        }
      >
        <form class="stack-form" onSubmit={onSubmit}>
          <label>
            {t('adminProducts.name')}
            <input
              value={form.name}
              onInput={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              minLength={2}
              maxLength={120}
              required
            />
          </label>

          <label>
            {t('adminProducts.descriptionLabel')}
            <textarea
              rows={4}
              value={form.description}
              onInput={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              minLength={5}
              maxLength={2000}
              required
            />
          </label>

          <div class="product-form-grid">
            <label>
              {t('adminProducts.price')}
              <input
                type="number"
                min={1}
                value={form.price}
                onInput={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                required
              />
            </label>

            <label>
              {t('adminProducts.quantity')}
              <input
                type="number"
                min={0}
                value={form.quantity}
                onInput={(event) =>
                  setForm((prev) => ({ ...prev, quantity: event.target.value }))
                }
                required
              />
            </label>
          </div>

          <div class="product-form-grid">
            <label>
              {t('adminProducts.category')}
              <select
                value={form.categoryId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, categoryId: event.target.value }))
                }
                required
              >
                <option value="">{t('adminProducts.selectCategory')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t('adminProducts.status')}
              <select
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                required
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            SKU
            <input
              value={form.sku}
              onInput={(event) => setForm((prev) => ({ ...prev, sku: event.target.value }))}
              minLength={2}
              maxLength={80}
              required
            />
          </label>

          <label>
            {t('adminProducts.imageUrl')}
            <input
              value={form.imageUrl}
              onInput={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
              required
            />
          </label>

          <div class="product-upload-row">
            <input type="file" accept="image/*" onChange={onSelectImage} disabled={uploading} />
            <span class="muted">
              {uploading ? t('adminProducts.uploading') : t('adminProducts.uploadImage')}
            </span>
          </div>

          {form.imageUrl ? (
            <img class="product-preview-image" src={form.imageUrl} alt={form.name || 'preview'} />
          ) : null}
        </form>
      </Modal>
    </AdminLayout>
  );
}


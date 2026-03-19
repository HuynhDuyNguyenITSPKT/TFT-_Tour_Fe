import { route } from 'preact-router';
import { useEffect, useMemo, useState } from 'preact/hooks';
import UserLayout from '../layouts/UserLayout';
import { SkeletonCard } from '../components/LoadingSkeleton';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { getCategories } from '../api/categoryApi';
import { getProducts } from '../api/productApi';
import { getErrorMessage } from '../utils/httpError';

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

export default function ProductListPage() {
  const { t } = useI18n();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const activeCategoryId = useMemo(() => {
    if (!selectedCategoryId) return null;
    const parsed = Number(selectedCategoryId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [selectedCategoryId]);

  async function loadCategories() {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error, t('products.loadCategoriesFailed')));
    }
  }

  async function loadProducts(categoryId = null) {
    setLoading(true);

    try {
      const response = await getProducts(categoryId);
      setProducts(response.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error, t('products.loadFailed')));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts(activeCategoryId);
  }, [activeCategoryId]);

  return (
    <UserLayout title={t('products.title')} currentPath="/products">
      <div class="section-head">
        <div>
          <h3>{t('products.heading')}</h3>
          <p class="muted">{t('products.description')}</p>
        </div>
        <select
          class="catalog-filter"
          value={selectedCategoryId}
          onChange={(event) => setSelectedCategoryId(event.target.value)}
        >
          <option value="">{t('products.allCategories')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div class="product-grid">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
          : products.map((product) => (
              <article key={product.id} class="product-tile">
                <div class="product-image-wrap">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} class="product-image" />
                  ) : (
                    <div class="product-image-placeholder">{t('products.noImage')}</div>
                  )}
                </div>
                <div class="product-tile-body">
                  <p class="muted">{product.categoryName || '-'}</p>
                  <h4>{product.name}</h4>
                  <p class="product-price">{toCurrency(product.price)}</p>
                  <p class="muted">{t('products.stock', { value: product.quantity ?? 0 })}</p>
                  <button
                    class="primary-btn"
                    onClick={() => route(`/products/${product.id}`, true)}
                  >
                    {t('products.viewDetail')}
                  </button>
                </div>
              </article>
            ))}
      </div>

      {!loading && products.length === 0 ? (
        <div class="empty-state">{t('products.empty')}</div>
      ) : null}
    </UserLayout>
  );
}


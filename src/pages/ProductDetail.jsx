import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import UserLayout from '../layouts/UserLayout';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { getProductById } from '../api/productApi';
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

export default function ProductDetailPage({ productId }) {
  const { t } = useI18n();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);

      try {
        const response = await getProductById(productId);
        setProduct(response.data || null);
      } catch (error) {
        toast.error(getErrorMessage(error, t('productDetail.loadFailed')));
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId, t, toast]);

  return (
    <UserLayout title={product?.name || t('productDetail.title')} currentPath="/products">
      <button class="ghost-btn" onClick={() => route('/products', true)}>
        {t('productDetail.back')}
      </button>

      {loading ? <div class="empty-state">{t('productDetail.loading')}</div> : null}

      {!loading && !product ? <div class="empty-state">{t('productDetail.notFound')}</div> : null}

      {!loading && product ? (
        <article class="product-detail-card">
          <div class="product-detail-image-wrap">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} class="product-detail-image" />
            ) : (
              <div class="product-image-placeholder">{t('products.noImage')}</div>
            )}
          </div>

          <div class="product-detail-content">
            <p class="muted">{product.categoryName || '-'}</p>
            <h2>{product.name}</h2>
            <p class="product-price">{toCurrency(product.price)}</p>
            <p>{product.description}</p>

            <div class="product-metadata">
              <p>
                <strong>{t('productDetail.sku')}:</strong> {product.sku || '-'}
              </p>
              <p>
                <strong>{t('productDetail.quantity')}:</strong> {product.quantity ?? 0}
              </p>
              <p>
                <strong>{t('productDetail.sold')}:</strong> {product.sold ?? 0}
              </p>
              <p>
                <strong>{t('productDetail.status')}:</strong> {product.status || '-'}
              </p>
            </div>
          </div>
        </article>
      ) : null}
    </UserLayout>
  );
}


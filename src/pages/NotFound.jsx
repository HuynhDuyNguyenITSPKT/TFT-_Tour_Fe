import { route } from 'preact-router';
import { useI18n } from '../hooks/useI18n';

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div class="fullpage-loader">
      <p>{t('common.notFound')}</p>
      <button class="primary-btn" onClick={() => route('/', true)}>
        {t('common.goHome')}
      </button>
    </div>
  );
}

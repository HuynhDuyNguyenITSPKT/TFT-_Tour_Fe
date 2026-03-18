import { useContext } from 'preact/hooks';
import { I18nContext } from '../store/I18nContext';

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }

  return context;
}


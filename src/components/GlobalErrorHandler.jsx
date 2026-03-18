import { useEffect } from 'preact/hooks';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { getErrorMessage } from '../utils/httpError';

export default function GlobalErrorHandler() {
  const toast = useToast();
  const { t } = useI18n();

  useEffect(() => {
    function onUnhandledError(event) {
      toast.error(getErrorMessage(event?.error || event, t('errors.unexpected')));
    }

    function onUnhandledRejection(event) {
      toast.error(getErrorMessage(event?.reason, t('errors.requestFailed')));
    }

    window.addEventListener('error', onUnhandledError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    return () => {
      window.removeEventListener('error', onUnhandledError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, [toast, t]);

  return null;
}

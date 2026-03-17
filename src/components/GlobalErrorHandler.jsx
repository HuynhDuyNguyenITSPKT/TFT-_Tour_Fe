import { useEffect } from 'preact/hooks';
import { useToast } from '../hooks/useToast';
import { getErrorMessage } from '../utils/httpError';

export default function GlobalErrorHandler() {
  const toast = useToast();

  useEffect(() => {
    function onUnhandledError(event) {
      toast.error(getErrorMessage(event?.error || event, 'Co loi khong mong muon da xay ra.'));
    }

    function onUnhandledRejection(event) {
      toast.error(
        getErrorMessage(event?.reason, 'Yeu cau that bai do loi he thong. Vui long thu lai.')
      );
    }

    window.addEventListener('error', onUnhandledError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    return () => {
      window.removeEventListener('error', onUnhandledError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, [toast]);

  return null;
}

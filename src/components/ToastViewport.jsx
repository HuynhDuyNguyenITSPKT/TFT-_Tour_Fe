import { useToast } from '../hooks/useToast';
import { useI18n } from '../hooks/useI18n';

export default function ToastViewport() {
  const { toasts, removeToast } = useToast();
  const { t } = useI18n();

  return (
    <div class="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} class={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button
            class="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label={t('common.closeToast')}
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}

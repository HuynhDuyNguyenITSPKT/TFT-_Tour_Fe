import { useToast } from '../hooks/useToast';

export default function ToastViewport() {
  const { toasts, removeToast } = useToast();

  return (
    <div class="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} class={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button class="toast-close" onClick={() => removeToast(toast.id)} aria-label="Close toast">
            x
          </button>
        </div>
      ))}
    </div>
  );
}

import { createContext } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';

export const ToastContext = createContext(null);

let nextToastId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((payload) => {
    const id = nextToastId++;
    const duration = payload.duration ?? 3500;

    setToasts((prev) => [...prev, { id, ...payload }]);

    window.setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, [removeToast]);

  const value = useMemo(
    () => ({
      toasts,
      removeToast,
      success: (message, options = {}) => pushToast({ type: 'success', message, ...options }),
      error: (message, options = {}) => pushToast({ type: 'error', message, ...options }),
      info: (message, options = {}) => pushToast({ type: 'info', message, ...options })
    }),
    [toasts, removeToast, pushToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

import { useContext } from 'preact/hooks';
import { ToastContext } from '../store/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast phai duoc dung trong ToastProvider.');
  }

  return context;
}

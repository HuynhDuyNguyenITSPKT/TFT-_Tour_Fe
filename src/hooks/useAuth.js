import { useContext } from 'preact/hooks';
import { AuthContext } from '../store/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth phai duoc dung trong AuthProvider.');
  }

  return context;
}

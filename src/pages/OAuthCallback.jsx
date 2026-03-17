import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { clearTokenParamsFromUrl, readOAuthTokensFromLocation } from '../utils/tokenStorage';

export default function OAuthCallbackPage() {
  const { fetchUser } = useAuth();
  const toast = useToast();

  useEffect(() => {
    async function handleOAuthResult() {
      const tokens = readOAuthTokensFromLocation();

      if (!tokens?.accessToken || !tokens?.refreshToken) {
        toast.error('Khong tim thay token sau khi dang nhap Google.');
        route('/login', true);
        return;
      }

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      window.dispatchEvent(new CustomEvent('auth:tokenRefreshed'));
      clearTokenParamsFromUrl();

      try {
        await fetchUser();
        toast.success('Dang nhap thanh cong.');
        route('/', true);
      } catch {
        toast.error('Khong the tai thong tin user.');
        route('/login', true);
      }
    }

    handleOAuthResult();
  }, [fetchUser, toast]);

  return (
    <div class="fullpage-loader">
      <div class="loader-spinner" />
      <p>Dang xu ly dang nhap OAuth2...</p>
    </div>
  );
}

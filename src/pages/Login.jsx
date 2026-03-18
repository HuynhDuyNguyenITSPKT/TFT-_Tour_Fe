import { route } from 'preact-router';
import { useEffect } from 'preact/hooks';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { isAuthenticated, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      route('/', true);
    }
  }, [isAuthenticated]);

  return (
    <div class="login-page">
      <div class="login-bg-orb orb-left" />
      <div class="login-bg-orb orb-right" />

      <div class="login-card glass-card">
        <p class="chip">Welcome</p>
        <h1>Sign in to TFT Manager</h1>
        <p class="login-caption">
          Dang nhap bang Google de tiep tuc quan ly giai dau, projects va phan quyen user.
        </p>

        <button class="google-btn" onClick={loginWithGoogle}>
          Login with Google Now
        </button>
      </div>
    </div>
  );
}

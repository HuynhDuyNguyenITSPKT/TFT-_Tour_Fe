import { createContext } from 'preact';
import { route } from 'preact-router';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { getCurrentUser } from '../api/userApi';
import { refreshAccessToken } from '../api/authApi';
import {
  clearTokenParamsFromUrl,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  readOAuthTokensFromLocation,
  setTokens
} from '../utils/tokenStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const OAUTH_REDIRECT_PATH = '/auth/callback';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [refreshToken, setRefreshToken] = useState(getRefreshToken());
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const syncTokens = useCallback((tokens) => {
    if (!tokens) return;

    setTokens(tokens);
    if (tokens.accessToken) setAccessToken(tokens.accessToken);
    if (tokens.refreshToken) setRefreshToken(tokens.refreshToken);
  }, []);

  const logout = useCallback((redirectToLogin = true) => {
    clearTokens();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    if (redirectToLogin) {
      route('/', true);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    const response = await getCurrentUser();
    setUser(response.data);
    return response.data;
  }, []);

  const tryRefresh = useCallback(async () => {
    if (!getRefreshToken()) {
      return null;
    }

    const response = await refreshAccessToken(getRefreshToken());
    const nextTokens = {
      accessToken: response?.data?.accessToken,
      refreshToken: response?.data?.refreshToken || getRefreshToken()
    };

    syncTokens(nextTokens);
    return nextTokens.accessToken;
  }, [syncTokens]);

  const loginWithGoogle = useCallback(() => {
    const callbackUrl = `${window.location.origin}${OAUTH_REDIRECT_PATH}`;
    const oauthUrl = `${API_BASE_URL}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(callbackUrl)}`;
    window.location.href = oauthUrl;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const oauthTokens = readOAuthTokensFromLocation();

        if (oauthTokens) {
          syncTokens(oauthTokens);
          clearTokenParamsFromUrl();
          route('/', true);
        }

        if (!getAccessToken() && getRefreshToken()) {
          await tryRefresh();
        }

        if (getAccessToken()) {
          await fetchUser();
        }
      } catch {
        if (isMounted) {
          logout(false);
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [fetchUser, logout, syncTokens, tryRefresh]);

  useEffect(() => {
    function handleSessionExpired() {
      logout(true);
    }

    function handleTokenRefreshed() {
      setAccessToken(getAccessToken());
      setRefreshToken(getRefreshToken());
      fetchUser().catch(() => {
        logout(true);
      });
    }

    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    window.addEventListener('auth:tokenRefreshed', handleTokenRefreshed);

    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
      window.removeEventListener('auth:tokenRefreshed', handleTokenRefreshed);
    };
  }, [fetchUser, logout]);

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: Boolean(accessToken),
      isBootstrapping,
      loginWithGoogle,
      logout,
      fetchUser,
      setUser
    }),
    [accessToken, refreshToken, user, isBootstrapping, loginWithGoogle, logout, fetchUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

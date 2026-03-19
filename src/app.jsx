import { Router } from 'preact-router';
import Login from './pages/Login';
import OAuthCallbackPage from './pages/OAuthCallback';
import HomePage from './pages/Home';
import DashboardPage from './pages/Dashboard';
import AdminPage from './pages/Admin';
import AdminCategoriesPage from './pages/AdminCategories';
import AdminProductsPage from './pages/AdminProducts';
import TopicDetailPage from './pages/TopicDetail';
import MyPostsPage from './pages/MyPosts';
import ProductListPage from './pages/Products';
import ProductDetailPage from './pages/ProductDetail';
import NotFoundPage from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalErrorHandler from './components/GlobalErrorHandler';
import { AuthProvider } from './store/AuthContext';
import { I18nProvider } from './store/I18nContext';
import { ToastProvider } from './store/ToastContext';
import ToastViewport from './components/ToastViewport';
import './app.css';

export function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <GlobalErrorHandler />
          <Router>
            <Login path="/login" />
            <OAuthCallbackPage path="/auth/callback" />
            <ProtectedRoute path="/" component={HomePage} />
            <ProtectedRoute path="/products" component={ProductListPage} />
            <ProtectedRoute path="/products/:productId" component={ProductDetailPage} />
            <ProtectedRoute path="/topics/:topicId" component={TopicDetailPage} />
            <ProtectedRoute path="/posts/me" component={MyPostsPage} />
            <ProtectedRoute path="/dashboard" component={DashboardPage} />
            <ProtectedRoute path="/admin" component={AdminPage} roles={['ADMIN']} />
            <ProtectedRoute
              path="/admin/categories"
              component={AdminCategoriesPage}
              roles={['ADMIN']}
            />
            <ProtectedRoute
              path="/admin/products"
              component={AdminProductsPage}
              roles={['ADMIN']}
            />
            <NotFoundPage default />
          </Router>
          <ToastViewport />
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}

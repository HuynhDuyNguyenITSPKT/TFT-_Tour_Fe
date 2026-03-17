import { route } from 'preact-router';

export default function NotFoundPage() {
  return (
    <div class="fullpage-loader">
      <p>404 - Page not found</p>
      <button class="primary-btn" onClick={() => route('/', true)}>
        Go to Home
      </button>
    </div>
  );
}

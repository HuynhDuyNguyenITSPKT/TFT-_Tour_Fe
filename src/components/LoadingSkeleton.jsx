export function SkeletonCard() {
  return (
    <div class="skeleton-card">
      <div class="skeleton skeleton-line short" />
      <div class="skeleton skeleton-line" />
      <div class="skeleton skeleton-line" />
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div class="profile-card">
      <div class="skeleton skeleton-avatar" />
      <div class="profile-body">
        <div class="skeleton skeleton-line short" />
        <div class="skeleton skeleton-line" />
      </div>
    </div>
  );
}

export function FullPageLoader({ message = 'Dang tai du lieu...' }) {
  return (
    <div class="fullpage-loader">
      <div class="loader-spinner" />
      <p>{message}</p>
    </div>
  );
}

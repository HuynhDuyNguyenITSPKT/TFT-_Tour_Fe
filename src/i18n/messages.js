export const SUPPORTED_LANGUAGES = ['vi', 'en'];

export const messages = {
  vi: {
    app: {
      name: 'Tổ chức hệ thống giải đấu game',
      eyebrow: 'Hệ thống giải đấu game'
    },
    nav: {
      dashboard: 'Bảng điều khiển',
      admin: 'Quản trị'
    },
    topbar: {
      welcomeBack: 'Chào mừng trở lại, {name}',
      guest: 'Người dùng',
      lightMode: 'Chế độ sáng',
      darkMode: 'Chế độ tối',
      logout: 'Đăng xuất',
      language: 'Ngôn ngữ'
    },
    login: {
      welcome: 'Chào mừng',
      title: 'Đăng nhập vào {appName}',
      caption: 'Đăng nhập bằng Google để tiếp tục quản lý giải đấu và phân quyền người dùng.',
      googleButton: 'Đăng nhập với Google'
    },
    dashboard: {
      title: 'Bảng điều khiển',
      unknownUser: 'Người dùng chưa xác định',
      noEmail: 'Chưa có email',
      editProfile: 'Sửa hồ sơ',
      reload: 'Tải lại',
      overview: 'Tổng quan',
      workspaceTitle: 'Chào mừng đến với không gian làm việc',
      workspaceDesc:
        'Bạn có thể quản lý hồ sơ và các tính năng liên quan đến giải đấu tại đây.',
      profileUpdated: 'Cập nhật hồ sơ thành công.',
      profileUpdateFailed: 'Cập nhật hồ sơ thất bại.',
      profileReloaded: 'Đã tải lại thông tin người dùng.',
      profileReloadFailed: 'Không thể tải hồ sơ.',
      updateProfileTitle: 'Cập nhật hồ sơ',
      cancel: 'Hủy',
      saving: 'Đang lưu...',
      saveChanges: 'Lưu thay đổi',
      name: 'Tên',
      email: 'Email',
      avatarUrl: 'Liên kết ảnh đại diện'
    },
    admin: {
      title: 'Quản trị',
      userManagement: 'Quản lý người dùng',
      userManagementDesc: 'Quản lý tài khoản người dùng trong hệ thống.',
      name: 'Tên',
      email: 'Email',
      role: 'Vai trò',
      actions: 'Hành động',
      loadingUsers: 'Đang tải người dùng...',
      noUsers: 'Không có người dùng nào.',
      delete: 'Xóa',
      confirmDelete: 'Bạn có chắc chắn muốn xóa người dùng này?',
      roleUpdated: 'Cập nhật vai trò thành công.',
      roleUpdateFailed: 'Không thể cập nhật vai trò.',
      userDeleted: 'Đã xóa người dùng.',
      userDeleteFailed: 'Không thể xóa người dùng.',
      usersLoadFailed: 'Không thể tải danh sách người dùng.'
    },
    auth: {
      processingOAuth: 'Đang xử lý đăng nhập OAuth2...',
      missingToken: 'Không tìm thấy token sau khi đăng nhập Google.',
      loginSuccess: 'Đăng nhập thành công.',
      loadUserFailed: 'Không thể tải thông tin người dùng.',
      verifyingSession: 'Đang xác thực phiên đăng nhập...',
      redirecting: 'Đang chuyển hướng...'
    },
    common: {
      loadingData: 'Đang tải dữ liệu...',
      closeToast: 'Đóng thông báo',
      notFound: '404 - Không tìm thấy trang',
      goHome: 'Về trang chủ'
    },
    errors: {
      unexpected: 'Có lỗi không mong muốn đã xảy ra.',
      requestFailed: 'Yêu cầu thất bại do lỗi hệ thống. Vui lòng thử lại.',
      generic: 'Có lỗi xảy ra, vui lòng thử lại.'
    }
  },
  en: {
    app: {
      name: 'Game Tournament System Organizer',
      eyebrow: 'Game tournament platform'
    },
    nav: {
      dashboard: 'Dashboard',
      admin: 'Admin'
    },
    topbar: {
      welcomeBack: 'Welcome back, {name}',
      guest: 'User',
      lightMode: 'Light mode',
      darkMode: 'Dark mode',
      logout: 'Logout',
      language: 'Language'
    },
    login: {
      welcome: 'Welcome',
      title: 'Sign in to {appName}',
      caption: 'Sign in with Google to continue managing tournaments and user permissions.',
      googleButton: 'Continue with Google'
    },
    dashboard: {
      title: 'Dashboard',
      unknownUser: 'Unknown user',
      noEmail: 'No email',
      editProfile: 'Edit profile',
      reload: 'Reload',
      overview: 'Overview',
      workspaceTitle: 'Welcome to your workspace',
      workspaceDesc: 'You can manage your profile and tournament-related features here.',
      profileUpdated: 'Profile updated successfully.',
      profileUpdateFailed: 'Failed to update profile.',
      profileReloaded: 'User information reloaded.',
      profileReloadFailed: 'Unable to load profile.',
      updateProfileTitle: 'Update profile',
      cancel: 'Cancel',
      saving: 'Saving...',
      saveChanges: 'Save changes',
      name: 'Name',
      email: 'Email',
      avatarUrl: 'Avatar URL'
    },
    admin: {
      title: 'Admin',
      userManagement: 'User management',
      userManagementDesc: 'Manage user accounts in the system.',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      actions: 'Actions',
      loadingUsers: 'Loading users...',
      noUsers: 'No users found.',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this user?',
      roleUpdated: 'Role updated successfully.',
      roleUpdateFailed: 'Unable to update role.',
      userDeleted: 'User deleted.',
      userDeleteFailed: 'Unable to delete user.',
      usersLoadFailed: 'Unable to load users.'
    },
    auth: {
      processingOAuth: 'Processing OAuth2 sign-in...',
      missingToken: 'Token not found after Google sign-in.',
      loginSuccess: 'Signed in successfully.',
      loadUserFailed: 'Unable to load user information.',
      verifyingSession: 'Verifying session...',
      redirecting: 'Redirecting...'
    },
    common: {
      loadingData: 'Loading data...',
      closeToast: 'Close notification',
      notFound: '404 - Page not found',
      goHome: 'Go to home'
    },
    errors: {
      unexpected: 'An unexpected error occurred.',
      requestFailed: 'Request failed due to a system error. Please try again.',
      generic: 'Something went wrong. Please try again.'
    }
  }
};


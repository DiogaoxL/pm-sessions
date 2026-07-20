export const ROUTES = {
  public: ['/api/health'],
  auth: ['/login'],
  protected: ['/admin', '/admin/dashboard'],
  callback: '/auth/callback',
  logout: '/logout',
  redirects: {
    afterLogin: '/admin/dashboard',
    afterLogout: '/login',
    unauthorized: '/login?error=unauthorized',
    forbidden: '/?error=forbidden',
  },
} as const;

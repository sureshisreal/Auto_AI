export const API_ENDPOINTS = {
  demo: {
    status: '/api/status'
  },
  wesendcv: {
    jobs: {
      list: '/api/jobs',
      detail: '/api/jobs/:id',
      create: '/api/jobs'
    },
    auth: {
      login: '/api/auth/login',
      logout: '/api/auth/logout'
    }
  }
};

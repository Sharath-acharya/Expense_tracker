import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage on every request automatically
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('expense-tracker-store');
    if (stored) {
      const parsed = JSON.parse(stored);
      const token = parsed?.state?.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

// Auto logout on 401 Invalid Token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear bad token from localStorage
      try {
        const stored = localStorage.getItem('expense-tracker-store');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.state.token = null;
          parsed.state.user = null;
          localStorage.setItem('expense-tracker-store', JSON.stringify(parsed));
        }
      } catch {
        localStorage.removeItem('expense-tracker-store');
      }
      // Redirect to auth page
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;

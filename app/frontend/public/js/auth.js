import Authenticate from './authenticate.js';

export async function isAuthenticated() {
  const token = localStorage.getItem('access_token');
  if (token) {
    const response = await Authenticate.verifyToken(token);
    if (response.ok) {
      return true;
    } else {
      // Try with refresh token
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        const response = await Authenticate.refreshToken(refreshToken);
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('access_token', data.access);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

export async function logout() {
  const token = localStorage.getItem('access_token');
  if (token) {
    const response = await Authenticate.logout();
    if (response.ok) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '#/login';
    } else {
      window.location.href = '/';
    }
  } else {
    window.location.href = '/';
  }
}
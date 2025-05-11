import axios from './axios';

const AUTH_TOKEN_KEY = 'auth_token';

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
      localStorage.setItem(AUTH_TOKEN_KEY, access_token);
      return user;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  async signup(email, username, password) {
    try {
      const response = await axios.post('/auth/signup', { email, username, password });
      const { access_token, user } = response.data;
      localStorage.setItem(AUTH_TOKEN_KEY, access_token);
      return user;
    } catch (error) {
      throw error.response?.data || { error: 'Signup failed' };
    }
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  async getCurrentUser() {
    try {
      const response = await axios.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get user data' };
    }
  }
};

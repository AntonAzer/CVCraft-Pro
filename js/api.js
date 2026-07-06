// Central place that talks to the backend. Change API_BASE_URL to wherever
// you deploy the cvcraft-backend service (e.g. https://api.yourapp.com).
const API_BASE_URL = window.CVCRAFT_API_BASE_URL || 'http://localhost:4000/api';

const TOKEN_KEY = 'cvcraft_token';

const Api = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  },
  isLoggedIn() {
    return Boolean(this.getToken());
  },

  async request(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth && this.getToken()) {
      headers.Authorization = `Bearer ${this.getToken()}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      // 204 No Content etc.
    }

    if (!response.ok) {
      const message = (data && data.error) || `Request failed (${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    return data;
  },

  // Auth
  signup(fullName, email, password) {
    return this.request('/auth/signup', { method: 'POST', body: { fullName, email, password }, auth: false });
  },
  login(email, password) {
    return this.request('/auth/login', { method: 'POST', body: { email, password }, auth: false });
  },
  me() {
    return this.request('/auth/me');
  },
  forgotPassword(email) {
    return this.request('/auth/forgot-password', { method: 'POST', body: { email }, auth: false });
  },

  // CVs
  listCVs() {
    return this.request('/cvs');
  },
  getCV(id) {
    return this.request(`/cvs/${id}`);
  },
  createCV(name, template, data) {
    return this.request('/cvs', { method: 'POST', body: { name, template, data } });
  },
  updateCV(id, patch) {
    return this.request(`/cvs/${id}`, { method: 'PUT', body: patch });
  },
  deleteCV(id) {
    return this.request(`/cvs/${id}`, { method: 'DELETE' });
  },

  // Payments
  listPayments() {
    return this.request('/payments');
  },
  createPendingPayment(cvId, amount) {
    return this.request('/payments', { method: 'POST', body: { cvId, amount } });
  },
  confirmPayment(paymentId) {
    return this.request(`/payments/${paymentId}/confirm`, { method: 'POST' });
  }
};

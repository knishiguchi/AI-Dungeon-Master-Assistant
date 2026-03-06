import axios from 'axios';
import type { APIResponse } from '../types';

/**
 * Axios instance pre-configured for the backend API.
 * In development the Vite proxy forwards /api → localhost:3000,
 * so we don't need an absolute base URL.
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 30_000, // 30 s — LLM calls can be slow
  headers: { 'Content-Type': 'application/json' },
});

// ---------------------------------------------------------------------------
// Response interceptor — unwrap APIResponse envelope
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalise error into a friendlier message
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as APIResponse | undefined;
      const message =
        data?.error ?? error.message ?? 'An unexpected error occurred.';
      const suggestion = data?.suggestion;
      return Promise.reject({ message, suggestion, status: error.response?.status });
    }
    return Promise.reject(error);
  },
);

export default api;

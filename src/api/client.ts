import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      const data = error.response.data;
      const apiError = {
        kind: data?.kind || 'Unknown',
        message: data?.message || error.message,
        details: data?.details,
      };
      return Promise.reject(apiError);
    }
    return Promise.reject({
      kind: 'Network',
      message: error.message || 'Network error',
    });
  },
);

/**
 * Normalize list API response.
 * Mayastor REST API may return:
 *   - A plain array: [{...}, {...}]
 *   - A paginated wrapper: { entries: [...], total: N, ... }
 *   - A named collection: { volumes: [...], ... }
 */
function extractList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.entries)) return obj.entries as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
    // Try to find any array field in the object
    for (const key of Object.keys(obj)) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }
  return [];
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

/** GET request that returns a list — normalizes the response */
export async function apiGetList<T>(url: string, config?: AxiosRequestConfig): Promise<T[]> {
  const response = await apiClient.get(url, config);
  return extractList<T>(response.data);
}

export async function apiPost<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

export async function apiPut<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

export default apiClient;

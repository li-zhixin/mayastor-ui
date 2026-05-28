declare global {
  interface Window {
    __MAYASTOR_UI_CONFIG__?: {
      apiBaseUrl?: string;
    };
  }
}

function normalizeBaseUrl(value: string | undefined): string {
  return value?.trim() ?? '';
}

export function getApiBaseUrl(): string {
  return normalizeBaseUrl(
    window.__MAYASTOR_UI_CONFIG__?.apiBaseUrl || import.meta.env.VITE_API_BASE_URL,
  );
}

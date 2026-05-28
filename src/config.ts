declare global {
  interface Window {
    __MAYASTOR_UI_CONFIG__?: {
      apiBaseUrl?: string;
      basePath?: string;
    };
  }
}

function normalizeBaseUrl(value: string | undefined): string {
  return value?.trim() ?? '';
}

function normalizeBasePath(value: string | undefined): string {
  const trimmed = value?.trim() || '/';
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const normalized = withLeadingSlash.replace(/\/+$/, '');
  return normalized === '' ? '/' : normalized;
}

export function getApiBaseUrl(): string {
  const explicitBaseUrl = normalizeBaseUrl(
    window.__MAYASTOR_UI_CONFIG__?.apiBaseUrl || import.meta.env.VITE_API_BASE_URL,
  );
  if (explicitBaseUrl) {
    return explicitBaseUrl;
  }

  const basePath = getBasePath();
  return basePath === '/' ? '' : basePath;
}

export function getBasePath(): string {
  return normalizeBasePath(window.__MAYASTOR_UI_CONFIG__?.basePath);
}

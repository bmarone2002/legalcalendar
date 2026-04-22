const DEFAULT_SITE_URL = "https://agendalegale-production.up.railway.app";

export function getSiteUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!rawUrl) {
    return DEFAULT_SITE_URL;
  }

  try {
    const parsed = new URL(rawUrl);
    return parsed.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

const cleanEnvValue = (value: string | undefined, variableName: string) => {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();
  const prefix = `${variableName}=`;

  return trimmedValue.startsWith(prefix)
    ? trimmedValue.slice(prefix.length).trim()
    : trimmedValue;
};

export const POSTHOG_KEY =
  cleanEnvValue(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, "VITE_PUBLIC_POSTHOG_KEY") ||
  "phc_CsG9pGA7fSShXcvqM7uvRywzQXgibMGbf4ePXB5GEMVa";

export const POSTHOG_HOST =
  cleanEnvValue(import.meta.env.VITE_PUBLIC_POSTHOG_HOST, "VITE_PUBLIC_POSTHOG_HOST") ||
  "https://us.i.posthog.com";

export const isPostHogConfigured = Boolean(POSTHOG_KEY && POSTHOG_HOST);

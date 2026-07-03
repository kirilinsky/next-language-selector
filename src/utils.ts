export const getLocaleCookie = (
  cookieName: string = "NEXT_LOCALE",
): string | null => {
  if (typeof document === "undefined") return null;

  const safeKey = encodeURIComponent(cookieName);
  const raw = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((row) => row.startsWith(`${safeKey}=`));
  if (!raw) return null;

  try {
    return decodeURIComponent(raw.slice(safeKey.length + 1));
  } catch {
    // malformed percent-encoding in the cookie value
    return null;
  }
};

export const setLocaleCookie = (
  locale: string,
  cookieName: string = "NEXT_LOCALE",
  autoReload: boolean = true,
) => {
  if (typeof document === "undefined") return;

  const safeKey = encodeURIComponent(cookieName);
  const safeValue = encodeURIComponent(locale);
  document.cookie = `${safeKey}=${safeValue}; max-age=31536000; path=/; SameSite=Lax`;
  if (autoReload) {
    window.location.reload();
  }
};

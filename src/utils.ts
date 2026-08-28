import type { ReloadStrategy } from "./types";

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
  /**
   * `true`/`"reload"` reloads the page, `false`/`"none"` does nothing,
   * a function is called with the locale code. Booleans are kept for
   * backwards compatibility with the pre-0.5 `autoReload` argument.
   */
  reload: boolean | ReloadStrategy = true,
) => {
  if (typeof document === "undefined") return;

  const safeKey = encodeURIComponent(cookieName);
  const safeValue = encodeURIComponent(locale);
  document.cookie = `${safeKey}=${safeValue}; max-age=31536000; path=/; SameSite=Lax`;

  if (typeof reload === "function") {
    reload(locale);
    return;
  }
  if (reload === true || reload === "reload") {
    window.location.reload();
  }
};

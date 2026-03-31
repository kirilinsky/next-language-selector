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

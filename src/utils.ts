export const setLocaleCookie = (
  locale: string,
  cookieName: string = "NEXT_LOCALE",
  autoReload: boolean = true,
) => {
  if (typeof document === "undefined") return;

  document.cookie = `${cookieName}=${locale}; max-age=31536000; path=/`;
  if (autoReload) {
    window.location.reload();
  }
};

export const setLocaleCookie = (
  locale: string,
  cookieName: string = "NEXT_LOCALE",
) => {
  if (typeof document === "undefined") return;

  document.cookie = `${cookieName}=${locale}; max-age=31536000; path=/`;
  window.location.reload();
};

import type { ReactNode } from "react";

export interface LocaleConfig {
  name: string;
  code: string;
  flag?: string;
}

/**
 * What happens after the locale cookie is written.
 *
 * - `"reload"` — full `window.location.reload()` (default, pre-0.5 behaviour).
 * - `"none"` — nothing; you re-render yourself.
 * - a function — called with the selected code. Use it to hand control to the
 *   router, e.g. `reloadStrategy={() => router.refresh()}` in the App Router.
 */
export type ReloadStrategy = "reload" | "none" | ((code: string) => void);

/**
 * Attributes written with the locale cookie. Every field is optional; the
 * defaults reproduce the pre-0.6 cookie exactly.
 */
export interface CookieOptions {
  /** Lifetime in seconds. Defaults to `31536000` (one year). */
  maxAge?: number;
  /** Defaults to `"/"`. */
  path?: string;
  /**
   * Share the cookie across subdomains, e.g. `".example.com"`. Omitted by
   * default, which scopes the cookie to the current host.
   */
  domain?: string;
  /** Defaults to `"Lax"`. */
  sameSite?: "Lax" | "Strict" | "None";
  /**
   * Adds the `Secure` attribute. Defaults to `false`, except when `sameSite`
   * is `"None"` — browsers reject `SameSite=None` without `Secure`, so it is
   * added automatically in that case.
   */
  secure?: boolean;
}

export interface LanguageSelectorProps {
  locales: LocaleConfig[];
  defaultLocale: string;
  /**
   * Locale to render on the server and during hydration, before the cookie is
   * read on the client. Pass the cookie value you already read server-side
   * (`cookies().get("NEXT_LOCALE")?.value`) to render the correct locale with
   * no flash. Falls back to `defaultLocale`.
   */
  initialLocale?: string;
  isDropdown?: boolean;
  cookieName?: string;
  /** Attributes for the written cookie: `maxAge`, `path`, `domain`, `sameSite`, `secure`. */
  cookieOptions?: CookieOptions;
  className?: string;
  itemClassName?: string;
  /**
   * Accessible name for the control — applied to the `<select>` in dropdown
   * mode and to the wrapper `role="group"` in button mode.
   */
  "aria-label"?: string;
  /**
   * @deprecated Use `reloadStrategy` instead. `autoReload={false}` is
   * equivalent to `reloadStrategy="none"`. Ignored when `reloadStrategy` is set.
   */
  autoReload?: boolean;
  /** What to do after the cookie is written. Defaults to `"reload"`. */
  reloadStrategy?: ReloadStrategy;
  /**
   * Called with the selected locale code after the internal state updates,
   * before the cookie is written (and before the reload strategy runs).
   * Not called when the already active locale is selected again.
   * Use for analytics, router navigation or other side effects.
   */
  onChange?: (code: string) => void;
  renderCustom?: (props: {
    locales: LocaleConfig[];
    currentLocale: string;
    onChange: (code: string) => void;
  }) => ReactNode;
}

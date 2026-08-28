import { ReactNode } from "react";

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
  className?: string;
  itemClassName?: string;
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
   * Use for analytics, router navigation or other side effects.
   */
  onChange?: (code: string) => void;
  renderCustom?: (props: {
    locales: LocaleConfig[];
    currentLocale: string;
    onChange: (code: string) => void;
  }) => ReactNode;
}

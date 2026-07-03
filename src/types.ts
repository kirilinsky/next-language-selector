import { ReactNode } from "react";

export interface LocaleConfig {
  name: string;
  code: string;
  flag?: string;
}

export interface LanguageSelectorProps {
  locales: LocaleConfig[];
  defaultLocale: string;
  isDropdown?: boolean;
  cookieName?: string;
  className?: string;
  itemClassName?: string;
  autoReload?: boolean;
  /**
   * Called with the selected locale code after the internal state updates,
   * before the cookie is written (and before the reload when autoReload is on).
   * Use for analytics, router navigation or other side effects.
   */
  onChange?: (code: string) => void;
  renderCustom?: (props: {
    locales: LocaleConfig[];
    currentLocale: string;
    onChange: (code: string) => void;
  }) => ReactNode;
}

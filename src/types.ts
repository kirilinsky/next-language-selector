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
  activeColor?: string;
  className?: string;
  renderCustom?: (props: {
    locales: LocaleConfig[];
    currentLocale: string;
    onChange: (code: string) => void;
  }) => ReactNode;
}

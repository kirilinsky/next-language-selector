import React from "react";
import { LanguageSelector as Component } from "./selector";
import { setLocaleCookie } from "./utils";
import type { LanguageSelectorProps, LocaleConfig } from "./types";

export const LanguageSelector: (
  props: LanguageSelectorProps,
) => React.JSX.Element | null = Component;

export { setLocaleCookie };
export type { LanguageSelectorProps, LocaleConfig };

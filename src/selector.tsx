"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { LanguageSelectorProps, ReloadStrategy } from "./types";
import { getLocaleCookie, setLocaleCookie } from "./utils";

const getLocaleLabel = (locale: { flag?: string; name: string }) =>
  locale.flag ? `${locale.flag} ${locale.name}` : locale.name;

// a locale code never contains a comma, so the joined codes are a stable
// primitive dependency for the sync effect — a `locales` array literal (the
// documented usage) is a new reference on every render
const CODE_SEPARATOR = ",";

// bundlers replace `process.env.NODE_ENV` with a literal, so this folds to
// `false` and the warnings are dropped from production builds
const isDev = () =>
  typeof process !== "undefined" && process.env.NODE_ENV !== "production";

const warn = (message: string) => {
  if (isDev()) console.warn(`[next-language-selector] ${message}`);
};

export function LanguageSelector(
  props: LanguageSelectorProps,
): React.JSX.Element | null {
  const {
    locales,
    defaultLocale,
    initialLocale,
    cookieName = "NEXT_LOCALE",
    cookieOptions,
    isDropdown = false,
    autoReload = true,
    reloadStrategy,
    onChange,
    renderCustom,
    className,
    itemClassName,
    "aria-label": ariaLabel,
  } = props;

  // rendered on the server and during hydration; the cookie takes over on mount
  const [current, setCurrent] = useState(initialLocale ?? defaultLocale);

  const localeCodesKey = locales
    .map((locale) => locale.code)
    .join(CODE_SEPARATOR);

  useEffect(() => {
    const codes = localeCodesKey.split(CODE_SEPARATOR);

    if (!codes.includes(defaultLocale)) {
      warn(
        `defaultLocale "${defaultLocale}" is not in locales (${codes.join(", ")}); nothing will be marked active.`,
      );
    }
    if (initialLocale !== undefined && !codes.includes(initialLocale)) {
      warn(
        `initialLocale "${initialLocale}" is not in locales (${codes.join(", ")}); nothing will be marked active.`,
      );
    }

    const saved = getLocaleCookie(cookieName);

    if (saved && codes.includes(saved)) {
      setCurrent(saved);
    } else {
      setCurrent(initialLocale ?? defaultLocale);
    }
  }, [cookieName, defaultLocale, initialLocale, localeCodesKey]);

  const handleSelect = useCallback(
    (code: string) => {
      if (!localeCodesKey.split(CODE_SEPARATOR).includes(code)) {
        warn(`ignoring unknown locale "${code}"; it is not in locales.`);
        return;
      }

      // re-selecting the active locale: make sure the cookie exists, but
      // don't fire onChange or throw the page away with a reload
      if (code === current) {
        setLocaleCookie(code, cookieName, "none", cookieOptions);
        return;
      }

      setCurrent(code);
      // before setLocaleCookie: with a reloading strategy the page navigates
      // inside it, so a callback fired later would never run
      onChange?.(code);

      const strategy: ReloadStrategy =
        reloadStrategy ?? (autoReload ? "reload" : "none");
      setLocaleCookie(code, cookieName, strategy, cookieOptions);
    },
    [
      localeCodesKey,
      current,
      cookieName,
      cookieOptions,
      autoReload,
      reloadStrategy,
      onChange,
    ],
  );

  if (renderCustom) {
    return (
      <>
        {renderCustom({
          locales,
          currentLocale: current,
          onChange: handleSelect,
        })}
      </>
    );
  }

  if (!isDropdown) {
    return (
      <div role="group" aria-label={ariaLabel} className={className}>
        {locales.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => handleSelect(l.code)}
            data-active={current === l.code}
            aria-pressed={current === l.code}
            className={itemClassName}
          >
            {getLocaleLabel(l)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <select
      value={current}
      onChange={(e) => handleSelect(e.target.value)}
      aria-label={ariaLabel}
      className={className}
    >
      {locales.map((l) => (
        <option key={l.code} value={l.code} className={itemClassName}>
          {getLocaleLabel(l)}
        </option>
      ))}
    </select>
  );
}

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { LanguageSelectorProps, ReloadStrategy } from "./types";
import { getLocaleCookie, setLocaleCookie } from "./utils";

const getLocaleLabel = (locale: { flag?: string; name: string }) =>
  locale.flag ? `${locale.flag} ${locale.name}` : locale.name;

// a locale code never contains a comma, so the joined codes are a stable
// primitive dependency for the sync effect — a `locales` array literal (the
// documented usage) is a new reference on every render
const CODE_SEPARATOR = ",";

export function LanguageSelector(
  props: LanguageSelectorProps,
): React.JSX.Element | null {
  const {
    locales,
    defaultLocale,
    initialLocale,
    cookieName = "NEXT_LOCALE",
    isDropdown = false,
    autoReload = true,
    reloadStrategy,
    onChange,
    renderCustom,
    className,
    itemClassName,
  } = props;

  // rendered on the server and during hydration; the cookie takes over on mount
  const [current, setCurrent] = useState(initialLocale ?? defaultLocale);

  const localeCodesKey = locales
    .map((locale) => locale.code)
    .join(CODE_SEPARATOR);

  useEffect(() => {
    const saved = getLocaleCookie(cookieName);

    if (saved && localeCodesKey.split(CODE_SEPARATOR).includes(saved)) {
      setCurrent(saved);
    } else {
      setCurrent(initialLocale ?? defaultLocale);
    }
  }, [cookieName, defaultLocale, initialLocale, localeCodesKey]);

  const handleSelect = useCallback(
    (code: string) => {
      setCurrent(code);
      // before setLocaleCookie: with a reloading strategy the page navigates
      // inside it, so a callback fired later would never run
      onChange?.(code);

      const strategy: ReloadStrategy =
        reloadStrategy ?? (autoReload ? "reload" : "none");
      setLocaleCookie(code, cookieName, strategy);
    },
    [cookieName, autoReload, reloadStrategy, onChange],
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
      <div className={className}>
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

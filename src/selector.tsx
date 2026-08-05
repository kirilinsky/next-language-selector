"use client";

import React, { useCallback, useEffect, useState } from "react";
import { LanguageSelectorProps } from "./types";
import { getLocaleCookie, setLocaleCookie } from "./utils";

const getLocaleLabel = (locale: { flag?: string; name: string }) =>
  locale.flag ? `${locale.flag} ${locale.name}` : locale.name;

export function LanguageSelector(
  props: LanguageSelectorProps,
): React.JSX.Element | null {
  const {
    locales,
    defaultLocale,
    cookieName = "NEXT_LOCALE",
    isDropdown = false,
    autoReload = true,
    onChange,
    renderCustom,
    className,
    itemClassName,
  } = props;

  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(defaultLocale);

  useEffect(() => {
    const saved = getLocaleCookie(cookieName);

    if (saved && locales.some((locale) => locale.code === saved)) {
      setCurrent(saved);
    } else {
      setCurrent(defaultLocale);
    }
    setMounted(true);
  }, [cookieName, defaultLocale, locales]);

  const handleSelect = useCallback(
    (code: string) => {
      setCurrent(code);
      // before setLocaleCookie: with autoReload the page reloads inside it,
      // so a callback fired later would never run
      onChange?.(code);
      setLocaleCookie(code, cookieName, autoReload);
    },
    [cookieName, autoReload, onChange],
  );

  if (!mounted) return null;

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

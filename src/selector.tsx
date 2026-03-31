"use client";

import React, { useCallback, useEffect, useState } from "react";
import { LanguageSelectorProps } from "./types";
import { setLocaleCookie } from "./utils";

export function LanguageSelector(
  props: LanguageSelectorProps,
): React.JSX.Element | null {
  const {
    locales,
    defaultLocale,
    cookieName = "NEXT_LOCALE",
    isDropdown = false,
    autoReload = true,
    renderCustom,
    className,
    itemClassName,
  } = props;

  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(defaultLocale);

  useEffect(() => {
    const safeKey = encodeURIComponent(cookieName);
    const raw = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${safeKey}=`));
    const saved = raw
      ? decodeURIComponent(raw.split("=").slice(1).join("="))
      : null;

    if (saved) setCurrent(saved);
    setMounted(true);
  }, [cookieName]);

  const handleSelect = useCallback(
    (code: string) => {
      setCurrent(code);
      setLocaleCookie(code, cookieName, autoReload);
    },
    [cookieName, autoReload],
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
            onClick={() => handleSelect(l.code)}
            data-active={current === l.code}
            aria-pressed={current === l.code}
            className={itemClassName}
          >
            {l.flag} {l.name}
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
          {l.flag} {l.name}
        </option>
      ))}
    </select>
  );
}

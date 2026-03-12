"use client";

import React, { useEffect, useState } from "react";
import { LanguageSelectorProps } from "./types";
import { setLocaleCookie } from "./utils";

export function LanguageSelector(
  props: LanguageSelectorProps,
): React.JSX.Element {
  const {
    locales,
    defaultLocale,
    cookieName = "NEXT_LOCALE",
    isDropdown = true,
    renderCustom,
    className,
    activeColor = "red",
  } = props;
  const [current, setCurrent] = useState(defaultLocale);

  useEffect(() => {
    const saved = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cookieName}=`))
      ?.split("=")[1];

    if (saved) setCurrent(saved);
  }, [cookieName]);

  const handleSelect = (code: string) => {
    setCurrent(code);
    setLocaleCookie(code, cookieName);
  };

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
      <div
        style={{ display: "flex", gap: "8px", alignItems: "center" }}
        className={className}
      >
        {locales.map((l) => (
          <button
            key={l.code}
            onClick={() => handleSelect(l.code)}
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              borderBottom:
                current === l.code
                  ? `1px solid ${activeColor}`
                  : "1px solid transparent",
              color: current === l.code ? "inherit" : "gray",
              fontSize: "12px",
              padding: "2px 4px",
            }}
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
        <option key={l.code} value={l.code}>
          {l.flag} {l.name}
        </option>
      ))}
    </select>
  );
}

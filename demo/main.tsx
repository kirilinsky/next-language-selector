import { useEffect, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageSelector } from "../src";

const locales = [
  { name: "English", code: "en", flag: "🇬🇧" },
  { name: "Deutsch", code: "de", flag: "🇩🇪" },
  { name: "日本語", code: "ja", flag: "🇯🇵" },
];

function CookieReadout() {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/);
      setValue(match ? decodeURIComponent(match[1]) : null);
    };
    read();
    const id = setInterval(read, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="cookie">
      document.cookie → NEXT_LOCALE = <b>{value ?? "∅"}</b>
    </div>
  );
}

function mount(id: string, node: ReactNode) {
  const el = document.getElementById(id);
  if (el) createRoot(el).render(node);
}

mount(
  "case-buttons",
  <LanguageSelector
    locales={locales}
    defaultLocale="en"
    autoReload={false}
    className="l-row"
    itemClassName="l-btn"
  />,
);

mount(
  "case-dropdown",
  <LanguageSelector
    locales={locales}
    defaultLocale="en"
    autoReload={false}
    isDropdown
    className="l-select"
  />,
);

mount(
  "case-custom",
  <LanguageSelector
    locales={locales}
    defaultLocale="en"
    autoReload={false}
    renderCustom={({ locales, currentLocale, onChange }) => (
      <div className="c-row">
        {locales.map((l) => (
          <button
            key={l.code}
            type="button"
            className={`c-dot${currentLocale === l.code ? " on" : ""}`}
            onClick={() => onChange(l.code)}
            aria-pressed={currentLocale === l.code}
          >
            {l.flag}
          </button>
        ))}
        <span className="c-name">
          {locales.find((l) => l.code === currentLocale)?.name}
        </span>
      </div>
    )}
  />,
);

mount("cookie-root", <CookieReadout />);

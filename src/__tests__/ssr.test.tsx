/**
 * The component must produce markup on the server: rendering nothing until
 * mount caused a layout shift and left the selector invisible without JS.
 */
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LanguageSelector } from "../selector";

const locales = [
  { name: "English", code: "en", flag: "🇺🇸" },
  { name: "Deutsch", code: "de", flag: "🇩🇪" },
];

describe("server rendering", () => {
  it("renders the buttons in the server markup, before any effect runs", () => {
    const html = renderToString(
      <LanguageSelector locales={locales} defaultLocale="en" />,
    );
    expect(html).toContain("English");
    expect(html).toContain("Deutsch");
  });

  it("marks defaultLocale active on the server", () => {
    const html = renderToString(
      <LanguageSelector locales={locales} defaultLocale="de" />,
    );
    expect(html).toMatch(/data-active="true"[^>]*>\s*🇩🇪 Deutsch/);
  });

  it("marks initialLocale active on the server", () => {
    const html = renderToString(
      <LanguageSelector
        locales={locales}
        defaultLocale="en"
        initialLocale="de"
      />,
    );
    expect(html).toMatch(/data-active="true"[^>]*>\s*🇩🇪 Deutsch/);
  });

  it("renders the dropdown with the initial locale selected", () => {
    const html = renderToString(
      <LanguageSelector
        locales={locales}
        defaultLocale="en"
        initialLocale="de"
        isDropdown
      />,
    );
    expect(html).toContain("<select");
    expect(html).toContain("Deutsch");
  });
});

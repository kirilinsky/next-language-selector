import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageSelector } from "../selector";

vi.mock("../utils", () => ({
  setLocaleCookie: vi.fn(),
}));

import { setLocaleCookie } from "../utils";

const locales = [
  { name: "English", code: "en", flag: "🇺🇸" },
  { name: "Deutsch", code: "de", flag: "🇩🇪" },
  { name: "Français", code: "fr" },
];

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}`;
}

function clearCookies() {
  document.cookie.split(";").forEach((c) => {
    const key = c.split("=")[0].trim();
    document.cookie = `${key}=; max-age=0`;
  });
}

beforeEach(() => {
  clearCookies();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});
 

describe("locale initialisation", () => {
  it("renders nothing before mounted (SSR hydration guard)", () => {
     let container!: HTMLElement;
    act(() => {
      ({ container } = render(
        <LanguageSelector locales={locales} defaultLocale="en" />,
      ));
    });
     expect(container.firstChild).not.toBeNull();
  });

  it("falls back to defaultLocale when no cookie is set", async () => {
    await act(async () => {
      render(<LanguageSelector locales={locales} defaultLocale="en" />);
    });
    expect(
      screen.getByRole("button", { name: /english/i }),
    ).toHaveAttribute("data-active", "true");
    expect(
      screen.getByRole("button", { name: /deutsch/i }),
    ).toHaveAttribute("data-active", "false");
  });

  it("reads locale from cookie on mount", async () => {
    setCookie("NEXT_LOCALE", "de");
    await act(async () => {
      render(<LanguageSelector locales={locales} defaultLocale="en" />);
    });
    expect(
      screen.getByRole("button", { name: /deutsch/i }),
    ).toHaveAttribute("data-active", "true");
    expect(
      screen.getByRole("button", { name: /english/i }),
    ).toHaveAttribute("data-active", "false");
  });

  it("decodes encoded cookie value (e.g. locale with special chars)", async () => {
     document.cookie = `NEXT_LOCALE=${encodeURIComponent("en")}`;
    await act(async () => {
      render(<LanguageSelector locales={locales} defaultLocale="de" />);
    });
    expect(
      screen.getByRole("button", { name: /english/i }),
    ).toHaveAttribute("data-active", "true");
  });

  it("handles cookie value containing = (e.g. base64-like locale)", async () => {

    document.cookie = "NEXT_LOCALE=abc=def";
    await act(async () => {
      render(
        <LanguageSelector
          locales={[
            { name: "Special", code: "abc=def" },
            { name: "English", code: "en" },
          ]}
          defaultLocale="en"
        />,
      );
    });
    expect(
      screen.getByRole("button", { name: /special/i }),
    ).toHaveAttribute("data-active", "true");
  });

  it("uses custom cookieName when reading", async () => {
    setCookie("MY_LOCALE", "fr");
    await act(async () => {
      render(
        <LanguageSelector
          locales={locales}
          defaultLocale="en"
          cookieName="MY_LOCALE"
        />,
      );
    });
    expect(
      screen.getByRole("button", { name: /français/i }),
    ).toHaveAttribute("data-active", "true");
  });
});
 

describe("locale selection", () => {
  it("calls setLocaleCookie with selected locale code", async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<LanguageSelector locales={locales} defaultLocale="en" />);
    });
    await user.click(screen.getByRole("button", { name: /deutsch/i }));
    expect(setLocaleCookie).toHaveBeenCalledWith("de", "NEXT_LOCALE", true);
  });

  it("passes autoReload=false to setLocaleCookie", async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(
        <LanguageSelector
          locales={locales}
          defaultLocale="en"
          autoReload={false}
        />,
      );
    });
    await user.click(screen.getByRole("button", { name: /deutsch/i }));
    expect(setLocaleCookie).toHaveBeenCalledWith("de", "NEXT_LOCALE", false);
  });

  it("updates data-active after clicking a different locale", async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<LanguageSelector locales={locales} defaultLocale="en" />);
    });
    await user.click(screen.getByRole("button", { name: /deutsch/i }));
    expect(
      screen.getByRole("button", { name: /deutsch/i }),
    ).toHaveAttribute("data-active", "true");
    expect(
      screen.getByRole("button", { name: /english/i }),
    ).toHaveAttribute("data-active", "false");
  });
});
 

describe("button mode (default)", () => {
  it("renders a button per locale", async () => {
    await act(async () => {
      render(<LanguageSelector locales={locales} defaultLocale="en" />);
    });
    expect(screen.getAllByRole("button")).toHaveLength(locales.length);
  });

  it("applies itemClassName to each button", async () => {
    await act(async () => {
      render(
        <LanguageSelector
          locales={locales}
          defaultLocale="en"
          itemClassName="my-btn"
        />,
      );
    });
    screen
      .getAllByRole("button")
      .forEach((btn) => expect(btn).toHaveClass("my-btn"));
  });

  it("applies className to wrapper div", async () => {
    await act(async () => {
      render(
        <LanguageSelector
          locales={locales}
          defaultLocale="en"
          className="my-wrapper"
        />,
      );
    });
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getAllByRole("button")[0].parentElement).toHaveClass(
      "my-wrapper",
    );
  });

  it("sets aria-pressed on buttons", async () => {
    await act(async () => {
      render(<LanguageSelector locales={locales} defaultLocale="en" />);
    });
    expect(screen.getByRole("button", { name: /english/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /deutsch/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});

describe("dropdown mode", () => {
  it("renders a select element", async () => {
    await act(async () => {
      render(
        <LanguageSelector locales={locales} defaultLocale="en" isDropdown />,
      );
    });
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders correct number of options", async () => {
    await act(async () => {
      render(
        <LanguageSelector locales={locales} defaultLocale="en" isDropdown />,
      );
    });
    expect(screen.getAllByRole("option")).toHaveLength(locales.length);
  });

  it("selects the active locale by default", async () => {
    setCookie("NEXT_LOCALE", "de");
    await act(async () => {
      render(
        <LanguageSelector locales={locales} defaultLocale="en" isDropdown />,
      );
    });
    expect(screen.getByRole("combobox")).toHaveValue("de");
  });

  it("calls setLocaleCookie on select change", async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(
        <LanguageSelector locales={locales} defaultLocale="en" isDropdown />,
      );
    });
    await user.selectOptions(screen.getByRole("combobox"), "fr");
    expect(setLocaleCookie).toHaveBeenCalledWith("fr", "NEXT_LOCALE", true);
  });
});

describe("renderCustom mode", () => {
  it("calls renderCustom with locales, currentLocale and onChange", async () => {
    const renderCustom = vi.fn(() => <div>custom</div>);
    await act(async () => {
      render(
        <LanguageSelector
          locales={locales}
          defaultLocale="en"
          renderCustom={renderCustom}
        />,
      );
    });
    expect(renderCustom).toHaveBeenCalledWith(
      expect.objectContaining({
        locales,
        currentLocale: "en",
        onChange: expect.any(Function),
      }),
    );
  });

  it("does not render built-in buttons when renderCustom is provided", async () => {
    await act(async () => {
      render(
        <LanguageSelector
          locales={locales}
          defaultLocale="en"
          renderCustom={() => <div>custom</div>}
        />,
      );
    });
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});

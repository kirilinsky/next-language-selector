import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLocaleCookie, setLocaleCookie } from "../utils";

describe("getLocaleCookie", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockCookie = (value: string) =>
    vi.spyOn(document, "cookie", "get").mockReturnValue(value);

  it("reads the locale value", () => {
    mockCookie("NEXT_LOCALE=de");
    expect(getLocaleCookie()).toBe("de");
  });

  it("returns null when the cookie is missing", () => {
    mockCookie("other=1");
    expect(getLocaleCookie()).toBeNull();
  });

  it("parses cookie strings without a space after the separator", () => {
    mockCookie("other=1;NEXT_LOCALE=fr");
    expect(getLocaleCookie()).toBe("fr");
  });

  it("decodes percent-encoded values", () => {
    mockCookie(`NEXT_LOCALE=${encodeURIComponent("pt-BR")}`);
    expect(getLocaleCookie()).toBe("pt-BR");
  });

  it("returns null instead of throwing on malformed percent-encoding", () => {
    mockCookie("NEXT_LOCALE=%E0%A4%A");
    expect(() => getLocaleCookie()).not.toThrow();
    expect(getLocaleCookie()).toBeNull();
  });

  it("keeps = characters inside the value", () => {
    mockCookie("NEXT_LOCALE=abc=def");
    expect(getLocaleCookie()).toBe("abc=def");
  });

  it("reads a custom cookie name", () => {
    mockCookie("MY_LOCALE=fr; NEXT_LOCALE=en");
    expect(getLocaleCookie("MY_LOCALE")).toBe("fr");
  });

  it("does not match a cookie whose name only shares a prefix", () => {
    mockCookie("NEXT_LOCALE_EXT=de; NEXT_LOCALE=en");
    expect(getLocaleCookie()).toBe("en");
  });

  it("returns null when document is undefined (SSR)", () => {
    vi.stubGlobal("document", undefined);
    expect(getLocaleCookie()).toBeNull();
    vi.unstubAllGlobals();
  });
});

describe("setLocaleCookie", () => {
  let writtenCookie = "";
  let reloadSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writtenCookie = "";
    vi.spyOn(document, "cookie", "set").mockImplementation((val) => {
      writtenCookie = val;
    });
    reloadSpy = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadSpy },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  }); 

  it("encodes locale value to prevent cookie injection", () => {
    setLocaleCookie("en; evil=injected", "NEXT_LOCALE", false);
    expect(writtenCookie).toContain("en%3B%20evil%3Dinjected");
    expect(writtenCookie).not.toContain("evil=injected");
  });

  it("encodes cookieName to prevent injection via key", () => {
    setLocaleCookie("en", "HACKED=x; path=/evil", false);
    expect(writtenCookie).toContain("HACKED%3Dx%3B%20path%3D%2Fevil=en");
    expect(writtenCookie).not.toMatch(/path=\/evil/);
  });

  it("includes SameSite=Lax", () => {
    setLocaleCookie("en", "NEXT_LOCALE", false);
    expect(writtenCookie).toContain("SameSite=Lax");
  });

  it("includes path=/", () => {
    setLocaleCookie("en", "NEXT_LOCALE", false);
    expect(writtenCookie).toContain("path=/");
  });

  it("includes max-age for 1 year", () => {
    setLocaleCookie("en", "NEXT_LOCALE", false);
    expect(writtenCookie).toContain("max-age=31536000");
  }); 

  it("calls window.location.reload() when autoReload is true", () => {
    setLocaleCookie("en", "NEXT_LOCALE", true);
    expect(reloadSpy).toHaveBeenCalledOnce();
  });

  it("does not call reload when autoReload is false", () => {
    setLocaleCookie("en", "NEXT_LOCALE", false);
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it("calls reload by default (autoReload defaults to true)", () => {
    setLocaleCookie("en", "NEXT_LOCALE");
    expect(reloadSpy).toHaveBeenCalledOnce();
  });

  it("does nothing when document is undefined (SSR)", () => {
    vi.stubGlobal("document", undefined);
    expect(() => setLocaleCookie("en", "NEXT_LOCALE", false)).not.toThrow();
    vi.unstubAllGlobals();
  }); 

  it("uses NEXT_LOCALE as default cookie name", () => {
    setLocaleCookie("en", undefined, false);
    expect(writtenCookie).toMatch(/^NEXT_LOCALE=en/);
  });
});

describe("setLocaleCookie reload strategies", () => {
  let reload: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    reload = vi.fn();
    vi.stubGlobal("location", { ...window.location, reload });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reloads on the default (legacy true)", () => {
    setLocaleCookie("de", "NEXT_LOCALE");
    expect(reload).toHaveBeenCalledOnce();
  });

  it("reloads on the \"reload\" strategy", () => {
    setLocaleCookie("de", "NEXT_LOCALE", "reload");
    expect(reload).toHaveBeenCalledOnce();
  });

  it("does not reload on the \"none\" strategy", () => {
    setLocaleCookie("de", "NEXT_LOCALE", "none");
    expect(reload).not.toHaveBeenCalled();
  });

  it("does not reload on legacy false", () => {
    setLocaleCookie("de", "NEXT_LOCALE", false);
    expect(reload).not.toHaveBeenCalled();
  });

  it("calls a strategy callback with the locale code instead of reloading", () => {
    const strategy = vi.fn();
    setLocaleCookie("de", "NEXT_LOCALE", strategy);
    expect(strategy).toHaveBeenCalledExactlyOnceWith("de");
    expect(reload).not.toHaveBeenCalled();
  });

  it("still writes the cookie when the strategy is a callback", () => {
    setLocaleCookie("de", "NEXT_LOCALE", () => {});
    expect(document.cookie).toContain("NEXT_LOCALE=de");
  });
});

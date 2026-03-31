import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setLocaleCookie } from "../utils";

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

# Changelog

## 0.5.0

- **Fixed:** the selector no longer renders `null` until mount. It now produces real markup on the server and during hydration, so there is no layout shift, no post-hydration pop-in, and the control exists without JS.
- Added `initialLocale` — pass the cookie value read on the server (`(await cookies()).get("NEXT_LOCALE")?.value`) to paint the correct locale on the first frame. The cookie read on mount still wins afterwards.
- Added `reloadStrategy: "reload" | "none" | (code) => void` so a locale change can hand off to `router.refresh()` instead of doing a full `window.location.reload()` that discards client state, scroll and the router cache. `setLocaleCookie` accepts the same values as its third argument.
- Deprecated `autoReload`. It still works — `autoReload={false}` maps to `reloadStrategy="none"` — and `reloadStrategy` takes precedence when both are set.
- The cookie sync effect no longer re-runs on every render when `locales` is passed as an inline array literal.
- Exported the `ReloadStrategy` type.

## 0.4.1

- Fixed the built-in button and dropdown labels for locales without `flag` so they no longer render a leading space.
- Updated development test dependencies and aligned `esbuild` with Vite's peer range.

## 0.4.0 

- Added optional `onChange(code)` callback — fires on selection before the cookie write/reload; use for analytics or `router.refresh()`.
- `homepage` now points to the live demo (GitHub Pages).

## 0.3.2 

- Fixed crash on malformed percent-encoding in the locale cookie — falls back to `defaultLocale`.
- Fixed cookie parsing when the string has no space after `;`.
- Locale buttons now render with `type="button"` — no accidental form submits.
- CI: typecheck + build in the test workflow, tag-triggered GitHub Releases.

## 0.3.1 and earlier

See [git history](https://github.com/kirilinsky/next-language-selector/commits/main).

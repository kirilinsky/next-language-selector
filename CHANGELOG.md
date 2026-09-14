# Changelog

## 0.6.0

- **Fixed:** the published bundle now starts with `"use client"`. The directive lived in `selector.tsx` and was dropped by the bundler, so importing `LanguageSelector` from a Server Component crashed with `useState only works in Client Components`. The build now fails if the directive is missing.
- **Fixed:** ESM consumers with `moduleResolution: node16` / `nodenext` now get ESM type declarations (`index.d.mts`) instead of CJS ones.
- Added `cookieOptions` (`maxAge`, `path`, `domain`, `sameSite`, `secure`) on the component and as the fourth argument of `setLocaleCookie`. Defaults are unchanged; `SameSite=None` adds `Secure` automatically.
- Added `aria-label`. The button wrapper now has `role="group"`; the label applies to it or to the `<select>`.
- Selecting the already active locale writes the cookie but no longer fires `onChange` or the reload strategy.
- Unknown codes passed to the `renderCustom` `onChange` are ignored. In development the component warns when `defaultLocale`, `initialLocale` or a selected code is not in `locales`.
- Added a `LICENSE` file to the repository and the npm tarball.
- README: the `LocaleSwitch` example now accepts `initialLocale`; documented why cookie + reload does not switch locale under next-intl prefix-based routing.

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

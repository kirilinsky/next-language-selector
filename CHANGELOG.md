# Changelog

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

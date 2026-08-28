# next-language-selector

![npm version](https://img.shields.io/npm/v/next-language-selector?color=3178C6&style=flat-square)
![bundle size](https://img.shields.io/bundlephobia/minzip/next-language-selector?color=black&style=flat-square)
[![codecov](https://codecov.io/gh/kirilinsky/next-language-selector/graph/badge.svg)](https://codecov.io/gh/kirilinsky/next-language-selector)
![security score](https://socket.dev/api/badge/npm/package/next-language-selector?style=flat-square)
![license](https://img.shields.io/npm/l/next-language-selector?color=2E7D32&style=flat-square)

A lightweight, unstyled language selector / locale switcher for Next.js (App Router & Pages Router).  
Manages the `NEXT_LOCALE` cookie and works with `next-intl` or any i18n solution.

**[Live demo →](https://kirilinsky.github.io/next-language-selector/)**

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Styling](#styling)
- [Custom UI](#custom-ui)
- [Dropdown mode](#dropdown-mode)
- [Setup with next-intl](#setup-with-next-intl)
- [Without full reloads](#without-full-reloads)
- [No flash on first paint](#no-flash-on-first-paint)
- [Props](#props)
- [`setLocaleCookie` utility](#setlocalecookie-utility)
- [SSR & hydration](#ssr--hydration)

## Key Features

- **Next.js Native**: Built for the Next.js ecosystem (App Router & Pages Router).
- **Zero Dependencies**: No runtime deps — just React.
- **Unstyled by default**: Bring your own CSS, Tailwind, Shadcn, Radix — no style conflicts.
- **SSR-rendered**: Real markup on the server — no post-hydration pop-in, no layout shift.
- **Cookie-based**: Reads and writes `NEXT_LOCALE` automatically.
- **Secure**: Cookie injection-safe, `SameSite=Lax` out of the box.

## Installation

```bash
pnpm add next-language-selector
# or
npm install next-language-selector
```

## Basic Usage

Drop the component into your Footer or Navbar. It handles cookie sync and state out of the box.

```tsx
import { LanguageSelector } from "next-language-selector";

const locales = [
  { name: "English", code: "en", flag: "🇺🇸" },
  { name: "Deutsch", code: "de", flag: "🇩🇪" },
];

export default function Footer() {
  return (
    <footer>
      <LanguageSelector
        locales={locales}
        defaultLocale="en"
      />
    </footer>
  );
}
```

## Styling

The component is **unstyled by default**. Use `className` / `itemClassName` props or target the `data-active` attribute:

```css
/* Plain CSS */
.lang-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
}

.lang-btn[data-active="true"] {
  opacity: 1;
  font-weight: 600;
  border-bottom: 2px solid currentColor;
}
```

```tsx
<LanguageSelector
  locales={locales}
  defaultLocale="en"
  className="flex gap-2"
  itemClassName="lang-btn"
/>
```

With Tailwind:

```tsx
<LanguageSelector
  locales={locales}
  defaultLocale="en"
  className="flex items-center gap-3"
  itemClassName="text-sm text-gray-400 data-[active=true]:text-black data-[active=true]:font-semibold"
/>
```

## Custom UI

Use the `renderCustom` prop to take full control over rendering while keeping the cookie logic.

```tsx
<LanguageSelector
  locales={locales}
  defaultLocale="en"
  renderCustom={({ locales, currentLocale, onChange }) => (
    <div className="flex gap-4">
      {locales.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={currentLocale === lang.code ? "font-bold" : "opacity-50"}
        >
          {lang.flag} {lang.name}
        </button>
      ))}
    </div>
  )}
/>
```

## Dropdown mode

```tsx
<LanguageSelector
  locales={locales}
  defaultLocale="en"
  isDropdown
  className="border rounded px-2 py-1"
/>
```

## Setup with next-intl

Update your `middleware.ts` to read the cookie set by this component:

```typescript
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware({
  ...routing,
  localeCookie: {
    name: "NEXT_LOCALE",
    path: "/",
    maxAge: 31536000,
  },
});
```

## Without full reloads

By default the page does a full `window.location.reload()` after a locale change so the server picks up the new cookie. That throws away client state, scroll position and the router cache. Use `reloadStrategy` to hand control to the Next.js router instead:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { LanguageSelector } from "next-language-selector";

export function LocaleSwitch() {
  const router = useRouter();
  return (
    <LanguageSelector
      locales={locales}
      defaultLocale="en"
      reloadStrategy={() => router.refresh()}
    />
  );
}
```

`reloadStrategy` accepts:

| Value                    | Behaviour                                                       |
| :----------------------- | :-------------------------------------------------------------- |
| `"reload"` (default)     | Full `window.location.reload()`                                  |
| `"none"`                 | Nothing — the cookie is written, you re-render yourself          |
| `(code: string) => void` | Called with the selected code, e.g. `router.refresh()`           |

The package never imports `next/navigation` itself, so it stays zero-dependency and works in the Pages Router too — pass the callback from your own client component.

`onChange` fires with the selected code before the cookie is written (and before the strategy runs) — handy for analytics.

> `autoReload` is deprecated as of 0.5.0. `autoReload={false}` still works and maps to `reloadStrategy="none"`; `reloadStrategy` wins when both are set.

## No flash on first paint

The selector renders `defaultLocale` on the server and switches to the cookie value after mount. If the visitor's cookie differs, that first paint shows the wrong locale for a frame. Read the cookie server-side and pass it as `initialLocale` to render the right one immediately:

```tsx
// app/layout.tsx — a Server Component
import { cookies } from "next/headers";
import { LocaleSwitch } from "./locale-switch";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const initialLocale = (await cookies()).get("NEXT_LOCALE")?.value;

  return (
    <html>
      <body>
        <LocaleSwitch initialLocale={initialLocale} />
        {children}
      </body>
    </html>
  );
}
```

The cookie read on mount still wins afterwards, so the value stays correct if it changed in another tab.

## Props

| Prop            | Type                     | Default        | Description                                          |
| :-------------- | :----------------------- | :------------- | :--------------------------------------------------- |
| `locales`       | `LocaleConfig[]`         | **Required**   | Array of `{ name, code, flag? }` objects             |
| `defaultLocale` | `string`                 | **Required**   | Fallback locale code                                 |
| `initialLocale` | `string`                 | `defaultLocale`| Locale rendered on the server and during hydration   |
| `isDropdown`    | `boolean`                | `false`        | Render as `<select>` instead of buttons              |
| `reloadStrategy`| `"reload" \| "none" \| (code) => void` | `"reload"` | What happens after the cookie is written |
| `autoReload`    | `boolean`                | `true`         | **Deprecated** — use `reloadStrategy`                 |
| `onChange`      | `(code: string) => void` | -              | Called on selection, before cookie write/reload      |
| `cookieName`    | `string`                 | `NEXT_LOCALE`  | Cookie name to store the selected locale             |
| `className`     | `string`         | -              | CSS class for the wrapper `<div>` or `<select>`      |
| `itemClassName` | `string`         | -              | CSS class for each `<button>` or `<option>`          |
| `renderCustom`  | `Function`       | -              | Render prop for fully custom UI                      |

### `LocaleConfig`

```ts
interface LocaleConfig {
  name: string;   // Display name, e.g. "English"
  code: string;   // Locale code, e.g. "en"
  flag?: string;  // Optional emoji flag, e.g. "🇺🇸"
}
```

## `setLocaleCookie` utility

The cookie writer is exported separately — useful if you want to switch the locale from your own code (a settings page, a keyboard shortcut, etc.) without rendering the component:

```ts
import { setLocaleCookie } from "next-language-selector";

// setLocaleCookie(locale, cookieName?, reloadStrategy?)
setLocaleCookie("de");                             // sets NEXT_LOCALE=de and reloads
setLocaleCookie("de", "MY_LOCALE", "none");        // custom cookie, no reload
setLocaleCookie("de", "NEXT_LOCALE", router.refresh); // hand off to the router
setLocaleCookie("de", "MY_LOCALE", false);         // deprecated boolean form, still works
```

The name and value are URI-encoded (cookie-injection safe), written with `max-age=31536000; path=/; SameSite=Lax`. On the server it is a no-op.

## SSR & hydration

The component renders real markup on the server, using `initialLocale ?? defaultLocale`. The first client render uses the same value, so hydration always matches; the cookie is read in an effect right after mount and updates the active locale if it differs.

Pass [`initialLocale`](#no-flash-on-first-paint) to avoid that one-frame correction entirely. Malformed or unknown cookie values are ignored and the initial locale is kept.

> Before 0.5.0 the component returned `null` until mount, which caused a layout shift and left the selector missing without JS. If you reserved space with CSS to work around that, you can drop it.

Buttons are rendered with `type="button"`, so placing the selector inside a `<form>` won't trigger submits.

## License

MIT

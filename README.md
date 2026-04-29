# next-language-selector

![npm version](https://img.shields.io/npm/v/next-language-selector?color=3178C6&style=flat-square)
![bundle size](https://img.shields.io/bundlephobia/minzip/next-language-selector?color=black&style=flat-square)
[![codecov](https://codecov.io/gh/kirilinsky/next-language-selector/graph/badge.svg)](https://codecov.io/gh/kirilinsky/next-language-selector)
![security score](https://socket.dev/api/badge/npm/package/next-language-selector?style=flat-square)
![license](https://img.shields.io/npm/l/next-language-selector?color=2E7D32&style=flat-square)

A lightweight, unstyled language selector for Next.js (App Router & Pages Router).  
Manages the `NEXT_LOCALE` cookie and works with `next-intl` or any i18n solution.

## Key Features

- **Next.js Native**: Built for the Next.js ecosystem (App Router & Pages Router).
- **Zero Dependencies**: No runtime deps — just React.
- **Unstyled by default**: Bring your own CSS, Tailwind, Shadcn, Radix — no style conflicts.
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

## Props

| Prop            | Type             | Default        | Description                                          |
| :-------------- | :--------------- | :------------- | :--------------------------------------------------- |
| `locales`       | `LocaleConfig[]` | **Required**   | Array of `{ name, code, flag? }` objects             |
| `defaultLocale` | `string`         | **Required**   | Fallback locale code                                 |
| `isDropdown`    | `boolean`        | `false`        | Render as `<select>` instead of buttons              |
| `autoReload`    | `boolean`        | `true`         | Reload page after cookie change                      |
| `cookieName`    | `string`         | `NEXT_LOCALE`  | Cookie name to store the selected locale             |
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

## License

MIT

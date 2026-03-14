# next-language-selector

![npm version](https://img.shields.io/npm/v/next-language-selector?color=3178C6&style=flat-square)
![bundle size](https://img.shields.io/bundlephobia/minzip/next-language-selector?color=black&style=flat-square)
![security score](https://socket.dev/api/badge/npm/package/next-language-selector?style=flat-square)
![license](https://img.shields.io/npm/l/next-language-selector?color=gray&style=flat-square)

A lightweight, configurable language selector for Next.js (App Router & Pages Router).  
Efficiently manages the `NEXT_LOCALE` cookie and works seamlessly with `next-intl` or any other i18n solution.

## Key Features

- 🚀 **Next.js Native**: Built specifically for the Next.js ecosystem.
- 🪶 **Zero Dependencies**: Keeps your bundle size minimal.
- 🎨 **Fully Customizable**: Use built-in styles or your own UI (Shadcn UI, Radix, etc.) via render props.
- 🍪 **Cookie-based**: Automatically syncs with the `NEXT_LOCALE` cookie.

## Installation

```bash
pnpm add next-language-selector
# or
npm install next-language-selector
```

## Basic Usage

Just drop the component into your Footer or Navbar. It handles cookie updates and local state out of the box.

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
        activeColor="#3b82f6" // optional
        isDropdown={false} // Renders as a list of buttons
      />
    </footer>
  );
}
```

## Custom UI (e.g., Shadcn UI / Headless)

Use the `renderCustom` prop to take full control over the rendering while keeping the cookie management logic.

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
          className={
            currentLocale === lang.code
              ? "text-blue-600 font-bold"
              : "text-gray-500"
          }
        >
          {lang.flag} {lang.name}
        </button>
      ))}
    </div>
  )}
/>
```

## Setup with next-intl (Middleware)

To make sure Next.js detects the language from the cookie set by this component, update your `middleware.ts` or `proxy.ts`:

```typescript
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware({
  ...routing,
  localeCookie: {
    name: "NEXT_LOCALE",
    path: "/",
    maxAge: 31536000, // 1 year
  },
});
```

## Props

| Prop            | Type             | Default       | Description                                                 |
| :-------------- | :--------------- | :------------ | :---------------------------------------------------------- |
| `locales`       | `LocaleConfig[]` | **Required**  | Array of `{ name, code, flag }` objects                     |
| `defaultLocale` | `string`         | **Required**  | Initial language code                                       |
| `isDropdown`    | `boolean`        | `false`       | Toggle between `<select>` and a list of buttons             |
| `autoReload`    | `boolean`        | `true`        | Trigger reload on cookie change                             |
| `cookieName`    | `string`         | `NEXT_LOCALE` | Name of the cookie to store the selected language           |
| `activeColor`   | `string`         | `red`         | Underline color for the active language (non-dropdown mode) |
| `className`     | `string`         | -             | CSS class for the wrapper element                           |
| `renderCustom`  | `Function`       | -             | Render prop for custom UI logic                             |

## License

MIT

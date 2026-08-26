# GaMegaMenu Default Theme And Font Size Design

## Goal

Allow consumers to configure the first-level menu font size while ensuring that GaMegaMenu always renders with a complete default visual theme when `theme` is omitted or only partially provided.

## API

Add `menuFontSize?: string | number` to `GaMegaMenuTheme`.

- Numeric values are formatted as pixels.
- String values are passed through, allowing values such as `1rem` or `18px`.
- The option controls only `.ga-mega-menu__nav-item`; panel item typography remains unchanged.

## Theme Resolution

Define an internal `defaultTheme: Required<GaMegaMenuTheme>` containing the component's current fallback colors, spacing, radii, icon size, and a `menuFontSize` value of `20px`.

Resolve the active theme with:

```ts
const currentTheme = computed<Required<GaMegaMenuTheme>>(() => ({
  ...defaultTheme,
  ...props.theme,
}))
```

This keeps the default appearance when no theme is provided and preserves unspecified defaults when a partial theme is provided.

## Styling

Map `currentTheme.menuFontSize` to `--ga-mega-menu-font-size` and use that variable for the first-level menu button font size. Keep the CSS fallback as a secondary guard.

## Verification

- Verify the component emits complete default CSS variables without a supplied theme.
- Verify a partial theme retains defaults and overrides `menuFontSize`.
- Verify both numeric and string sizes are formatted correctly.
- Update the Playground theme examples so the option is visible in use.


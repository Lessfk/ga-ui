# GaMegaMenu Label-Only Alignment Design

## Goal

Vertically center panel item content when `description` is missing, empty, or contains only whitespace, while preserving the current top-aligned layout for items with descriptions.

## Design

- Treat `Boolean(item.description?.trim())` as the description presence check.
- Add `is-label-only` to `.ga-mega-menu__item` when no meaningful description exists.
- Render the description only when the same presence check succeeds.
- Set `align-items: center` for label-only items so the icon and label content are vertically centered while text remains left-aligned.
- Keep the existing `align-items: flex-start` rule for items with descriptions.

## Verification

- Test missing, empty, whitespace-only, and non-empty descriptions.
- Add a label-only item to the Playground demo and inspect its computed alignment.


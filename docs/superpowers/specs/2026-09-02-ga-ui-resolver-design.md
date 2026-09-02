# GaUiResolver Design

## Goal

Provide a public `GaUiResolver` for `unplugin-vue-components` so consumers can auto-import GA UI components and automatically include the Element Plus styles used inside those components.

The resolver must support two consumer setups:

1. Element Plus on-demand styles: GA component dependencies are injected automatically.
2. Full Element Plus stylesheet: consumers can disable Element Plus style injection to avoid duplicate rules.

## Public API

The resolver is exported from `ga-ui-plus/resolver`.

```ts
export interface GaUiResolverOptions {
  importStyle?: boolean
  elementPlusStyle?: boolean
}

export function GaUiResolver(options?: GaUiResolverOptions): ComponentResolver
```

Defaults:

- `importStyle: true`
- `elementPlusStyle: true`

`importStyle` controls `ga-ui-plus/style.css`. `elementPlusStyle` controls the Element Plus component style side effects.

The package defines a small structurally compatible resolver type locally. It does not add `unplugin-vue-components` as a runtime dependency.

## Resolution Rules

Only known public GA component names are resolved. Unknown names return `undefined`.

| Component | Import entry | Element Plus styles |
| --- | --- | --- |
| `GaDialog` | `ga-ui-plus/base` | `dialog` |
| `GaMegaMenu` | `ga-ui-plus/base` | `scrollbar` |
| `GaPagination` | `ga-ui-plus/base` | `pagination` |
| `GaTable` | `ga-ui-plus/base` | `table`, `table-column`, `empty`, `loading` |
| `GaAsideMenu` | `ga-ui-plus/business` | `aside`, `menu`, `scrollbar` |
| `GaSearchBar` | `ga-ui-plus/business` | `form`, `form-item`, `row`, `col`, `button`, `input`, `select`, `option`, `date-picker` |
| `GaTablePagination` | `ga-ui-plus/business` | union of `GaTable` and `GaPagination` dependencies |

Each Element Plus dependency is emitted as:

```text
element-plus/es/components/<component>/style/css
```

Repeated paths are deduplicated before returning `sideEffects`.

## Consumer Usage

On-demand Element Plus styles:

```ts
Components({
  resolvers: [
    ElementPlusResolver(),
    GaUiResolver(),
  ],
})
```

`ElementPlusResolver` handles Element Plus components present in consumer templates. `GaUiResolver` handles GA components and their internal Element Plus dependencies.

Full Element Plus stylesheet:

```ts
import 'element-plus/dist/index.css'

Components({
  resolvers: [
    GaUiResolver({ elementPlusStyle: false }),
  ],
})
```

Manual GA component imports do not invoke an `unplugin-vue-components` resolver. Those consumers must import `ga-ui-plus/style.css` and manage Element Plus styles themselves.

## Packaging

Add `src/resolver/index.ts` as an independent Vite library entry and expose it through package exports as `./resolver` with JavaScript and declaration files.

Build and export verification scripts must validate the new entry without changing the existing root, base, or business component boundaries.

## Testing

Resolver unit tests cover:

- base and business component import entries;
- default GA and Element Plus side effects;
- disabling GA styles;
- disabling Element Plus styles;
- unknown component names;
- deduplication for composite components.

Build verification covers the published `ga-ui-plus/resolver` export. Playground verification covers on-demand mode and confirms an internal selector such as `.el-scrollbar` is present without importing `element-plus/dist/index.css`.

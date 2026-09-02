# GaUiResolver Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a published `GaUiResolver` that auto-imports GA components and optionally injects their GA UI and internal Element Plus styles.

**Architecture:** A standalone resolver entry owns a static map from each public `Ga*` component to its package barrel and direct Element Plus style dependencies. It returns an `unplugin-vue-components` compatible object without taking a runtime dependency on that plugin. Package exports, build verification, playground configuration, and documentation expose and validate both on-demand and full Element Plus CSS modes.

**Tech Stack:** TypeScript, Vue 3, Vite library mode, Vitest, unplugin-vue-components, pnpm.

---

## File Structure

- Create `packages/ui/src/resolver/index.ts`: public resolver API, component map, and side-effect generation.
- Create `packages/ui/src/resolver/__tests__/resolver.spec.ts`: unit contract for all mappings and options.
- Modify `packages/ui/vite.config.ts`: add the resolver library entry.
- Modify `packages/ui/package.json`: publish `ga-ui-plus/resolver`.
- Modify `packages/ui/scripts/verify-build.mjs`: verify resolver build files and runtime exports.
- Modify `packages/ui/scripts/verify-exports.mjs`: verify package self-reference import.
- Modify `packages/ui/scripts/fixtures/node-next-consumer/index.ts`: verify published resolver declarations under NodeNext.
- Modify `packages/ui/README.md`: document automatic on-demand and full-style modes.
- Modify `playground/vite.config.ts`: exercise the workspace resolver with the existing Element Plus on-demand setup.

### Task 1: Define Resolver Behavior With Tests

**Files:**
- Create: `packages/ui/src/resolver/__tests__/resolver.spec.ts`
- Create: `packages/ui/src/resolver/index.ts`

- [ ] **Step 1: Write the failing resolver tests**

```ts
import { describe, expect, it } from 'vitest'

import { GaUiResolver } from '../index'

describe('GaUiResolver', () => {
  it.each([
    ['GaDialog', 'ga-ui-plus/base', ['dialog']],
    ['GaMegaMenu', 'ga-ui-plus/base', ['scrollbar']],
    ['GaPagination', 'ga-ui-plus/base', ['pagination']],
    [
      'GaTable',
      'ga-ui-plus/base',
      ['table', 'table-column', 'empty', 'loading'],
    ],
    [
      'GaAsideMenu',
      'ga-ui-plus/business',
      ['aside', 'menu', 'scrollbar'],
    ],
    [
      'GaSearchBar',
      'ga-ui-plus/business',
      [
        'form',
        'form-item',
        'row',
        'col',
        'button',
        'input',
        'select',
        'option',
        'date-picker',
      ],
    ],
    [
      'GaTablePagination',
      'ga-ui-plus/business',
      ['table', 'table-column', 'empty', 'loading', 'pagination'],
    ],
  ])('resolves %s with its default style dependencies', (name, from, styles) => {
    const result = GaUiResolver().resolve(name)

    expect(result).toEqual({
      name,
      from,
      sideEffects: [
        'ga-ui-plus/style.css',
        ...styles.map(
          (style) => `element-plus/es/components/${style}/style/css`,
        ),
      ],
    })
  })

  it('can disable the GA UI stylesheet', () => {
    expect(
      GaUiResolver({ importStyle: false }).resolve('GaMegaMenu'),
    ).toEqual({
      name: 'GaMegaMenu',
      from: 'ga-ui-plus/base',
      sideEffects: [
        'element-plus/es/components/scrollbar/style/css',
      ],
    })
  })

  it('can disable Element Plus styles for full stylesheet consumers', () => {
    expect(
      GaUiResolver({ elementPlusStyle: false }).resolve('GaMegaMenu'),
    ).toEqual({
      name: 'GaMegaMenu',
      from: 'ga-ui-plus/base',
      sideEffects: ['ga-ui-plus/style.css'],
    })
  })

  it('omits sideEffects when both style options are disabled', () => {
    expect(
      GaUiResolver({
        importStyle: false,
        elementPlusStyle: false,
      }).resolve('GaMegaMenu'),
    ).toEqual({
      name: 'GaMegaMenu',
      from: 'ga-ui-plus/base',
    })
  })

  it('does not resolve unknown components', () => {
    expect(GaUiResolver().resolve('GaUnknown')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
pnpm --filter ga-ui-plus exec vitest run src/resolver/__tests__/resolver.spec.ts
```

Expected: FAIL because `../index` does not exist.

- [ ] **Step 3: Implement the minimal resolver**

```ts
export interface GaUiResolverOptions {
  importStyle?: boolean
  elementPlusStyle?: boolean
}

export interface GaUiResolverComponentInfo {
  name: string
  from: string
  sideEffects?: string[]
}

export interface GaUiComponentResolver {
  type: 'component'
  resolve: (name: string) => GaUiResolverComponentInfo | undefined
}

interface GaUiComponentDefinition {
  from: 'ga-ui-plus/base' | 'ga-ui-plus/business'
  elementPlusStyles: readonly string[]
}

const componentDefinitions: Record<string, GaUiComponentDefinition> = {
  GaDialog: {
    from: 'ga-ui-plus/base',
    elementPlusStyles: ['dialog'],
  },
  GaMegaMenu: {
    from: 'ga-ui-plus/base',
    elementPlusStyles: ['scrollbar'],
  },
  GaPagination: {
    from: 'ga-ui-plus/base',
    elementPlusStyles: ['pagination'],
  },
  GaTable: {
    from: 'ga-ui-plus/base',
    elementPlusStyles: ['table', 'table-column', 'empty', 'loading'],
  },
  GaAsideMenu: {
    from: 'ga-ui-plus/business',
    elementPlusStyles: ['aside', 'menu', 'scrollbar'],
  },
  GaSearchBar: {
    from: 'ga-ui-plus/business',
    elementPlusStyles: [
      'form',
      'form-item',
      'row',
      'col',
      'button',
      'input',
      'select',
      'option',
      'date-picker',
    ],
  },
  GaTablePagination: {
    from: 'ga-ui-plus/business',
    elementPlusStyles: [
      'table',
      'table-column',
      'empty',
      'loading',
      'pagination',
    ],
  },
}

const elementPlusStylePath = (component: string) =>
  `element-plus/es/components/${component}/style/css`

export function GaUiResolver(
  options: GaUiResolverOptions = {},
): GaUiComponentResolver {
  const importStyle = options.importStyle ?? true
  const elementPlusStyle = options.elementPlusStyle ?? true

  return {
    type: 'component',
    resolve(name) {
      const definition = componentDefinitions[name]
      if (!definition) return undefined

      const sideEffects = [
        ...(importStyle ? ['ga-ui-plus/style.css'] : []),
        ...(elementPlusStyle
          ? definition.elementPlusStyles.map(elementPlusStylePath)
          : []),
      ]

      return {
        name,
        from: definition.from,
        ...(sideEffects.length > 0 ? { sideEffects } : {}),
      }
    },
  }
}
```

- [ ] **Step 4: Run the resolver tests and verify GREEN**

Run:

```bash
pnpm --filter ga-ui-plus exec vitest run src/resolver/__tests__/resolver.spec.ts
```

Expected: all resolver tests PASS.

- [ ] **Step 5: Commit resolver behavior**

```bash
git add packages/ui/src/resolver
git commit -m "feat: add ga ui component resolver"
```

### Task 2: Publish the Resolver Entry

**Files:**
- Modify: `packages/ui/vite.config.ts`
- Modify: `packages/ui/package.json`
- Modify: `packages/ui/scripts/verify-build.mjs`
- Modify: `packages/ui/scripts/verify-exports.mjs`
- Modify: `packages/ui/scripts/fixtures/node-next-consumer/index.ts`

- [ ] **Step 1: Extend verification before changing package entries**

Add `resolver/index.js` and `resolver/index.d.ts` to `requiredFiles` in `verify-build.mjs`, import the built resolver, and assert:

```js
assert.deepEqual(Object.keys(resolver).sort(), ['GaUiResolver'])
assert.equal(typeof resolver.GaUiResolver, 'function')
```

In `verify-exports.mjs`, add:

```js
const resolver = await import('ga-ui-plus/resolver')
assert.equal(typeof resolver.GaUiResolver, 'function')
```

In the NodeNext fixture, add:

```ts
import {
  GaUiResolver,
  type GaUiResolverOptions,
} from 'ga-ui-plus/resolver'

const resolverOptions: GaUiResolverOptions = {
  importStyle: true,
  elementPlusStyle: true,
}
const resolver = GaUiResolver(resolverOptions)
const resolvedMegaMenu = resolver.resolve('GaMegaMenu')

void resolver
void resolvedMegaMenu
```

- [ ] **Step 2: Run build verification and confirm RED**

Run:

```bash
pnpm --filter ga-ui-plus run build
```

Expected: FAIL because the resolver build files and package export do not exist.

- [ ] **Step 3: Add the Vite library entry and package export**

Add to `packages/ui/vite.config.ts` library entries:

```ts
'resolver/index': resolveFile('./src/resolver/index.ts'),
```

Add to `packages/ui/package.json` exports:

```json
"./resolver": {
  "types": "./dist/resolver/index.d.ts",
  "import": "./dist/resolver/index.js",
  "default": "./dist/resolver/index.js"
}
```

- [ ] **Step 4: Build and verify GREEN**

Run:

```bash
pnpm --filter ga-ui-plus run build
pnpm --filter ga-ui-plus run verify:exports
```

Expected: both commands exit with code 0 and verify the resolver runtime and declaration entry.

- [ ] **Step 5: Commit the published entry**

```bash
git add packages/ui/vite.config.ts packages/ui/package.json packages/ui/scripts
git commit -m "build: publish ga ui resolver entry"
```

### Task 3: Document and Exercise On-Demand Usage

**Files:**
- Modify: `packages/ui/README.md`
- Modify: `playground/vite.config.ts`

- [ ] **Step 1: Add resolver usage documentation**

Replace the single full-style recommendation with two sections. The on-demand example must include:

```ts
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { GaUiResolver } from 'ga-ui-plus/resolver'

Components({
  resolvers: [
    ElementPlusResolver(),
    GaUiResolver(),
  ],
})
```

The full-style example must include:

```ts
import 'element-plus/dist/index.css'

GaUiResolver({
  elementPlusStyle: false,
})
```

Document that manual GA imports do not invoke the resolver and require an explicit `ga-ui-plus/style.css` import.

- [ ] **Step 2: Configure the playground resolver without replacing user changes**

Add the workspace source alias before the existing root alias:

```ts
{
  find: /^ga-ui-plus\/resolver$/,
  replacement: resolveWorkspaceFile(
    '../packages/ui/src/resolver/index.ts',
  ),
},
```

Import and register the resolver:

```ts
import { GaUiResolver } from 'ga-ui-plus/resolver'

Components({
  resolvers: [ElementPlusResolver(), GaUiResolver()],
})
```

Keep `AutoImport` limited to `ElementPlusResolver()` because `GaUiResolver` resolves components, not composable APIs.

- [ ] **Step 3: Build the playground**

Run:

```bash
pnpm --dir playground run build
```

Expected: exit code 0 with no unresolved `ga-ui-plus/resolver` or style imports.

- [ ] **Step 4: Confirm the internal Element Plus style was emitted**

Run:

```powershell
rg -n "\.el-scrollbar" playground/dist/assets/*.css
```

Expected: at least one `.el-scrollbar` selector even though `playground/src/main.ts` does not import `element-plus/dist/index.css`.

- [ ] **Step 5: Commit playground and documentation changes**

```bash
git add packages/ui/README.md playground/vite.config.ts
git commit -m "docs: add ga ui resolver usage"
```

### Task 4: Complete Regression and Publish Verification

**Files:**
- Verify only; do not modify unrelated dirty playground files.

- [ ] **Step 1: Run the complete UI test suite**

Run:

```bash
pnpm --filter ga-ui-plus run test
```

Expected: type tests and all Vitest suites PASS.

- [ ] **Step 2: Run package build and export verification**

Run:

```bash
pnpm --filter ga-ui-plus run build
pnpm --filter ga-ui-plus run verify:exports
```

Expected: both commands exit with code 0.

- [ ] **Step 3: Verify the npm package contents**

Run:

```bash
pnpm --filter ga-ui-plus publish --dry-run --no-git-checks
```

Expected: the tarball listing contains `dist/resolver/index.js`, `dist/resolver/index.d.ts`, and `dist/style.css`, and the dry run exits successfully without publishing.

- [ ] **Step 4: Review the final diff**

Run:

```bash
git status --short
git diff --check
```

Expected: no whitespace errors. Existing user-owned playground changes remain present and are not reverted or included in resolver-only commits unless explicitly modified by this plan.

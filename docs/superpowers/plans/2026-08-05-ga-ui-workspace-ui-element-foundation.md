# GA UI Workspace and UI Element Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working GA UI milestone: a pnpm workspace, shared Vite Library Mode configuration, a minimal `@ga/ui-core`, a tested `@ga/ui-element`, automatic component resolution, and a Vite playground that consumes the built packages.

**Architecture:** `@ga/ui-core` owns Vue installation helpers and Element Plus-independent primitives. `@ga/ui-element` depends on `@ga/ui-core`, keeps Vue and Element Plus external, emits ESM plus declaration files, and compiles aggregate and per-component SCSS as separate CSS artifacts. The first playground is generated with create-vite and validates automatic import against actual package build output.

**Tech Stack:** pnpm 10, Vite Library Mode, Vue 3, TypeScript, Element Plus, SCSS, Vitest, Vue Test Utils, vite-plugin-dts, unplugin-vue-components

---

## Scope

This is the first independently testable implementation slice from the approved design. It includes:

- Workspace and Git foundation.
- Shared build configuration.
- Minimal `@ga/ui-core` package.
- Minimal `@ga/ui-element` package with one valuable wrapper component.
- Automatic-import Resolver.
- One create-vite Playground for automatic-import verification.
- Local `.tgz` packaging smoke checks.

Separate plans should implement `@ga/ui-business` adapters, Storybook, lint/style quality gates, Changesets, the remaining Playground modes, and Registry publishing.

## File Map

### Workspace files

- Modify: `package.json` — root metadata and workspace scripts.
- Modify: `pnpm-workspace.yaml` — workspace package globs.
- Modify: `tsconfig.base.json` — shared compiler options and source aliases.
- Modify: `.gitignore` — generated artifacts.
- Create: `vitest.config.ts` — workspace component-test configuration.
- Create: `README.md` — development and consumption instructions.

### Shared build package

- Create: `packages/build-config/package.json` — private workspace package metadata.
- Create: `packages/build-config/tsconfig.json` — build-config TypeScript settings.
- Create: `packages/build-config/src/index.ts` — Vite Library Mode factory.
- Create: `packages/build-config/src/index.spec.ts` — configuration behavior test.
- Create: `packages/build-config/scripts/build-styles.mjs` — aggregate and component CSS compiler.

### Core package

- Create: `packages/ui-core/package.json` — public package metadata and exports.
- Create: `packages/ui-core/tsconfig.json` — package compiler settings.
- Create: `packages/ui-core/vite.config.ts` — core library entries and externals.
- Create: `packages/ui-core/src/utils/with-install.ts` — component/plugin installers.
- Create: `packages/ui-core/src/components/ga-visually-hidden/src/visually-hidden.vue` — Element Plus-independent primitive.
- Create: `packages/ui-core/src/components/ga-visually-hidden/style/index.scss` — isolated accessibility styles.
- Create: `packages/ui-core/src/components/ga-visually-hidden/index.ts` — component install/export entry.
- Create: `packages/ui-core/src/components/ga-visually-hidden/__tests__/visually-hidden.spec.ts` — behavior and install tests.
- Create: `packages/ui-core/src/style/index.scss` — aggregate core style entry.
- Create: `packages/ui-core/src/index.ts` — package exports and full-install plugin.

### Element wrapper package

- Create: `packages/ui-element/package.json` — public package metadata and exports.
- Create: `packages/ui-element/tsconfig.json` — package compiler settings.
- Create: `packages/ui-element/vite.config.ts` — multi-entry library build.
- Create: `packages/ui-element/src/components/ga-async-button/src/async-button.vue` — duplicate-submit-safe Element Plus wrapper.
- Create: `packages/ui-element/src/components/ga-async-button/src/props.ts` — public Props and Emits types.
- Create: `packages/ui-element/src/components/ga-async-button/style/index.scss` — scoped wrapper style.
- Create: `packages/ui-element/src/components/ga-async-button/index.ts` — install/export entry.
- Create: `packages/ui-element/src/components/ga-async-button/__tests__/async-button.spec.ts` — async interaction tests.
- Create: `packages/ui-element/src/resolver/index.ts` — automatic-import Resolver.
- Create: `packages/ui-element/src/resolver/index.spec.ts` — Resolver mapping tests.
- Create: `packages/ui-element/src/style/index.scss` — aggregate element-wrapper style entry.
- Create: `packages/ui-element/src/index.ts` — package exports and full-install plugin.

### Playground

- Create with create-vite: `playground/auto-import/` — Vue 3 + TypeScript Vite application.
- Modify: `playground/auto-import/package.json` — workspace package metadata and dependencies.
- Modify: `playground/auto-import/vite.config.ts` — GA Resolver registration.
- Modify: `playground/auto-import/src/main.ts` — Element Plus base setup.
- Modify: `playground/auto-import/src/App.vue` — no-import `GaAsyncButton` demonstration.
- Modify: `playground/auto-import/src/style.css` — minimal page presentation.

### Packaging

- Create: `artifacts/.gitkeep` — local package output directory marker.

---

### Task 1: Initialize Git and Normalize the Workspace Root

**Files:**
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `tsconfig.base.json`
- Modify: `.gitignore`

- [ ] **Step 1: Confirm the current directory is not a Git repository**

Run:

```powershell
git status --short --branch
```

Expected: FAIL with `fatal: not a git repository`.

- [ ] **Step 2: Initialize the repository**

Run:

```powershell
git init
```

Expected: a new `.git` directory under `D:\ga-ui`.

- [ ] **Step 3: Replace the root package metadata**

Set `package.json` to:

```json
{
  "name": "ga-ui-workspace",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.34.5",
  "scripts": {
    "build": "pnpm -r --sort --if-present run build",
    "typecheck": "pnpm -r --sort --if-present run typecheck",
    "test": "vitest run",
    "test:watch": "vitest",
    "dev": "pnpm run build && pnpm --filter @ga/playground-auto-import dev"
  }
}
```

- [ ] **Step 4: Normalize workspace package discovery**

Set `pnpm-workspace.yaml` to:

```yaml
packages:
  - packages/*
  - playground/*
```

- [ ] **Step 5: Add shared TypeScript aliases**

Set `tsconfig.base.json` to:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@ga/ui-core": ["packages/ui-core/src/index.ts"],
      "@ga/ui-element": ["packages/ui-element/src/index.ts"],
      "@ga/ui-element/resolver": ["packages/ui-element/src/resolver/index.ts"]
    },
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

- [ ] **Step 6: Ignore generated files**

Set `.gitignore` to:

```gitignore
node_modules/
dist/
coverage/
storybook-static/
artifacts/*.tgz
playground/**/src/components.d.ts
.vite/
.DS_Store
*.log
```

- [ ] **Step 7: Commit the normalized root**

Run:

```powershell
git add package.json pnpm-workspace.yaml tsconfig.base.json .gitignore docs
git commit -m "chore: initialize ga ui workspace"
```

Expected: one root commit containing the approved design and this implementation plan.

---

### Task 2: Install the Foundation Toolchain and Configure Vitest

**Files:**
- Modify: `package.json`
- Create: `pnpm-lock.yaml`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install root development dependencies**

Run:

```powershell
pnpm.cmd add -Dw vue@^3.5.0 @vue/compiler-sfc@^3.5.0 element-plus@^2.11.0 typescript@^5.9.0 @types/node@^24.0.0 vite@^7.0.0 @vitejs/plugin-vue@^6.0.0 vite-plugin-dts@^4.5.0 vue-tsc@^3.0.0 vitest@^3.2.0 jsdom@^26.1.0 @vue/test-utils@^2.4.6 sass@^1.89.0 unplugin-vue-components@^28.0.0
```

Expected: dependencies are added to root `devDependencies` and `pnpm-lock.yaml` is created.

- [ ] **Step 2: Create the workspace Vitest configuration**

Create `vitest.config.ts`:

```ts
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@ga/ui-core': fileURLToPath(
        new URL('./packages/ui-core/src/index.ts', import.meta.url),
      ),
      '@ga/ui-element/resolver': fileURLToPath(
        new URL('./packages/ui-element/src/resolver/index.ts', import.meta.url),
      ),
      '@ga/ui-element': fileURLToPath(
        new URL('./packages/ui-element/src/index.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['packages/**/*.spec.ts'],
    clearMocks: true,
  },
})
```

- [ ] **Step 3: Verify the tools can start**

Run:

```powershell
pnpm.cmd exec vite --version
pnpm.cmd exec vitest --version
pnpm.cmd exec vue-tsc --version
```

Expected: all three commands print versions and exit successfully.

- [ ] **Step 4: Commit the toolchain**

Run:

```powershell
git add package.json pnpm-lock.yaml vitest.config.ts
git commit -m "chore: add vue library toolchain"
```

---

### Task 3: Build the Shared Vite Library Configuration

**Files:**
- Create: `packages/build-config/package.json`
- Create: `packages/build-config/tsconfig.json`
- Create: `packages/build-config/src/index.spec.ts`
- Create: `packages/build-config/src/index.ts`
- Create: `packages/build-config/scripts/build-styles.mjs`

- [ ] **Step 1: Create private package metadata**

Create `packages/build-config/package.json`:

```json
{
  "name": "@ga/build-config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.0",
    "vite": "^7.0.0",
    "vite-plugin-dts": "^4.5.0"
  }
}
```

Create `packages/build-config/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["node"],
    "noEmit": true
  },
  "include": ["src/**/*.ts"]
}
```

Run:

```powershell
pnpm.cmd install
```

Expected: the private workspace package is linked successfully.

- [ ] **Step 2: Write the failing configuration test**

Create `packages/build-config/src/index.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { createLibraryConfig } from './index'

describe('createLibraryConfig', () => {
  it('creates ESM entries and externalizes package subpaths', () => {
    const config = createLibraryConfig({
      root: 'D:/virtual-package',
      entries: {
        index: 'src/index.ts',
        'resolver/index': 'src/resolver/index.ts',
      },
      external: ['vue', 'element-plus'],
    })

    const external = config.build?.rollupOptions?.external

    expect(config.build?.lib).toMatchObject({ formats: ['es'] })
    expect(typeof external).toBe('function')
    expect((external as (id: string) => boolean)('vue')).toBe(true)
    expect((external as (id: string) => boolean)('element-plus/es')).toBe(true)
    expect((external as (id: string) => boolean)('./local-module')).toBe(false)
  })
})
```

- [ ] **Step 3: Run the test and verify the missing implementation failure**

Run:

```powershell
pnpm.cmd test -- packages/build-config/src/index.spec.ts
```

Expected: FAIL because `packages/build-config/src/index.ts` does not exist.

- [ ] **Step 4: Implement the Vite configuration factory**

Create `packages/build-config/src/index.ts`:

```ts
import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig, type UserConfig } from 'vite'
import dts from 'vite-plugin-dts'

export interface LibraryConfigOptions {
  root?: string
  entries: Record<string, string>
  external: string[]
}

export function createLibraryConfig({
  root = process.cwd(),
  entries,
  external,
}: LibraryConfigOptions): UserConfig {
  const resolvedEntries = Object.fromEntries(
    Object.entries(entries).map(([name, entry]) => [name, resolve(root, entry)]),
  )

  const isExternal = (id: string) =>
    external.some((packageName) =>
      id === packageName || id.startsWith(`${packageName}/`),
    )

  return defineConfig({
    plugins: [
      vue(),
      dts({
        entryRoot: resolve(root, 'src'),
        outDir: resolve(root, 'dist'),
        tsconfigPath: resolve(root, 'tsconfig.json'),
      }),
    ],
    build: {
      lib: {
        entry: resolvedEntries,
        formats: ['es'],
      },
      sourcemap: true,
      emptyOutDir: true,
      copyPublicDir: false,
      rollupOptions: {
        external: isExternal,
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name][extname]',
        },
      },
    },
  })
}
```

- [ ] **Step 5: Run the configuration test**

Run:

```powershell
pnpm.cmd test -- packages/build-config/src/index.spec.ts
```

Expected: PASS with one passing test.

- [ ] **Step 6: Implement the shared SCSS build script**

Create `packages/build-config/scripts/build-styles.mjs`:

```js
import {
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, join } from 'node:path'

import { compile } from 'sass'

const root = process.cwd()

function compileFile(source, target) {
  if (!existsSync(source)) return

  const result = compile(source, {
    style: 'expanded',
    sourceMap: true,
  })
  const mapTarget = `${target}.map`
  const css = `${result.css}\n/*# sourceMappingURL=${basename(mapTarget)} */\n`

  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, css)
  writeFileSync(mapTarget, JSON.stringify(result.sourceMap))
}

compileFile(
  join(root, 'src/style/index.scss'),
  join(root, 'dist/style.css'),
)

const componentsRoot = join(root, 'src/components')

if (existsSync(componentsRoot)) {
  for (const entry of readdirSync(componentsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue

    compileFile(
      join(componentsRoot, entry.name, 'style/index.scss'),
      join(root, 'dist/components', entry.name, 'style.css'),
    )
  }
}
```

- [ ] **Step 7: Commit the shared build configuration**

Run:

```powershell
git add packages/build-config pnpm-lock.yaml
git commit -m "build: add shared vite library config"
```

---

### Task 4: Create `@ga/ui-core` with an Element Plus-Independent Primitive

**Files:**
- Create: `packages/ui-core/package.json`
- Create: `packages/ui-core/tsconfig.json`
- Create: `packages/ui-core/vite.config.ts`
- Create: `packages/ui-core/src/components/ga-visually-hidden/__tests__/visually-hidden.spec.ts`
- Create: `packages/ui-core/src/utils/with-install.ts`
- Create: `packages/ui-core/src/components/ga-visually-hidden/src/visually-hidden.vue`
- Create: `packages/ui-core/src/components/ga-visually-hidden/style/index.scss`
- Create: `packages/ui-core/src/components/ga-visually-hidden/index.ts`
- Create: `packages/ui-core/src/style/index.scss`
- Create: `packages/ui-core/src/index.ts`

- [ ] **Step 1: Create package and build metadata**

Create `packages/ui-core/package.json`:

```json
{
  "name": "@ga/ui-core",
  "version": "0.1.0",
  "type": "module",
  "files": ["dist", "README.md"],
  "sideEffects": ["**/*.css"],
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./style.css": "./dist/style.css",
    "./components/ga-visually-hidden": {
      "types": "./dist/components/ga-visually-hidden/index.d.ts",
      "import": "./dist/components/ga-visually-hidden/index.js"
    },
    "./components/ga-visually-hidden/style.css": "./dist/components/ga-visually-hidden/style.css"
  },
  "scripts": {
    "build": "vite build && node ../build-config/scripts/build-styles.mjs",
    "typecheck": "vue-tsc --noEmit -p tsconfig.json"
  },
  "peerDependencies": {
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@ga/build-config": "workspace:*"
  }
}
```

Create `packages/ui-core/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist"
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "exclude": ["src/**/*.spec.ts", "src/**/__tests__/**"]
}
```

Create `packages/ui-core/vite.config.ts`:

```ts
import { createLibraryConfig } from '@ga/build-config'

export default createLibraryConfig({
  entries: {
    index: 'src/index.ts',
    'components/ga-visually-hidden/index':
      'src/components/ga-visually-hidden/index.ts',
  },
  external: ['vue'],
})
```

Run:

```powershell
pnpm.cmd install
```

- [ ] **Step 2: Write the failing primitive and installer tests**

Create `packages/ui-core/src/components/ga-visually-hidden/__tests__/visually-hidden.spec.ts`:

```ts
import type { App } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { GaVisuallyHidden } from '../index'

describe('GaVisuallyHidden', () => {
  it('renders slot content inside the accessibility class', () => {
    const wrapper = mount(GaVisuallyHidden, {
      slots: { default: '辅助说明' },
    })

    expect(wrapper.text()).toBe('辅助说明')
    expect(wrapper.classes()).toContain('ga-visually-hidden')
  })

  it('registers itself through its install method', () => {
    const component = vi.fn()
    const app = { component } as unknown as App

    GaVisuallyHidden.install?.(app)

    expect(component).toHaveBeenCalledWith(
      'GaVisuallyHidden',
      expect.anything(),
    )
  })
})
```

- [ ] **Step 3: Run the core test and verify it fails**

Run:

```powershell
pnpm.cmd test -- packages/ui-core/src/components/ga-visually-hidden/__tests__/visually-hidden.spec.ts
```

Expected: FAIL because `../index` does not exist.

- [ ] **Step 4: Implement reusable Vue installers**

Create `packages/ui-core/src/utils/with-install.ts`:

```ts
import type { App, Component, Plugin } from 'vue'

export type SFCWithInstall<T extends Component> = T & Plugin

export function withInstall<T extends Component>(
  component: T,
  name: string,
): SFCWithInstall<T> {
  const installable = component as SFCWithInstall<T>

  installable.install = (app: App) => {
    app.component(name, component)
  }

  return installable
}

export function makeInstaller(components: Plugin[]): Plugin {
  return {
    install(app: App) {
      for (const component of components) {
        app.use(component)
      }
    },
  }
}
```

- [ ] **Step 5: Implement `GaVisuallyHidden`**

Create `packages/ui-core/src/components/ga-visually-hidden/src/visually-hidden.vue`:

```vue
<script setup lang="ts">
defineOptions({ name: 'GaVisuallyHidden' })
</script>

<template>
  <span class="ga-visually-hidden"><slot /></span>
</template>
```

Create `packages/ui-core/src/components/ga-visually-hidden/style/index.scss`:

```scss
.ga-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

Create `packages/ui-core/src/components/ga-visually-hidden/index.ts`:

```ts
import { withInstall } from '../../utils/with-install'
import VisuallyHidden from './src/visually-hidden.vue'

export const GaVisuallyHidden = withInstall(
  VisuallyHidden,
  'GaVisuallyHidden',
)

export default GaVisuallyHidden
```

Create `packages/ui-core/src/style/index.scss`:

```scss
@use '../components/ga-visually-hidden/style/index.scss';
```

Create `packages/ui-core/src/index.ts`:

```ts
import { GaVisuallyHidden } from './components/ga-visually-hidden'
import { makeInstaller } from './utils/with-install'

export * from './components/ga-visually-hidden'
export * from './utils/with-install'

export default makeInstaller([GaVisuallyHidden])
```

- [ ] **Step 6: Run core tests and type checking**

Run:

```powershell
pnpm.cmd test -- packages/ui-core/src/components/ga-visually-hidden/__tests__/visually-hidden.spec.ts
pnpm.cmd --filter @ga/ui-core typecheck
```

Expected: two passing tests and a successful type check.

- [ ] **Step 7: Commit the core package**

Run:

```powershell
git add packages/ui-core pnpm-lock.yaml
git commit -m "feat(core): add core installer and accessibility primitive"
```

---

### Task 5: Create `@ga/ui-element` and `GaAsyncButton`

**Files:**
- Create: `packages/ui-element/package.json`
- Create: `packages/ui-element/tsconfig.json`
- Create: `packages/ui-element/vite.config.ts`
- Create: `packages/ui-element/src/components/ga-async-button/__tests__/async-button.spec.ts`
- Create: `packages/ui-element/src/components/ga-async-button/src/props.ts`
- Create: `packages/ui-element/src/components/ga-async-button/src/async-button.vue`
- Create: `packages/ui-element/src/components/ga-async-button/style/index.scss`
- Create: `packages/ui-element/src/components/ga-async-button/index.ts`
- Create: `packages/ui-element/src/style/index.scss`
- Create: `packages/ui-element/src/index.ts`

- [ ] **Step 1: Create package and multi-entry build metadata**

Create `packages/ui-element/package.json`:

```json
{
  "name": "@ga/ui-element",
  "version": "0.1.0",
  "type": "module",
  "files": ["dist", "README.md"],
  "sideEffects": ["**/*.css"],
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./style.css": "./dist/style.css",
    "./components/ga-async-button": {
      "types": "./dist/components/ga-async-button/index.d.ts",
      "import": "./dist/components/ga-async-button/index.js"
    },
    "./components/ga-async-button/style.css": "./dist/components/ga-async-button/style.css",
    "./resolver": {
      "types": "./dist/resolver/index.d.ts",
      "import": "./dist/resolver/index.js"
    }
  },
  "scripts": {
    "build": "vite build && node ../build-config/scripts/build-styles.mjs",
    "typecheck": "vue-tsc --noEmit -p tsconfig.json"
  },
  "dependencies": {
    "@ga/ui-core": "workspace:^"
  },
  "peerDependencies": {
    "element-plus": "^2.11.0",
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@ga/build-config": "workspace:*"
  }
}
```

Create `packages/ui-element/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist"
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "exclude": ["src/**/*.spec.ts", "src/**/__tests__/**"]
}
```

Create `packages/ui-element/vite.config.ts`:

```ts
import { createLibraryConfig } from '@ga/build-config'

export default createLibraryConfig({
  entries: {
    index: 'src/index.ts',
    'components/ga-async-button/index':
      'src/components/ga-async-button/index.ts',
    'resolver/index': 'src/resolver/index.ts',
  },
  external: ['vue', 'element-plus', '@ga/ui-core'],
})
```

Run:

```powershell
pnpm.cmd install
```

- [ ] **Step 2: Write failing asynchronous interaction tests**

Create `packages/ui-element/src/components/ga-async-button/__tests__/async-button.spec.ts`:

```ts
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { GaAsyncButton } from '../index'

describe('GaAsyncButton', () => {
  it('prevents duplicate actions while the first action is pending', async () => {
    let release!: () => void
    const action = vi.fn(
      () => new Promise<void>((resolve) => { release = resolve }),
    )
    const wrapper = mount(GaAsyncButton, {
      props: { action },
      slots: { default: '保存' },
    })

    await wrapper.get('button').trigger('click')
    await wrapper.get('button').trigger('click')

    expect(action).toHaveBeenCalledTimes(1)

    release()
    await flushPromises()

    expect(wrapper.emitted('success')).toHaveLength(1)
  })

  it('emits the rejected error and leaves loading state', async () => {
    const error = new Error('保存失败')
    const wrapper = mount(GaAsyncButton, {
      props: { action: vi.fn().mockRejectedValue(error) },
      slots: { default: '保存' },
    })

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('error')).toEqual([[error]])
    expect(wrapper.get('button').attributes('disabled')).toBeUndefined()
  })
})
```

- [ ] **Step 3: Run the component test and verify it fails**

Run:

```powershell
pnpm.cmd test -- packages/ui-element/src/components/ga-async-button/__tests__/async-button.spec.ts
```

Expected: FAIL because `../index` does not exist.

- [ ] **Step 4: Define the public component types**

Create `packages/ui-element/src/components/ga-async-button/src/props.ts`:

```ts
import type { ButtonProps } from 'element-plus'

export interface GaAsyncButtonProps {
  action: () => void | Promise<void>
  type?: ButtonProps['type']
  nativeType?: ButtonProps['nativeType']
  disabled?: boolean
}

export interface GaAsyncButtonEmits {
  success: []
  error: [error: unknown]
}
```

- [ ] **Step 5: Implement duplicate-submit protection**

Create `packages/ui-element/src/components/ga-async-button/src/async-button.vue`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'

import type {
  GaAsyncButtonEmits,
  GaAsyncButtonProps,
} from './props'

defineOptions({
  name: 'GaAsyncButton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<GaAsyncButtonProps>(), {
  type: 'primary',
  nativeType: 'button',
  disabled: false,
})
const emit = defineEmits<GaAsyncButtonEmits>()
const loading = ref(false)

async function handleClick() {
  if (loading.value || props.disabled) return

  loading.value = true

  try {
    await props.action()
    emit('success')
  } catch (error) {
    emit('error', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <ElButton
    v-bind="$attrs"
    class="ga-async-button"
    :type="type"
    :native-type="nativeType"
    :disabled="disabled"
    :loading="loading"
    @click="handleClick"
  >
    <slot />
  </ElButton>
</template>
```

Create `packages/ui-element/src/components/ga-async-button/style/index.scss`:

```scss
.ga-async-button.is-loading {
  cursor: wait;
}
```

Create `packages/ui-element/src/components/ga-async-button/index.ts`:

```ts
import { withInstall } from '@ga/ui-core'

import AsyncButton from './src/async-button.vue'

export type {
  GaAsyncButtonEmits,
  GaAsyncButtonProps,
} from './src/props'

export const GaAsyncButton = withInstall(AsyncButton, 'GaAsyncButton')

export default GaAsyncButton
```

Create `packages/ui-element/src/style/index.scss`:

```scss
@use '../components/ga-async-button/style/index.scss';
```

Create `packages/ui-element/src/index.ts`:

```ts
import { makeInstaller } from '@ga/ui-core'

import { GaAsyncButton } from './components/ga-async-button'

export * from './components/ga-async-button'

export default makeInstaller([GaAsyncButton])
```

- [ ] **Step 6: Run component tests and type checking**

Run:

```powershell
pnpm.cmd test -- packages/ui-element/src/components/ga-async-button/__tests__/async-button.spec.ts
pnpm.cmd --filter @ga/ui-element typecheck
```

Expected: two passing tests and a successful type check.

- [ ] **Step 7: Commit the first Element Plus wrapper**

Run:

```powershell
git add packages/ui-element pnpm-lock.yaml
git commit -m "feat(element): add async button wrapper"
```

---

### Task 6: Add the Automatic-Import Resolver

**Files:**
- Create: `packages/ui-element/src/resolver/index.spec.ts`
- Create: `packages/ui-element/src/resolver/index.ts`

- [ ] **Step 1: Write the failing Resolver tests**

Create `packages/ui-element/src/resolver/index.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { GaElementResolver } from './index'

describe('GaElementResolver', () => {
  it('maps a known component to its component and style subpaths', () => {
    const resolver = GaElementResolver()

    expect(resolver.resolve('GaAsyncButton')).toEqual({
      name: 'GaAsyncButton',
      from: '@ga/ui-element/components/ga-async-button',
      sideEffects:
        '@ga/ui-element/components/ga-async-button/style.css',
    })
  })

  it('ignores unknown component names', () => {
    const resolver = GaElementResolver()

    expect(resolver.resolve('ElButton')).toBeUndefined()
    expect(resolver.resolve('GaUnknown')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run the Resolver test and verify it fails**

Run:

```powershell
pnpm.cmd test -- packages/ui-element/src/resolver/index.spec.ts
```

Expected: FAIL because `./index` does not exist.

- [ ] **Step 3: Implement a structurally compatible Resolver**

Create `packages/ui-element/src/resolver/index.ts`:

```ts
export interface GaResolverResult {
  name: string
  from: string
  sideEffects: string
}

export interface GaResolver {
  type: 'component'
  resolve(name: string): GaResolverResult | undefined
}

const componentPaths: Record<string, string> = {
  GaAsyncButton: 'ga-async-button',
}

export function GaElementResolver(): GaResolver {
  return {
    type: 'component',
    resolve(name) {
      const componentPath = componentPaths[name]

      if (!componentPath) return undefined

      return {
        name,
        from: `@ga/ui-element/components/${componentPath}`,
        sideEffects:
          `@ga/ui-element/components/${componentPath}/style.css`,
      }
    },
  }
}
```

- [ ] **Step 4: Run all current tests**

Run:

```powershell
pnpm.cmd test
```

Expected: all build-config, core, component, and Resolver tests pass.

- [ ] **Step 5: Commit the Resolver**

Run:

```powershell
git add packages/ui-element/src/resolver
git commit -m "feat(element): add automatic import resolver"
```

---

### Task 7: Build and Inspect the Public Package Artifacts

**Files:**
- Generated: `packages/ui-core/dist/**`
- Generated: `packages/ui-element/dist/**`

- [ ] **Step 1: Build `@ga/ui-core`**

Run:

```powershell
pnpm.cmd --filter @ga/ui-core build
```

Expected files include:

```text
packages/ui-core/dist/index.js
packages/ui-core/dist/index.d.ts
packages/ui-core/dist/style.css
packages/ui-core/dist/style.css.map
packages/ui-core/dist/components/ga-visually-hidden/index.js
packages/ui-core/dist/components/ga-visually-hidden/index.d.ts
packages/ui-core/dist/components/ga-visually-hidden/style.css
```

- [ ] **Step 2: Build `@ga/ui-element`**

Run:

```powershell
pnpm.cmd --filter @ga/ui-element build
```

Expected files include:

```text
packages/ui-element/dist/index.js
packages/ui-element/dist/index.d.ts
packages/ui-element/dist/style.css
packages/ui-element/dist/components/ga-async-button/index.js
packages/ui-element/dist/components/ga-async-button/index.d.ts
packages/ui-element/dist/components/ga-async-button/style.css
packages/ui-element/dist/resolver/index.js
packages/ui-element/dist/resolver/index.d.ts
```

- [ ] **Step 3: Confirm Element Plus remains external**

Run:

```powershell
rg -n "element-plus" packages/ui-element/dist
```

Expected: an ESM import from `element-plus` remains in the output. The package source is not copied into `dist`.

- [ ] **Step 4: Confirm aggregate and per-component styles are present**

Run:

```powershell
rg -n "ga-async-button" packages/ui-element/dist/style.css packages/ui-element/dist/components/ga-async-button/style.css
rg -n "ga-visually-hidden" packages/ui-core/dist/style.css packages/ui-core/dist/components/ga-visually-hidden/style.css
```

Expected: each selector appears in both its aggregate and component stylesheet.

- [ ] **Step 5: Run workspace type checking and tests**

Run:

```powershell
pnpm.cmd typecheck
pnpm.cmd test
```

Expected: all commands pass.

- [ ] **Step 6: Commit build configuration fixes only if verification required source changes**

If Steps 1–5 required a source/configuration correction, commit those exact files with:

```powershell
git add package.json pnpm-lock.yaml packages/build-config packages/ui-core packages/ui-element
git commit -m "fix: produce consumable library artifacts"
```

If no tracked files changed, do not create an empty commit.

---

### Task 8: Generate and Configure the Vite Automatic-Import Playground

**Files:**
- Create with scaffold: `playground/auto-import/**`
- Modify: `playground/auto-import/package.json`
- Modify: `playground/auto-import/vite.config.ts`
- Modify: `playground/auto-import/src/main.ts`
- Modify: `playground/auto-import/src/App.vue`
- Modify: `playground/auto-import/src/style.css`

- [ ] **Step 1: Generate the Vue + TypeScript application with create-vite**

Run:

```powershell
pnpm.cmd create vite playground/auto-import --template vue-ts
```

Expected: create-vite generates a Vue 3 + TypeScript Vite app. This is the correct place to use the application scaffold; the library packages themselves remain manually configured Library Mode packages.

- [ ] **Step 2: Remove unused create-vite demonstration files**

After confirming the files were generated by Step 1, run:

```powershell
Remove-Item -LiteralPath 'playground/auto-import/public/vite.svg' -ErrorAction SilentlyContinue
Remove-Item -LiteralPath 'playground/auto-import/src/assets/vue.svg' -ErrorAction SilentlyContinue
Remove-Item -LiteralPath 'playground/auto-import/src/components/HelloWorld.vue' -ErrorAction SilentlyContinue
```

Expected: only scaffold demonstration assets are removed; application configuration files remain.

- [ ] **Step 3: Replace Playground package metadata**

Set `playground/auto-import/package.json` to:

```json
{
  "name": "@ga/playground-auto-import",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@ga/ui-core": "workspace:*",
    "@ga/ui-element": "workspace:*",
    "element-plus": "^2.11.0",
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.0",
    "typescript": "^5.9.0",
    "unplugin-vue-components": "^28.0.0",
    "vite": "^7.0.0",
    "vue-tsc": "^3.0.0"
  }
}
```

Run:

```powershell
pnpm.cmd install
```

- [ ] **Step 4: Configure automatic component and style resolution**

Set `playground/auto-import/vite.config.ts` to:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

import { GaElementResolver } from '@ga/ui-element/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      dts: 'src/components.d.ts',
      resolvers: [GaElementResolver()],
    }),
  ],
})
```

- [ ] **Step 5: Configure Element Plus base styles**

Set `playground/auto-import/src/main.ts` to:

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import './style.css'

createApp(App).use(ElementPlus).mount('#app')
```

- [ ] **Step 6: Add a component with no manual GA UI import**

Set `playground/auto-import/src/App.vue` to:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const saves = ref(0)

async function save() {
  await new Promise((resolve) => window.setTimeout(resolve, 500))
  saves.value += 1
}
</script>

<template>
  <main class="playground-page">
    <h1>GA UI 自动导入验证</h1>
    <p>成功保存次数：{{ saves }}</p>
    <GaAsyncButton :action="save">保存</GaAsyncButton>
  </main>
</template>
```

Set `playground/auto-import/src/style.css` to:

```css
:root {
  font-family: Inter, "Microsoft YaHei", sans-serif;
  color: #303133;
  background: #f5f7fa;
}

body {
  margin: 0;
}

.playground-page {
  width: min(720px, calc(100% - 48px));
  margin: 64px auto;
  padding: 32px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}
```

- [ ] **Step 7: Build packages, then build the Playground**

Run:

```powershell
pnpm.cmd build
pnpm.cmd --filter @ga/playground-auto-import build
```

Expected: the package builds pass, `components.d.ts` is generated, and the Playground outputs `playground/auto-import/dist` without an unresolved `GaAsyncButton` error.

- [ ] **Step 8: Verify the Resolver included component code and styles**

Run:

```powershell
rg -n "ga-async-button" playground/auto-import/dist/assets
```

Expected: the built assets contain the component class and its CSS.

- [ ] **Step 9: Commit the Playground**

Run:

```powershell
git add playground pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "feat: add vite auto import playground"
```

---

### Task 9: Pack the Public Packages and Document the First Milestone

**Files:**
- Create: `artifacts/.gitkeep`
- Create: `README.md`
- Generated and ignored: `artifacts/ga-ui-core-0.1.0.tgz`
- Generated and ignored: `artifacts/ga-ui-element-0.1.0.tgz`

- [ ] **Step 1: Create the artifact directory marker**

Create an empty file at `artifacts/.gitkeep`.

- [ ] **Step 2: Build and pack `@ga/ui-core`**

Run:

```powershell
pnpm.cmd --filter @ga/ui-core build
pnpm.cmd --dir packages/ui-core pack --pack-destination ../../artifacts
```

Expected: `artifacts/ga-ui-core-0.1.0.tgz`.

- [ ] **Step 3: Build and pack `@ga/ui-element`**

Run:

```powershell
pnpm.cmd --filter @ga/ui-element build
pnpm.cmd --dir packages/ui-element pack --pack-destination ../../artifacts
```

Expected: `artifacts/ga-ui-element-0.1.0.tgz`.

- [ ] **Step 4: Inspect package contents**

Run:

```powershell
tar -tf artifacts/ga-ui-core-0.1.0.tgz
tar -tf artifacts/ga-ui-element-0.1.0.tgz
```

Expected: each archive contains `package.json` and `dist/**`; neither archive contains `src/**`, `__tests__/**`, or `node_modules/**`.

- [ ] **Step 5: Document development and consumption**

Create `README.md`:

```markdown
# GA UI

GA UI is an internal Vue 3 component workspace built with Vite Library Mode, TypeScript, Element Plus, SCSS, and pnpm.

## Requirements

- Node.js 22.15 or newer compatible Node 22 release
- pnpm 10.34.5

On Windows PowerShell, use `pnpm.cmd` when the execution policy blocks `pnpm.ps1`.

## Commands

```powershell
pnpm.cmd install
pnpm.cmd test
pnpm.cmd typecheck
pnpm.cmd build
pnpm.cmd dev
```

## Full Installation

```ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import GaCore from '@ga/ui-core'
import GaElement from '@ga/ui-element'
import '@ga/ui-core/style.css'
import '@ga/ui-element/style.css'

app.use(ElementPlus)
app.use(GaCore)
app.use(GaElement)
```

## Manual Component Import

```ts
import { GaAsyncButton } from '@ga/ui-element'
import '@ga/ui-element/components/ga-async-button/style.css'
```

## Automatic Import

```ts
import Components from 'unplugin-vue-components/vite'
import { GaElementResolver } from '@ga/ui-element/resolver'

Components({
  resolvers: [GaElementResolver()],
})
```

The first milestone includes `@ga/ui-core`, `@ga/ui-element`, and the automatic-import Playground. Business adapters, Storybook, Changesets, and Registry publishing are separate implementation milestones.
```

- [ ] **Step 6: Run final milestone verification**

Run:

```powershell
pnpm.cmd test
pnpm.cmd typecheck
pnpm.cmd build
pnpm.cmd --filter @ga/playground-auto-import build
git status --short
```

Expected:

- All tests pass.
- All type checks pass.
- Both public packages build.
- The Playground builds.
- `git status --short` shows only the intended README and artifact marker before the final commit.

- [ ] **Step 7: Commit the verified first milestone**

Run:

```powershell
git add README.md artifacts/.gitkeep
git commit -m "docs: document ga ui foundation"
```

Expected: clean Git status except ignored build, package, and Playground artifacts.

---

## Final Acceptance Checklist

- [ ] `@ga/ui-core` builds ESM, declarations, aggregate CSS, and component CSS.
- [ ] `@ga/ui-core` has no Element Plus runtime or style dependency.
- [ ] `@ga/ui-element` externalizes Vue, Element Plus, and `@ga/ui-core`.
- [ ] `GaAsyncButton` prevents duplicate async actions and emits success/error results.
- [ ] The Resolver maps `GaAsyncButton` to component and style subpaths.
- [ ] The create-vite Playground builds without manually importing `GaAsyncButton`.
- [ ] Public package archives contain only publishable files.
- [ ] Tests, type checking, library builds, and the Playground build all pass.

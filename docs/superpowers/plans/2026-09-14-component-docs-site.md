# GA UI Plus Internal Component Documentation Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an internal VitePress site that documents all seven public GA UI Plus components with live demos, expandable copyable source code, API tables, search, and dark mode.

**Architecture:** Add a VitePress workspace package under `docs`, with site content isolated in `docs/site` so existing `docs/superpowers` files remain outside the rendered site. Each demo is a standalone Vue SFC rendered by its component page and included as source through VitePress's `<<<` syntax, keeping runtime and displayed code in one file.

**Tech Stack:** Vue 3, TypeScript, VitePress, Element Plus, `ga-ui-plus`, `unplugin-vue-components`, Node.js test runner, pnpm workspaces.

---

## File Structure

- Create `docs/package.json`: documentation workspace scripts and dependencies.
- Create `docs/tests/docs-content.spec.mjs`: structural contract for required pages, API sections, and demo source links.
- Create `docs/.vitepress/config.mts`: site navigation, sidebar, local search, Vite plugins, and markdown settings.
- Create `docs/.vitepress/theme/index.ts`: theme registration, Element Plus/GA styles, and global components.
- Create `docs/.vitepress/theme/styles.css`: restrained technical-documentation visual system.
- Create `docs/.vitepress/theme/components/DemoPreview.vue`: consistent live-demo frame.
- Create `docs/site/index.md`: working component index and quick start.
- Create `docs/site/guide/*.md`: introduction, local setup, quick start, and Resolver usage.
- Create `docs/site/components/*.md`: seven public component reference pages.
- Create `docs/site/demos/**/*.vue`: runnable examples referenced by component pages.
- Modify `package.json`: root documentation commands.
- Modify `pnpm-lock.yaml`: resolved VitePress documentation dependencies.

### Task 1: Add the documentation content contract

**Files:**
- Create: `docs/tests/docs-content.spec.mjs`

- [x] **Step 1: Write the failing structural test**

Use the Node.js test runner to assert that all seven component pages exist, contain `## API`, identify Props/Events/Slots/Expose sections, render `DemoPreview`, and include at least one demo source file through `<<<`.

```js
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const pages = [
  'dialog',
  'mega-menu',
  'pagination',
  'table',
  'aside-menu',
  'search-bar',
  'table-pagination',
]

for (const page of pages) {
  test(`${page} exposes demos and API reference`, async () => {
    const content = await readFile(
      new URL(`../site/components/${page}.md`, import.meta.url),
      'utf8',
    )
    assert.match(content, /<DemoPreview/)
    assert.match(content, /<<< .*\.vue/)
    assert.match(content, /## API/)
    assert.match(content, /### Props/)
    assert.match(content, /### Events/)
    assert.match(content, /### Slots/)
    assert.match(content, /### Expose/)
  })
}
```

- [x] **Step 2: Run the test and verify RED**

Run: `node --test docs/tests/docs-content.spec.mjs`

Expected: FAIL with `ENOENT` because component documentation pages do not exist.

### Task 2: Create the VitePress workspace and theme shell

**Files:**
- Create: `docs/package.json`
- Create: `docs/.vitepress/config.mts`
- Create: `docs/.vitepress/theme/index.ts`
- Create: `docs/.vitepress/theme/styles.css`
- Create: `docs/.vitepress/theme/components/DemoPreview.vue`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [x] **Step 1: Add workspace scripts and dependencies**

Configure `docs/package.json` with `dev`, `build`, `preview`, and `test` scripts. Add VitePress, Vue, Element Plus, icons, `ga-ui-plus: workspace:*`, `unplugin-auto-import`, and `unplugin-vue-components`.

- [x] **Step 2: Configure VitePress**

Set `srcDir: './site'`, local search, heading anchors, clean URLs, guide/component navigation, and grouped base/business sidebars. Register `AutoImport` with `ElementPlusResolver` and `Components` with both `ElementPlusResolver` and `GaUiResolver`.

- [x] **Step 3: Register the custom theme**

Extend `vitepress/theme`, import Element Plus and GA styles needed by directly imported demos, register `DemoPreview`, and add semantic CSS variables for light/dark modes.

- [x] **Step 4: Add root commands**

Add:

```json
"docs:dev": "pnpm --filter ga-ui-docs dev",
"docs:build": "pnpm --filter ga-ui-docs build",
"docs:preview": "pnpm --filter ga-ui-docs preview",
"docs:test": "pnpm --filter ga-ui-docs test"
```

- [x] **Step 5: Install dependencies**

Run: `pnpm install`

Expected: lockfile updates and the `ga-ui-docs` workspace resolves successfully.

### Task 3: Add home and guide pages

**Files:**
- Create: `docs/site/index.md`
- Create: `docs/site/guide/introduction.md`
- Create: `docs/site/guide/development.md`
- Create: `docs/site/guide/quick-start.md`
- Create: `docs/site/guide/resolver.md`

- [x] **Step 1: Build the working index**

Include the package purpose, `pnpm docs:dev`, install/import snippets, base/business component lists, and links to all component pages. Keep the page operational and compact instead of using a marketing hero.

- [x] **Step 2: Write local development and consumer guides**

Document workspace startup, full import, manual on-demand import, `GaUiResolver`, Element Plus full-style compatibility, and the difference between stable docs demos and temporary playground experiments.

### Task 4: Document base components with runnable demos

**Files:**
- Create: `docs/site/components/dialog.md`
- Create: `docs/site/components/mega-menu.md`
- Create: `docs/site/components/pagination.md`
- Create: `docs/site/components/table.md`
- Create: `docs/site/demos/dialog/BasicDemo.vue`
- Create: `docs/site/demos/dialog/LifecycleDemo.vue`
- Create: `docs/site/demos/mega-menu/BasicDemo.vue`
- Create: `docs/site/demos/mega-menu/ThemeDemo.vue`
- Create: `docs/site/demos/pagination/BasicDemo.vue`
- Create: `docs/site/demos/pagination/ThemeDemo.vue`
- Create: `docs/site/demos/table/BasicDemo.vue`
- Create: `docs/site/demos/table/SelectionDemo.vue`

- [x] **Step 1: Implement live base-component demos**

Use public imports from `ga-ui-plus`, visible local state, and compact datasets. Cover dialog model/fullscreen/footer, mega-menu trigger/theme/select, pagination models/disabled/theme, and table columns/slots/selection/theme.

- [x] **Step 2: Write base-component API pages**

For each page include purpose, examples, `## API`, Props, Events, Slots, Expose, public types/theme fields, and wrapper-specific Element Plus passthrough notes. Include each demo source with VitePress `<<<` syntax.

### Task 5: Document business components with runnable demos

**Files:**
- Create: `docs/site/components/aside-menu.md`
- Create: `docs/site/components/search-bar.md`
- Create: `docs/site/components/table-pagination.md`
- Create: `docs/site/demos/aside-menu/BasicDemo.vue`
- Create: `docs/site/demos/aside-menu/ThemeDemo.vue`
- Create: `docs/site/demos/search-bar/BasicDemo.vue`
- Create: `docs/site/demos/search-bar/AdvancedDemo.vue`
- Create: `docs/site/demos/table-pagination/BasicDemo.vue`
- Create: `docs/site/demos/table-pagination/LoadingDemo.vue`

- [x] **Step 1: Implement live business-component demos**

Cover aside slots/collapse/theme/events, search fields/layout/validation/actions/custom slots, and table-pagination models/loading/disabled/table and pagination themes.

- [x] **Step 2: Write business-component API pages**

Document component-owned Props, Events, Slots, Expose methods, public types, and passthrough limitations. Keep `GaTablePagination` column details focused on the wrapper rather than duplicating the full `GaTableColumn` reference.

### Task 6: Verify content, build, and regression behavior

**Files:**
- Modify only files found incorrect by verification.

- [x] **Step 1: Run the documentation contract and verify GREEN**

Run: `pnpm docs:test`

Expected: seven tests pass.

- [x] **Step 2: Build the documentation site**

Run: `pnpm docs:build`

Expected: VitePress client and server bundles complete with no dead links or Vue compilation errors.

- [x] **Step 3: Run component-library regression tests**

Run: `pnpm --filter ga-ui-plus test`

Expected: 15 files and 184 tests pass.

- [x] **Step 4: Inspect the site in a browser**

Run: `pnpm docs:dev --host 127.0.0.1`

Verify the homepage, navigation, one base component, one business component, source expansion, copy control, local search, and dark mode at desktop and narrow widths.

- [x] **Step 5: Check repository hygiene**

Run: `git diff --check`

Expected: no whitespace errors.

Run: `git status --short`

Expected: only intentional documentation-site files, root script changes, and lockfile changes.

# Component Theme Configuration Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add complete, searchable style configuration tables for every public GA UI Plus theme object, including field descriptions, exact TypeScript types, and built-in defaults.

**Architecture:** Extend the existing TypeScript API extractor to emit theme interface fields declared by the API manifest. Merge generated field/type data with explicit Chinese descriptions and defaults, then render reusable style groups in component pages and index them in documentation search.

**Tech Stack:** Vue 3, TypeScript, TypeScript Compiler API, Vitest, Node test runner, Vite, pnpm.

---

## File Structure

- Modify `docs/scripts/api-manifest.mjs`: declare each component's public style groups and source interfaces.
- Modify `docs/scripts/api-extractor.mjs`: extract style group fields from TypeScript interfaces.
- Modify `docs/scripts/api-extractor.spec.mjs`: verify single and multiple style group extraction.
- Modify `docs/src/generated/component-api.ts`: regenerate API output after extractor changes.
- Modify `docs/src/content/types.ts`: define generated and reader-facing style group types.
- Create `docs/src/content/style-configs.ts`: merge generated style fields with documentation metadata and validate completeness.
- Create `docs/src/content/style-config-overrides.ts`: hold Chinese descriptions and built-in defaults for all theme fields.
- Create `docs/src/content/style-configs.spec.ts`: test metadata validation and all real style groups.
- Modify all files under `docs/src/content/components/*.ts`: add `styleConfigs`, using an empty array for components without themes.
- Modify `docs/src/views/ComponentView.vue`: render the `样式配置` section and publish it to the outline.
- Modify `docs/src/views/ComponentView.spec.ts`: verify style groups, omission, and outline order.
- Modify `docs/src/components/ApiTable.vue`: support style table labels and default-value behavior.
- Modify `docs/src/components/ApiTable.spec.ts`: verify the style table presentation.
- Modify `docs/src/styles/index.css`: style multiple theme groups without nesting cards.
- Modify `docs/src/content/search.ts`: index theme fields and link them to `#styles`.
- Modify `docs/src/content/search.spec.ts`: verify theme field search results and context.
- Modify `docs/src/content/components/components.spec.ts`: require complete style documentation for themed components.

### Task 1: Extract Theme Interfaces

**Files:**
- Modify: `docs/scripts/api-manifest.mjs`
- Modify: `docs/scripts/api-extractor.mjs`
- Test: `docs/scripts/api-extractor.spec.mjs`
- Regenerate: `docs/src/generated/component-api.ts`

- [ ] **Step 1: Write failing extractor tests**

Add tests that require `extractComponentApi()` to return `styleConfigs`:

```js
test('extracts public theme interface fields', () => {
  const megaMenu = extractComponentApi('mega-menu')
  assert.equal(megaMenu.styleConfigs.length, 1)
  assert.equal(megaMenu.styleConfigs[0].prop, 'theme')
  assert.equal(megaMenu.styleConfigs[0].type, 'GaMegaMenuTheme')
  assert.equal(
    megaMenu.styleConfigs[0].entries.some(
      (item) =>
        item.name === 'menuItemFontSize' &&
        item.type === 'string | number | undefined',
    ),
    true,
  )
})

test('extracts both table pagination theme groups', () => {
  const tablePagination = extractComponentApi('table-pagination')
  assert.deepEqual(
    tablePagination.styleConfigs.map(({ prop, type }) => ({ prop, type })),
    [
      { prop: 'tableTheme', type: 'GaTableTheme' },
      { prop: 'paginationTheme', type: 'GaPaginationTheme' },
    ],
  )
  assert.equal(
    tablePagination.styleConfigs[0].entries.some(
      (item) => item.name === 'headerBackgroundColor',
    ),
    true,
  )
  assert.equal(
    tablePagination.styleConfigs[1].entries.some(
      (item) => item.name === 'activeBackgroundColor',
    ),
    true,
  )
})
```

- [ ] **Step 2: Run the Node extractor tests and verify RED**

Run:

```powershell
pnpm --filter ga-ui-docs exec node --test scripts/api-extractor.spec.mjs
```

Expected: FAIL because `styleConfigs` is not returned.

- [ ] **Step 3: Declare style groups in the API manifest**

Add `styleConfigs: []` to non-themed entries and these exact declarations to themed entries:

```js
'mega-menu': {
  styleConfigs: [{ prop: 'theme', type: 'GaMegaMenuTheme' }],
},
pagination: {
  styleConfigs: [{ prop: 'theme', type: 'GaPaginationTheme' }],
},
table: {
  styleConfigs: [{ prop: 'theme', type: 'GaTableTheme' }],
},
'aside-menu': {
  styleConfigs: [{ prop: 'theme', type: 'GaAsideMenuTheme' }],
},
'table-pagination': {
  styleConfigs: [
    {
      prop: 'tableTheme',
      type: 'GaTableTheme',
      source: '../packages/ui/src/base/components/table/src/props.ts',
    },
    {
      prop: 'paginationTheme',
      type: 'GaPaginationTheme',
      source: '../packages/ui/src/base/components/pagination/src/props.ts',
    },
  ],
},
```

- [ ] **Step 4: Extend the extractor**

Include style sources in `createChecker()` and return this structure:

```js
function styleConfigEntries(entry, program, checker) {
  return (entry.styleConfigs ?? []).map((styleConfig) => {
    const source = styleConfig.source ?? entry.source
    const sourceFile = program.getSourceFile(resolveSource(source))
    if (!sourceFile) {
      throw new Error(`Cannot load style API source for ${styleConfig.type}`)
    }

    return {
      prop: styleConfig.prop,
      type: styleConfig.type,
      entries: objectEntries(checker, sourceFile, styleConfig.type),
    }
  })
}
```

Update the root names and result:

```js
const rootNames = [
  entry.source,
  entry.secondarySource,
  ...(entry.styleConfigs ?? []).map((item) => item.source),
]
  .filter(Boolean)
  .map(resolveSource)

return {
  props: objectEntries(checker, sourceFile, entry.props),
  events: eventEntries(checker, sourceFile, entry.emits),
  slots: slotEntries(entry),
  expose: objectEntries(checker, secondaryFile, entry.expose),
  styleConfigs: styleConfigEntries(entry, program, checker),
}
```

- [ ] **Step 5: Run the extractor tests and regenerate output**

Run:

```powershell
pnpm --filter ga-ui-docs exec node --test scripts/api-extractor.spec.mjs
pnpm --filter ga-ui-docs generate:api
```

Expected: extractor tests PASS and every generated component contains a `styleConfigs` array.

- [ ] **Step 6: Commit the extractor change**

```powershell
git add docs/scripts/api-manifest.mjs docs/scripts/api-extractor.mjs docs/scripts/api-extractor.spec.mjs docs/src/generated/component-api.ts
git commit -m "feat(docs): extract component theme interfaces"
```

### Task 2: Merge And Validate Style Metadata

**Files:**
- Modify: `docs/src/content/types.ts`
- Create: `docs/src/content/style-configs.ts`
- Create: `docs/src/content/style-configs.spec.ts`

- [ ] **Step 1: Write failing merge tests**

Cover successful merging and strict validation:

```ts
import { describe, expect, it } from 'vitest'
import { mergeStyleConfigs } from './style-configs'

const generated = [
  {
    prop: 'theme',
    type: 'SampleTheme',
    entries: [
      { name: 'backgroundColor', type: 'string | undefined', required: false },
    ],
  },
] as const

describe('mergeStyleConfigs', () => {
  it('adds group descriptions, field descriptions, and defaults', () => {
    expect(
      mergeStyleConfigs('sample', generated, {
        theme: {
          description: '当前实例主题。',
          fields: {
            backgroundColor: { description: '背景色', default: '#ffffff' },
          },
        },
      }),
    ).toEqual([
      {
        prop: 'theme',
        type: 'SampleTheme',
        description: '当前实例主题。',
        entries: [
          {
            name: 'backgroundColor',
            type: 'string | undefined',
            required: false,
            description: '背景色',
            default: '#ffffff',
          },
        ],
      },
    ])
  })

  it('rejects missing, unknown, and incomplete metadata', () => {
    expect(() => mergeStyleConfigs('sample', generated, {})).toThrow(
      'Missing style config metadata: sample.theme',
    )
    expect(() =>
      mergeStyleConfigs('sample', generated, {
        theme: {
          description: '当前实例主题。',
          fields: {
            backgroundColor: { description: '', default: '#ffffff' },
          },
        },
      }),
    ).toThrow('Missing style field description: sample.theme.backgroundColor')
    expect(() =>
      mergeStyleConfigs('sample', generated, {
        theme: {
          description: '当前实例主题。',
          fields: {
            backgroundColor: { description: '背景色', default: '#ffffff' },
            unknown: { description: '未知字段', default: 'none' },
          },
        },
      }),
    ).toThrow('Unknown style field metadata: sample.theme.unknown')
  })
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
pnpm --filter ga-ui-docs exec vitest run src/content/style-configs.spec.ts
```

Expected: FAIL because the types and merge helper do not exist.

- [ ] **Step 3: Add style configuration types**

Add to `docs/src/content/types.ts`:

```ts
export interface GeneratedStyleConfigDefinition {
  prop: string
  type: string
  entries: ApiEntry[]
}

export interface StyleConfigDefinition extends GeneratedStyleConfigDefinition {
  description: string
}

export interface ReadonlyGeneratedStyleConfigDefinition {
  readonly prop: string
  readonly type: string
  readonly entries: readonly ApiEntry[]
}

export interface StyleFieldMetadata {
  description: string
  default: string
}

export interface StyleConfigMetadata {
  description: string
  fields: Record<string, StyleFieldMetadata>
}

export type ComponentStyleConfigMetadata = Record<string, StyleConfigMetadata>
```

Extend `ReadonlyComponentApiDefinition` with a readonly `styleConfigs` array and extend `ComponentDocDefinition` with:

```ts
styleConfigs: StyleConfigDefinition[]
```

- [ ] **Step 4: Implement strict metadata merging**

Create `docs/src/content/style-configs.ts` with `mergeStyleConfigs(slug, generated, metadata)`. It must:

1. Reject metadata groups absent from generated groups.
2. Reject generated groups without metadata.
3. Reject blank group descriptions.
4. Reject metadata fields absent from the generated interface.
5. Reject generated fields without metadata.
6. Reject blank descriptions or defaults.
7. Preserve generated field order and exact TypeScript types.

Use error messages asserted in Step 1 and return `StyleConfigDefinition[]`.

- [ ] **Step 5: Run the focused test and verify GREEN**

```powershell
pnpm --filter ga-ui-docs exec vitest run src/content/style-configs.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Commit the merge layer**

```powershell
git add docs/src/content/types.ts docs/src/content/style-configs.ts docs/src/content/style-configs.spec.ts
git commit -m "feat(docs): validate theme configuration metadata"
```

### Task 3: Document All Theme Fields

**Files:**
- Create: `docs/src/content/style-config-overrides.ts`
- Modify: `docs/src/content/style-configs.spec.ts`
- Modify: `docs/src/content/components/dialog.ts`
- Modify: `docs/src/content/components/mega-menu.ts`
- Modify: `docs/src/content/components/pagination.ts`
- Modify: `docs/src/content/components/table.ts`
- Modify: `docs/src/content/components/aside-menu.ts`
- Modify: `docs/src/content/components/search-bar.ts`
- Modify: `docs/src/content/components/table-pagination.ts`

- [ ] **Step 1: Write a failing real-metadata completeness test**

Add a test that loops through `generatedComponentApi`, calls `mergeStyleConfigs()` with `styleConfigOverrides[slug] ?? {}`, and expects these group counts:

```ts
expect(Object.fromEntries(results.map(([slug, groups]) => [slug, groups.length])))
  .toEqual({
    dialog: 0,
    'mega-menu': 1,
    pagination: 1,
    table: 1,
    'aside-menu': 1,
    'search-bar': 0,
    'table-pagination': 2,
  })
```

Also assert every merged field has a non-empty description and default.

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
pnpm --filter ga-ui-docs exec vitest run src/content/style-configs.spec.ts
```

Expected: FAIL because the real metadata is absent.

- [ ] **Step 3: Create the metadata registry**

Create `styleConfigOverrides` keyed by component slug. Reuse shared `tableTheme` and `paginationTheme` metadata constants for `GaTablePagination`. Use the exact field documentation in Appendix A.

The exported shape must be:

```ts
export const styleConfigOverrides = {
  dialog: {},
  'mega-menu': { theme: megaMenuTheme },
  pagination: { theme: paginationTheme },
  table: { theme: tableTheme },
  'aside-menu': { theme: asideMenuTheme },
  'search-bar': {},
  'table-pagination': {
    tableTheme: {
      ...tableTheme,
      description: '单独配置当前组合组件中的表格主题。',
    },
    paginationTheme: {
      ...paginationTheme,
      description: '单独配置当前组合组件中的分页主题。',
    },
  },
} satisfies Record<string, ComponentStyleConfigMetadata>
```

- [ ] **Step 4: Wire style groups into every component document**

After creating the metadata registry, add this helper to `style-configs.ts`:

```ts
export function getComponentStyleConfigs(
  slug: keyof typeof generatedComponentApi,
): StyleConfigDefinition[] {
  return mergeStyleConfigs(
    slug,
    generatedComponentApi[slug].styleConfigs,
    styleConfigOverrides[slug],
  )
}
```

Import `generatedComponentApi` and `styleConfigOverrides` into `style-configs.ts`. In each component document, import `getComponentStyleConfigs` and add the exact matching call:

```ts
// dialog.ts
styleConfigs: getComponentStyleConfigs('dialog'),

// mega-menu.ts
styleConfigs: getComponentStyleConfigs('mega-menu'),

// pagination.ts
styleConfigs: getComponentStyleConfigs('pagination'),

// table.ts
styleConfigs: getComponentStyleConfigs('table'),

// aside-menu.ts
styleConfigs: getComponentStyleConfigs('aside-menu'),

// search-bar.ts
styleConfigs: getComponentStyleConfigs('search-bar'),

// table-pagination.ts
styleConfigs: getComponentStyleConfigs('table-pagination'),
```

Non-themed components receive an empty result from the generated empty style arrays.

- [ ] **Step 5: Run metadata and component document tests**

```powershell
pnpm --filter ga-ui-docs exec vitest run src/content/style-configs.spec.ts src/content/components/components.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Commit complete theme documentation data**

```powershell
git add docs/src/content/style-config-overrides.ts docs/src/content/style-configs.spec.ts docs/src/content/components
git commit -m "docs: describe component theme configuration fields"
```

### Task 4: Render Style Configuration Tables

**Files:**
- Modify: `docs/src/components/ApiTable.vue`
- Test: `docs/src/components/ApiTable.spec.ts`
- Modify: `docs/src/views/ComponentView.vue`
- Test: `docs/src/views/ComponentView.spec.ts`
- Modify: `docs/src/styles/index.css`

- [ ] **Step 1: Write failing table and page tests**

Add an `ApiTable` test using `section="styles"` that expects:

- The fourth column heading to be `默认值`.
- The region label to be `样式配置表格`.
- Field type copy controls to remain available.

Extend `sampleDefinition` in `ComponentView.spec.ts`:

```ts
styleConfigs: [
  {
    prop: 'theme',
    type: 'GaSampleTheme',
    description: '当前实例的主题配置。',
    entries: [
      {
        name: 'backgroundColor',
        description: '背景色',
        type: 'string | undefined',
        default: '#ffffff',
      },
    ],
  },
],
```

Expect the page to contain `样式配置`, `theme`, `GaSampleTheme`, the description, one additional `ApiTable`, and outline order:

```ts
['usage', 'examples', 'styles', 'props', 'events', 'slots', 'expose']
```

Add a second page test with `styleConfigs: []` and assert no `#styles` section or outline item is rendered.

- [ ] **Step 2: Run focused tests and verify RED**

```powershell
pnpm --filter ga-ui-docs exec vitest run src/components/ApiTable.spec.ts src/views/ComponentView.spec.ts
```

Expected: FAIL because `styles` is not supported or rendered.

- [ ] **Step 3: Extend `ApiTable` for style entries**

Define:

```ts
type ApiTableSection = ApiSectionName | 'styles'
```

Use `默认值` for `props` and `styles`, use `参数` for other sections, and map `styles` to the label `样式配置`.

- [ ] **Step 4: Render style groups in `ComponentView`**

After examples and before API sections, add:

```vue
<section
  v-if="definition.styleConfigs.length"
  id="styles"
  class="ga-docs-component__section"
>
  <h2>样式配置</h2>
  <div class="ga-docs-component__style-groups">
    <article
      v-for="group in definition.styleConfigs"
      :key="group.prop"
      class="ga-docs-component__style-group"
    >
      <h3>
        <code>{{ group.prop }}</code>
        <span>{{ group.type }}</span>
      </h3>
      <p>{{ group.description }}</p>
      <ApiTable section="styles" :entries="group.entries" />
    </article>
  </div>
</section>
```

Insert `{ id: 'styles', label: '样式配置', level: 2 }` in the outline only when groups exist.

- [ ] **Step 5: Add restrained group layout styles**

Add unframed spacing and typography rules:

```css
.ga-docs-component__style-groups {
  display: grid;
  gap: 28px;
}

.ga-docs-component__style-group h3 {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: baseline;
  margin-bottom: 8px;
}

.ga-docs-component__style-group h3 code {
  color: var(--ga-docs-accent);
}

.ga-docs-component__style-group h3 span,
.ga-docs-component__style-group > p {
  color: var(--ga-docs-muted);
}

.ga-docs-component__style-group > p {
  margin: 0 0 12px;
}
```

- [ ] **Step 6: Run focused page tests and verify GREEN**

```powershell
pnpm --filter ga-ui-docs exec vitest run src/components/ApiTable.spec.ts src/views/ComponentView.spec.ts
```

Expected: PASS.

- [ ] **Step 7: Commit page rendering**

```powershell
git add docs/src/components/ApiTable.vue docs/src/components/ApiTable.spec.ts docs/src/views/ComponentView.vue docs/src/views/ComponentView.spec.ts docs/src/styles/index.css
git commit -m "feat(docs): render component style configuration tables"
```

### Task 5: Index Theme Fields In Search

**Files:**
- Modify: `docs/src/content/search.ts`
- Test: `docs/src/content/search.spec.ts`

- [ ] **Step 1: Write failing search tests**

```ts
it('finds theme fields and links to style configuration', () => {
  expect(searchDocs('menuItemActiveBackgroundColor', entries)[0]).toMatchObject({
    path: '/components/mega-menu#styles',
    meta: 'MegaMenu 大型菜单 · theme 样式配置',
  })
})

it('distinguishes reused theme fields by component and prop', () => {
  const results = searchDocs('backgroundColor', entries)
  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ meta: 'Table 表格 · theme 样式配置' }),
      expect.objectContaining({ meta: 'TablePagination 表格分页 · tableTheme 样式配置' }),
      expect.objectContaining({ meta: 'TablePagination 表格分页 · paginationTheme 样式配置' }),
    ]),
  )
})
```

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
pnpm --filter ga-ui-docs exec vitest run src/content/search.spec.ts
```

Expected: FAIL because theme fields are not indexed.

- [ ] **Step 3: Add style search entries**

Import `mergeStyleConfigs` and `styleConfigOverrides`, merge groups for each component, and append entries with:

```ts
{
  label: entry.name,
  description: entry.description ?? '',
  path: `/components/${component.slug}#styles`,
  keywords: [
    entry.name,
    group.prop,
    group.type,
    component.name,
    component.title,
    '样式配置',
    'theme',
  ],
  meta: `${component.title} · ${group.prop} 样式配置`,
}
```

Return component, API, and style entries together.

- [ ] **Step 4: Run search tests and verify GREEN**

```powershell
pnpm --filter ga-ui-docs exec vitest run src/content/search.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Commit search integration**

```powershell
git add docs/src/content/search.ts docs/src/content/search.spec.ts
git commit -m "feat(docs): index component theme fields"
```

### Task 6: Full Verification

**Files:**
- Verify all modified documentation files.

- [ ] **Step 1: Regenerate API and run all documentation tests**

```powershell
pnpm --filter ga-ui-docs generate:api
pnpm docs:test
```

Expected: all Vitest and Node tests PASS.

- [ ] **Step 2: Run type checking and production build**

```powershell
pnpm --filter ga-ui-docs typecheck
pnpm docs:build
```

Expected: both commands exit 0.

- [ ] **Step 3: Check generated output and whitespace**

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors; only intended documentation changes are present.

- [ ] **Step 4: Start the documentation preview and inspect themed pages**

```powershell
pnpm docs:dev
```

Verify in the browser:

- MegaMenu displays all menu and panel theme fields.
- Pagination, Table, and AsideMenu display one theme group each.
- TablePagination displays separate `tableTheme` and `paginationTheme` groups.
- Dialog and SearchBar omit the style section.
- Searching `menuItemActiveBackgroundColor` navigates to MegaMenu `#styles`.
- Tables remain readable at desktop and narrow documentation widths.

- [ ] **Step 5: Commit final generated and integration changes**

```powershell
git add docs
git commit -m "docs: complete component theme configuration reference"
```

## Appendix A: Theme Field Documentation

### `GaMegaMenuTheme`

Group description: `配置当前大型菜单实例的一级菜单和二级面板样式，未传字段继续使用内置主题。`

| Field | Description | Default |
| --- | --- | --- |
| `menuBackgroundColor` | 一级菜单区域背景色 | `#2f436b` |
| `menuGap` | 一级菜单项之间的间距 | `8` |
| `menuItemTextColor` | 一级菜单项文字颜色 | `#ffffff` |
| `menuItemBackgroundColor` | 一级菜单项背景色 | `#3d527c` |
| `menuItemBorderColor` | 一级菜单项边框颜色 | `transparent` |
| `menuItemHoverTextColor` | 一级菜单项悬停文字颜色 | `#ffffff` |
| `menuItemHoverBackgroundColor` | 一级菜单项悬停背景色 | `#465d89` |
| `menuItemHoverBorderColor` | 一级菜单项悬停边框颜色 | `rgb(255 255 255 / 12%)` |
| `menuItemActiveTextColor` | 一级菜单项激活文字颜色 | `#ffffff` |
| `menuItemActiveBackgroundColor` | 一级菜单项激活背景色 | `#315c96` |
| `menuItemActiveBorderColor` | 一级菜单项激活边框颜色 | `#4c78b1` |
| `menuItemDisabledTextColor` | 一级菜单项禁用文字颜色 | `rgb(255 255 255 / 45%)` |
| `menuItemDisabledBackgroundColor` | 一级菜单项禁用背景色 | `rgb(255 255 255 / 8%)` |
| `menuItemDisabledBorderColor` | 一级菜单项禁用边框颜色 | `transparent` |
| `menuItemFocusOutlineColor` | 一级菜单项键盘聚焦轮廓颜色 | `#8db7f0` |
| `menuItemFontSize` | 一级菜单项字号 | `20` |
| `menuItemFontWeight` | 一级菜单项字重 | `700` |
| `menuItemIconSize` | 一级菜单项图标尺寸 | `26` |
| `menuItemGap` | 一级菜单项图标与文字的间距 | `10` |
| `menuItemHorizontalPadding` | 一级菜单项左右内边距 | `24` |
| `menuItemVerticalSpace` | 一级菜单项上下留白 | `32` |
| `menuItemBorderRadius` | 一级菜单项圆角 | `14` |
| `menuItemShadow` | 一级菜单项默认阴影 | `0 1px 1px rgb(15 31 58 / 18%)` |
| `menuItemActiveShadow` | 一级菜单项激活阴影 | `inset 0 1px 0 rgb(255 255 255 / 6%), 0 1px 2px rgb(13 29 55 / 22%)` |
| `panelBackgroundColor` | 二级面板背景色 | `#2f436b` |
| `panelBorderColor` | 二级面板边框颜色 | `#415a86` |
| `panelTopBorderColor` | 二级面板顶部边框颜色 | `rgb(255 255 255 / 8%)` |
| `panelShadow` | 二级面板阴影 | `0 18px 40px rgb(15 31 58 / 28%)` |
| `panelPadding` | 二级面板内边距 | `24` |
| `panelGap` | 二级面板分组之间的间距 | `24` |
| `panelGroupTitleColor` | 二级面板分组标题颜色 | `#b7c4da` |
| `panelGroupTitleFontSize` | 二级面板分组标题字号 | `13` |
| `panelGroupTitleFontWeight` | 二级面板分组标题字重 | `600` |
| `panelGroupTitleMarginBottom` | 二级面板分组标题下外边距 | `10` |
| `panelGroupTitleHorizontalPadding` | 二级面板分组标题左右内边距 | `12` |
| `panelItemTextColor` | 二级菜单项文字颜色 | `#ffffff` |
| `panelItemBackgroundColor` | 二级菜单项背景色 | `#3d527c` |
| `panelItemBorderColor` | 二级菜单项边框颜色 | `transparent` |
| `panelItemHoverTextColor` | 二级菜单项悬停文字颜色 | `#ffffff` |
| `panelItemHoverBackgroundColor` | 二级菜单项悬停背景色 | `#465d89` |
| `panelItemHoverBorderColor` | 二级菜单项悬停边框颜色 | `rgb(255 255 255 / 12%)` |
| `panelItemActiveTextColor` | 二级菜单项激活文字颜色 | `#ffffff` |
| `panelItemActiveBackgroundColor` | 二级菜单项激活背景色 | `#315c96` |
| `panelItemActiveBorderColor` | 二级菜单项激活边框颜色 | `#4c78b1` |
| `panelItemDisabledTextColor` | 二级菜单项禁用文字颜色 | `rgb(255 255 255 / 42%)` |
| `panelItemDisabledBackgroundColor` | 二级菜单项禁用背景色 | `rgb(255 255 255 / 6%)` |
| `panelItemDisabledBorderColor` | 二级菜单项禁用边框颜色 | `transparent` |
| `panelItemFocusOutlineColor` | 二级菜单项键盘聚焦轮廓颜色 | `#8db7f0` |
| `panelItemBorderRadius` | 二级菜单项圆角 | `10` |
| `panelItemMinHeight` | 二级菜单项最小高度 | `64` |
| `panelItemPadding` | 二级菜单项内边距 | `12` |
| `panelItemGap` | 二级菜单项图标与内容的间距 | `12` |
| `panelItemListGap` | 同组二级菜单项之间的间距 | `8` |
| `panelItemLabelFontSize` | 二级菜单项标题字号 | `14` |
| `panelItemLabelFontWeight` | 二级菜单项标题字重 | `700` |
| `panelItemDescriptionColor` | 二级菜单项描述文字颜色 | `#b7c4da` |
| `panelItemDescriptionFontSize` | 二级菜单项描述文字字号 | `12` |
| `panelItemDescriptionLineHeight` | 二级菜单项描述文字行高 | `18` |
| `panelItemIconColor` | 二级菜单项图标颜色 | `#ffffff` |
| `panelItemIconSize` | 二级菜单项图标尺寸 | `20` |
| `panelItemIconBoxSize` | 二级菜单项图标容器尺寸 | `38` |
| `panelItemIconBackgroundColor` | 二级菜单项图标容器背景色 | `rgb(255 255 255 / 8%)` |
| `panelItemIconBorderRadius` | 二级菜单项图标容器圆角 | `8` |
| `panelEmptyTextColor` | 空面板提示文字颜色 | `#b7c4da` |
| `panelEmptyPadding` | 空面板提示区域内边距 | `48px 24px` |

### `GaPaginationTheme`

Group description: `配置当前分页实例的容器、按钮、激活、悬停和禁用状态颜色。`

| Field | Description | Default |
| --- | --- | --- |
| `backgroundColor` | 分页整体区域背景色 | `#EEEEEF` |
| `textColor` | 分页普通文字颜色 | `#606266` |
| `buttonColor` | 分页按钮文字颜色 | `#7A7475` |
| `buttonBackgroundColor` | 分页按钮背景色 | `#ffffff` |
| `activeColor` | 当前页按钮文字颜色 | `#ffffff` |
| `activeBackgroundColor` | 当前页按钮背景色 | `#4F7DB2` |
| `hoverColor` | 可交互按钮悬停文字颜色 | `#ffffff` |
| `hoverBackgroundColor` | 可交互按钮悬停背景色 | `#4f7db299` |
| `disabledColor` | 禁用按钮文字颜色 | `#606266` |
| `disabledBackgroundColor` | 禁用按钮背景色 | `#fafafa` |

### `GaTableTheme`

Group description: `配置当前表格实例的表头、行、边框和交互状态颜色。`

| Field | Description | Default |
| --- | --- | --- |
| `backgroundColor` | 表格整体背景色 | `#ffffff` |
| `rowBackgroundColor` | 普通数据行背景色 | `#ffffff` |
| `textColor` | 表格正文文字颜色 | `#344054` |
| `headerBackgroundColor` | 表头背景色 | `#4F7DB2` |
| `headerTextColor` | 表头文字颜色 | `#f9fafb` |
| `borderColor` | 表格边框和分隔线颜色 | `#d0d5dd` |
| `stripeBackgroundColor` | 斑马纹数据行背景色 | `#f8fafc` |
| `hoverBackgroundColor` | 数据行悬停背景色 | `#eff8ff` |
| `currentRowBackgroundColor` | 当前行高亮背景色 | `#d1e9ff` |
| `expandedRowBackgroundColor` | 展开行内容背景色 | `#f2f4f7` |

### `GaAsideMenuTheme`

Group description: `配置当前侧边菜单及折叠弹层共享的背景、文字和状态颜色。`

| Field | Description | Default |
| --- | --- | --- |
| `backgroundColor` | 侧边菜单和折叠弹层背景 | `radial-gradient(130% 55% at 40% -10%, rgba(96, 165, 250, 0.28) 0%, transparent 62%),radial-gradient(85% 40% at 95% 100%, rgba(125, 211, 252, 0.1) 0%, transparent 55%),linear-gradient(168deg, #1d4480 0%, #122c5c 48%, #0a1a3d 100%)` |
| `textColor` | 普通菜单项文字和图标颜色 | `#d0d5dd` |
| `activeTextColor` | 激活菜单项文字和图标颜色 | `#ffffff` |
| `activeBackgroundColor` | 激活菜单项背景 | `linear-gradient(90deg, #4f6ef7, #7a5cf7)` |
| `hoverBackgroundColor` | 菜单项悬停背景色 | `rgba(59, 130, 246, 0.16)` |
| `borderColor` | 侧边菜单边框颜色 | `#344054` |

# GaAsideMenu Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `GaAsideMenu` into a backward-compatible, configuration-driven side menu with recursive nodes, controlled or internal active state, isolated state logic, improved accessibility, and complete public declaration coverage.

**Architecture:** Keep `GaAsideMenu` as the only public component. Split pure node normalization and validation into `menu-items.ts`, recursive Element Plus node rendering into `menu-tree.vue`, and collapse/active synchronization into `use-aside-menu-state.ts`; `index.vue` remains the layout and event integration layer. The existing default-slot API takes priority over the new `items` API, while routing and permissions remain consumer responsibilities.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript 5.8, Element Plus 2.14, SCSS, Vitest, Vue Test Utils, Vite, pnpm.

---

## Working-tree safety

The current workspace already contains an unstaged user edit in `playground/src/demos/AsideMenuDemo.vue`. That file overlaps the approved refactor, so execution must preserve it as the starting point rather than resetting or replacing it from `HEAD`.

- Create branch `codex/aside-menu-refactor` in the current workspace so the existing Playground edit remains present.
- Before editing the demo, save `git diff -- playground/src/demos/AsideMenuDemo.vue` in the task log and preserve the current `Navigator One` slot-menu structure as the compatibility example.
- Never run `git checkout --`, `git restore`, `git reset --hard`, or any command that discards the existing demo edit.
- Before each commit, run `git diff --cached --name-only` and confirm only the task files are staged.
- The committed design at `docs/superpowers/specs/2026-08-12-aside-menu-refactor-design.md` is the source of truth.

## File map

- Modify: `packages/ui/src/business/components/asideMenu/types/index.ts` — public node, prop, event, slot, and expose contracts.
- Create: `packages/ui/src/business/components/asideMenu/src/menu-items.ts` — pure hidden-node filtering and development-warning derivation.
- Create: `packages/ui/src/business/components/asideMenu/src/menu-tree.vue` — recursive rendering of item, submenu, and group nodes.
- Create: `packages/ui/src/business/components/asideMenu/src/use-aside-menu-state.ts` — internal/external collapse and active synchronization.
- Modify: `packages/ui/src/business/components/asideMenu/src/index.vue` — layout, rendering priority, scoped slots, events, warnings, and exposed instance.
- Modify: `packages/ui/src/business/components/asideMenu/style/index.scss` — CSS variables, collapse compensation, trigger focus, and selector isolation.
- Modify: `packages/ui/src/business/components/asideMenu/src/__tests__/aside-menu.spec.ts` — integration, compatibility, state, warnings, slots, and accessibility.
- Create: `packages/ui/src/business/components/asideMenu/src/__tests__/menu-items.spec.ts` — pure normalization and validation tests.
- Create: `packages/ui/src/business/components/asideMenu/src/__tests__/menu-tree.spec.ts` — recursive rendering tests.
- Modify: `packages/ui/src/__tests__/exports.spec.ts` — source-level public type contracts.
- Modify: `packages/ui/scripts/fixtures/node-next-consumer/index.ts` — built root/business NodeNext declarations.
- Modify: `packages/ui/README.md` — configuration API, compatibility, routing boundary, props, events, and slots.
- Modify: `playground/src/demos/AsideMenuDemo.vue` — configuration-driven and legacy-slot examples without alerts or debug logs.

### Task 1: Establish the branch, baseline, and public node contracts

**Files:**
- Modify: `packages/ui/src/business/components/asideMenu/types/index.ts`
- Modify: `packages/ui/src/__tests__/exports.spec.ts`

- [ ] **Step 1: Create the feature branch without discarding the demo edit**

Run:

```powershell
git switch -c codex/aside-menu-refactor
git status --short
git diff -- playground/src/demos/AsideMenuDemo.vue
```

Expected: the branch is active and `playground/src/demos/AsideMenuDemo.vue` remains the only pre-existing unstaged file.

- [ ] **Step 2: Run the current targeted baseline**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus exec vitest run src/business/components/asideMenu/src/__tests__/aside-menu.spec.ts
pnpm.cmd --dir playground build
```

Expected baseline result:

- The AsideMenu test command currently exits 1 with 13/14 tests passing. The known failure is `passes the collapse state to the header slot scope`, because the current component does not bind `collapse` into the header slot. Task 4 deliberately fixes this approved existing defect.
- The Playground build passes. Existing browser-only unresolved icon warnings are not a build failure and will be removed in Task 7.

- [ ] **Step 3: Write failing source-level type contracts**

In `packages/ui/src/__tests__/exports.spec.ts`, replace the two existing type imports from `../business` with this single import:

```ts
import type {
  GaAsideMenuEmits,
  GaAsideMenuNode,
  GaAsideMenuProps,
  GaAsideMenuStateSlotProps,
  GaAsideMenuTriggerSlotProps,
  GaTablePaginationProps,
} from '../business'
```

In the existing root type import from `../index`, add these three node/slot aliases immediately after `RootGaAsideMenuExpose` so all other root type imports remain unchanged:

```ts
  GaAsideMenuNode as RootGaAsideMenuNode,
  GaAsideMenuStateSlotProps as RootGaAsideMenuStateSlotProps,
  GaAsideMenuTriggerSlotProps as RootGaAsideMenuTriggerSlotProps,
```

Replace the AsideMenu portion of `RootTypeContract` with:

```ts
  RootGaAsideMenuProps,
  RootGaAsideMenuEmits,
  RootGaAsideMenuExpose,
  RootGaAsideMenuNode,
  RootGaAsideMenuStateSlotProps,
  RootGaAsideMenuTriggerSlotProps,
```

Then add these compile-time checks below the existing AsideMenu contract:

```ts
const configuredAsideMenuNodes: GaAsideMenuNode[] = [
  {
    type: 'submenu',
    index: 'system',
    label: '系统管理',
    children: [
      {
        type: 'item',
        index: 'users',
        label: '用户管理',
      },
    ],
  },
]

const configuredAsideMenuProps: GaAsideMenuProps = {
  items: configuredAsideMenuNodes,
  active: 'users',
  defaultActive: 'system',
}

const asideMenuStateSlot: GaAsideMenuStateSlotProps = {
  collapse: false,
  active: 'users',
}

const asideMenuTriggerSlot: GaAsideMenuTriggerSlotProps = {
  ...asideMenuStateSlot,
  toggle: () => undefined,
}

function checkAsideMenuActiveEmit(emit: GaAsideMenuEmits) {
  emit('update:active', 'users')
}

void configuredAsideMenuProps
void asideMenuStateSlot
void asideMenuTriggerSlot
void checkAsideMenuActiveEmit
```

- [ ] **Step 4: Run the type check and verify the contracts fail**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus run test:type
```

Expected: FAIL because `GaAsideMenuNode`, the slot-scope types, `items`, `active`, and `update:active` do not exist yet.

- [ ] **Step 5: Add the complete public types**

Replace `packages/ui/src/business/components/asideMenu/types/index.ts` with:

```ts
import type {
  MenuInstance,
  MenuItemClicked,
  MenuPropsPublic,
} from 'element-plus'
import type { Component } from 'vue'

export type GaAsideMenuNode =
  | GaAsideMenuItem
  | GaAsideSubMenu
  | GaAsideMenuGroup

export interface GaAsideMenuItem {
  type: 'item'
  index: string
  label: string
  icon?: Component
  disabled?: boolean
  hidden?: boolean
}

export interface GaAsideSubMenu {
  type: 'submenu'
  index: string
  label: string
  icon?: Component
  disabled?: boolean
  hidden?: boolean
  children: GaAsideMenuNode[]
}

export interface GaAsideMenuGroup {
  type: 'group'
  label: string
  hidden?: boolean
  children: Array<GaAsideMenuItem | GaAsideSubMenu>
}

export type GaAsideMenuProps = Omit<MenuPropsPublic, 'mode' | 'collapse'> & {
  collapse?: boolean
  width?: string
  items?: readonly GaAsideMenuNode[]
  active?: string
}

export interface GaAsideMenuEmits {
  (event: 'update:collapse', collapse: boolean): void
  (event: 'update:active', active: string): void
  (event: 'toggle', collapse: boolean): void
  (
    event: 'select',
    index: string,
    indexPath: string[],
    item: MenuItemClicked,
    routerResult?: Promise<unknown>,
  ): void
  (event: 'open', index: string, indexPath: string[]): void
  (event: 'close', index: string, indexPath: string[]): void
}

export interface GaAsideMenuStateSlotProps {
  collapse: boolean
  active: string
}

export interface GaAsideMenuTriggerSlotProps
  extends GaAsideMenuStateSlotProps {
  toggle: () => void
}

export interface GaAsideMenuExpose {
  menuRef: MenuInstance | undefined
  toggle: () => void
}
```

Update `packages/ui/src/business/components/asideMenu/index.ts` to export all new public types:

```ts
export type {
  GaAsideMenuEmits,
  GaAsideMenuExpose,
  GaAsideMenuGroup,
  GaAsideMenuItem,
  GaAsideMenuNode,
  GaAsideMenuProps,
  GaAsideMenuStateSlotProps,
  GaAsideMenuTriggerSlotProps,
  GaAsideSubMenu,
} from './types'
```

- [ ] **Step 6: Verify the public type contracts pass**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus run test:type
```

Expected: PASS with no TypeScript diagnostics.

- [ ] **Step 7: Commit the public contract**

```powershell
git add -- packages/ui/src/business/components/asideMenu/types/index.ts packages/ui/src/business/components/asideMenu/index.ts packages/ui/src/__tests__/exports.spec.ts
git diff --cached --name-only
git commit -m "feat: define GaAsideMenu configuration contract"
```

Expected staged files: the three listed paths only.

### Task 2: Add pure node normalization and configuration validation

**Files:**
- Create: `packages/ui/src/business/components/asideMenu/src/menu-items.ts`
- Create: `packages/ui/src/business/components/asideMenu/src/__tests__/menu-items.spec.ts`

- [ ] **Step 1: Write failing normalization and validation tests**

Create `packages/ui/src/business/components/asideMenu/src/__tests__/menu-items.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import type { GaAsideMenuNode } from '../../types'
import {
  getAsideMenuConfigurationWarnings,
  normalizeAsideMenuNodes,
} from '../menu-items'

describe('GaAsideMenu menu item helpers', () => {
  it('filters hidden nodes and empty containers without mutating input', () => {
    const nodes: GaAsideMenuNode[] = [
      { type: 'item', index: 'visible', label: 'Visible' },
      { type: 'item', index: 'hidden', label: 'Hidden', hidden: true },
      {
        type: 'submenu',
        index: 'empty-submenu',
        label: 'Empty submenu',
        children: [
          { type: 'item', index: 'hidden-child', label: 'Hidden', hidden: true },
        ],
      },
      {
        type: 'group',
        label: 'Reports',
        children: [
          { type: 'item', index: 'report', label: 'Report' },
          { type: 'item', index: 'hidden-report', label: 'Hidden', hidden: true },
        ],
      },
    ]
    const snapshot = structuredClone(nodes)

    expect(normalizeAsideMenuNodes(nodes)).toEqual([
      { type: 'item', index: 'visible', label: 'Visible' },
      {
        type: 'group',
        label: 'Reports',
        children: [{ type: 'item', index: 'report', label: 'Report' }],
      },
    ])
    expect(nodes).toEqual(snapshot)
  })

  it('reports empty and duplicate indexes plus empty visible containers', () => {
    const nodes: GaAsideMenuNode[] = [
      { type: 'item', index: '', label: 'No index' },
      { type: 'item', index: 'users', label: 'Users' },
      { type: 'item', index: 'users', label: 'Duplicate users' },
      {
        type: 'submenu',
        index: 'system',
        label: 'System',
        children: [
          { type: 'item', index: 'hidden', label: 'Hidden', hidden: true },
        ],
      },
      { type: 'group', label: 'Empty group', children: [] },
    ]

    expect(getAsideMenuConfigurationWarnings(nodes, false)).toEqual([
      'Menu item "No index" requires a non-empty index.',
      'Duplicate menu index "users".',
      'Submenu "system" has no visible children.',
      'Menu group "Empty group" has no visible children.',
    ])
  })

  it('reports when the default slot takes priority over items', () => {
    expect(
      getAsideMenuConfigurationWarnings(
        [{ type: 'item', index: 'users', label: 'Users' }],
        true,
      ),
    ).toContain(
      'The default slot and items were both provided; the default slot takes precedence.',
    )
  })
})
```

- [ ] **Step 2: Run the helper test and verify it fails**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus exec vitest run src/business/components/asideMenu/src/__tests__/menu-items.spec.ts
```

Expected: FAIL because `../menu-items` does not exist.

- [ ] **Step 3: Implement the pure helpers**

Create `packages/ui/src/business/components/asideMenu/src/menu-items.ts`:

```ts
import type {
  GaAsideMenuGroup,
  GaAsideMenuItem,
  GaAsideMenuNode,
  GaAsideSubMenu,
} from '../types'

const hasVisibleChildren = (
  node: GaAsideSubMenu | GaAsideMenuGroup,
) => normalizeAsideMenuNodes(node.children).length > 0

export function normalizeAsideMenuNodes(
  nodes: readonly GaAsideMenuNode[],
): GaAsideMenuNode[] {
  return nodes.flatMap((node) => {
    if (node.hidden) return []
    if (node.type === 'item') return [node]

    const children = normalizeAsideMenuNodes(node.children)
    if (children.length === 0) return []

    if (node.type === 'group') {
      return [
        {
          ...node,
          children: children as Array<GaAsideMenuItem | GaAsideSubMenu>,
        },
      ]
    }

    return [{ ...node, children }]
  })
}

export function getAsideMenuConfigurationWarnings(
  nodes: readonly GaAsideMenuNode[],
  hasDefaultSlot: boolean,
): string[] {
  const warnings: string[] = []
  const indexes = new Set<string>()

  if (hasDefaultSlot && nodes.length > 0) {
    warnings.push(
      'The default slot and items were both provided; the default slot takes precedence.',
    )
  }

  const visit = (node: GaAsideMenuNode) => {
    if (node.hidden) return

    if (node.type !== 'group') {
      const index = node.index.trim()

      if (!index) {
        const type = node.type === 'item' ? 'Menu item' : 'Submenu'
        warnings.push(`${type} "${node.label}" requires a non-empty index.`)
      } else if (indexes.has(index)) {
        warnings.push(`Duplicate menu index "${index}".`)
      } else {
        indexes.add(index)
      }
    }

    if (node.type === 'item') return

    if (!hasVisibleChildren(node)) {
      const type = node.type === 'group' ? 'Menu group' : 'Submenu'
      const name = node.type === 'group' ? node.label : node.index
      warnings.push(`${type} "${name}" has no visible children.`)
    }

    node.children.forEach(visit)
  }

  nodes.forEach(visit)
  return [...new Set(warnings)]
}
```

- [ ] **Step 4: Verify helper tests pass**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus exec vitest run src/business/components/asideMenu/src/__tests__/menu-items.spec.ts
```

Expected: 1 test file and 3 tests pass.

- [ ] **Step 5: Commit the pure helpers**

```powershell
git add -- packages/ui/src/business/components/asideMenu/src/menu-items.ts packages/ui/src/business/components/asideMenu/src/__tests__/menu-items.spec.ts
git diff --cached --name-only
git commit -m "feat: normalize GaAsideMenu configuration nodes"
```

### Task 3: Add recursive configuration rendering

**Files:**
- Create: `packages/ui/src/business/components/asideMenu/src/menu-tree.vue`
- Create: `packages/ui/src/business/components/asideMenu/src/__tests__/menu-tree.spec.ts`

- [ ] **Step 1: Write the failing recursive-render test**

Create `packages/ui/src/business/components/asideMenu/src/__tests__/menu-tree.spec.ts` with lightweight Element Plus stubs:

```ts
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import type { GaAsideMenuNode } from '../../types'
import GaMenuTree from '../menu-tree.vue'

const slotStub = (name: string, tag: string) =>
  defineComponent({
    name,
    inheritAttrs: false,
    props: {
      index: String,
      title: String,
      disabled: Boolean,
    },
    setup(props, { attrs, slots }) {
      return () =>
        h(
          tag,
          {
            ...attrs,
            class: name,
            'data-index': props.index,
            'data-disabled': String(props.disabled),
          },
          [
            slots.title ? h('span', { class: 'title' }, slots.title()) : props.title,
            slots.default?.(),
          ],
        )
    },
  })

const ElMenuItemStub = slotStub('ElMenuItem', 'li')
const ElSubMenuStub = slotStub('ElSubMenu', 'section')
const ElMenuItemGroupStub = slotStub('ElMenuItemGroup', 'div')
const ElIconStub = defineComponent({
  name: 'ElIcon',
  setup(_, { slots }) {
    return () => h('i', { class: 'ElIcon' }, slots.default?.())
  },
})

const TestIcon = defineComponent({
  name: 'TestIcon',
  setup: () => () => h('svg', { class: 'test-icon' }),
})

describe('GaMenuTree', () => {
  it('renders items, submenus, groups, icons, and disabled state recursively', () => {
    const nodes: GaAsideMenuNode[] = [
      {
        type: 'submenu',
        index: 'system',
        label: 'System',
        icon: TestIcon,
        children: [
          {
            type: 'group',
            label: 'Accounts',
            children: [
              {
                type: 'item',
                index: 'users',
                label: 'Users',
                disabled: true,
              },
            ],
          },
          {
            type: 'group',
            label: 'Accounts',
            children: [
              {
                type: 'item',
                index: 'audit',
                label: 'Audit',
              },
            ],
          },
        ],
      },
    ]

    const wrapper = mount(GaMenuTree, {
      props: { nodes },
      global: {
        stubs: {
          ElMenuItem: ElMenuItemStub,
          ElSubMenu: ElSubMenuStub,
          ElMenuItemGroup: ElMenuItemGroupStub,
          ElIcon: ElIconStub,
        },
      },
    })

    expect(wrapper.find('[data-index="system"] > .title').text()).toContain(
      'System',
    )
    expect(wrapper.find('.test-icon').exists()).toBe(true)
    expect(wrapper.findAllComponents(ElMenuItemGroupStub)).toHaveLength(2)
    expect(wrapper.find('[data-index="users"]').text()).toContain('Users')
    expect(wrapper.find('[data-index="users"]').attributes('data-disabled')).toBe(
      'true',
    )
    expect(wrapper.find('[data-index="audit"]').text()).toContain('Audit')
  })
})
```

- [ ] **Step 2: Run the recursive-render test and verify it fails**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus exec vitest run src/business/components/asideMenu/src/__tests__/menu-tree.spec.ts
```

Expected: FAIL because `menu-tree.vue` does not exist.

- [ ] **Step 3: Implement the recursive renderer**

Create `packages/ui/src/business/components/asideMenu/src/menu-tree.vue`:

```vue
<template>
  <template
    v-for="(node, nodeIndex) in props.nodes"
    :key="nodeKey(node, nodeIndex)"
  >
    <ElMenuItem
      v-if="node.type === 'item'"
      :index="node.index"
      :disabled="node.disabled"
    >
      <ElIcon v-if="node.icon" aria-hidden="true">
        <component :is="node.icon" />
      </ElIcon>
      <template #title>{{ node.label }}</template>
    </ElMenuItem>

    <ElSubMenu
      v-else-if="node.type === 'submenu'"
      :index="node.index"
      :disabled="node.disabled"
    >
      <template #title>
        <ElIcon v-if="node.icon" aria-hidden="true">
          <component :is="node.icon" />
        </ElIcon>
        <span>{{ node.label }}</span>
      </template>
      <GaMenuTree :nodes="node.children" />
    </ElSubMenu>

    <ElMenuItemGroup v-else :title="node.label">
      <GaMenuTree :nodes="node.children" />
    </ElMenuItemGroup>
  </template>
</template>

<script setup lang="ts">
import { ElIcon, ElMenuItem, ElMenuItemGroup, ElSubMenu } from 'element-plus'

import type { GaAsideMenuNode } from '../types'

defineOptions({ name: 'GaMenuTree' })

const props = defineProps<{
  nodes: readonly GaAsideMenuNode[]
}>()

const nodeKey = (node: GaAsideMenuNode, nodeIndex: number) =>
  node.type === 'group'
    ? `group:${node.label}:${nodeIndex}`
    : `${node.type}:${node.index}`
</script>
```

- [ ] **Step 4: Verify the recursive-render test passes**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus exec vitest run src/business/components/asideMenu/src/__tests__/menu-tree.spec.ts
```

Expected: 1 test passes with no unresolved-component warnings.

- [ ] **Step 5: Commit the recursive renderer**

```powershell
git add -- packages/ui/src/business/components/asideMenu/src/menu-tree.vue packages/ui/src/business/components/asideMenu/src/__tests__/menu-tree.spec.ts
git diff --cached --name-only
git commit -m "feat: render GaAsideMenu configuration tree"
```

### Task 4: Isolate collapse and active state, then integrate the new render path

**Files:**
- Create: `packages/ui/src/business/components/asideMenu/src/use-aside-menu-state.ts`
- Modify: `packages/ui/src/business/components/asideMenu/src/index.vue`
- Modify: `packages/ui/src/business/components/asideMenu/src/__tests__/aside-menu.spec.ts`

- [ ] **Step 1: Extend the ElMenu stub and write failing state/configuration tests**

In `aside-menu.spec.ts`, replace the existing Vue and Vitest imports, add an exposed `updateActiveIndex` spy to `ElMenuStub`, and reset it before each test:

```ts
import { defineComponent, h, nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const updateActiveIndex = vi.fn()

beforeEach(() => {
  updateActiveIndex.mockReset()
})
```

Change `ElMenuStub.setup` from `setup(_, { attrs, slots })` to `setup(_, { attrs, expose, slots })`, then call:

```ts
expose({
  open: vi.fn(),
  close: vi.fn(),
  handleResize: vi.fn(),
  updateActiveIndex,
})
```

Add `defaultActive: String` to the stub props. Append the following tests to the existing `describe('GaAsideMenu', ...)` block:

```ts
it('renders normalized items only when the default slot is absent', () => {
  const configured = mountAsideMenu({
    props: {
      items: [
        { type: 'item', index: 'users', label: 'Users' },
        { type: 'item', index: 'hidden', label: 'Hidden', hidden: true },
      ],
    },
  })

  expect(configured.findComponent({ name: 'GaMenuTree' }).props('nodes')).toEqual([
    { type: 'item', index: 'users', label: 'Users' },
  ])

  const slotted = mountAsideMenu({
    props: {
      items: [{ type: 'item', index: 'users', label: 'Users' }],
    },
    slots: {
      default: '<li class="legacy-menu">Legacy menu</li>',
    },
  })

  expect(slotted.find('.legacy-menu').exists()).toBe(true)
  expect(slotted.findComponent({ name: 'GaMenuTree' }).exists()).toBe(false)
})

it('re-renders normalized items when the configuration changes', async () => {
  const wrapper = mountAsideMenu({
    props: {
      items: [{ type: 'item', index: 'users', label: 'Users' }],
    },
  })

  await wrapper.setProps({
    items: [
      { type: 'item', index: 'users', label: 'Users', hidden: true },
      { type: 'item', index: 'reports', label: 'Reports' },
    ],
  })

  expect(wrapper.findComponent({ name: 'GaMenuTree' }).props('nodes')).toEqual([
    { type: 'item', index: 'reports', label: 'Reports' },
  ])
})

it('initializes active from active before defaultActive', () => {
  const controlled = mountAsideMenu({
    props: { active: 'users', defaultActive: 'dashboard' },
  })
  const legacy = mountAsideMenu({
    props: { defaultActive: 'dashboard' },
  })

  expect(controlled.findComponent(ElMenuStub).props('defaultActive')).toBe('users')
  expect(legacy.findComponent(ElMenuStub).props('defaultActive')).toBe(
    'dashboard',
  )
})

it('updates active internally and emits both active and select events', async () => {
  const wrapper = mountAsideMenu({ props: { active: 'dashboard' } })
  const item = { index: 'users', indexPath: ['system', 'users'] }

  wrapper
    .findComponent(ElMenuStub)
    .vm.$emit('select', 'users', ['system', 'users'], item)
  await nextTick()

  expect(wrapper.findComponent(ElMenuStub).props('defaultActive')).toBe('users')
  expect(wrapper.emitted('update:active')).toEqual([['users']])
  expect(wrapper.emitted('select')).toEqual([
    ['users', ['system', 'users'], item, undefined],
  ])
})

it('does not re-emit active when selecting the current index', async () => {
  const wrapper = mountAsideMenu({ props: { active: 'users' } })
  const item = { index: 'users', indexPath: ['system', 'users'] }

  wrapper
    .findComponent(ElMenuStub)
    .vm.$emit('select', 'users', ['system', 'users'], item)
  await nextTick()

  expect(wrapper.emitted('update:active')).toBeUndefined()
  expect(wrapper.emitted('select')).toEqual([
    ['users', ['system', 'users'], item, undefined],
  ])
})

it('synchronizes external active changes through the menu instance', async () => {
  const wrapper = mountAsideMenu({ props: { active: 'dashboard' } })

  await wrapper.setProps({ active: 'reports' })
  await nextTick()

  expect(wrapper.findComponent(ElMenuStub).props('defaultActive')).toBe('reports')
  expect(updateActiveIndex).toHaveBeenCalledWith('reports')
})

it('passes collapse and active to state slots', () => {
  const wrapper = mountAsideMenu({
    props: { collapse: true, active: 'users' },
    slots: {
      header: ({ collapse, active }) =>
        h('div', { class: 'header-state' }, `${collapse}:${active}`),
      footer: ({ collapse, active }) =>
        h('div', { class: 'footer-state' }, `${collapse}:${active}`),
      trigger: ({ collapse, active, toggle }) =>
        h(
          'button',
          { class: 'trigger-state', onClick: toggle },
          `${collapse}:${active}`,
        ),
    },
  })

  expect(wrapper.find('.header-state').text()).toBe('true:users')
  expect(wrapper.find('.footer-state').text()).toBe('true:users')
  expect(wrapper.find('.trigger-state').text()).toBe('true:users')
})

it('publishes the expanded width through the component CSS variable', () => {
  const wrapper = mountAsideMenu({ props: { width: '300px' } })

  expect(wrapper.findComponent(ElAsideStub).attributes('style')).toContain(
    '--ga-aside-menu-width: 300px',
  )
})

it('warns once for invalid configuration and slot priority in development', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  const wrapper = mountAsideMenu({
    props: {
      items: [
        { type: 'item', index: 'users', label: 'Users' },
        { type: 'item', index: 'users', label: 'Duplicate' },
      ],
    },
    slots: { default: '<li>Legacy</li>' },
  })

  await wrapper.setProps({ width: '280px' })

  expect(warn).toHaveBeenCalledWith(
    '[GaAsideMenu] The default slot and items were both provided; the default slot takes precedence.',
  )
  expect(warn).toHaveBeenCalledWith(
    '[GaAsideMenu] Duplicate menu index "users".',
  )
  expect(warn).toHaveBeenCalledTimes(2)
  warn.mockRestore()
})
```

Update the existing menu-prop forwarding test to assert that `items`, `active`, `defaultActive`, `collapse`, and `width` do not appear in the forwarded attrs while `default-active` is bound explicitly from `currentActive`.

Use these assertions after `const menu = wrapper.findComponent(ElMenuStub)`:

```ts
expect(menu.props('mode')).toBe('vertical')
expect(menu.props('defaultActive')).toBe('1-1')
expect(menu.attributes()).not.toHaveProperty('items')
expect(menu.attributes()).not.toHaveProperty('active')
expect(menu.attributes()).not.toHaveProperty('defaultactive')
expect(menu.attributes()).not.toHaveProperty('width')
```

Retain these positive expectations from the existing test: `defaultOpeneds`, `uniqueOpened`, `router`, `menuTrigger`, color props, transition/ellipsis flags, popper props, timeouts, `closeOnClickOutside`, and the explicit `collapse: false` prop.

- [ ] **Step 2: Run the targeted integration tests and verify they fail**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus exec vitest run src/business/components/asideMenu/src/__tests__/aside-menu.spec.ts
```

Expected: FAIL because active state, `GaMenuTree`, scoped header/footer state, and development warnings are not integrated.

- [ ] **Step 3: Implement the state composable**

Create `packages/ui/src/business/components/asideMenu/src/use-aside-menu-state.ts`:

```ts
import type { MenuInstance } from 'element-plus'
import { nextTick, ref, watch } from 'vue'
import type { Ref } from 'vue'

import type { GaAsideMenuProps } from '../types'

interface UseAsideMenuStateOptions {
  props: Readonly<
    Pick<GaAsideMenuProps, 'collapse' | 'active' | 'defaultActive'>
  >
  menuRef: Ref<MenuInstance | undefined>
  onCollapseUpdate: (value: boolean) => void
  onToggle: (value: boolean) => void
  onActiveUpdate: (value: string) => void
}

export function useAsideMenuState(options: UseAsideMenuStateOptions) {
  const currentCollapse = ref(options.props.collapse ?? false)
  const currentActive = ref(
    options.props.active ?? options.props.defaultActive ?? '',
  )

  watch(
    () => options.props.collapse,
    (value) => {
      currentCollapse.value = value ?? false
    },
  )

  watch(
    () => options.props.active,
    (value) => {
      if (value === undefined) return

      currentActive.value = value
      void nextTick(() => options.menuRef.value?.updateActiveIndex(value))
    },
  )

  const setCollapse = (value: boolean) => {
    if (currentCollapse.value === value) return

    currentCollapse.value = value
    options.onCollapseUpdate(value)
    options.onToggle(value)
  }

  const toggleCollapse = () => {
    setCollapse(!currentCollapse.value)
  }

  const selectActive = (value: string) => {
    if (currentActive.value === value) return

    currentActive.value = value
    options.onActiveUpdate(value)
  }

  return {
    currentActive,
    currentCollapse,
    selectActive,
    toggleCollapse,
  }
}
```

- [ ] **Step 4: Refactor the main component around the three internal units**

Replace `packages/ui/src/business/components/asideMenu/src/index.vue` with:

```vue
<template>
  <ElAside
    v-bind="$attrs"
    :width="currentWidth"
    class="ga-aside-menu"
    :style="{ '--ga-aside-menu-width': props.width }"
  >
    <div v-if="slots.header" class="ga-aside-menu__header">
      <slot
        name="header"
        :collapse="currentCollapse"
        :active="currentActive"
      />
    </div>

    <ElScrollbar class="ga-aside-menu__body">
      <ElMenu
        ref="menuRef"
        v-bind="menuProps"
        class="ga-aside-menu__menu"
        mode="vertical"
        :collapse="currentCollapse"
        :default-active="currentActive"
        @select="handleSelect"
        @open="handleOpen"
        @close="handleClose"
      >
        <slot v-if="slots.default" />
        <GaMenuTree
          v-else-if="normalizedItems.length"
          :nodes="normalizedItems"
        />
      </ElMenu>
    </ElScrollbar>

    <div v-if="slots.footer" class="ga-aside-menu__footer">
      <slot
        name="footer"
        :collapse="currentCollapse"
        :active="currentActive"
      />
    </div>

    <div class="ga-aside-menu__trigger">
      <slot
        name="trigger"
        :collapse="currentCollapse"
        :active="currentActive"
        :toggle="toggleCollapse"
      >
        <button
          type="button"
          class="ga-aside-menu__trigger-btn"
          :aria-label="currentCollapse ? '展开菜单' : '折叠菜单'"
          :title="currentCollapse ? '展开菜单' : '折叠菜单'"
          @click="toggleCollapse"
        >
          <svg
            v-if="currentCollapse"
            class="ga-aside-menu__trigger-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"
            />
            <path d="M15 4v16" />
            <path d="M9 10l2 2l-2 2" />
          </svg>

          <svg
            v-else
            class="ga-aside-menu__trigger-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"
            />
            <path d="M9 4v16" />
            <path d="M15 10l-2 2l2 2" />
          </svg>

          <span v-if="!currentCollapse">折叠菜单</span>
        </button>
      </slot>
    </div>
  </ElAside>
</template>

<script setup lang="ts">
import { ElAside, ElMenu, ElScrollbar } from 'element-plus'
import type { MenuInstance, MenuItemClicked } from 'element-plus'
import { computed, ref, useSlots, watchEffect } from 'vue'
import type { Slots } from 'vue'

import type { GaAsideMenuEmits, GaAsideMenuProps } from '../types'
import {
  getAsideMenuConfigurationWarnings,
  normalizeAsideMenuNodes,
} from './menu-items'
import GaMenuTree from './menu-tree.vue'
import { useAsideMenuState } from './use-aside-menu-state'

defineOptions({
  name: 'GaAsideMenu',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<GaAsideMenuProps>(), {
  collapse: false,
  width: '240px',
  items: () => [],
})

const emit = defineEmits<GaAsideMenuEmits>()
const slots: Slots = useSlots()
const menuRef = ref<MenuInstance>()

const {
  currentActive,
  currentCollapse,
  selectActive,
  toggleCollapse,
} = useAsideMenuState({
  props,
  menuRef,
  onCollapseUpdate: (value) => emit('update:collapse', value),
  onToggle: (value) => emit('toggle', value),
  onActiveUpdate: (value) => emit('update:active', value),
})

const currentWidth = computed(() =>
  currentCollapse.value ? 'auto' : props.width,
)

const normalizedItems = computed(() => normalizeAsideMenuNodes(props.items))

const menuProps = computed(() => {
  const {
    active,
    collapse,
    defaultActive,
    items,
    width,
    ...elMenuProps
  } = props

  return elMenuProps
})

const warnedMessages = new Set<string>()

watchEffect(() => {
  if (!import.meta.env.DEV) return

  const messages = getAsideMenuConfigurationWarnings(
    props.items,
    Boolean(slots.default),
  )

  messages.forEach((message) => {
    if (warnedMessages.has(message)) return

    warnedMessages.add(message)
    console.warn(`[GaAsideMenu] ${message}`)
  })
})

const handleSelect = (
  index: string,
  indexPath: string[],
  item: MenuItemClicked,
  routerResult?: Promise<unknown>,
) => {
  selectActive(index)
  emit('select', index, indexPath, item, routerResult)
}

const handleOpen = (index: string, indexPath: string[]) => {
  emit('open', index, indexPath)
}

const handleClose = (index: string, indexPath: string[]) => {
  emit('close', index, indexPath)
}

defineExpose({
  menuRef,
  toggle: toggleCollapse,
})
</script>

<style lang="scss">
@use '../style/index.scss';
</style>
```

- [ ] **Step 5: Run the entire AsideMenu test group**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus exec vitest run src/business/components/asideMenu/src/__tests__
pnpm.cmd --filter ga-ui-plus run test:type
```

Expected: helper, tree, and integration tests pass with no TypeScript diagnostics.

- [ ] **Step 6: Commit state and integration**

```powershell
git add -- packages/ui/src/business/components/asideMenu/src/index.vue packages/ui/src/business/components/asideMenu/src/use-aside-menu-state.ts packages/ui/src/business/components/asideMenu/src/__tests__/aside-menu.spec.ts
git diff --cached --name-only
git commit -m "feat: add GaAsideMenu active state and configuration mode"
```

### Task 5: Improve isolated styles and trigger accessibility

**Files:**
- Modify: `packages/ui/src/business/components/asideMenu/style/index.scss`
- Modify: `packages/ui/src/business/components/asideMenu/src/__tests__/aside-menu.spec.ts`

- [ ] **Step 1: Replace the comment-only style assertions with failing exact assertions**

In `aside-menu.spec.ts`, replace the existing collapse-style test with:

```ts
it('scopes collapse compensation and trigger focus styles to GaAsideMenu', () => {
  expect(asideMenuStyleSource).toContain('.el-aside.ga-aside-menu')
  expect(asideMenuStyleSource).toContain('> .ga-aside-menu__body')
  expect(asideMenuStyleSource).toContain(
    '.el-menu.ga-aside-menu__menu.el-menu--collapse',
  )
  expect(asideMenuStyleSource).toContain(
    '> .el-menu-item-group > ul > .el-menu-item',
  )
  expect(asideMenuStyleSource).toContain('&:focus-visible')
  expect(asideMenuStyleSource).toContain(
    '--ga-aside-menu-transition-duration',
  )
})
```

Extend the default-trigger test:

```ts
expect(button.attributes('type')).toBe('button')
expect(button.attributes('title')).toBe('折叠菜单')
expect(button.find('svg').attributes('aria-hidden')).toBe('true')
```

Immediately after the existing post-click `aria-label` assertion, add:

```ts
expect(button.attributes('title')).toBe('展开菜单')
```

- [ ] **Step 2: Run the targeted test and verify the style assertion fails**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus exec vitest run src/business/components/asideMenu/src/__tests__/aside-menu.spec.ts
```

Expected: FAIL because the collapse compensation block is commented and the required variables/focus rule are absent.

- [ ] **Step 3: Replace the SCSS with isolated, active rules**

Update `style/index.scss` to this structure:

```scss
.el-aside.ga-aside-menu {
  --ga-aside-menu-width: 240px;
  --ga-aside-menu-trigger-height: 40px;
  --ga-aside-menu-border-color: var(--el-border-color-light);
  --ga-aside-menu-transition-duration: 0.3s;

  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width var(--ga-aside-menu-transition-duration);

  > .ga-aside-menu__header,
  > .ga-aside-menu__footer,
  > .ga-aside-menu__trigger {
    flex: none;
  }

  > .ga-aside-menu__body {
    flex: 1;
    min-height: 0;

    .el-menu.ga-aside-menu__menu {
      border-right: 0;
    }

    .el-menu.ga-aside-menu__menu.el-menu--collapse {
      .el-menu-item-group__title {
        display: none;
      }

      > .el-menu-item-group > ul > .el-menu-item {
        > .el-icon {
          width: var(--el-menu-icon-width);
          margin: 0;
          text-align: center;
          vertical-align: middle;
        }

        > span {
          display: inline-block;
          width: 0;
          height: 0;
          overflow: hidden;
          visibility: hidden;
        }
      }
    }
  }

  > .ga-aside-menu__trigger {
    border-top: 1px solid var(--ga-aside-menu-border-color);

    > .ga-aside-menu__trigger-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: var(--ga-aside-menu-trigger-height);
      padding: 0;
      color: inherit;
      font-size: 14px;
      cursor: pointer;
      background: transparent;
      border: 0;

      &:hover {
        color: var(--el-color-primary);
        background: var(--el-fill-color-light);
      }

      &:focus-visible {
        color: var(--el-color-primary);
        outline: 2px solid var(--el-color-primary);
        outline-offset: -2px;
      }

      > .ga-aside-menu__trigger-icon {
        width: 18px;
        height: 18px;
      }
    }
  }
}
```

- [ ] **Step 4: Verify style and accessibility tests pass**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus exec vitest run src/business/components/asideMenu/src/__tests__/aside-menu.spec.ts
```

Expected: all AsideMenu integration tests pass.

- [ ] **Step 5: Commit the style refactor**

```powershell
git add -- packages/ui/src/business/components/asideMenu/style/index.scss packages/ui/src/business/components/asideMenu/src/__tests__/aside-menu.spec.ts
git diff --cached --name-only
git commit -m "feat: refine GaAsideMenu collapse and focus styles"
```

### Task 6: Strengthen root, business, and NodeNext declaration contracts

**Files:**
- Modify: `packages/ui/src/__tests__/exports.spec.ts`
- Modify: `packages/ui/scripts/fixtures/node-next-consumer/index.ts`

- [ ] **Step 1: Add complete built-declaration consumption**

In the existing import lists in `node-next-consumer/index.ts`, add these types from both `ga-ui-plus` and `ga-ui-plus/business` (use the shown aliases for the business imports and do not create duplicate imports from either package). Also add `GaAsideMenuEmits as BusinessAsideMenuEmits` to the business import so both entry points validate the new event overload:

```ts
type GaAsideMenuNode,
type GaAsideMenuStateSlotProps,
type GaAsideMenuTriggerSlotProps,

type GaAsideMenuNode as BusinessAsideMenuNode,
type GaAsideMenuEmits as BusinessAsideMenuEmits,
type GaAsideMenuStateSlotProps as BusinessAsideMenuStateSlotProps,
type GaAsideMenuTriggerSlotProps as BusinessAsideMenuTriggerSlotProps,
```

Use aliases for the business imports. Replace the current AsideMenu fixtures with:

```ts
const rootAsideMenuNodes: GaAsideMenuNode[] = [
  {
    type: 'submenu',
    index: 'system',
    label: 'System',
    children: [
      { type: 'item', index: 'users', label: 'Users' },
      { type: 'item', index: 'roles', label: 'Roles', disabled: true },
    ],
  },
]

const rootAsideMenuProps: GaAsideMenuProps = {
  collapse: false,
  active: 'users',
  items: rootAsideMenuNodes,
  width: '260px',
  defaultActive: 'system',
  uniqueOpened: true,
}

const businessAsideMenuProps: BusinessAsideMenuProps = {
  collapse: true,
  active: 'roles',
  items: rootAsideMenuNodes,
}

const rootAsideMenuStateSlot: GaAsideMenuStateSlotProps = {
  collapse: false,
  active: 'users',
}

const rootAsideMenuTriggerSlot: GaAsideMenuTriggerSlotProps = {
  ...rootAsideMenuStateSlot,
  toggle: () => undefined,
}

const businessAsideMenuNode: BusinessAsideMenuNode = {
  type: 'item',
  index: 'business',
  label: 'Business',
}

const businessAsideMenuStateSlot: BusinessAsideMenuStateSlotProps = {
  collapse: true,
  active: 'business',
}

const businessAsideMenuTriggerSlot: BusinessAsideMenuTriggerSlotProps = {
  ...businessAsideMenuStateSlot,
  toggle: () => undefined,
}

function checkRootAsideMenuEmits(emit: GaAsideMenuEmits) {
  emit('update:collapse', true)
  emit('update:active', 'users')
  emit('toggle', false)
  emit('select', 'users', ['system', 'users'], {
    index: 'users',
    indexPath: ['system', 'users'],
  })
  emit('open', 'system', ['system'])
  emit('close', 'system', ['system'])
}

function checkBusinessAsideMenuEmits(emit: BusinessAsideMenuEmits) {
  emit('update:collapse', false)
  emit('update:active', 'business')
  emit('toggle', true)
}
```

Add `rootAsideMenuNodes`, all root/business node and slot fixtures, and `checkBusinessAsideMenuEmits` to the final `void [...]` array.

- [ ] **Step 2: Build and verify all public declarations**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus build
pnpm.cmd --filter ga-ui-plus verify:exports
```

Expected output includes:

```text
Verified ga-ui multi-entry build output and <count> relative declaration specifiers.
Verified ga-ui-plus package exports
Verified ga-ui-plus NodeNext declarations with TypeScript 5.8.3
```

`<count>` is generated from the built declaration graph and may increase when the new `menu-tree` and state/helper declarations are emitted; require a positive count rather than pinning the previous baseline value of 26.

- [ ] **Step 3: Commit declaration coverage**

```powershell
git add -- packages/ui/src/__tests__/exports.spec.ts packages/ui/scripts/fixtures/node-next-consumer/index.ts
git diff --cached --name-only
git commit -m "test: cover GaAsideMenu configuration declarations"
```

### Task 7: Document and demonstrate both configuration and slot modes

**Files:**
- Modify: `packages/ui/README.md`
- Modify: `playground/src/demos/AsideMenuDemo.vue`

- [ ] **Step 1: Preserve the existing user-edited slot example before restructuring**

Run:

```powershell
git diff -- playground/src/demos/AsideMenuDemo.vue
```

Use the current `Navigator One`, grouped child items, disabled `Navigator Three`, footer, and inline SVG structure as the legacy-slot example. Do not restore the file from `HEAD`.

- [ ] **Step 2: Add a configuration-driven Playground example**

Refactor `AsideMenuDemo.vue` into two labeled examples. Use this exact component/state structure for the new configuration example:

```vue
<GaAsideMenu
  v-model:collapse="configuredCollapsed"
  v-model:active="configuredActive"
  :items="configuredItems"
  width="280px"
  unique-opened
>
  <template #header="{ collapse }">
    <div class="aside-logo">
      <ElIcon><MenuGridIcon /></ElIcon>
      <span v-if="!collapse">Ga Admin</span>
    </div>
  </template>
  <template #footer="{ collapse, active }">
    <div class="aside-status">
      {{ collapse ? active || '未选择' : `当前菜单：${active || '未选择'}` }}
    </div>
  </template>
</GaAsideMenu>
```

Define the nodes without adding an icon dependency:

```ts
import { defineComponent, h, ref } from 'vue'
import type { GaAsideMenuNode } from 'ga-ui-plus/business'

const MenuGridIcon = defineComponent({
  name: 'MenuGridIcon',
  setup: () => () =>
    h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      },
      [
        h('path', { d: 'M4 4h6v6H4z' }),
        h('path', { d: 'M14 4h6v6h-6z' }),
        h('path', { d: 'M4 14h6v6H4z' }),
        h('path', { d: 'M14 14h6v6h-6z' }),
      ],
    ),
})

const configuredCollapsed = ref(false)
const configuredActive = ref('users')
const configuredItems: GaAsideMenuNode[] = [
  {
    type: 'submenu',
    index: 'system',
    label: '系统管理',
    icon: MenuGridIcon,
    children: [
      {
        type: 'group',
        label: '账号管理',
        children: [
          { type: 'item', index: 'users', label: '用户管理' },
          { type: 'item', index: 'roles', label: '角色管理' },
          {
            type: 'item',
            index: 'permissions',
            label: '权限管理',
            disabled: true,
          },
        ],
      },
      {
        type: 'item',
        index: 'hidden-audit',
        label: '隐藏审计菜单',
        hidden: true,
      },
    ],
  },
  { type: 'item', index: 'reports', label: '报表中心', icon: MenuGridIcon },
]
```

Move the current user-edited Navigator markup unchanged into a second `GaAsideMenu` labeled “原生插槽兼容示例”, except for renaming `asideCollapsed` to `legacyCollapsed`, adding `v-model:active="legacyActive"`, removing `@toggle="handleToggle"`, and changing `@select` to `@select="handleLegacySelect"`. Preserve `Navigator One`, both groups, nested `1-4`, `Navigator Two`, disabled `Navigator Three`, `Navigator Four`, footer content, and all inline SVG paths. Replace the old script handlers with:

```ts
const legacyCollapsed = ref(false)
const legacyActive = ref('1-1')

function handleLegacySelect(index: string) {
  legacyActive.value = index
}
```

Render both active values visibly beside their example labels, for example `当前激活：{{ configuredActive || '未选择' }}` and `当前激活：{{ legacyActive || '未选择' }}`. Delete `handleClickToggle`, `handleToggle`, `handleSelect`, all commented trigger code, every `alert`/`console.info`, and the unused `ElMenuItem`, `ElMenuItemGroup`, and `ElSubMenu` imports; keep `ElIcon`. Continue using the current globally resolved kebab-case `el-sub-menu`, `el-menu-item-group`, and `el-menu-item` tags. Do not reference unresolved `<location>`, `<icon-menu>`, `<document>`, or `<setting>` tags.

- [ ] **Step 3: Update README usage and API tables**

In the `GaAsideMenu` section, add this configuration example before the legacy slot example:

````markdown
### 配置驱动菜单

`items` 支持普通菜单项、子菜单和分组。权限过滤与路由跳转由业务层负责；组件只渲染节点并通过 `select` 返回 index。

```vue
<GaAsideMenu
  v-model:collapse="collapsed"
  v-model:active="active"
  :items="items"
  width="260px"
  @select="handleSelect"
/>
```

当默认插槽与 `items` 同时存在时，默认插槽优先。旧的 `ElMenuItem`、`ElSubMenu`、`ElMenuItemGroup` 插槽写法保持兼容。
````

Add these Props rows:

```markdown
| `items` | `readonly GaAsideMenuNode[]` | `[]` | 配置驱动节点；默认插槽存在时不渲染 |
| `active` | `string` | `undefined` | 当前激活 index，支持 `v-model:active` |
```

Clarify `defaultActive` as “仅用于未传 active 时的初始激活值”. Add this Event row:

```markdown
| `update:active` | `(active: string)` | 菜单选择导致激活 index 变化时触发，用于 `v-model:active` |
```

Update Slots rows to:

```markdown
| `header` | `{ collapse: boolean, active: string }` | 侧栏头部 |
| `footer` | `{ collapse: boolean, active: string }` | 侧栏底部 |
| `trigger` | `{ collapse: boolean, active: string, toggle: () => void }` | 自定义折叠触发器；使用方负责按钮语义与键盘交互 |
```

Add this node table after the Props table and explicitly state that `index` must be non-empty and unique across rendered item/submenu nodes:

```markdown
| 字段 | item | submenu | group | 说明 |
| --- | --- | --- | --- | --- |
| `type` | 必填 | 必填 | 必填 | `'item'`、`'submenu'` 或 `'group'` |
| `index` | 必填 | 必填 | 不支持 | 可激活节点标识，整棵渲染树内非空且唯一 |
| `label` | 必填 | 必填 | 必填 | 第一版只支持文本标签 |
| `icon` | 可选 | 可选 | 不支持 | 任意 Vue `Component` |
| `disabled` | 可选 | 可选 | 不支持 | 复用 Element Plus 禁用行为 |
| `hidden` | 可选 | 可选 | 可选 | 隐藏当前节点及其子树 |
| `children` | 不支持 | 必填 | 必填 | submenu 可递归；group 只接收 item/submenu |
```

Update the TypeScript type table with these rows:

```markdown
| `GaAsideMenuNode` | 配置节点联合类型：item、submenu、group |
| `GaAsideMenuItem` | 普通菜单项配置 |
| `GaAsideSubMenu` | 可递归子菜单配置 |
| `GaAsideMenuGroup` | 只包含 item/submenu 的菜单分组配置 |
| `GaAsideMenuStateSlotProps` | header/footer 状态作用域，包含 `collapse` 与 `active` |
| `GaAsideMenuTriggerSlotProps` | trigger 状态作用域，并额外包含 `toggle()` |
```

Replace the existing `GaAsideMenuProps` and `GaAsideMenuEmits` descriptions so they mention `items`/`active` and `update:active` respectively.

- [ ] **Step 4: Build and inspect the Playground**

Run:

```powershell
pnpm.cmd --dir playground build
```

Expected: TypeScript and Vite pass; only the known upstream `@vueuse/core` PURE-comment Rollup warnings are acceptable.

Run the existing Playground server and verify in the browser:

1. Both “配置驱动示例” and “原生插槽兼容示例” render.
2. Configuration nodes show submenu, group, icon, disabled item, and omit the hidden item.
3. Configuration and legacy menus both collapse to 64px and restore their configured widths.
4. Selecting a configuration item updates the visible active status and `v-model:active`.
5. The browser console contains no unresolved-component warning, `alert`, or component debug log.

- [ ] **Step 5: Commit documentation and Playground changes**

```powershell
git add -- packages/ui/README.md playground/src/demos/AsideMenuDemo.vue
git diff --cached --name-only
git commit -m "docs: demonstrate GaAsideMenu configuration mode"
```

Expected: the two listed files only. Note in the handoff that `AsideMenuDemo.vue` began with user edits and those edits were preserved as the legacy example.

### Task 8: Final verification and scope audit

**Files:**
- Verify all feature files

- [ ] **Step 1: Run the full component-library verification**

```powershell
pnpm.cmd --filter ga-ui-plus test
pnpm.cmd --filter ga-ui-plus build
pnpm.cmd --filter ga-ui-plus verify:exports
```

Expected:

- All Vitest files and tests pass.
- TypeScript reports no diagnostics.
- Multi-entry build and every emitted relative declaration specifier verify; the count may be higher than the pre-refactor baseline of 26.
- Root/business exports and NodeNext declarations verify with TypeScript 5.8.3.

- [ ] **Step 2: Run the Playground production build**

```powershell
pnpm.cmd --dir playground build
```

Expected: the build succeeds; only the two accepted upstream `@vueuse/core` PURE-comment warnings may appear.

- [ ] **Step 3: Audit whitespace, debug code, and changed scope**

```powershell
git diff --check
rg -n "console\.(log|info)|alert\(" packages/ui/src/business/components/asideMenu playground/src/demos/AsideMenuDemo.vue
git status --short
git diff main...HEAD --name-only
```

Expected:

- `git diff --check` exits 0.
- The debug scan returns no component or demo matches.
- Changed files are limited to the AsideMenu component/types/tests/styles, public declaration fixtures/tests, README, and Playground demo.

- [ ] **Step 4: Perform final browser acceptance**

Verify these exact behaviors on a freshly restarted Playground server to avoid stale Vite type caches:

1. Default-slot menus remain backward compatible.
2. `items` recursively render item/submenu/group nodes.
3. Hidden nodes and empty visible containers are absent.
4. Disabled items cannot become active.
5. `v-model:active` updates immediately and external changes synchronize back.
6. `v-model:collapse` works internally and externally.
7. Header/footer/trigger receive `collapse` and `active`.
8. Default trigger has correct dynamic title/ARIA label and keyboard focus styling.
9. No Vue warnings or console errors are present.

- [ ] **Step 5: Request final code review**

Review the range from the branch point on `main` through `HEAD`, with special attention to:

- slot compatibility versus `items` priority;
- active-state controlled/uncontrolled behavior;
- recursive type and render correctness;
- no mutation of consumer arrays;
- warning deduplication;
- CSS selector isolation;
- root/business declaration exports;
- preservation of the pre-existing Playground edit.

Fix Critical and Important findings before completion; fix reproducible Minor findings that affect the approved requirements, then rerun Steps 1–4.

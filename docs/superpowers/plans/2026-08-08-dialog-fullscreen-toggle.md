# GaDialog Fullscreen Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a default fullscreen/restore control immediately before the Element Plus close button while preserving custom headers, supporting internal state and `v-model:fullscreen`, and keeping the existing user-approved Dialog changes.

**Architecture:** `GaDialog` will always provide the `ElDialog` header slot, render either the consumer header or an accessible title fallback, and append a fullscreen utility button. A local `currentFullscreen` ref mirrors the external prop, emits `update:fullscreen` on user changes, and resets after the `closed` lifecycle event. Component-scoped SCSS positions the utility button without changing global Element Plus Dialog styles.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript 5.8, Element Plus 2.14, SCSS, Vitest, Vue Test Utils, Vite, pnpm.

---

## Working-tree safety

The current workspace contains user-approved, uncommitted changes in the Dialog component, Dialog styles, Playground, and Pagination styles. The user explicitly approved including the Dialog and Playground changes in this feature's commits. The Pagination file remains unrelated and must never be staged or modified by this plan.

- Work on branch `codex/ga-dialog-fullscreen` in the current workspace so the approved overlapping edits remain available.
- Never stage `packages/ui/src/base/components/pagination/style/index.scss`.
- Before every commit, run `git diff --cached --name-only` and confirm the Pagination path is absent.
- Preserve the current Dialog defaults: `appendToBody`, `destroyOnClose`, `alignCenter`, and `draggable` are `true`; modal-click and Escape closing are `false`.

## File map

- `packages/ui/src/base/components/dialog/src/index.vue`: header rendering, internal fullscreen state, accessible fullscreen button, lifecycle reset.
- `packages/ui/src/base/components/dialog/types/index.ts`: `showFullscreen` prop and `update:fullscreen` event contract.
- `packages/ui/src/base/components/dialog/style/index.scss`: close-button cleanup, fullscreen-button positioning, title spacing, hover and focus styling.
- `packages/ui/src/base/components/dialog/src/__tests__/dialog.spec.ts`: component behavior and regression coverage.
- `packages/ui/src/__tests__/exports.spec.ts`: source-level public type contract.
- `packages/ui/scripts/fixtures/node-next-consumer/index.ts`: built declaration consumption for root and base entries.
- `packages/ui/README.md`: defaults, fullscreen usage, props, events, and button-boundary documentation.
- `playground/src/App.vue`: interactive `v-model:fullscreen` example and existing footer close fix.

### Task 1: Establish a green baseline for the approved existing edits

**Files:**
- Modify: `packages/ui/src/base/components/dialog/src/__tests__/dialog.spec.ts`
- Modify: `packages/ui/src/base/components/dialog/style/index.scss`
- Modify: `packages/ui/README.md`
- Modify: `playground/src/App.vue`
- Include in commit: `packages/ui/src/base/components/dialog/src/index.vue`

- [ ] **Step 1: Create the feature branch without discarding working changes**

Run:

```powershell
git switch -c codex/ga-dialog-fullscreen
git status --short
```

Expected: the new branch is active; Dialog, Playground, and Pagination edits are still present.

- [ ] **Step 2: Update the existing default-props assertion to the approved values**

Replace the affected expectations in `dialog.spec.ts` with:

```ts
expect(wrapper.findComponent(ElDialogStub).props()).toMatchObject({
  modelValue: false,
  title: '',
  width: undefined,
  top: undefined,
  fullscreen: false,
  appendToBody: true,
  destroyOnClose: true,
  center: false,
  alignCenter: true,
  draggable: true,
  showClose: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  beforeClose: undefined,
})
```

- [ ] **Step 3: Normalize the approved close-icon style without changing its appearance**

Make `style/index.scss` start with this exact block:

```scss
.el-dialog.ga-dialog {
  .el-dialog__close {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    font-size: 20px;
    color: #606266;

    &:hover {
      background-color: #409eff1a;
    }
  }
}
```

- [ ] **Step 4: Fix the current Playground compile error while preserving the footer button**

Change the footer link button from the undefined slot variable:

```vue
<ElButton
  link
  @click="close"
>
  关闭
</ElButton>
```

to the existing guarded close handler:

```vue
<ElButton
  link
  @click="handleDialogCancel"
>
  关闭
</ElButton>
```

This preserves `beforeClose` because `handleDialogCancel()` calls `dialogRef.handleClose()`.

- [ ] **Step 5: Align README defaults with the approved component defaults**

Update the existing Props rows to these values:

```markdown
| `appendToBody` | `boolean` | `true` | 是否将对话框挂载到 `body` |
| `destroyOnClose` | `boolean` | `true` | 关闭时是否销毁插槽内容 |
| `alignCenter` | `boolean` | `true` | 是否让对话框水平、垂直居中 |
| `draggable` | `boolean` | `true` | 是否允许拖动对话框 |
| `closeOnClickModal` | `boolean` | `false` | 是否允许点击遮罩关闭 |
| `closeOnPressEscape` | `boolean` | `false` | 是否允许按 Escape 关闭 |
```

- [ ] **Step 6: Verify the baseline is green**

Run from `packages/ui`:

```powershell
.\node_modules\.bin\vitest.CMD run src/base/components/dialog/src/__tests__/dialog.spec.ts
```

Expected: one test file passes with zero failed tests.

Run from the repository root:

```powershell
pnpm.cmd --dir playground build
```

Expected: TypeScript and Vite build pass. Rollup may report the existing upstream `@vueuse/core` PURE-comment warnings only.

- [ ] **Step 7: Commit the approved baseline without Pagination**

```powershell
git add -- packages/ui/src/base/components/dialog/src/index.vue packages/ui/src/base/components/dialog/style/index.scss packages/ui/src/base/components/dialog/src/__tests__/dialog.spec.ts packages/ui/README.md playground/src/App.vue
git diff --cached --name-only
git commit -m "chore: align GaDialog defaults and demo"
```

Expected staged paths: the five listed files only. `packages/ui/src/base/components/pagination/style/index.scss` must remain unstaged.

### Task 2: Define the public fullscreen contract and default header control

**Files:**
- Modify: `packages/ui/src/base/components/dialog/src/__tests__/dialog.spec.ts`
- Modify: `packages/ui/src/__tests__/exports.spec.ts`
- Modify: `packages/ui/src/base/components/dialog/types/index.ts`
- Modify: `packages/ui/src/base/components/dialog/src/index.vue`

- [ ] **Step 1: Write failing runtime tests for the default control and title fallback**

Replace the old native-title/no-buttons test with:

```ts
it('renders an accessible fullscreen control with the default title', () => {
  const wrapper = mountDialog({
    props: {
      title: 'Native dialog title',
    },
    attrs: {
      'header-aria-level': '3',
    },
    slots: {
      default: () => h('p', { class: 'dialog-content' }, 'Dialog body'),
    },
  })

  const title = wrapper.get(`#${titleId}`)
  const fullscreenButton = wrapper.get('button.ga-dialog__fullscreenbtn')

  expect(title.text()).toBe('Native dialog title')
  expect(title.classes()).toContain(titleClass)
  expect(title.attributes('role')).toBe('heading')
  expect(title.attributes('aria-level')).toBe('3')
  expect(fullscreenButton.attributes('type')).toBe('button')
  expect(fullscreenButton.attributes('title')).toBe('全屏')
  expect(fullscreenButton.attributes('aria-label')).toBe('全屏')
  expect(wrapper.find('.el-dialog__footer').exists()).toBe(false)
})
```

Add this assertion to the existing custom-header test:

```ts
expect(wrapper.find('button.ga-dialog__fullscreenbtn').exists()).toBe(true)
```

- [ ] **Step 2: Write failing source-level type contracts**

Add below the type-contract declarations in `src/__tests__/exports.spec.ts`:

```ts
const fullscreenDialogProps: GaDialogProps = {
  modelValue: true,
  showFullscreen: true,
}

function checkDialogFullscreenEmit(emit: GaDialogEmits) {
  emit('update:fullscreen', true)
}

void fullscreenDialogProps
void checkDialogFullscreenEmit
```

- [ ] **Step 3: Run the tests and confirm the feature is missing**

Run from `packages/ui`:

```powershell
.\node_modules\.bin\vitest.CMD run src/base/components/dialog/src/__tests__/dialog.spec.ts
.\node_modules\.bin\vue-tsc.CMD --noEmit -p tsconfig.type-tests.json
```

Expected runtime failure: `button.ga-dialog__fullscreenbtn` is not found.

Expected type failure: `showFullscreen` and `update:fullscreen` are not part of the public contracts.

- [ ] **Step 4: Add the prop and event types**

Change `GaDialogProps` to:

```ts
export type GaDialogProps = Pick<
  DialogProps,
  | 'modelValue'
  | 'title'
  | 'width'
  | 'top'
  | 'fullscreen'
  | 'appendToBody'
  | 'destroyOnClose'
  | 'center'
  | 'alignCenter'
  | 'draggable'
  | 'showClose'
  | 'closeOnClickModal'
  | 'closeOnPressEscape'
  | 'beforeClose'
> & {
  showFullscreen?: boolean
}
```

Add this overload to `GaDialogEmits`:

```ts
(event: 'update:fullscreen', value: boolean): void
```

- [ ] **Step 5: Always render the internal header and a minimal default control**

Import `useAttrs` and create the low-frequency ARIA fallback:

```ts
import { computed, ref, useAttrs, useSlots } from 'vue'

const attrs = useAttrs()
const headerAriaLevel = computed(() => {
  const value = attrs['header-aria-level'] ?? attrs.headerAriaLevel

  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : '2'
})
```

Add the default:

```ts
showFullscreen: true,
```

Replace the conditional internal header template with:

```vue
<template #header="scope">
  <slot
    v-if="slots.header"
    name="header"
    v-bind="scope"
  />

  <span
    v-else
    :id="scope.titleId"
    :class="scope.titleClass"
    role="heading"
    :aria-level="headerAriaLevel"
  >
    {{ props.title }}
  </span>

  <button
    type="button"
    class="ga-dialog__fullscreenbtn"
    title="全屏"
    aria-label="全屏"
  />
</template>
```

This step intentionally renders the button unconditionally. Visibility control is the next red-green cycle.

- [ ] **Step 6: Verify the default-control tests and type contracts pass**

Run from `packages/ui`:

```powershell
.\node_modules\.bin\vitest.CMD run src/base/components/dialog/src/__tests__/dialog.spec.ts
.\node_modules\.bin\vue-tsc.CMD --noEmit -p tsconfig.type-tests.json
```

Expected: both commands pass with zero failures.

### Task 3: Add visibility control and fullscreen state transitions

**Files:**
- Modify: `packages/ui/src/base/components/dialog/src/__tests__/dialog.spec.ts`
- Modify: `packages/ui/src/base/components/dialog/src/index.vue`

- [ ] **Step 1: Write a failing test for `showFullscreen=false`**

```ts
it('hides the fullscreen control when showFullscreen is false', () => {
  const wrapper = mountDialog({
    props: {
      showFullscreen: false,
    },
  })

  expect(wrapper.find('button.ga-dialog__fullscreenbtn').exists()).toBe(false)
})
```

- [ ] **Step 2: Run the Dialog test and verify the button is still present**

Run from `packages/ui`:

```powershell
.\node_modules\.bin\vitest.CMD run src/base/components/dialog/src/__tests__/dialog.spec.ts
```

Expected: FAIL because the minimal button is unconditional.

- [ ] **Step 3: Add the visibility condition**

Add the directive to the button:

```vue
<button
  v-if="props.showFullscreen"
  type="button"
  class="ga-dialog__fullscreenbtn"
  title="全屏"
  aria-label="全屏"
/>
```

- [ ] **Step 4: Run the Dialog test and verify the visibility behavior passes**

Run the same targeted Vitest command.

Expected: one test file passes with zero failures.

- [ ] **Step 5: Write failing tests for click, external sync, and close reset**

Add `nextTick` to the Vue test imports and add:

```ts
it('toggles fullscreen and emits update:fullscreen', async () => {
  const wrapper = mountDialog()
  const dialog = wrapper.findComponent(ElDialogStub)
  const button = wrapper.get('button.ga-dialog__fullscreenbtn')

  await button.trigger('click')

  expect(dialog.props('fullscreen')).toBe(true)
  expect(wrapper.emitted('update:fullscreen')).toEqual([[true]])
  expect(button.attributes('title')).toBe('退出全屏')
  expect(button.attributes('aria-label')).toBe('退出全屏')

  await button.trigger('click')

  expect(dialog.props('fullscreen')).toBe(false)
  expect(wrapper.emitted('update:fullscreen')).toEqual([[true], [false]])
})

it('synchronizes external fullscreen changes', async () => {
  const wrapper = mountDialog({
    props: {
      fullscreen: false,
    },
  })

  await wrapper.setProps({ fullscreen: true })

  expect(wrapper.findComponent(ElDialogStub).props('fullscreen')).toBe(true)
  expect(
    wrapper.get('button.ga-dialog__fullscreenbtn').attributes('title'),
  ).toBe('退出全屏')
})

it('restores the external fullscreen value after closed', async () => {
  const wrapper = mountDialog({
    props: {
      fullscreen: false,
    },
  })
  const dialog = wrapper.findComponent(ElDialogStub)

  await wrapper.get('button.ga-dialog__fullscreenbtn').trigger('click')
  dialog.vm.$emit('close')
  await nextTick()

  expect(dialog.props('fullscreen')).toBe(true)

  dialog.vm.$emit('closed')
  await nextTick()

  expect(dialog.props('fullscreen')).toBe(false)
  expect(wrapper.emitted('update:fullscreen')).toEqual([[true], [false]])
  expect(wrapper.emitted('closed')).toEqual([[]])
})
```

- [ ] **Step 6: Run the Dialog test and verify state transitions are missing**

Run the targeted Vitest command.

Expected: the new tests fail because the button has no click handler and `ElDialog` still receives `props.fullscreen` directly.

- [ ] **Step 7: Implement internal state, external synchronization, and reset**

Change the Vue imports to include `watch` and add:

```ts
const currentFullscreen = ref(props.fullscreen)
const fullscreenLabel = computed(() =>
  currentFullscreen.value ? '退出全屏' : '全屏',
)

watch(
  () => props.fullscreen,
  (value) => {
    currentFullscreen.value = value
  },
)

function setFullscreen(value: boolean) {
  if (currentFullscreen.value === value) return

  currentFullscreen.value = value
  emit('update:fullscreen', value)
}

function toggleFullscreen() {
  setFullscreen(!currentFullscreen.value)
}

function handleClosed() {
  setFullscreen(props.fullscreen)
  emit('closed')
}
```

Change the `ElDialog` binding and event:

```vue
:fullscreen="currentFullscreen"
@closed="handleClosed"
```

Change the button bindings:

```vue
<button
  v-if="props.showFullscreen"
  type="button"
  class="ga-dialog__fullscreenbtn"
  :title="fullscreenLabel"
  :aria-label="fullscreenLabel"
  @click="toggleFullscreen"
/>
```

- [ ] **Step 8: Run the targeted tests and verify all state behavior passes**

Run the targeted Vitest command.

Expected: one Dialog test file passes with zero failures.

### Task 4: Add button icons, positioning, and interaction styling

**Files:**
- Modify: `packages/ui/src/base/components/dialog/src/__tests__/dialog.spec.ts`
- Modify: `packages/ui/src/base/components/dialog/src/index.vue`
- Modify: `packages/ui/src/base/components/dialog/style/index.scss`

- [ ] **Step 1: Write failing tests for positioning state and icon switching**

Add:

```ts
it('moves the fullscreen control to the right when close is hidden', () => {
  const wrapper = mountDialog({
    props: {
      showClose: false,
    },
  })
  const dialog = wrapper.findComponent(ElDialogStub)

  expect(dialog.classes()).toContain('ga-dialog--fullscreenable')
  expect(dialog.classes()).toContain('ga-dialog--without-close')
})
```

Add these assertions to the toggle test:

```ts
expect(wrapper.find('.ga-dialog__fullscreen-icon--expand').exists()).toBe(true)
await button.trigger('click')
expect(wrapper.find('.ga-dialog__fullscreen-icon--restore').exists()).toBe(true)
```

- [ ] **Step 2: Run the targeted test and verify the classes/icons are absent**

Expected: FAIL on `ga-dialog--fullscreenable` or the expand icon selector.

- [ ] **Step 3: Bind root state classes**

Replace the static `class` binding on `ElDialog` with:

```vue
:class="[
  'ga-dialog',
  {
    'ga-dialog--fullscreenable': props.showFullscreen,
    'ga-dialog--without-close': !props.showClose,
  },
]"
```

- [ ] **Step 4: Render dependency-free state icons inside the button**

Use this button content:

```vue
<svg
  v-if="!currentFullscreen"
  class="ga-dialog__fullscreen-icon ga-dialog__fullscreen-icon--expand"
  viewBox="0 0 24 24"
  aria-hidden="true"
>
  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
  <path d="M16 3h3a2 2 0 0 1 2 2v3" />
  <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
</svg>

<svg
  v-else
  class="ga-dialog__fullscreen-icon ga-dialog__fullscreen-icon--restore"
  viewBox="0 0 24 24"
  aria-hidden="true"
>
  <path d="M8 3v3a2 2 0 0 1-2 2H3" />
  <path d="M16 3v3a2 2 0 0 0 2 2h3" />
  <path d="M8 21v-3a2 2 0 0 0-2-2H3" />
  <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
</svg>
```

- [ ] **Step 5: Add scoped header-action styles**

Extend `.el-dialog.ga-dialog` with:

```scss
--ga-dialog-header-action-size: 48px;
--ga-dialog-header-action-icon-size: 30px;

&.ga-dialog--fullscreenable {
  .el-dialog__header {
    padding-right: calc(
      var(--el-dialog-padding-primary) +
      var(--ga-dialog-header-action-size) +
      var(--ga-dialog-header-action-size)
    );
  }
}

&.ga-dialog--fullscreenable.ga-dialog--without-close {
  .el-dialog__header {
    padding-right: calc(
      var(--el-dialog-padding-primary) +
      var(--ga-dialog-header-action-size)
    );
  }

  .ga-dialog__fullscreenbtn {
    right: 0;
  }
}

.ga-dialog__fullscreenbtn {
  position: absolute;
  top: 0;
  right: var(--ga-dialog-header-action-size);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ga-dialog-header-action-size);
  height: var(--ga-dialog-header-action-size);
  padding: 0;
  color: #606266;
  cursor: pointer;
  background: transparent;
  border: 0;
  outline: none;

  &:hover .ga-dialog__fullscreen-icon {
    color: var(--el-color-primary);
    background-color: #409eff1a;
  }

  &:focus-visible {
    border-radius: 4px;
    outline: 2px solid var(--el-color-primary);
    outline-offset: -4px;
  }
}

.ga-dialog__fullscreen-icon {
  box-sizing: border-box;
  width: var(--ga-dialog-header-action-icon-size);
  height: var(--ga-dialog-header-action-icon-size);
  padding: 5px;
  color: inherit;
  border-radius: 4px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition:
    color var(--el-transition-duration-fast),
    background-color var(--el-transition-duration-fast);
}
```

Keep the approved `.el-dialog__close` block in the same component namespace.

- [ ] **Step 6: Run tests and component build**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus test
pnpm.cmd --filter ga-ui-plus build
```

Expected: all test files pass, TypeScript declarations build, and `verify:build` succeeds.

- [ ] **Step 7: Commit the component behavior and styles**

```powershell
git add -- packages/ui/src/base/components/dialog/src/index.vue packages/ui/src/base/components/dialog/types/index.ts packages/ui/src/base/components/dialog/style/index.scss packages/ui/src/base/components/dialog/src/__tests__/dialog.spec.ts packages/ui/src/__tests__/exports.spec.ts
git diff --cached --name-only
git commit -m "feat: add GaDialog fullscreen toggle"
```

Expected: only Dialog implementation/type/test files and the source export type test are staged. Pagination remains unstaged.

### Task 5: Strengthen built declaration contracts

**Files:**
- Modify: `packages/ui/scripts/fixtures/node-next-consumer/index.ts`

- [ ] **Step 1: Add the new prop and event to the root declaration fixture**

Change `rootDialogProps` to include:

```ts
const rootDialogProps: GaDialogProps = {
  modelValue: false,
  title: 'NodeNext Dialog',
  width: 480,
  showFullscreen: true,
}
```

Add to both emit check functions:

```ts
emit('update:fullscreen', true)
```

- [ ] **Step 2: Add the new prop to the base declaration fixture**

Change `baseDialogProps` to:

```ts
const baseDialogProps: BaseDialogProps = {
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showFullscreen: false,
}
```

- [ ] **Step 3: Rebuild and verify package exports and NodeNext declarations**

Run:

```powershell
pnpm.cmd --filter ga-ui-plus build
pnpm.cmd --filter ga-ui-plus verify:exports
```

Expected:

```text
Verified ga-ui-plus package exports
Verified ga-ui-plus NodeNext declarations with TypeScript 5.8.3
```

- [ ] **Step 4: Commit the declaration fixture**

```powershell
git add -- packages/ui/scripts/fixtures/node-next-consumer/index.ts
git diff --cached --name-only
git commit -m "test: cover GaDialog fullscreen declarations"
```

### Task 6: Document and demonstrate fullscreen behavior

**Files:**
- Modify: `packages/ui/README.md`
- Modify: `playground/src/App.vue`

- [ ] **Step 1: Add `v-model:fullscreen` to the Playground Dialog**

Add the state:

```ts
const dialogFullscreen = ref(false)
```

Bind it:

```vue
<GaDialog
  ref="dialogInstance"
  v-model="dialogVisible"
  v-model:fullscreen="dialogFullscreen"
  title="通用弹窗示例"
  width="520px"
  destroy-on-close
  modal-class="ga-dialog-demo-modal"
  :before-close="handleDialogBeforeClose"
>
```

Update the explanatory paragraph to:

```vue
<p>
  GaDialog 默认在关闭按钮左侧提供全屏/还原按钮，并通过
  v-model:fullscreen 同步状态。组件不内置 footer 业务按钮，底部操作仍由使用方提供。
</p>
```

- [ ] **Step 2: Add README fullscreen usage**

Insert before the custom-header section:

````markdown
### 全屏切换

`GaDialog` 默认在右上角关闭按钮左侧显示全屏/还原按钮。不绑定额外状态时，组件会在内部完成切换；需要从业务代码读取或控制状态时，可以使用 `v-model:fullscreen`。

```vue
<template>
  <GaDialog
    v-model="dialogVisible"
    v-model:fullscreen="dialogFullscreen"
    title="编辑用户"
  >
    <p>{{ dialogFullscreen ? '当前为全屏模式' : '当前为窗口模式' }}</p>
  </GaDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GaDialog } from 'ga-ui-plus/base'

const dialogVisible = ref(true)
const dialogFullscreen = ref(false)
</script>
```

传入 `show-fullscreen="false"` 可以隐藏按钮。弹窗完成关闭后，内部状态恢复为当前 `fullscreen` 属性值；如果使用 `v-model:fullscreen`，外部状态就是下一次打开时的状态来源。
````

- [ ] **Step 3: Update API tables and component-boundary wording**

Add the Props row:

```markdown
| `showFullscreen` | `boolean` | `true` | 是否显示右上角全屏/还原按钮 |
```

Add the Events row:

```markdown
| `update:fullscreen` | `(value: boolean)` | 点击全屏/还原按钮或关闭后恢复内部状态；用于 `v-model:fullscreen` |
```

Replace claims that the component adds no buttons with the precise boundary:

```markdown
组件默认提供头部全屏/还原工具按钮，但不内置确认、取消等 footer 业务按钮。
```

- [ ] **Step 4: Build the Playground and inspect the interaction**

Run:

```powershell
pnpm.cmd --dir playground build
```

Expected: TypeScript and Vite build pass.

Then run the Playground locally and verify:

1. Open the Dialog and confirm the fullscreen button is immediately left of close.
2. Click fullscreen and confirm the Dialog fills the viewport.
3. Confirm the icon and tooltip change to “退出全屏”.
4. Click again and confirm the configured `520px` window returns.
5. Close while fullscreen, reopen, and confirm state follows the bound `dialogFullscreen` value.
6. Confirm close, cancel, confirm, dragging, and `beforeClose` behavior still work.

- [ ] **Step 5: Commit documentation and Playground changes**

```powershell
git add -- packages/ui/README.md playground/src/App.vue
git diff --cached --name-only
git commit -m "docs: document GaDialog fullscreen toggle"
```

### Task 7: Final verification and scope audit

**Files:**
- Verify all changed files
- Do not modify: `packages/ui/src/base/components/pagination/style/index.scss`

- [ ] **Step 1: Run the full component-library verification**

```powershell
pnpm.cmd --filter ga-ui-plus test
pnpm.cmd --filter ga-ui-plus build
pnpm.cmd --filter ga-ui-plus verify:exports
```

Expected: all Vitest files pass, no TypeScript diagnostics, build output verifies, package exports verify, and NodeNext declarations verify with TypeScript 5.8.3.

- [ ] **Step 2: Run the Playground build**

```powershell
pnpm.cmd --dir playground build
```

Expected: build succeeds; only the known upstream `@vueuse/core` PURE-comment Rollup warnings are acceptable.

- [ ] **Step 3: Check whitespace and changed-file scope**

```powershell
git diff --check
git status --short
git diff main...HEAD --name-only
```

Expected:

- `git diff --check` exits with code 0.
- Feature commits contain only Dialog implementation/types/tests, README, NodeNext fixture, and Playground files.
- `packages/ui/src/base/components/pagination/style/index.scss` remains a separate unstaged user modification.

- [ ] **Step 4: Review the final requirements checklist**

Confirm each item with code or test evidence:

- Fullscreen button defaults to visible.
- `showFullscreen=false` hides it.
- It appears before the Element Plus close button.
- It works with default and custom headers.
- Internal switching works without external binding.
- `v-model:fullscreen` receives every state transition.
- External prop changes synchronize inward.
- Reset occurs on `closed`, not `close`.
- Dynamic labels and icons are accessible.
- No footer business buttons were added.
- Pagination was not included in any commit.

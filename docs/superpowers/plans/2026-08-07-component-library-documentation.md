# ga-ui-plus Component Library Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the package usage guide and workspace maintenance guide so consumers and maintainers can use the three public components and operate the pnpm workspace without reading source code.

**Architecture:** Keep consumer-facing API details in `packages/ui/README.md` and repository operations in the root `README.md`. Derive every API statement from source types, Vue implementations, tests, package exports, and build scripts; link between the two documents instead of duplicating component API tables.

**Tech Stack:** Markdown, pnpm 10, Vue 3, Element Plus, Vite 6, TypeScript 5.8, Vitest

---

## File map

- Modify `packages/ui/README.md`: authoritative installation, import, examples, Props, events, slots, public types, and limitations for package consumers.
- Modify `README.md`: authoritative workspace structure, local development, testing, build, verification, release, and contribution workflow for maintainers.
- Read `packages/ui/src/**`: source of truth for component behavior and types.
- Read `packages/ui/package.json` and `packages/ui/vite.config.ts`: source of truth for package compatibility, exports, scripts, and build output.
- Read `playground/src/App.vue`: source of truth for the complete table-pagination example.

### Task 1: Expand the package consumer guide

**Files:**
- Modify: `packages/ui/README.md`
- Reference: `packages/ui/package.json`
- Reference: `packages/ui/src/base/components/table/src/props.ts`
- Reference: `packages/ui/src/base/components/table/types/index.ts`
- Reference: `packages/ui/src/base/components/table/src/index.vue`
- Reference: `packages/ui/src/base/components/pagination/src/props.ts`
- Reference: `packages/ui/src/base/components/pagination/src/index.vue`
- Reference: `packages/ui/src/business/components/tablePagination/src/props.ts`
- Reference: `packages/ui/src/business/components/tablePagination/src/index.vue`

- [ ] **Step 1: Record the current documentation gaps**

Run:

```powershell
Select-String -Path packages/ui/README.md -Pattern 'GaTable Props','GaPagination Props','GaTablePagination Props','tableRef','column-prepend','父容器'
```

Expected: no matches, proving the existing package README does not yet document the complete API.

- [ ] **Step 2: Replace the package README with the approved consumer structure**

Use these headings in this order:

```markdown
# ga-ui-plus
## 特性
## 兼容性
## 安装
## 引入样式
## 导出入口
## 快速开始
## GaTable
### 基础用法
### 配置式列与自定义单元格
### 混合使用配置列与 ElTableColumn
### 空状态和追加内容
### 访问底层表格实例
### GaTable Props
### GaTableColumn
### GaTable Slots
## GaPagination
### 基础用法
### 对齐方式
### GaPagination Props
### GaPagination Events
## GaTablePagination
### 完整用法
### 布局与高度要求
### GaTablePagination Props
### GaTablePagination Events
### GaTablePagination Slots
## TypeScript 类型
## 属性透传与当前限制
```

State compatibility from the package manifest exactly:

```markdown
- Vue：`^3.3.7`
- Element Plus：`^2.14.3`
- 包格式：ESM
```

Use this installation and style setup:

```bash
pnpm add ga-ui-plus vue element-plus
```

```ts
import 'element-plus/dist/index.css'
import 'ga-ui-plus/style.css'
```

Document all three export paths:

```ts
import { GaPagination, GaTable, type GaTableColumn } from 'ga-ui-plus/base'
import { GaTablePagination } from 'ga-ui-plus/business'
import { GaPagination, GaTable, GaTablePagination } from 'ga-ui-plus'
```

- [ ] **Step 3: Add exact `GaTable` examples and API contracts**

Use a typed row and configuration array:

```ts
interface UserRow {
  id: number
  name: string
  status: 'enabled' | 'disabled'
}

const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名', minWidth: 140 },
  {
    key: 'status',
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
    slot: 'status',
  },
]
```

Show `#status="{ row, column, $index }"`, `#column-prepend`, the default slot for manually authored `ElTableColumn`, `#empty`, and `#append`.

Document the `GaTableProps` defaults exactly:

| Prop | Type | Default |
| --- | --- | --- |
| `data` | `Row[]` | `[]` |
| `columns` | `GaTableColumn<Row>[]` | `[]` |
| `height` | `string \| number` | — |
| `maxHeight` | `string \| number` | — |
| `rowKey` | `string \| ((row: Row) => string)` | — |
| `border` | `boolean` | `true` |
| `stripe` | `boolean` | `true` |
| `size` | `ComponentSize` | — |
| `fit` | `boolean` | `true` |
| `showHeader` | `boolean` | `true` |
| `highlightCurrentRow` | `boolean` | `false` |
| `emptyText` | `string` | `暂无数据` |
| `loading` | `boolean` | `false` |
| `loadingText` | `string` | `加载中...` |

List every property declared by `GaTableColumn<Row>` and explain that `key` controls the Vue rendering key while `slot` selects a named cell slot; neither field is forwarded to `ElTableColumn`.

Show instance access with the actual exposed shape:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { GaTable, type GaTableExpose } from 'ga-ui-plus/base'

const table = ref<GaTableExpose>()

function clearSelection() {
  table.value?.tableRef?.clearSelection()
}
</script>

<template>
  <GaTable ref="table" :data="rows" :columns="columns" />
</template>
```

- [ ] **Step 4: Add exact `GaPagination` examples and API contracts**

Show both models and both events:

```vue
<GaPagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="total"
  position="center"
  @current-change="loadPage"
  @size-change="loadPage"
/>
```

Document defaults exactly:

| Prop | Type | Default |
| --- | --- | --- |
| `currentPage` | `number` | `1` |
| `pageSize` | `number` | `10` |
| `total` | `number` | `100` |
| `pageSizes` | `number[]` | `[10, 20, 30, 40, 50]` |
| `size` | `ComponentSize` | `default` |
| `layout` | `string` | `total, sizes, prev, pager, next, jumper` |
| `background` | `boolean` | `true` |
| `position` | `left \| center \| right` | `right` |

Document emitted events: `update:current-page`, `update:page-size`, `current-change`, and `size-change`.

- [ ] **Step 5: Add exact `GaTablePagination` examples and limitations**

Base the complete example on `playground/src/App.vue`, correcting the duplicate sample row ID and omitting the unrelated standalone pagination demo.

Show a parent container with an explicit height:

```vue
<template>
  <section class="users-table">
    <GaTablePagination
      :data="rows"
      :columns="columns"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
    >
      <template #status="{ row }">
        <ElTag :type="row.status === 'enabled' ? 'success' : 'info'">
          {{ row.status === 'enabled' ? '启用' : '停用' }}
        </ElTag>
      </template>
    </GaTablePagination>
  </section>
</template>

<style scoped>
.users-table {
  height: 600px;
  min-height: 0;
}
</style>
```

Explain these contracts explicitly:

- The component accepts one flat Props object combining table props and pagination props.
- Its table Props are all `GaTableProps<Row>` fields except `height` and `maxHeight`; its pagination Props are all `GaPaginationProps` fields. Present both inherited groups in the API section and state that `size` is shared by the table and pagination.
- `height` and `maxHeight` are intentionally unavailable; the internal table always uses `height="100%"`.
- The parent must provide a definite height because the root uses a two-row Grid layout.
- All table slots are forwarded.
- Page models and page events are forwarded.
- Arbitrary attributes bind to the root container, not the underlying `GaTable`.
- The component does not expose the underlying `tableRef`.

- [ ] **Step 6: Verify package README coverage**

Run:

```powershell
Select-String -Path packages/ui/README.md -Pattern '^## GaTable$','^## GaPagination$','^## GaTablePagination$','GaTable Props','GaTableColumn','column-prepend','tableRef','update:current-page','父容器必须','不暴露底层'
```

Expected: every pattern has at least one match.

- [ ] **Step 7: Commit the consumer guide**

```bash
git add packages/ui/README.md
git commit -m "docs: expand component usage guide"
```

### Task 2: Rewrite the workspace maintenance guide

**Files:**
- Modify: `README.md`
- Reference: `package.json`
- Reference: `pnpm-workspace.yaml`
- Reference: `packages/ui/package.json`
- Reference: `packages/ui/vite.config.ts`
- Reference: `packages/ui/scripts/verify-build.mjs`
- Reference: `packages/ui/scripts/verify-exports.mjs`
- Reference: `packages/ui/scripts/verify-types.mjs`

- [ ] **Step 1: Demonstrate the stale paths in the current root README**

Run:

```powershell
Select-String -Path README.md -Pattern 'packages/ui-element'
```

Expected: multiple matches, proving the current maintenance commands and links use an obsolete directory.

- [ ] **Step 2: Replace the root README with the approved maintainer structure**

Use these headings in this order:

```markdown
# ga-ui-plus Workspace
## 项目结构
## 技术栈
## 环境要求
## 安装依赖
## 本地开发与预览
## 测试与类型检查
## 构建与包验证
## 构建产物与公开入口
## 发布流程
## 新增组件检查清单
## 组件使用文档
## 许可证
```

Use actual workspace paths:

```text
packages/ui   ga-ui-plus npm 包源码、测试、构建与发布配置
playground    Vue 3 本地联调应用
docs          设计说明和实施计划
```

State that pnpm is pinned to `10.34.5`. State that the repository does not pin an exact Node.js version and requires a Node.js environment compatible with pnpm 10 and Vite 6.

- [ ] **Step 3: Add exact development, test, build, and verification commands**

Use these commands:

```bash
pnpm install
pnpm --dir playground dev
pnpm --dir packages/ui test
pnpm --dir packages/ui test:watch
pnpm --dir packages/ui build
pnpm --dir packages/ui verify:exports
pnpm --dir playground build
```

Explain that the Playground server is configured for port `5555` and that the package must be built before standalone package export/type verification.

Document the expected public output:

```text
dist/index.js
dist/index.d.ts
dist/base/index.js
dist/base/index.d.ts
dist/business/index.js
dist/business/index.d.ts
dist/style.css
```

Explain that Vue and Element Plus stay external, the package emits ESM only, CSS is emitted as one file, and source maps are generated without embedding source content.

- [ ] **Step 4: Document the release and component contribution workflow**

Describe `prepublishOnly` in its real order:

```text
test → build → verify:exports
```

State that `publishConfig` publishes publicly to `https://registry.npmjs.org/`.

Add this component contribution checklist:

1. Add the component implementation, style entry, public props, and public types under the correct `base` or `business` directory.
2. Export the component from its local `index.ts` and the corresponding category barrel.
3. Add source-level unit tests and update `src/__tests__/exports.spec.ts` when the public surface changes.
4. Update Vite library entries only when adding a new public package subpath.
5. Update `verify-build.mjs` and `verify-exports.mjs` when output files or public exports change.
6. Update `packages/ui/README.md` with examples and API contracts.
7. Run tests, build, export verification, and Playground build before publishing.

- [ ] **Step 5: Verify root README accuracy**

Run:

```powershell
Select-String -Path README.md -Pattern 'packages/ui-element'
```

Expected: no matches.

Run:

```powershell
Select-String -Path README.md -Pattern 'packages/ui','pnpm@10.34.5','pnpm --dir playground dev','pnpm --dir packages/ui test','pnpm --dir packages/ui build','verify:exports','prepublishOnly','packages/ui/README.md'
```

Expected: every pattern has at least one match.

- [ ] **Step 6: Commit the maintenance guide**

```bash
git add README.md
git commit -m "docs: rewrite workspace maintenance guide"
```

### Task 3: Validate commands, links, and reader comprehension

**Files:**
- Verify: `README.md`
- Verify: `packages/ui/README.md`
- Verify: `packages/ui/src/**`

- [ ] **Step 1: Scan both documents for unfinished content and obsolete paths**

Run a PowerShell check that fails when obsolete paths or unfinished Chinese section markers appear:

```powershell
$docs = @('README.md', 'packages/ui/README.md')
$bad = Select-String -Path $docs -Pattern 'packages/ui-element|待补充内容|未完成章节'
if ($bad) { $bad | Format-Table; exit 1 }
```

Expected: exit code `0` with no matches.

- [ ] **Step 2: Run the component library test suite**

Run:

```bash
pnpm --dir packages/ui test
```

Expected: 5 test files and 36 tests pass.

- [ ] **Step 3: Build and verify the package**

Run:

```bash
pnpm --dir packages/ui build
pnpm --dir packages/ui verify:exports
```

Expected: Vite build succeeds; the required ESM, declaration, CSS, and source map outputs exist; package exports and NodeNext declarations verify successfully.

- [ ] **Step 4: Build the Playground as a consumer**

Run:

```bash
pnpm --dir playground build
```

Expected: Vue TypeScript project build and Vite production build both succeed after the workspace package has produced `dist` declarations.

- [ ] **Step 5: Run reader tests with a context-free reviewer**

Give the reviewer only the two README files and ask these questions:

1. Which packages and style files must a consumer install and import?
2. How does a consumer configure a custom `status` cell in `GaTable`?
3. How can manual `ElTableColumn` nodes be placed before and after configured columns?
4. Which events support two-way pagination binding?
5. Why must the parent of `GaTablePagination` have a definite height?
6. Does `GaTablePagination` forward arbitrary table events to the underlying table?
7. How does a maintainer run tests, build the package, and verify package exports?
8. Which files must be updated when a new public package subpath is added?

Expected: every answer can be quoted or directly inferred from the documents without reading source code. The reviewer should report no contradictions between the consumer and maintainer guides.

- [ ] **Step 6: Apply any reader-test corrections and rerun focused checks**

For each identified ambiguity, edit only the affected paragraph or table. Repeat the relevant `Select-String` check and reader question until the answer is unambiguous.

- [ ] **Step 7: Commit final documentation corrections if needed**

```bash
git add README.md packages/ui/README.md
git commit -m "docs: clarify component library documentation"
```

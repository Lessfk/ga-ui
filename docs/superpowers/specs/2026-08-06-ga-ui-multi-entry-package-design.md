# ga-ui 单包多入口设计

## 背景

当前组件库位于 `packages/ui-element`，以单一入口发布基础组件和业务组件。目标是在只安装一个 npm 包的前提下，为基础组件和业务组件提供清晰、独立的公开入口：

```bash
npm install ga-ui
```

```ts
import { GaTable } from 'ga-ui/base'
import { GaTablePagination } from 'ga-ui/business'
```

组件库继续统一版本、统一构建和统一发布，不拆成多个 npm 包。

## 目标

- npm 上只发布一个名为 `ga-ui` 的包。
- 基础组件通过 `ga-ui/base` 导入。
- 业务组件通过 `ga-ui/business` 导入。
- 根入口 `ga-ui` 聚合导出全部组件。
- 所有组件样式统一输出为 `ga-ui/style.css`。
- 业务组件只能通过基础层的公开入口使用基础组件和类型。
- 保持现有组件的 props、事件、插槽和组件名称不变。

## 非目标

- 不拆分为 `ga-ui-base` 和 `ga-ui-business` 两个 npm 包。
- 不为基础组件和业务组件维护独立版本。
- 不在本次调整中改变组件功能或视觉表现。
- 不增加全量 `app.use()` 插件注册能力。
- 不拆分基础样式和业务样式。

## 目录结构

源码按基础层和业务层重新组织：

```text
packages/ui-element/
└── src/
    ├── base/
    │   ├── components/
    │   │   ├── table/
    │   │   ├── pagination/
    │   │   └── dialog/
    │   └── index.ts
    ├── business/
    │   ├── components/
    │   │   └── tablePagination/
    │   └── index.ts
    └── index.ts
```

组件归属如下：

- 基础组件：`GaTable`、`GaPagination`、`GaDialog`。
- 业务组件：`GaTablePagination`。

后续新增组件必须先明确归属。通用、无业务语义的组件进入 `base`；由多个基础组件组合且承载业务交互的组件进入 `business`。

## 公开 API

基础入口只导出基础组件及其公开类型：

```ts
// src/base/index.ts
export * from './components/table'
export * from './components/pagination'
export * from './components/dialog'
```

业务入口只导出业务组件及其公开类型：

```ts
// src/business/index.ts
export * from './components/tablePagination'
```

根入口聚合全部组件：

```ts
// src/index.ts
export * from './base'
export * from './business'
```

消费者可以按职责导入：

```ts
import { GaTable, GaPagination } from 'ga-ui/base'
import { GaTablePagination } from 'ga-ui/business'
```

也可以通过根入口导入全部公开 API：

```ts
import { GaTable, GaTablePagination } from 'ga-ui'
```

## 层级依赖规则

依赖方向固定为：

```text
business -> base -> vue / element-plus
```

基础层不得导入业务层。业务层可以使用基础层，但必须通过 `src/base/index.ts` 暴露的公开组件和公开类型访问，不得直接导入基础组件内部的 `src/props`、`types` 或实现文件。

例如业务组件应使用：

```ts
import {
  GaPagination,
  GaTable,
  type GaTableProps,
} from '../../../../base'
```

该约束使基础组件内部目录可以独立调整，而不破坏业务层。

## 构建设计

Vite 继续执行一次库构建，但提供三个 ESM 入口：

```ts
lib: {
  entry: {
    index: resolveFile('./src/index.ts'),
    'base/index': resolveFile('./src/base/index.ts'),
    'business/index': resolveFile('./src/business/index.ts'),
  },
  formats: ['es'],
  fileName: (_format, entryName) => `${entryName}.js`,
  cssFileName: 'style',
},
cssCodeSplit: false,
```

`vue`、`element-plus` 及其子路径继续作为 external，不进入组件库 bundle。`vite-plugin-dts` 继续生成 TypeScript 声明文件，并排除测试文件。

预期构建产物：

```text
dist/
├── index.js
├── index.d.ts
├── base/
│   ├── index.js
│   └── index.d.ts
├── business/
│   ├── index.js
│   └── index.d.ts
└── style.css
```

如果 Rollup 为共享代码生成额外 chunk，这些 chunk 也保留在 `dist` 中，并由入口文件通过相对路径引用。

## 样式设计

所有基础组件和业务组件的样式统一提取到：

```text
dist/style.css
```

消费者统一导入 Element Plus 样式和 ga-ui 样式：

```ts
import 'element-plus/dist/index.css'
import 'ga-ui/style.css'
```

`package.json` 保持 CSS side effect 声明，防止构建工具错误移除样式：

```json
{
  "sideEffects": [
    "**/*.css"
  ]
}
```

## npm 包配置

组件包名称改为 `ga-ui`，通过 `exports` 暴露根入口、基础入口、业务入口和统一样式：

```json
{
  "name": "ga-ui",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./base": {
      "types": "./dist/base/index.d.ts",
      "import": "./dist/base/index.js",
      "default": "./dist/base/index.js"
    },
    "./business": {
      "types": "./dist/business/index.d.ts",
      "import": "./dist/business/index.js",
      "default": "./dist/business/index.js"
    },
    "./style.css": "./dist/style.css"
  },
  "files": [
    "dist"
  ]
}
```

`vue` 和 `element-plus` 继续作为 `peerDependencies`。Playground 的 workspace 依赖由 `ga-ui-element` 更新为：

```json
{
  "dependencies": {
    "ga-ui": "workspace:*"
  }
}
```

正式改名和发布前必须通过 npm registry 检查 `ga-ui` 是否可用。如果名称已被占用，实施暂停，由维护者选择作用域名称，例如 `@lemonmon/ga-ui`；所有导入路径相应变为 `@lemonmon/ga-ui/base` 和 `@lemonmon/ga-ui/business`。

## 迁移策略

1. 先增加入口导出测试，覆盖根入口、基础入口和业务入口。
2. 创建 `src/base` 和 `src/business` 目录并移动现有组件。
3. 更新组件间相对导入，使业务层只访问基础层公开入口。
4. 更新 Vite 多入口配置和声明文件生成配置。
5. 更新组件包名称、`exports` 和 Playground workspace 依赖。
6. 更新 Playground 示例，同时验证基础入口与业务入口。
7. 更新 README 中的安装、导入和样式说明。
8. 执行测试、构建、入口导入验证和 npm pack dry-run。

迁移过程中不修改组件行为。文件移动后，现有组件单元测试应继续通过。

## 测试与验证

### 源码导出测试

测试必须确认：

- `src/base/index.ts` 导出 `GaTable`、`GaPagination` 和 `GaDialog`。
- `src/base/index.ts` 不导出 `GaTablePagination`。
- `src/business/index.ts` 导出 `GaTablePagination`。
- `src/business/index.ts` 不导出基础组件。
- `src/index.ts` 导出全部基础组件和业务组件。
- 现有组件测试在移动后继续通过。

### 构建产物测试

构建完成后必须确认以下文件存在：

- `dist/index.js`
- `dist/index.d.ts`
- `dist/base/index.js`
- `dist/base/index.d.ts`
- `dist/business/index.js`
- `dist/business/index.d.ts`
- `dist/style.css`

还需要实际导入 `ga-ui`、`ga-ui/base` 和 `ga-ui/business` 三个入口，验证 JavaScript 和 TypeScript 导出均可解析。

### Playground 验证

Playground 分别从 `ga-ui/base` 和 `ga-ui/business` 导入组件，统一导入 `ga-ui/style.css`，并通过类型检查和生产构建。

### 发布包验证

执行：

```powershell
npm.cmd pack --dry-run
```

确认发布包包含三个入口、全部声明文件、共享 chunk、统一样式、README、LICENSE 和 `package.json`，且不包含源码测试、Playground 或其他无关文件。

## 发布保护

发布前生命周期保持测试和构建保护：

```json
{
  "scripts": {
    "build": "vite build",
    "test": "vitest run",
    "prepublishOnly": "pnpm run test && pnpm run build"
  }
}
```

测试或构建失败时，npm 发布必须中止。发布成功后，消费者的标准使用方式为：

```bash
npm install ga-ui vue element-plus
```

```ts
import { GaTable } from 'ga-ui/base'
import { GaTablePagination } from 'ga-ui/business'
import 'element-plus/dist/index.css'
import 'ga-ui/style.css'
```

## 验收标准

- 只需安装一个 npm 包。
- `ga-ui/base` 只能访问基础组件公开 API。
- `ga-ui/business` 只能访问业务组件公开 API。
- `ga-ui` 根入口可以访问全部公开 API。
- 业务组件通过基础入口复用基础组件，不依赖其内部文件。
- 构建只生成一份统一样式文件。
- 单元测试、类型检查、库构建和 Playground 构建全部通过。
- `npm pack --dry-run` 中的所有 `exports` 目标均存在且可以导入。

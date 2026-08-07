# ga-ui

ga-ui 是一个基于 Vue 3 和 Element Plus 的组件库工作区。本仓库包含组件库源码、构建与契约验证脚本，以及用于本地联调的 Playground。

## Workspace 概览

- `packages/ui-element`：组件库 npm 包目录，包名为 `ga-ui`。
- `playground`：引用 workspace 内 `ga-ui` 的 Vue 3 示例应用。
- `docs`：项目文档目录。

组件库提供三个公开 JavaScript/TypeScript 入口：

- `ga-ui/base`：基础组件 `GaTable`、`GaPagination` 及相关类型。
- `ga-ui/business`：业务组件 `GaTablePagination` 及相关类型。
- `ga-ui`：聚合基础组件和业务组件的根入口。

样式统一从 `ga-ui/style.css` 导入；Element Plus 的样式需要由消费者单独导入。

## 本地开发

本仓库使用 pnpm workspace，并通过 `packageManager` 固定使用 `pnpm@10.34.5`。首次使用且环境已提供 Corepack 时，可先启用其包管理器代理：

```bash
corepack enable
```

然后安装依赖：

```bash
pnpm install
```

运行组件库测试与构建：

```bash
pnpm --dir packages/ui-element test
pnpm --dir packages/ui-element build
```

检查已构建包的公开入口：

```bash
pnpm --dir packages/ui-element verify:exports
```

启动或构建 Playground：

```bash
pnpm --dir playground dev
pnpm --dir playground build
```

## 消费者使用示例

当前 0.1.0 尚未发布到 npm registry；以下安装命令仅适用于正式发布后。

```bash
npm install ga-ui vue element-plus
```

消费者项目需要提供 `ga-ui` 的 peer dependencies：`vue` 与 `element-plus`。

```ts
import { GaPagination, GaTable, type GaTableColumn } from 'ga-ui/base'
import { GaTablePagination } from 'ga-ui/business'
import 'element-plus/dist/index.css'
import 'ga-ui/style.css'
```

也可以从根入口统一导入组件：

```ts
import { GaPagination, GaTable, GaTablePagination } from 'ga-ui'
```

完整的包使用说明见 [`packages/ui-element/README.md`](packages/ui-element/README.md)。

## 许可证

`packages/ui-element` 下的 `ga-ui` npm 包使用 [MIT License](packages/ui-element/LICENSE)。此说明仅适用于该 npm 包，不代表整个 workspace 采用 MIT License。

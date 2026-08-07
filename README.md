# ga-ui-plus Workspace

本仓库是 `ga-ui-plus` 组件库的 pnpm workspace，根维护说明面向组件贡献者与发布维护者。

## 项目结构

- `packages/ui`：`ga-ui-plus` npm 包的源码、测试、构建与发布配置。
- `playground`：用于本地联调的 Vue 3 应用。
- `docs`：设计说明和实施计划；当前仅作为文档目录，不是独立 package。

`pnpm-workspace.yaml` 覆盖 `packages/*`、`playground` 和 `docs`。

## 技术栈

- Vue 3
- Element Plus
- Vite 6
- TypeScript 5.8
- Vitest
- pnpm workspace

## 环境要求

根 `package.json` 通过 `packageManager` 固定使用 `pnpm@10.34.5`。仓库当前没有通过 `engines` 或版本文件固定精确的 Node.js 版本，请使用兼容 pnpm 10 与 Vite 6 的 Node.js 环境。

## 安装依赖

如果本机使用 Corepack，可先启用包管理器代理：

```bash
corepack enable
```

在 workspace 根目录安装依赖：

```bash
pnpm install
```

## 本地开发与预览

从 workspace 根目录启动 Playground：

```bash
pnpm --dir playground dev
```

Playground 的 Vite server 配置端口为 `5555`，默认可访问 `http://localhost:5555`。根 `package.json` 没有提供可用的 `dev` 脚本。

## 测试与类型检查

运行组件包的完整测试：

```bash
pnpm --dir packages/ui test
```

该命令先通过 `vue-tsc` 检查类型契约，再运行 Vitest 测试。开发时可单独以监听模式运行 Vitest：

```bash
pnpm --dir packages/ui test:watch
```

## 构建与包验证

先构建组件包：

```bash
pnpm --dir packages/ui build
```

`build` 已包含 `verify:build`，会检查构建产物、样式、声明文件和运行时导出。随后验证 npm 包的公开导出与类型消费：

```bash
pnpm --dir packages/ui verify:exports
```

`verify:exports` 依赖已经存在的 `dist`，因此应先运行 `build`。最后构建 Playground：

```bash
pnpm --dir playground build
```

建议在组件包构建完成后运行 Playground build，以便解析 workspace 包的 `dist` 类型声明。

## 构建产物与公开入口

组件包构建生成以下主要文件：

- `dist/index.js`
- `dist/index.d.ts`
- `dist/base/index.js`
- `dist/base/index.d.ts`
- `dist/business/index.js`
- `dist/business/index.d.ts`
- `dist/style.css`

包为 ESM-only，并提供多个公开入口：

- `ga-ui-plus`
- `ga-ui-plus/base`
- `ga-ui-plus/business`
- `ga-ui-plus/style.css`

Vue 和 Element Plus 被标记为 external，不会打入组件包。组件样式合并为单个 CSS 文件。构建会生成 source maps，但不会把源码嵌入 source maps。

## 发布流程

`packages/ui/package.json` 中的组件包版本当前为 `0.1.0`，且未标记为 `private`；workspace 根包则为私有包。组件包的发布配置为公开访问，并使用 npmjs registry：

- `publishConfig.access`：`public`
- `publishConfig.registry`：`https://registry.npmjs.org/`
- `peerDependencies.vue`：`^3.3.7`
- `peerDependencies.element-plus`：`^2.14.3`

发布钩子 `prepublishOnly` 会依次执行 `test` → `build` → `verify:exports`。确认版本、变更内容、npm 登录状态和验证结果后，可从 workspace 根目录运行：

```bash
pnpm --dir packages/ui publish
```

该命令说明发布入口，不表示当前版本已经发布。

## 新增组件检查清单

- 在正确的 `base` 或 `business` 路径新增实现、style 入口以及公开 Props/类型。
- 从组件的本地 `index.ts` 和所属 category barrel 导出公共内容。
- 新增单元测试；公共表面发生变化时同步更新 `src/__tests__/exports.spec.ts`。
- 只有新增公共包子路径时，才更新 Vite library entries。
- 构建产物或导出发生变化时，更新 `scripts/verify-build.mjs` 和 `scripts/verify-exports.mjs`。
- 更新 `packages/ui/README.md` 中的组件使用文档。
- 发布前依次运行：

  ```bash
  pnpm --dir packages/ui test
  pnpm --dir packages/ui build
  pnpm --dir packages/ui verify:exports
  pnpm --dir playground build
  ```

## 组件使用文档

消费者安装、入口选择、样式导入和组件 API 见 [`packages/ui/README.md`](packages/ui/README.md)。根维护说明不重复组件 Props 或长篇使用示例。

## 许可证

`packages/ui` 下的 `ga-ui-plus` 组件包使用 [MIT License](packages/ui/LICENSE)。workspace 根 `package.json` 当前声明为 ISC；组件包的 MIT 许可证不代表整个 workspace 根目录采用 MIT License。

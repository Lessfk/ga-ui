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

根 `package.json` 通过 `packageManager` 固定使用 `pnpm@10.34.5`。运行 `pnpm --version` 时应输出 `10.34.5`。仓库当前没有通过 `engines` 或版本文件固定精确的 Node.js 版本，请使用兼容 pnpm 10 与 Vite 6 的 Node.js 环境。

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

Playground 的 Vite server 配置端口为 `5555`，默认可访问 `http://localhost:5555`。开发服务器通过 Vite 源码 alias 直接解析 `packages/ui/src`，不需要预先构建组件包。根 `package.json` 没有提供可用的 `dev` 脚本。

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

在干净环境中，必须先运行 `pnpm --dir packages/ui build`，再运行 `pnpm --dir playground build`。Playground production build 的 `vue-tsc` 会通过 package exports 解析组件包的 `dist` 类型声明，因此构建 Playground 前必须已经生成 `packages/ui/dist`。

## 构建产物与公开入口

组件包构建生成以下主要文件；下列路径均相对于 workspace 根目录：

- `packages/ui/dist/index.js`
- `packages/ui/dist/index.d.ts`
- `packages/ui/dist/base/index.js`
- `packages/ui/dist/base/index.d.ts`
- `packages/ui/dist/business/index.js`
- `packages/ui/dist/business/index.d.ts`
- `packages/ui/dist/style.css`

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

发布前必须从 workspace 根目录手动依次运行完整检查，唯一顺序为 `test` → `build` → `verify:exports` → Playground build：

```bash
pnpm --dir packages/ui test
pnpm --dir packages/ui build
pnpm --dir packages/ui verify:exports
pnpm --dir playground build
```

执行 publish 时，`prepublishOnly` 会自动重复前三项 `test` → `build` → `verify:exports` 作为安全门。Playground build 不在发布钩子内，因此仍必须在发布前按上面的完整顺序手动完成。随后可从 workspace 根目录运行：

```bash
pnpm --dir packages/ui publish
```

该命令说明发布入口，不表示当前版本已经发布。

## 新增组件检查清单

- 先确定组件分类和导出层级：
  - `base`：通用、可独立复用的基础组件。源码放在 `packages/ui/src/base/components/<component>`，所属 category barrel 是 `packages/ui/src/base/index.ts`。
  - `business`：组合多个基础能力的业务组件。源码放在 `packages/ui/src/business/components/<component>`，所属 category barrel 是 `packages/ui/src/business/index.ts`。
  - “local index”是组件目录内的 `index.ts`，即 `packages/ui/src/<category>/components/<component>/index.ts`。
- 在对应组件目录新增实现、style 入口以及公开 Props/类型，并新增单元测试。
- 普通组件通常沿用已有的 `base` 或 `business` npm 子路径。若只改变现有 barrel 的导出成员，从 local index 和所属 category barrel 导出公共内容，并更新 `packages/ui/src/__tests__/exports.spec.ts`；不需要新增 Vite library entry 或 package exports。
- 只有当构建产物清单、npm 包子路径或验证所期望的运行时导出集合发生变化时，才按实际变化同步 `packages/ui/scripts/verify-build.mjs`、`packages/ui/scripts/verify-exports.mjs` 与 `packages/ui/scripts/fixtures/node-next-consumer/index.ts` 中的断言或消费用例。
- 只有确实新增 npm 公共子路径时，才必须同步维护以下位置：
  - `packages/ui/vite.config.ts` 的 library entry。
  - `packages/ui/package.json` 的 `exports` 映射。
  - `packages/ui/scripts/verify-build.mjs`。
  - `packages/ui/scripts/verify-exports.mjs`。
  - `packages/ui/scripts/fixtures/node-next-consumer/index.ts`，确保 NodeNext 消费类型检查覆盖新入口。
  - 根 `README.md` 的“构建产物与公开入口”列表。
  - `packages/ui/README.md` 的“导出入口”表和新子路径的对应用法。
  - 若需要在 Playground 演示或消费新子路径，再同步 `playground/vite.config.ts` 的源码 alias 与相应 `playground/src` 导入；这不是无条件必改项。
- 更新 `packages/ui/README.md` 中的组件用法、API 与限制说明。
- 发布前检查按“发布流程”中的唯一顺序手动执行。

## 组件使用文档

消费者安装、入口选择、样式导入和组件 API 见 [`packages/ui/README.md`](packages/ui/README.md)。根维护说明不重复组件 Props 或长篇使用示例。

## 许可证

`packages/ui` 下的 `ga-ui-plus` 组件包使用 [MIT License](packages/ui/LICENSE)。workspace 根 `package.json` 当前声明为 ISC；组件包的 MIT 许可证不代表整个 workspace 根目录采用 MIT License。

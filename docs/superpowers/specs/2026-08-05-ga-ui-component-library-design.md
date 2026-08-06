# GA UI 企业组件库设计

- 日期：2026-08-05
- 状态：设计已确认，等待实施计划
- 目标技术栈：Vite、Vue 3、TypeScript、Element Plus、SCSS、pnpm workspace

## 1. 背景与目标

GA UI 面向公司内部多个 Vue 项目，以私有 npm 包形式复用。组件库包含三类能力：不依赖 Element Plus 的基础组件、Element Plus 二次封装组件，以及具有公司业务语义的业务组件。

本设计的主要目标是：

- 为多个 Vite SPA 提供一致、可独立升级的组件能力。
- 保持基础组件、Element Plus 封装和业务组件之间的清晰边界。
- 同时支持全量安装、手动按需导入和 `unplugin-vue-components` 自动导入。
- 让简单业务组件保持纯 Props、Events、Slots 模型，让复杂组件通过适配器访问外部能力。
- 提供完整类型声明、组件预览、测试和本地打包验证流程。
- 在私有 npm Registry 尚未确定时，先通过本地 `.tgz` 包验证真实消费方式。

## 2. 非目标

首期明确不包含以下能力：

- Nuxt 或服务端渲染支持。
- 暗色主题、品牌主题或可视化主题生成器。
- 完整国际化运行时；首期使用中文默认文案，并允许通过 Props 和 Slots 覆盖。
- 对 Element Plus 所有组件进行机械式二次封装。
- 连接真实私有 npm Registry 或自动发布远程包。
- 外部视觉回归平台。

## 3. 当前仓库状态

当前仓库只有 pnpm workspace 和 TypeScript 根配置，尚无可运行的组件包。实施时需要处理以下现状：

- `packages/ui` 当前是一个空文件，需要替换为实际包目录。
- `playground` 尚不存在，`docs` 为空目录。
- 根 `package.json` 尚未声明 `private`、`packageManager`、开发依赖和工作区脚本。
- `.gitignore` 为空。
- 当前目录不是 Git 仓库，暂时不能提交设计或代码 commit。
- 当前环境为 Node.js `v22.15.0`、pnpm `10.34.5`；PowerShell 中应使用 `pnpm.cmd`，或由使用者调整脚本执行策略。

## 4. 仓库与包架构

仓库采用三个公开包加内部支持包的结构：

```text
ga-ui/
├── packages/
│   ├── ui-core/          # 发布为 @ga/ui-core
│   ├── ui-element/       # 发布为 @ga/ui-element
│   ├── ui-business/      # 发布为 @ga/ui-business
│   ├── shared/           # 内部共享源码，private
│   └── build-config/     # 统一构建、类型和测试配置，private
├── playground/           # 真实消费方式的集成验证应用
├── storybook/            # Storybook 配置与组件工作台
└── docs/
```

不创建独立 `theme` 包。`ui-element` 和 `ui-business` 直接使用 Element Plus 默认主题及其 CSS Variables；`ui-core` 使用局部、无主题系统的 SCSS，并保持对 Element Plus 的独立性。

### 4.1 依赖方向

依赖只能由上层指向下层：

```text
@ga/ui-business
  ├── @ga/ui-element
  └── @ga/ui-core

@ga/ui-element
  └── @ga/ui-core

@ga/ui-core
  └── 不依赖另外两个公开包
```

禁止循环依赖和反向依赖。

### 4.2 包职责

#### `@ga/ui-core`

- 不依赖 Element Plus 的通用基础组件。
- 公共 Vue Hooks、插件基础设施和公开类型。
- 可跨业务复用的交互能力。
- 不包含具体公司业务和接口调用。

#### `@ga/ui-element`

- Element Plus 的有价值二次封装。
- 统一跨项目反复使用的默认配置和交互规范。
- 提供组合组件，例如搜索表单、标准弹窗、表格工具栏等。
- 不直接访问接口、路由、权限系统或 Store。

#### `@ga/ui-business`

- 具有公司业务语义的组件。
- 简单组件采用 Props、Events、Slots。
- 复杂组件通过适配器使用权限、导航和错误处理等外部能力。
- 数据加载优先通过组件级函数 Props 或领域适配器传入。

#### `shared`

- 只承载仓库内部共享源码和构建期工具。
- 不作为公开运行时依赖发布。
- 如果公开包使用其中的运行时代码，该代码必须被构建进公开包产物，不能在发布后留下无法解析的私有依赖。

#### `build-config`

- 统一 Vite Library Mode、TypeScript、Vitest、ESLint 和 Stylelint 配置。
- 只供 workspace 内部继承，不发布。

### 4.3 依赖声明

- `vue` 是三个公开包的 `peerDependency`。
- `element-plus` 是 `ui-element` 和 `ui-business` 的 `peerDependency`。
- `ui-element` 将 `ui-core` 声明为普通依赖。
- `ui-business` 将 `ui-core` 和 `ui-element` 声明为普通依赖。
- 安装 `ui-business` 时会自动获得匹配版本的另外两个公开包。
- Vite 构建时将 `vue` 和 `element-plus` external，不重复打进组件库产物。

## 5. 组件设计规范

### 5.1 命名与目录

所有公开组件使用 `Ga` 前缀，例如 `GaButton`、`GaDialog`、`GaSearchForm` 和 `GaUserSelector`。

每个组件采用独立目录：

```text
components/ga-user-selector/
├── src/
│   ├── user-selector.vue
│   ├── props.ts
│   ├── types.ts
│   └── use-user-selector.ts
├── style/
│   └── index.scss
├── __tests__/
│   └── user-selector.spec.ts
├── index.ts
└── stories.ts
```

### 5.2 公开 API

组件公开导出组件本身及稳定类型：

```ts
export { GaUserSelector }
export type {
  GaUserSelectorProps,
  GaUserSelectorEmits,
  GaUserSelectorInstance,
}
```

规范如下：

- 值同步使用 `modelValue` 和 `update:modelValue`。
- 动作事件使用明确名称，例如 `search`、`confirm`、`cancel`。
- 优先通过 Slots 扩展布局，避免堆积仅控制展示的 Props。
- 公开类型不得暴露内部实现类型。
- 实例方法只暴露 `validate()`、`reset()`、`focus()` 等必要能力。
- 默认不访问消费项目的全局 Store、Router 或请求实例。
- 默认避免直接访问浏览器全局对象，为以后扩展运行环境保留空间，但首期不承诺 SSR。

### 5.3 Element Plus 封装标准

只有满足至少一项明确价值时才进行封装：

- 统一默认配置或公司交互规范。
- 解决多个项目反复遇到的问题。
- 形成稳定的组合组件。
- 隔离重要的 Element Plus API 变化。
- 提供权限、防重复提交或标准状态等通用能力。

没有新增价值的 Element Plus 组件由业务项目直接使用，不创建只有一层转发的 `Ga` 组件。

封装组件保留常用 Props、Events 和 Slots，可通过 `$attrs` 传递低频配置，但不承诺透传 Element Plus 的全部内部实现细节。

## 6. 样式策略

首期不建设 GA 设计令牌或主题映射层。`ui-element` 和 `ui-business` 直接使用 Element Plus 默认主题，`ui-core` 保持样式独立。

规则如下：

- Element Plus 全局样式由使用 `ui-element` 或 `ui-business` 的消费项目统一引入。
- 所有自有组件使用局部 SCSS，选择器以 `.ga-` 命名空间开头。
- 自有样式只作用于组件自身，不全局覆盖 Element Plus。
- `ui-core` 不引用 Element Plus CSS Variables，使用 `currentColor`、继承值或组件内局部 SCSS 常量保持独立。
- `ui-element` 和 `ui-business` 的颜色、边框、背景和圆角优先使用 Element Plus CSS Variables。
- 必须修改 Element Plus 内部结构时，修改范围限定在当前封装组件根节点下。
- 不依赖未经公开的 Element Plus DOM 类名；不可避免时添加升级测试。

示例：

```scss
.ga-search-form {
  padding: 16px;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}
```

## 7. 业务适配器设计

业务组件采用 A+B 混合模式。

### 7.1 组件级函数 Props

数据加载和领域动作优先通过函数 Props 传入：

```vue
<GaUserSelector
  :load-users="userService.search"
  :get-user-detail="userService.getDetail"
  @confirm="handleConfirm"
/>
```

组件只依赖约定的输入输出类型，不知道 URL、Axios 实例或后端接口实现。

### 7.2 全局适配器

多个组件共享的横切能力通过 Vue 插件注入：

```ts
app.use(GaBusinessPlugin, {
  hasPermission: permissionService.has,
  navigate: router.push,
  onError: errorHandler,
})
```

首期适配器包含：

- `hasPermission`：权限判断。
- `navigate`：导航能力。
- `onError`：统一异常上报或提示入口。

不提供通用的 `request(url, config)` 适配器，以免组件与接口地址或传输协议耦合。

### 7.3 缺失能力与错误行为

- 简单展示组件不要求安装业务插件。
- 组件只在实际使用某项能力时检查对应适配器。
- 声明了权限要求但缺少权限适配器时，默认拒绝操作，并在开发环境输出明确警告。
- 缺少必需的数据加载函数时，组件进入可展示的错误状态，不请求隐含默认地址。
- 异常交给 `onError` 后，组件仍需维护明确的 loading、error 和 retry 状态。
- 所有默认文案使用中文，并允许通过 Props 或 Slots 覆盖。

## 8. 构建与导入

### 8.1 构建产物

- 使用 Vite Library Mode。
- 只输出 ESM，服务现代 Vite SPA。
- 输出完整 `.d.ts` 类型声明。
- 保留组件级入口和 Resolver 入口。
- SCSS 在发布前编译为 CSS。
- 输出 Source Map。
- 发布产物不包含测试、Storybook、缓存文件或无关源码。

### 8.2 完整安装

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import GaCore from '@ga/ui-core'
import GaElement from '@ga/ui-element'
import GaBusiness from '@ga/ui-business'

import '@ga/ui-core/style.css'
import '@ga/ui-element/style.css'
import '@ga/ui-business/style.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(GaCore)
app.use(GaElement)
app.use(GaBusiness, businessAdapters)
```

### 8.3 手动按需导入

```ts
import { GaSearchForm } from '@ga/ui-element'
import '@ga/ui-element/components/search-form/style.css'
```

### 8.4 自动导入

每个公开包提供独立 Resolver：

```ts
Components({
  resolvers: [
    GaCoreResolver(),
    GaElementResolver(),
    GaBusinessResolver(),
  ],
})
```

Resolver 同时返回组件入口和对应样式路径。

### 8.5 样式产物

- 每个包提供聚合 `style.css`。
- 每个组件提供独立 `style.css`。
- Element Plus CSS 不重复打进 GA UI 的聚合样式。
- 包的 `package.json` 通过 `sideEffects` 标记 CSS 文件。
- 组件 JavaScript 不隐式加载当前包的全部 CSS。

### 8.6 包导出

每个公开包至少提供根入口、样式入口、组件子路径和 Resolver：

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./style.css": "./dist/style.css",
    "./components/*": "./dist/components/*",
    "./resolver": {
      "types": "./dist/resolver.d.ts",
      "import": "./dist/resolver.js"
    }
  }
}
```

根 `package.json` 设置 `private: true` 和 `packageManager: pnpm@10.34.5`。

## 9. Storybook 与 Playground

Storybook 是主要组件工作台，负责隔离开发、交互展示和组件文档。

每个公开组件至少提供：

- 默认状态。
- 主要 Props、Events 和 Slots 示例。
- 禁用或只读状态（适用时）。
- 加载、空数据和失败状态（异步组件适用时）。
- 权限允许和拒绝状态（权限组件适用时）。

Storybook 使用 Mock 数据和 Mock 适配器，不连接真实后端。文档使用中文。

Playground 只验证真实集成方式：

```text
playground/
├── full-install
├── manual-import
├── auto-import
└── adapter-demo
```

Playground 不复制 Storybook 的全部组件示例。

## 10. 测试与质量门禁

### 10.1 测试层级

- Vitest + Vue Test Utils：组件单元测试。
- Storybook 交互测试：点击、输入、异步状态和组件组合。
- Playground 集成测试：真实安装、构建、样式和 Resolver 验证。

复杂业务组件重点覆盖：

- 数据加载成功、失败和重试。
- 缺失适配器。
- 权限允许和拒绝。
- `v-model` 同步。
- 异步操作防重复提交。
- 组件卸载后不再更新状态。

### 10.2 静态检查

- ESLint：Vue 和 TypeScript。
- Prettier：代码格式。
- Stylelint：SCSS 和组件样式。
- `vue-tsc`：Vue 模板和类型声明。

统一质量命令：

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

首期不接入外部视觉回归平台，但保留以后基于 Storybook 增加截图测试的空间。

## 11. 版本与本地发布

三个公开包从 `0.1.0` 开始，使用 Changesets 独立版本化：

- Patch：不改变公开 API 的修复。
- Minor：向后兼容的新组件或新能力。
- Major：破坏性 API 或默认行为变化。

`shared` 和 `build-config` 保持 `private: true`。Changesets 负责联动更新公开包之间的依赖版本。

私有 Registry 未确定前，执行完整本地验证：

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm pack:check
```

`pack:check` 分别生成三个 `.tgz` 包，并在临时 Vite 项目中安装它们，验证：

- 包导出和类型声明可用。
- 全量安装可运行。
- 手动按需导入可构建。
- Resolver 自动导入可工作。
- Element Plus 未被重复打包。
- 发布包不包含无关文件。

本地包统一输出到：

```text
artifacts/
├── ga-ui-core-0.1.0.tgz
├── ga-ui-element-0.1.0.tgz
└── ga-ui-business-0.1.0.tgz
```

以后接入私有 Registry 时，只增加 Registry 配置和发布命令。认证 Token 只能保存在环境变量或用户级 `.npmrc`，不能提交到仓库。

## 12. 验收标准

组件库首期骨架完成时应满足：

- 三个公开包和两个内部包均可在 pnpm workspace 中独立构建。
- 三个公开包可生成有效 ESM、CSS 和 TypeScript 声明产物。
- 全量安装、手动按需导入和自动导入均有可运行示例。
- Storybook 能展示三个层级的代表组件。
- Playground 能验证完整安装和适配器注入。
- 公开包中不存在对消费项目 Store、Router 或 Axios 实例的直接依赖。
- `vue` 与 `element-plus` 不被打进发布包。
- 本地 `.tgz` 安装验证通过。
- lint、typecheck、test 和 build 全部通过。

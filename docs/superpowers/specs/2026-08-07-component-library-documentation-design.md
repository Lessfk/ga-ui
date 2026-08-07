# ga-ui-plus 使用与维护文档设计

## 背景

当前仓库已经提供 `GaTable`、`GaPagination` 和 `GaTablePagination` 三个公开组件，但现有文档只有安装、导入和组件列表，缺少完整示例、API 表、插槽、事件、类型说明以及组件库维护流程。根目录 README 还保留了已经失效的 `packages/ui-element` 路径，包内 README 对 Vue peer dependency 的描述也与 `package.json` 不一致。

本次工作将按照实际源码、类型定义、单元测试、构建配置和 Playground 示例，重写组件使用说明与仓库维护说明。

## 目标

- 让组件使用者不阅读源码即可完成安装、引入、配置和常见定制。
- 让组件库维护者能够完成本地开发、测试、构建、验证和发布前检查。
- 明确当前公共 API、默认值、插槽作用域、事件行为和组件限制。
- 消除失效路径、版本不一致和无法从源码验证的描述。
- 将消费者文档和维护者文档分离，降低重复内容失同步的概率。

## 非目标

- 不实现新组件或修改现有组件行为。
- 不记录尚未实现、尚未导出的 `Dialog` 目录。
- 不建立 VitePress 等文档站点。
- 不补充 ESLint、Changesets、CI 或自动发布配置。
- 不承诺源码和测试未覆盖的 Element Plus 能力。

## 受众与文件分工

### `packages/ui/README.md`

面向安装和使用 `ga-ui-plus` 的业务开发者。该文件是 npm 包的主要使用说明，包含：

1. 组件库简介与兼容版本。
2. 安装、样式加载和导出入口。
3. 最小可运行示例。
4. `GaTable` 的配置列、命名插槽、普通插槽、属性与事件透传、底层实例访问。
5. `GaPagination` 的双向绑定、对齐方式、属性和事件。
6. `GaTablePagination` 的组合用法、扁平 Props、插槽转发、容器高度要求和限制。
7. TypeScript 泛型与公开类型示例。
8. 常见问题与当前限制。

### 根目录 `README.md`

面向组件库贡献者和发布维护者。该文件包含：

1. Workspace 结构和各目录职责。
2. pnpm、Node.js、Vue、Vite 和 TypeScript 的开发环境说明。
3. 安装依赖和启动 Playground。
4. 类型检查、单元测试、构建和包导出验证命令。
5. ESM 多入口构建和 `dist` 产物结构。
6. peer dependencies、发布前钩子和发布配置。
7. 新增组件时需要同步维护的源码入口、样式、测试、构建验证和文档。
8. 指向包内使用说明和许可证的链接。

消费者 API 细节只写在包内 README；根 README 通过链接引用，避免复制 Props 和示例。

## 公共组件覆盖范围

### `GaTable`

文档覆盖以下已验证能力：

- `data`、`columns`、高度、行键、边框、斑马纹、尺寸、表头、高亮、空状态和加载状态。
- 使用 `GaTableColumn<Row>` 配置普通列、选择列、索引列、展开列、排序、过滤、格式化和固定列。
- 通过列配置的 `slot` 字段关联同名插槽，插槽作用域包含 `row`、`column` 和 `$index`。
- `column-prepend`、默认插槽、`append` 和 `empty` 插槽。
- 未声明的属性和 Element Plus 表格事件通过 `$attrs` 传给底层 `ElTable`。
- 通过组件 Ref 访问暴露的 `tableRef`，再调用 Element Plus Table 实例方法。
- 说明 `key` 和 `slot` 是包装组件字段，不会作为列属性传给 `ElTableColumn`。

### `GaPagination`

文档覆盖以下已验证能力：

- `currentPage`、`pageSize`、`total`、`pageSizes`、`size`、`layout`、`background` 和 `position`。
- `v-model:current-page` 与 `v-model:page-size`。
- `current-change` 与 `size-change` 事件。
- `left`、`center`、`right` 三种对齐方式。
- 未声明属性通过 `$attrs` 传给底层 `ElPagination`。

### `GaTablePagination`

文档覆盖以下已验证能力：

- 使用同一层 Props 同时配置表格和分页，不使用旧式 `tableProps`、`paginationProps` 对象。
- 使用一个 `size` 同时控制表格与分页尺寸。
- 转发所有表格插槽，包括配置列的命名插槽。
- 支持页码、每页数量双向绑定及对应变更事件。
- 组件内部将表格高度固定为 `100%`，自身使用两行 Grid 布局，因此父容器必须提供明确高度。
- 公共类型有意排除 `height` 和 `maxHeight`。
- 普通 `$attrs` 绑定在组合组件根容器，不应宣称底层表格事件会自动透传。
- 当前组合组件不暴露底层 `tableRef`。

## 示例设计

- 使用统一的 `UserRow` 示例类型贯穿表格和组合组件章节。
- 示例同时展示配置列、选择列、操作列、自定义状态单元格、空状态和分页双向绑定。
- 每个较长示例之前先给出最小示例，方便读者快速复制。
- 示例中的导入路径与包导出严格对应：基础组件从 `ga-ui-plus/base`，业务组件从 `ga-ui-plus/business`，也说明可从根入口聚合导入。
- 明确 Element Plus CSS 与 `ga-ui-plus/style.css` 都需要由使用方加载。

## 写作规则

- 使用简体中文，保留组件名、API 名和命令原文。
- 先说明最常见用法，再列完整 API；避免先展示大段属性表。
- 所有默认值以 `withDefaults` 和单元测试为准。
- 类型兼容范围以 `packages/ui/package.json` 的 peer dependencies 为准。
- 仓库当前没有通过 `engines` 或版本文件固定 Node.js 版本，维护文档只说明使用支持 pnpm 10 与 Vite 6 的 Node.js 环境，不虚构精确版本下限。
- 对 Element Plus 透传能力使用“可透传”措辞，并链接到 Element Plus 对应组件概念，不复制其全部 API。
- 明确区分已经验证的行为、当前限制和维护建议。

## 验证与验收标准

完成后的文档需要满足：

1. 根 README 不再出现 `packages/ui-element`。
2. 安装章节的 Vue 与 Element Plus 版本和 `peerDependencies` 一致。
3. 三个公开组件均有最小示例和 API 说明。
4. Props、默认值、事件、插槽和限制可以在源码或测试中逐项找到依据。
5. 所有本地开发命令使用当前真实目录 `packages/ui` 和 `playground`。
6. Markdown 中不存在未完成的占位标记、空章节或失效的相对路径。
7. 组件库单元测试继续通过。
8. 使用无对话上下文的读者测试，验证读者能从文档回答安装、导入、表格列定制、分页绑定、组合组件高度和维护命令等问题。

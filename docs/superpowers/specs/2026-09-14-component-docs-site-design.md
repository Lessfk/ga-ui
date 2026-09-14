# GA UI Plus 内部组件文档站设计

## 背景

当前仓库通过 `playground` 手动切换组件案例，适合临时调试，但无法集中回答组件有哪些功能、Props、Events、Slots、Expose API 以及完整使用代码。包内 `README.md` 已包含较多文字说明，不过内容过长、缺少实时预览，也不适合按组件快速浏览。

本次新增一个仅供组件库维护者使用的 VitePress 文档站。它不承担营销官网职责，重点是快速查阅、实时验证和复制组件用法。

## 目标

- 为当前七个公开组件提供独立文档页面。
- 每个案例同时提供实时预览、折叠源码、语法高亮和复制按钮。
- 集中说明组件 Props、Events、Slots、Expose API、公开类型和注意事项。
- 文档站直接消费 workspace 中的 `ga-ui-plus`，确保案例验证的是组件库公开入口。
- 保留 `playground` 作为临时调试环境，文档站只收录稳定案例。
- 支持本地搜索、深色模式、顶部导航、左侧组件导航和右侧页内目录。

## 非目标

- 不建设面向外部用户的营销首页。
- 不提供浏览器内代码编辑和即时编译能力。
- 不自动解析全部 TypeScript 类型生成 API 表。
- 不替代现有单元测试或 `playground`。
- 不在本次修改组件库现有公共 API。

## 技术方案

在现有 `docs` 目录中增加 VitePress 工作区包。VitePress 配置位于 `docs/.vitepress`，站点内容由 `srcDir: './site'` 指向 `docs/site`；`docs/superpowers` 保持原样，避免设计文档和站点页面互相干扰。

文档站依赖：

- `vitepress`：路由、Markdown、代码高亮、复制、本地搜索和主题框架。
- `vue`、`element-plus`、`@element-plus/icons-vue`：运行组件案例。
- `ga-ui-plus: workspace:*`：通过包公开入口加载组件。
- `unplugin-vue-components` 与 `GaUiResolver`：验证组件和内部 Element Plus 样式的按需引入方案。

## 信息架构

顶部导航只保留“指南”和“组件”。首页直接展示安装命令、启动命令、快速入口和组件索引，不使用营销式 Hero。

左侧导航分为：

- 指南：介绍、安装与启动、快速开始、按需引入。
- 基础组件：Dialog、MegaMenu、Pagination、Table。
- 业务组件：AsideMenu、SearchBar、TablePagination。

每个组件页面统一按以下顺序组织：

1. 组件定位和适用场景。
2. 基础用法。
3. 重要功能案例。
4. Props。
5. Events。
6. Slots。
7. Expose API。
8. 主题或公开类型。
9. 注意事项和 Element Plus 透传边界。

## 案例与源码

每个案例是 `docs/site/demos/<component>/<name>.vue` 下的独立 SFC。Markdown 页面直接导入并渲染该 SFC，实现实时预览；随后使用 VitePress 的文件包含语法引用同一个文件：

```md
<DemoPreview title="基础用法">
  <BasicDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/dialog/BasicDemo.vue
:::
```

这样案例运行代码和展示代码只有一份。VitePress 负责源码语法高亮和复制按钮，`DemoPreview` 只负责统一预览区域的标题、说明和内容边界。

## 视觉与交互

采用克制的技术文档风格：白色与浅灰为主背景，蓝色作为操作色，绿色用于状态提示，避免大面积单一蓝色。导航和 API 表格强调扫描效率，卡片圆角不超过 8px。

- 顶部导航固定，品牌名 `GA UI Plus` 是首屏明确标识。
- 案例区域使用稳定边界和内边距，不嵌套多层卡片。
- 代码默认折叠，用户主动展开后使用 VitePress 复制按钮。
- 深色模式使用同一组语义变量适配，不单独维护两套组件结构。
- 文档站以桌面端为主要目标，但导航和正文在窄视口下保持可用。

## API 维护策略

第一版根据组件公开 Props、类型文件、测试和包内 README 手动维护 API 表。包装组件没有声明、但会通过 `$attrs` 透传给 Element Plus 的能力，不复制完整 Element Plus API，只说明透传边界。

手动维护可以避免把 Element Plus 内部类型、复杂泛型和实现字段错误暴露为 GA UI Plus 的承诺。未来组件数量明显增加后，再评估使用 `vue-component-meta` 生成基础数据并人工校对。

## 工程命令

根目录增加以下脚本：

- `pnpm docs:dev`：启动文档站开发服务器。
- `pnpm docs:build`：执行 VitePress 生产构建。
- `pnpm docs:preview`：预览生产构建。

文档站构建必须能解析 workspace 包、`GaUiResolver`、Element Plus 样式和所有案例 SFC。

## 验收标准

1. `pnpm docs:dev` 可以启动站点。
2. `pnpm docs:build` 成功完成，无死链和 Vue 编译错误。
3. 首页、指南和七个组件页面均可通过导航访问。
4. 每个组件至少有一个实时案例，关键组件包含多个功能案例。
5. 每个案例源码默认折叠，展开后有语法高亮和复制按钮。
6. 七个组件页面均列出适用的 Props、Events、Slots 和 Expose API；不适用项明确说明。
7. 本地搜索和深色模式可用。
8. 现有 `ga-ui-plus` 184 个测试继续通过。

# 介绍

GA UI Plus 是一个基于 Vue 3 和 Element Plus 的业务组件库。它保留 Element Plus 的基础能力，并为项目中重复出现的表格、分页、搜索、菜单和对话框场景提供更稳定的默认行为。

## 文档站用途

这个站点主要供组件库维护者使用，用来回答四类问题：

- 组件解决什么问题，适合放在哪些业务场景。
- 组件有哪些 Props、Events、Slots 和 Expose 方法。
- 某项能力应该如何组合使用。
- 修改组件后，稳定案例是否仍能正常运行。

## 组件分层

### 基础组件

基础组件对 Element Plus 单个能力进行增强：`GaDialog`、`GaMegaMenu`、`GaPagination`、`GaTable`。

### 业务组件

业务组件组合多个基础能力形成常用页面模块：`GaAsideMenu`、`GaSearchBar`、`GaTablePagination`。

## Playground 与文档站

`playground` 适合快速试验和排查问题，可以随时修改当前渲染案例。文档站只收录行为稳定、API 清晰的案例，并要求案例代码可直接查看和复制。

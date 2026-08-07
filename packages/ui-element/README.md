# ga-ui

ga-ui 是一个基于 Vue 3 和 Element Plus 二次封装的组件库，提供可独立使用的基础组件和组合式业务组件。

## 安装

当前 0.1.0 尚未发布到 npm registry；以下安装命令仅适用于正式发布后。

`vue` 和 `element-plus` 是 ga-ui 的 peer dependencies，需要由消费者项目一并安装。支持范围为 `vue ^3.5.40` 和 `element-plus ^2.14.3`。

使用 npm：

```bash
npm install ga-ui vue element-plus
```

或使用 pnpm：

```bash
pnpm add ga-ui vue element-plus
```

## 使用

### 基础组件入口

从 `ga-ui/base` 导入基础组件及相关类型：

```ts
import { GaPagination, GaTable, type GaTableColumn } from 'ga-ui/base'
```

### 业务组件入口

从 `ga-ui/business` 导入业务组件及相关类型：

```ts
import {
  GaTablePagination,
  type GaTablePaginationProps,
} from 'ga-ui/business'
```

### 根入口

如需统一导入，也可以使用聚合入口 `ga-ui`：

```ts
import { GaPagination, GaTable, GaTablePagination } from 'ga-ui'
```

### 样式

Element Plus 与 ga-ui 的样式均需由消费者加载：

```ts
import 'element-plus/dist/index.css'
import 'ga-ui/style.css'
```

## 公开组件

| 入口 | 组件 | 说明 |
| --- | --- | --- |
| `ga-ui/base` | `GaTable` | 基础表格组件 |
| `ga-ui/base` | `GaPagination` | 基础分页组件 |
| `ga-ui/business` | `GaTablePagination` | 组合表格与分页的业务组件 |
| `ga-ui` | 上述全部组件 | 聚合入口 |

各入口同时导出对应组件的 TypeScript 类型。

---
outline: false
---

# GA UI Plus

基于 Vue 3 和 Element Plus 的内部组件库文档。这里集中维护稳定案例、组件参数、事件、插槽和实例方法；临时调试仍放在 `playground`。

## 本地启动

```bash
pnpm install
pnpm docs:dev
```

默认访问 `http://localhost:5557`。生产构建使用：

```bash
pnpm docs:build
pnpm docs:preview
```

## 快速引入

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { GaDialog, GaTable } from 'ga-ui-plus'
import 'ga-ui-plus/style.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)

app.component('GaDialog', GaDialog)
app.component('GaTable', GaTable)
app.mount('#app')
```

组件库当前没有默认安装插件，以具名导出和 Resolver 自动引入为主，详见[快速开始](/guide/quick-start)和[按需引入](/guide/resolver)。

## 基础组件

<div class="ga-doc-index">
  <a href="/components/dialog">Dialog 对话框</a>
  <a href="/components/mega-menu">MegaMenu 大型菜单</a>
  <a href="/components/pagination">Pagination 分页</a>
  <a href="/components/table">Table 表格</a>
</div>

## 业务组件

<div class="ga-doc-index">
  <a href="/components/aside-menu">AsideMenu 侧边菜单</a>
  <a href="/components/search-bar">SearchBar 搜索栏</a>
  <a href="/components/table-pagination">TablePagination 表格分页</a>
</div>

## 文档约定

- 示例区域运行的就是展开后展示的 `.vue` 文件。
- API 表只记录 GA UI Plus 明确维护的能力；透传能力会单独说明。
- 新功能先在 `playground` 验证，稳定后再加入对应组件文档。

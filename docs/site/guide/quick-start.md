# 快速开始

## 安装

```bash
pnpm add ga-ui-plus vue element-plus
```

`vue` 和 `element-plus` 是 peer dependencies，需要由业务项目直接安装。

## 全量样式与按组件导入

在应用入口引入 Element Plus 和 GA UI Plus 的完整样式：

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'ga-ui-plus/style.css'

import App from './App.vue'

createApp(App).use(ElementPlus).mount('#app')
```

在页面中按需导入组件：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { GaDialog } from 'ga-ui-plus/base'

const visible = ref(false)
</script>

<template>
  <ElButton @click="visible = true">打开</ElButton>
  <GaDialog v-model="visible" title="示例对话框">
    对话框内容
  </GaDialog>
</template>
```

## 聚合入口

所有公开组件和类型也可以从根入口导入：

```ts
import {
  GaDialog,
  GaSearchBar,
  GaTable,
  type GaSearchField,
  type GaTableColumn,
} from 'ga-ui-plus'
```

## 分类入口

```ts
import { GaDialog, GaPagination, GaTable } from 'ga-ui-plus/base'
import { GaAsideMenu, GaSearchBar } from 'ga-ui-plus/business'
```

分类入口更容易看出组件职责，也能减少业务代码对聚合入口的依赖。

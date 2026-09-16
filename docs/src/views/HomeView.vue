<script setup lang="ts">
import SourceCode from '../components/SourceCode.vue'
import { componentCatalog } from '../content/catalog'
import { buildComponentGroups } from '../content/navigation'

const groups = buildComponentGroups(componentCatalog)
const installCode = 'pnpm add ga-ui-plus element-plus'
const setupCode = `import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'ga-ui-plus/style.css'

import App from './App.vue'

createApp(App).use(ElementPlus).mount('#app')`
</script>

<template>
  <main class="ga-docs-page ga-docs-home">
    <header class="ga-docs-home__intro">
      <h1>GA UI Plus</h1>
      <p>
        基于 Vue 3 和 Element Plus 的业务组件库，覆盖对话框、菜单、分页、表格和搜索等常用场景。
      </p>
      <div class="ga-docs-home__actions">
        <RouterLink class="ga-docs-button-link" to="/guide/quick-start">
          快速开始
        </RouterLink>
        <RouterLink to="/guide/development">本地开发</RouterLink>
      </div>
    </header>

    <section class="ga-docs-home__section">
      <h2>安装</h2>
      <SourceCode :code="installCode" language="bash" />
    </section>

    <section class="ga-docs-home__section">
      <h2>最小配置</h2>
      <SourceCode :code="setupCode" language="ts" />
    </section>

    <section class="ga-docs-home__section">
      <h2>组件索引</h2>
      <div class="ga-docs-home__index">
        <section
          v-for="group in groups"
          :key="group.key"
          class="ga-docs-home__group"
        >
          <h3>{{ group.label }}</h3>
          <div class="ga-docs-home__links">
            <RouterLink
              v-for="item in group.items"
              :key="item.slug"
              :to="`/components/${item.slug}`"
            >
              <strong>{{ item.title }}</strong>
              <span>{{ item.description }}</span>
            </RouterLink>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<template>
  <div class="doc-page usage-page">
    <header class="doc-intro">
      <p class="doc-eyebrow">指南 / 开始使用</p>
      <h1>在项目中使用 ga-ui</h1>
      <p class="doc-lead">
        ga-ui-plus 基于 Vue 3 和 Element Plus。安装依赖后，可以使用 Resolver 按需引入组件和样式，
        也可以在应用入口手动引入。
      </p>
    </header>

    <div class="usage-grid">
      <article class="usage-article">
        <section id="requirements" class="doc-section">
          <h2>环境要求</h2>
          <p>消费项目需要安装 Vue 和 Element Plus；它们是 ga-ui-plus 的 peer dependencies。</p>
          <div class="doc-table-wrap">
            <table>
              <thead><tr><th>依赖</th><th>版本</th><th>说明</th></tr></thead>
              <tbody>
                <tr><td>Vue</td><td><code>^3.3.7</code></td><td>Vue 3 项目</td></tr>
                <tr><td>Element Plus</td><td><code>^2.14.3</code></td><td>组件的基础依赖</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="installation" class="doc-section">
          <h2>安装</h2>
          <p>在项目中安装组件库和 peer dependencies：</p>
          <DocsCodeBlock language="bash" code="pnpm add ga-ui-plus vue element-plus" />
        </section>

        <section id="auto-import" class="doc-section">
          <h2>按需自动引入</h2>
          <p>
            使用 <code>unplugin-vue-components</code> 时，<code>GaUiResolver</code> 会解析模板中的
            <code>GaXxx</code> 组件，同时引入 ga-ui 自身样式和组件内部所需的 Element Plus 样式。
            <code>ElementPlusResolver</code> 负责模板里直接使用的 <code>ElXxx</code> 组件。
          </p>
          <DocsCodeBlock language="bash" code="pnpm add -D unplugin-vue-components" />
          <DocsCodeBlock language="vite.config.ts" :code="resolverCode" />
          <p>
            配好后可直接在模板中写 <code>&lt;GaTable /&gt;</code> 等组件；这一方式不需要在入口手动引入
            <code>element-plus/dist/index.css</code> 或 <code>ga-ui-plus/style.css</code>。
          </p>
        </section>

        <section id="manual-import" class="doc-section">
          <h2>手动引入</h2>
          <p>
            在脚本里直接导入组件时，Resolver 不会接管这些导入。应用入口需加载 Element Plus 和 ga-ui 的样式：
          </p>
          <DocsCodeBlock language="main.ts" :code="manualStyleCode" />
          <p>然后从聚合入口或分类入口导入组件：</p>
          <DocsCodeBlock language="Vue" :code="componentCode" />
        </section>

        <section id="styles" class="doc-section">
          <h2>样式说明</h2>
          <p>
            <code>ga-ui-plus/style.css</code> 只包含 ga-ui 的样式，不包含 Element Plus 的完整样式。
            使用 <code>GaUiResolver</code> 自动解析模板中的 ga-ui 组件时，它会补齐内部依赖的
            Element Plus 按需样式。若在脚本中手动导入 ga-ui 组件，普通的
            <code>ElementPlusResolver</code> 无法识别其内部依赖，需要自行补齐相应样式。
            例如只使用 <code>GaPagination</code> 时，可以这样按需引入：
          </p>
          <DocsCodeBlock language="main.ts" :code="paginationStyleCode" />
          <p>不确定内部依赖时，可使用上面的全量 Element Plus 样式方案。</p>
        </section>
      </article>

      <aside class="usage-toc" aria-label="本页目录">
        <span>本页目录</span>
        <RouterLink :to="{ path: route.path, hash: '#requirements' }" :class="{ 'is-active': route.hash === '#requirements' }">环境要求</RouterLink>
        <RouterLink :to="{ path: route.path, hash: '#installation' }" :class="{ 'is-active': route.hash === '#installation' }">安装</RouterLink>
        <RouterLink :to="{ path: route.path, hash: '#auto-import' }" :class="{ 'is-active': route.hash === '#auto-import' }">按需自动引入</RouterLink>
        <RouterLink :to="{ path: route.path, hash: '#manual-import' }" :class="{ 'is-active': route.hash === '#manual-import' }">手动引入</RouterLink>
        <RouterLink :to="{ path: route.path, hash: '#styles' }" :class="{ 'is-active': route.hash === '#styles' }">样式说明</RouterLink>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import DocsCodeBlock from '../../DocsCodeBlock.vue'
import { nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.hash,
  async (hash) => {
    if (!hash) return
    await nextTick()
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
  },
  { immediate: true },
)

const resolverCode = `import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { GaUiResolver } from 'ga-ui-plus/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver(), GaUiResolver()],
    }),
  ],
})`

const manualStyleCode = `import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import 'ga-ui-plus/style.css'

createApp(App).mount('#app')`

const componentCode = `<script setup lang="ts">
import { GaPagination } from 'ga-ui-plus/base'
<\/script>

<template>
  <GaPagination :total="100" />
</template>`

const paginationStyleCode = `import 'element-plus/es/components/pagination/style/css'
import 'ga-ui-plus/style.css'`
</script>

<template>
  <div class="doc-page">
    <h1>安装与样式引入</h1>
    <p class="doc-lead">
      ga-ui-plus 是一个基于 Vue 3 与 Element Plus 的 ESM 组件库，本页介绍环境要求、安装方式与样式引入方案。
    </p>

    <h2>兼容性</h2>
    <ApiTable
      :headers="['项目', '支持范围', '说明']"
      :rows="[
        ['Vue', '^3.3.7', 'peer dependency，需由消费项目安装'],
        ['Element Plus', '^2.14.3', 'peer dependency，需由消费项目安装'],
        ['模块格式', 'ESM', '包声明为 type: module，各入口提供 ESM 导出'],
      ]"
    />

    <h2>安装</h2>
    <p>使用 pnpm 同时安装组件库及其 peer dependencies：</p>
    <CodeBlock :code="installCode" />

    <h2>引入样式</h2>

    <h3>按需引入（推荐）</h3>
    <p>
      使用 <code>unplugin-vue-components</code> 时，可以通过 <code>GaUiResolver</code> 自动引入组件和样式：
    </p>
    <CodeBlock :code="resolverCode" />
    <p>
      <code>ElementPlusResolver</code> 处理业务模板中直接使用的 <code>ElXxx</code> 组件，<code>GaUiResolver</code>
      处理 <code>GaXxx</code> 组件，并补齐这些组件内部使用的 Element Plus 样式。默认同时启用
      <code>ga-ui-plus/style.css</code> 和 Element Plus 按需样式。
    </p>

    <h3>全量 Element Plus 样式</h3>
    <p>业务项目已经全量引入 Element Plus 样式时，应关闭 Resolver 的 Element Plus 样式补齐：</p>
    <CodeBlock :code="fullStyleCode" />
    <p>
      <code>importStyle</code> 控制 <code>ga-ui-plus/style.css</code>，<code>elementPlusStyle</code>
      控制 GA 组件内部依赖的 Element Plus 样式，两者默认都是 <code>true</code>：
    </p>
    <CodeBlock :code="resolverOptionsCode" />

    <h3>手动引入样式</h3>
    <p>
      手动通过 JavaScript 导入 <code>GaDialog</code>、<code>GaTable</code> 等组件不会触发
      <code>unplugin-vue-components</code> Resolver。这种用法仍需在应用入口显式引入样式：
    </p>
    <CodeBlock :code="manualStyleCode" />
  </div>
</template>

<script setup lang="ts">
import ApiTable from '../../components/ApiTable.vue'
import CodeBlock from '../../components/CodeBlock.vue'

const installCode = `pnpm add ga-ui-plus vue element-plus`

const resolverCode = `import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { GaUiResolver } from 'ga-ui-plus/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        ElementPlusResolver(),
        GaUiResolver(),
      ],
    }),
  ],
})`

const fullStyleCode = `import 'element-plus/dist/index.css'

Components({
  resolvers: [
    ElementPlusResolver({ importStyle: false }),
    GaUiResolver({ elementPlusStyle: false }),
  ],
})`

const resolverOptionsCode = `GaUiResolver({
  importStyle: true,
  elementPlusStyle: true,
})`

const manualStyleCode = `import 'element-plus/dist/index.css'
import 'ga-ui-plus/style.css'`
</script>

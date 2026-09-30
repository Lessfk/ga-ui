<template>
  <div class="doc-page pagination-page">
    <header class="doc-intro">
      <p class="doc-eyebrow">基础组件 / Pagination 分页</p>
      <h1>Pagination 分页</h1>
      <p class="doc-lead">
        <code>GaPagination</code> 基于 Element Plus Pagination，支持当前页和每页条数的双向绑定，
        并提供水平对齐和实例级颜色主题。
      </p>
    </header>

    <div class="pagination-layout">
      <article class="pagination-content">
        <section id="pagination-usage" class="doc-section">
          <h2>如何使用</h2>
          <p>
            安装并配置样式后，从 <code>ga-ui-plus/base</code> 导入组件。
            使用 <code>GaUiResolver</code> 自动解析模板组件时可以直接写
            <code>&lt;GaPagination /&gt;</code>；手动导入时请按
            <RouterLink to="/guide/usage">接入指南</RouterLink>配置样式。
          </p>
          <DocsCodeBlock language="Vue" :code="importCode" />
          <p>
            使用 <code>v-model:current-page</code>、<code>v-model:page-size</code>
            同步分页状态，<code>total</code> 传入总条数。切换页码或每页条数后，
            用这两个值请求或截取对应数据。
          </p>
        </section>

        <section id="pagination-basic" class="doc-section">
          <h2>基础用法</h2>
          <p>
            下方列表会随页码和每页条数改变。示例通过 <code>layout</code>
            选择总数、每页条数、上一页、页码和下一页；组件默认布局还包含跳页输入框。
          </p>
          <div class="pagination-preview">
            <span class="pagination-preview__label">预览</span>
            <div class="pagination-preview__scroll">
              <div class="pagination-preview__canvas"><PaginationBasicDemo /></div>
            </div>
          </div>
          <DocsCodeBlock language="PaginationBasicDemo.vue" :code="basicSource" />
        </section>

        <section id="pagination-position" class="doc-section">
          <h2>对齐方式</h2>
          <p>
            <code>position</code> 支持 <code>left</code>、<code>center</code>、<code>right</code>，
            默认右对齐。它只改变容器内的水平位置，不影响分页状态。
          </p>
          <div class="pagination-preview">
            <span class="pagination-preview__label">预览</span>
            <div class="pagination-preview__scroll">
              <div class="pagination-preview__canvas"><PaginationPositionDemo /></div>
            </div>
          </div>
          <DocsCodeBlock language="PaginationPositionDemo.vue" :code="positionSource" />
        </section>

        <section id="pagination-style" class="doc-section">
          <h2>样式风格</h2>
          <p>
            默认风格使用浅灰容器和蓝色选中项。<code>theme</code> 可部分覆盖当前实例的颜色，
            <code>background</code> 切换页码按钮的背景模式；主题对两种模式均生效。
          </p>
          <div class="pagination-preview">
            <span class="pagination-preview__label">预览</span>
            <div class="pagination-preview__scroll">
              <div class="pagination-preview__canvas"><PaginationThemeDemo /></div>
            </div>
          </div>
          <DocsCodeBlock language="PaginationThemeDemo.vue" :code="themeSource" />
        </section>

        <section id="pagination-state" class="doc-section">
          <h2>尺寸与禁用状态</h2>
          <p>
            <code>size</code> 调整分页控件尺寸，<code>disabled</code> 禁止翻页与修改页码。
            只需要页码时，可把 <code>layout</code> 设为 <code>prev, pager, next</code>。
          </p>
          <div class="pagination-preview">
            <span class="pagination-preview__label">预览</span>
            <div class="pagination-preview__scroll">
              <div class="pagination-preview__canvas"><PaginationStateDemo /></div>
            </div>
          </div>
          <DocsCodeBlock language="PaginationStateDemo.vue" :code="stateSource" />
        </section>

        <section id="pagination-behavior" class="doc-section">
          <h2>布局与属性透传</h2>
          <p>
            默认 <code>layout</code> 为 <code>total, sizes, prev, pager, next, jumper</code>。
            可按需重排或省略这些布局项。未声明的属性和监听器会透传给内部
            <code>ElPagination</code>，例如 <code>hide-on-single-page</code> 和
            <code>pager-count</code>。
          </p>
          <p>
            组件没有公开自定义插槽或实例方法。更多底层配置参见
            <a href="https://element-plus.org/zh-CN/component/pagination.html" target="_blank" rel="noopener noreferrer">Element Plus Pagination 文档</a>。
          </p>
        </section>

        <section id="pagination-api" class="doc-section">
          <h2>API</h2>

          <h3 id="pagination-props">Props</h3>
          <DocsApiTable :headers="['属性', '类型', '默认值', '说明']" :rows="propsRows" />

          <h3 id="pagination-events">Events</h3>
          <DocsApiTable :headers="['事件', '参数', '说明']" :rows="eventsRows" />

          <h3 id="pagination-theme">GaPaginationTheme</h3>
          <p>
            主题字段均可部分覆盖，未传字段使用默认值。背景字段支持颜色、CSS 变量等合法的
            CSS <code>background</code> 值。
          </p>
          <DocsApiTable :headers="['字段', '默认值', '说明']" :rows="themeRows" />
        </section>
      </article>

      <aside class="pagination-toc" aria-label="本页目录">
        <span>本页目录</span>
        <RouterLink
          v-for="item in tocItems"
          :key="item.id"
          :to="{ path: route.path, hash: `#${item.id}` }"
          :class="{ 'is-active': route.hash === `#${item.id}` }"
        >
          {{ item.title }}
        </RouterLink>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'

import DocsApiTable from '../../DocsApiTable.vue'
import DocsCodeBlock from '../../DocsCodeBlock.vue'
import PaginationBasicDemo from './PaginationBasicDemo.vue'
import basicSource from './PaginationBasicDemo.vue?raw'
import PaginationPositionDemo from './PaginationPositionDemo.vue'
import positionSource from './PaginationPositionDemo.vue?raw'
import PaginationStateDemo from './PaginationStateDemo.vue'
import stateSource from './PaginationStateDemo.vue?raw'
import PaginationThemeDemo from './PaginationThemeDemo.vue'
import themeSource from './PaginationThemeDemo.vue?raw'

const route = useRoute()

const tocItems = [
  { id: 'pagination-usage', title: '如何使用' },
  { id: 'pagination-basic', title: '基础用法' },
  { id: 'pagination-position', title: '对齐方式' },
  { id: 'pagination-style', title: '样式风格' },
  { id: 'pagination-state', title: '尺寸与禁用' },
  { id: 'pagination-behavior', title: '布局与透传' },
  { id: 'pagination-props', title: 'Props' },
  { id: 'pagination-events', title: 'Events' },
  { id: 'pagination-theme', title: 'GaPaginationTheme' },
]

watch(
  () => route.hash,
  async (hash) => {
    if (!hash) return
    await nextTick()
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
  },
  { immediate: true },
)

const importCode = `import { GaPagination } from 'ga-ui-plus/base'`

const propsRows = [
  ['currentPage', 'number', '1', '当前页；支持 v-model:current-page'],
  ['pageSize', 'number', '10', '每页条数；支持 v-model:page-size'],
  ['total', 'number', '0', '总条目数'],
  ['pageSizes', 'number[]', '[10, 20, 30, 40, 50]', '可选的每页条数'],
  ['size', 'ComponentSize', "'default'", '分页控件尺寸'],
  ['layout', 'string', "'total, sizes, prev, pager, next, jumper'", '布局项及顺序'],
  ['background', 'boolean', 'false', '是否启用分页按钮的背景模式'],
  ['disabled', 'boolean', 'false', '是否禁用分页交互'],
  ['position', "'left' | 'center' | 'right'", "'right'", '水平对齐方式'],
  ['theme', 'GaPaginationTheme', '内置颜色主题', '当前实例的颜色配置，支持部分覆盖'],
]

const eventsRows = [
  ['update:current-page', '(currentPage: number)', '当前页变化；用于 v-model:current-page'],
  ['update:page-size', '(pageSize: number)', '每页条数变化；用于 v-model:page-size'],
  ['current-change', '(currentPage: number)', '当前页变化后触发'],
  ['size-change', '(pageSize: number)', '每页条数变化后触发'],
]

const themeRows = [
  ['backgroundColor', '#EEEEEF', '整个分页容器背景'],
  ['textColor', '#606266', '总数、每页条数和跳页说明文字颜色'],
  ['buttonColor', '#7A7475', '普通按钮和页码文字颜色'],
  ['buttonBackgroundColor', '#ffffff', '普通按钮和页码背景'],
  ['activeColor', '#ffffff', '当前页文字颜色'],
  ['activeBackgroundColor', '#4F7DB2', '当前页背景'],
  ['hoverColor', '#ffffff', '悬停时文字颜色'],
  ['hoverBackgroundColor', '#4f7db299', '悬停时背景'],
  ['disabledColor', '#606266', '禁用项文字颜色'],
  ['disabledBackgroundColor', '#fafafa', '禁用项背景'],
]
</script>

<style scoped>
.pagination-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 170px;
  gap: 60px;
  margin-top: 48px;
}

.pagination-content { min-width: 0; }

.pagination-page .doc-section h3 {
  margin: 36px 0 18px;
  color: #303133;
  font-size: 18px;
  scroll-margin-top: 24px;
}

.pagination-page .doc-section a { color: var(--docs-primary); text-decoration: none; }
.pagination-page .doc-section a:hover { text-decoration: underline; }

.pagination-preview {
  margin-top: 22px;
  padding: 20px 24px 24px;
  border: 1px solid var(--docs-border);
  border-radius: 6px;
}

.pagination-preview__label {
  display: block;
  margin-bottom: 20px;
  color: #909399;
  font-size: 12px;
}

.pagination-preview__scroll { overflow-x: auto; }
.pagination-preview__canvas { min-width: 600px; }
#pagination-basic .pagination-preview__canvas { min-width: 0; }

.pagination-toc {
  position: sticky;
  top: 36px;
  display: flex;
  height: max-content;
  flex-direction: column;
  gap: 14px;
  padding-left: 18px;
  border-left: 1px solid var(--docs-border);
  font-size: 13px;
}

.pagination-toc > span { color: #909399; font-size: 12px; font-weight: 700; }
.pagination-toc a { color: var(--docs-text-secondary); text-decoration: none; }
.pagination-toc a:hover, .pagination-toc a.is-active { color: var(--docs-primary); }

@media (max-width: 1000px) {
  .pagination-layout { grid-template-columns: minmax(0, 1fr); }
  .pagination-toc { display: none; }
}

@media (max-width: 720px) {
  .pagination-layout { margin-top: 40px; }
  .pagination-preview { padding: 18px 16px 20px; }
}
</style>

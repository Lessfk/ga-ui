<template>
  <div class="doc-page table-pagination-page">
    <header class="doc-intro">
      <p class="doc-eyebrow">业务组件 / TablePagination 表格分页</p>
      <h1>TablePagination 表格分页</h1>
      <p class="doc-lead">
        <code>GaTablePagination</code> 将表格与分页组合在同一个固定高度容器中，
        适合需要列表展示、翻页、加载状态和独立配色的业务页面。
      </p>
    </header>

    <div class="table-pagination-layout">
      <article class="table-pagination-content">
        <section id="table-pagination-usage" class="doc-section">
          <h2>如何使用</h2>
          <p>
            安装并配置样式后，从 <code>ga-ui-plus/business</code> 导入组件，
            列类型从 <code>ga-ui-plus/base</code> 导入。使用 <code>GaUiResolver</code>
            自动解析模板组件时可直接写 <code>&lt;GaTablePagination /&gt;</code>；手动导入请参阅
            <RouterLink to="/guide/usage">接入指南</RouterLink>。
          </p>
          <DocsCodeBlock language="Vue" :code="importCode" />
          <p>
            容器必须有明确高度，例如 <code>height: 360px</code>。组件使用两行 Grid：
            表格占据剩余空间，分页栏固定 <code>50px</code>；在 Flex 或 Grid 中使用时，
            父级收缩链路还应设置 <code>min-height: 0</code>。
          </p>
        </section>

        <section id="table-pagination-basic" class="doc-section">
          <h2>基础分页</h2>
          <p>
            <code>data</code> 应传入当前页的数据，<code>total</code> 是完整数据集的总条数。
            组件不会自动截取数据，也不会自动发请求。示例用 <code>currentPage</code> 与
            <code>pageSize</code> 从本地数组截取数据，切换每页条数时返回第一页。
          </p>
          <div class="table-pagination-preview">
            <span class="table-pagination-preview__label">预览</span>
            <div class="table-pagination-preview__scroll">
              <div class="table-pagination-preview__canvas"><TablePaginationBasicDemo /></div>
            </div>
          </div>
          <DocsCodeBlock language="TablePaginationBasicDemo.vue" :code="basicSource" />
        </section>

        <section id="table-pagination-slots" class="doc-section">
          <h2>自定义列与状态</h2>
          <p>
            在 <code>columns</code> 中为列设置 <code>slot</code>，再提供同名插槽即可自定义单元格。
            <code>empty</code> 插槽可替换空表格内容；设置 <code>loading</code> 时表格显示加载层，
            分页交互同时禁用。下方开关可预览这两种状态。
          </p>
          <div class="table-pagination-preview">
            <span class="table-pagination-preview__label">预览</span>
            <div class="table-pagination-preview__scroll">
              <div class="table-pagination-preview__canvas"><TablePaginationSlotsDemo /></div>
            </div>
          </div>
          <DocsCodeBlock language="TablePaginationSlotsDemo.vue" :code="slotsSource" />
        </section>

        <section id="table-pagination-style" class="doc-section">
          <h2>样式风格</h2>
          <p>
            表格与分页分别使用 <code>tableTheme</code> 和 <code>paginationTheme</code>，
            均支持部分覆盖。<code>size</code> 会同时作用于两者；<code>border</code>、
            <code>stripe</code>、<code>background</code> 和 <code>position</code> 可分别调整边框、
            斑马纹、页码背景和分页对齐方式。
          </p>
          <div class="table-pagination-preview">
            <span class="table-pagination-preview__label">预览</span>
            <div class="table-pagination-preview__scroll">
              <div class="table-pagination-preview__canvas"><TablePaginationThemeDemo /></div>
            </div>
          </div>
          <DocsCodeBlock language="TablePaginationThemeDemo.vue" :code="themeSource" />
        </section>

        <section id="table-pagination-behavior" class="doc-section">
          <h2>组合边界</h2>
          <p>
            组件使用扁平 Props，不接受 <code>height</code>、<code>maxHeight</code>、
            <code>disabled</code> 或通用 <code>theme</code>。未声明的属性绑定在组合组件根节点，
            不会自动传给内部表格或分页。
          </p>
          <p>
            当前只对外触发四个分页事件；<code>row-click</code>、<code>selection-change</code>、
            <code>sort-change</code> 等内部表格事件不会透传，也不暴露底层
            <code>tableRef</code>。需要这些能力时，可分别使用
            <RouterLink to="/components/table">GaTable</RouterLink> 与
            <RouterLink to="/components/pagination">GaPagination</RouterLink> 自行组合。
          </p>
        </section>

        <section id="table-pagination-api" class="doc-section">
          <h2>API</h2>
          <p>
            <code>GaTablePaginationProps&lt;Row&gt;</code> 由表格和分页 Props 合并而来；
            <code>data</code> 与 <code>columns</code> 的行类型可通过 <code>Row</code> 指定。
          </p>

          <h3 id="table-pagination-props">Props</h3>
          <DocsApiTable :headers="['属性', '类型', '默认值', '说明']" :rows="propsRows" />

          <h3 id="table-pagination-events">Events</h3>
          <DocsApiTable :headers="['事件', '参数', '说明']" :rows="eventsRows" />

          <h3 id="table-pagination-slots-api">Slots</h3>
          <p>所有插槽及其作用域转发给内部 <code>GaTable</code>，不会传给分页组件。</p>
          <DocsApiTable :headers="['插槽', '作用域', '说明']" :rows="slotsRows" />

          <h3 id="table-pagination-table-theme">GaTableTheme</h3>
          <p><code>tableTheme</code> 只控制表格颜色；未设置的字段沿用默认值。</p>
          <DocsApiTable :headers="['字段', '默认值', '说明']" :rows="tableThemeRows" />

          <h3 id="table-pagination-pagination-theme">GaPaginationTheme</h3>
          <p><code>paginationTheme</code> 只控制分页颜色；未设置的字段沿用默认值。</p>
          <DocsApiTable :headers="['字段', '默认值', '说明']" :rows="paginationThemeRows" />
        </section>
      </article>

      <aside class="table-pagination-toc" aria-label="本页目录">
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
import TablePaginationBasicDemo from './TablePaginationBasicDemo.vue'
import basicSource from './TablePaginationBasicDemo.vue?raw'
import TablePaginationSlotsDemo from './TablePaginationSlotsDemo.vue'
import slotsSource from './TablePaginationSlotsDemo.vue?raw'
import TablePaginationThemeDemo from './TablePaginationThemeDemo.vue'
import themeSource from './TablePaginationThemeDemo.vue?raw'
import {
  eventsRows,
  paginationThemeRows,
  propsRows,
  slotsRows,
  tableThemeRows,
} from './TablePaginationApi'

const route = useRoute()
const importCode = `import { GaTablePagination } from 'ga-ui-plus/business'
import type { GaTableColumn } from 'ga-ui-plus/base'`

const tocItems = [
  { id: 'table-pagination-usage', title: '如何使用' },
  { id: 'table-pagination-basic', title: '基础分页' },
  { id: 'table-pagination-slots', title: '自定义列与状态' },
  { id: 'table-pagination-style', title: '样式风格' },
  { id: 'table-pagination-behavior', title: '组合边界' },
  { id: 'table-pagination-props', title: 'Props' },
  { id: 'table-pagination-events', title: 'Events' },
  { id: 'table-pagination-slots-api', title: 'Slots' },
  { id: 'table-pagination-table-theme', title: 'GaTableTheme' },
  { id: 'table-pagination-pagination-theme', title: 'GaPaginationTheme' },
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
</script>

<style scoped>
.table-pagination-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 170px;
  gap: 60px;
  margin-top: 48px;
}

.table-pagination-content { min-width: 0; }

.table-pagination-page .doc-section h3 {
  margin: 36px 0 18px;
  color: #303133;
  font-size: 18px;
  scroll-margin-top: 24px;
}

.table-pagination-page .doc-section a { color: var(--docs-primary); text-decoration: none; }
.table-pagination-page .doc-section a:hover { text-decoration: underline; }

.table-pagination-preview {
  margin-top: 22px;
  padding: 20px 24px 24px;
  border: 1px solid var(--docs-border);
  border-radius: 6px;
}

.table-pagination-preview__label {
  display: block;
  margin-bottom: 20px;
  color: #909399;
  font-size: 12px;
}

.table-pagination-preview__scroll { overflow-x: auto; }
.table-pagination-preview__canvas { min-width: 600px; }

.table-pagination-toc {
  position: sticky;
  top: 36px;
  display: flex;
  height: max-content;
  max-height: calc(100dvh - 72px);
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  padding-left: 18px;
  border-left: 1px solid var(--docs-border);
  font-size: 13px;
}

.table-pagination-toc > span { color: #909399; font-size: 12px; font-weight: 700; }
.table-pagination-toc a { color: var(--docs-text-secondary); text-decoration: none; }
.table-pagination-toc a:hover, .table-pagination-toc a.is-active { color: var(--docs-primary); }

@media (max-width: 1000px) {
  .table-pagination-layout { grid-template-columns: minmax(0, 1fr); }
  .table-pagination-toc { display: none; }
}

@media (max-width: 720px) {
  .table-pagination-layout { margin-top: 40px; }
  .table-pagination-preview { padding: 18px 16px 20px; }
}
</style>

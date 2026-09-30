<template>
  <div class="doc-page table-page">
    <header class="doc-intro">
      <p class="doc-eyebrow">基础组件 / Table 表格</p>
      <h1>Table 表格</h1>
      <p class="doc-lead">
        <code>GaTable</code> 基于 Element Plus Table，提供配置式列、插槽列和实例级颜色主题。
        默认显示边框与斑马纹，也可以继续使用底层表格的属性和事件。
      </p>
    </header>

    <div class="table-layout">
      <article class="table-content">
        <section id="table-usage" class="doc-section">
          <h2>如何使用</h2>
          <p>
            安装并配置样式后，从 <code>ga-ui-plus/base</code> 导入组件和列类型。
            使用 <code>GaUiResolver</code> 自动解析模板组件时可以直接写
            <code>&lt;GaTable /&gt;</code>；手动导入时请按
            <RouterLink to="/guide/usage">接入指南</RouterLink>配置样式。
          </p>
          <DocsCodeBlock language="Vue" :code="importCode" />
          <p>
            传入 <code>data</code> 和 <code>columns</code> 即可渲染。列配置中的
            <code>prop</code> 对应行字段，使用 <code>GaTableColumn&lt;Row&gt;</code>
            可获得字段提示；需要更复杂的列时使用插槽。
          </p>
        </section>

        <section id="table-basic" class="doc-section">
          <h2>基础表格</h2>
          <p>
            <code>border</code> 和 <code>stripe</code> 默认开启。这个示例同时展示选择列、
            原生排序与 <code>@selection-change</code> 事件；点击表头“年龄”可以排序。
          </p>
          <div class="table-preview">
            <span class="table-preview__label">预览</span>
            <div class="table-preview__scroll">
              <div class="table-preview__canvas"><TableBasicDemo /></div>
            </div>
          </div>
          <DocsCodeBlock language="TableBasicDemo.vue" :code="basicSource" />
        </section>

        <section id="table-slots-demo" class="doc-section">
          <h2>自定义单元格</h2>
          <p>
            在列配置中设置 <code>slot</code>，使用同名插槽渲染单元格。
            作用域包含 <code>row</code>、<code>column</code> 和 <code>$index</code>。
            没有提供同名插槽时，该列回退到原生单元格渲染。
          </p>
          <div class="table-preview">
            <span class="table-preview__label">预览</span>
            <div class="table-preview__scroll">
              <div class="table-preview__canvas"><TableSlotDemo /></div>
            </div>
          </div>
          <DocsCodeBlock language="TableSlotDemo.vue" :code="slotSource" />
        </section>

        <section id="table-mixed" class="doc-section">
          <h2>混合列</h2>
          <p>
            <code>column-prepend</code> 插槽位于配置列之前，默认插槽位于配置列之后。
            可直接加入 <code>ElTableColumn</code>，例如索引列、展开列或固定操作列。
          </p>
          <div class="table-preview">
            <span class="table-preview__label">预览</span>
            <div class="table-preview__scroll">
              <div class="table-preview__canvas"><TableMixedDemo /></div>
            </div>
          </div>
          <DocsCodeBlock language="TableMixedDemo.vue" :code="mixedSource" />
        </section>

        <section id="table-states" class="doc-section">
          <h2>空状态与加载</h2>
          <p>
            数据为空时默认渲染 <code>ElEmpty</code>，描述文字来自 <code>emptyText</code>。
            传入 <code>loading</code> 可显示加载层，<code>loadingText</code> 设置提示文字；
            也可通过 <code>empty</code> 插槽替换默认空状态。
          </p>
          <div class="table-preview">
            <span class="table-preview__label">预览</span>
            <div class="table-preview__scroll">
              <div class="table-preview__canvas"><TableStatesDemo /></div>
            </div>
          </div>
          <DocsCodeBlock language="TableStatesDemo.vue" :code="statesSource" />
        </section>

        <section id="table-style" class="doc-section">
          <h2>样式风格</h2>
          <p>
            默认风格使用蓝色表头、浅色斑马纹和悬停高亮。
            <code>theme</code> 只作用于当前表格实例，可按需覆盖颜色字段；未传字段使用默认值。
            点击表格行还可查看 <code>highlight-current-row</code> 的高亮效果。
          </p>
          <div class="table-preview">
            <span class="table-preview__label">预览</span>
            <div class="table-preview__scroll">
              <div class="table-preview__canvas"><TableThemeDemo /></div>
            </div>
          </div>
          <DocsCodeBlock language="TableThemeDemo.vue" :code="themeSource" />
        </section>

        <section id="table-api" class="doc-section">
          <h2>API</h2>
          <p>
            下表列出 <code>GaTableProps</code> 的全部属性。未声明的
            <code>ElTable</code> 属性和事件监听器会透传到底层表格，例如
            <code>table-layout="fixed"</code>、<code>scrollbar-always-on</code> 和
            <code>@row-click</code>。
          </p>

          <h3 id="table-props">Props</h3>
          <DocsApiTable :headers="['属性', '类型', '默认值', '说明']" :rows="propsRows" />

          <h3 id="table-columns">GaTableColumn</h3>
          <p>
            除 <code>key</code> 与 <code>slot</code> 外，列配置字段会绑定到对应的
            <code>ElTableColumn</code>。列的 Vue key 依次取 <code>key</code>、
            <code>prop</code>、最后是 <code>type + index</code>。
          </p>
          <DocsApiTable :headers="['字段', '类型', '说明']" :rows="columnRows" />
          <p>
            <code>filterMethod</code> 的公开类型返回 <code>void</code>，但运行时会原样传给
            Element Plus；实际筛选时应返回布尔值。更多列能力可通过插槽手写
            <code>ElTableColumn</code>。
          </p>

          <h3 id="table-events">Events</h3>
          <p>
            <code>GaTable</code> 未单独声明事件。下表是常见的 Element Plus Table
            事件，可直接监听；完整列表参见
            <a href="https://element-plus.org/zh-CN/component/table.html" target="_blank" rel="noopener noreferrer">Element Plus Table 文档</a>。
          </p>
          <DocsApiTable :headers="['事件', '参数', '说明']" :rows="eventsRows" />

          <h3 id="table-slots">Slots</h3>
          <DocsApiTable :headers="['插槽', '作用域', '说明']" :rows="slotsRows" />

          <h3 id="table-expose">Expose</h3>
          <p>
            Vue 会解包暴露的 ref。组件挂载后，可通过
            <code>tableInstance.value?.tableRef?.clearSelection()</code> 等方式调用底层方法。
          </p>
          <DocsApiTable :headers="['名称', '类型', '说明']" :rows="exposeRows" />

          <h3 id="table-theme">GaTableTheme</h3>
          <p>以下颜色字段均可部分覆盖，默认值来自组件内置主题。</p>
          <DocsApiTable :headers="['字段', '默认值', '说明']" :rows="themeRows" />
        </section>
      </article>

      <aside class="table-toc" aria-label="本页目录">
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
import TableBasicDemo from './TableBasicDemo.vue'
import basicSource from './TableBasicDemo.vue?raw'
import TableMixedDemo from './TableMixedDemo.vue'
import mixedSource from './TableMixedDemo.vue?raw'
import TableSlotDemo from './TableSlotDemo.vue'
import slotSource from './TableSlotDemo.vue?raw'
import TableStatesDemo from './TableStatesDemo.vue'
import statesSource from './TableStatesDemo.vue?raw'
import TableThemeDemo from './TableThemeDemo.vue'
import themeSource from './TableThemeDemo.vue?raw'

const route = useRoute()

const tocItems = [
  { id: 'table-usage', title: '如何使用' },
  { id: 'table-basic', title: '基础表格' },
  { id: 'table-slots-demo', title: '自定义单元格' },
  { id: 'table-mixed', title: '混合列' },
  { id: 'table-states', title: '空状态与加载' },
  { id: 'table-style', title: '样式风格' },
  { id: 'table-props', title: 'Props' },
  { id: 'table-columns', title: 'GaTableColumn' },
  { id: 'table-events', title: 'Events' },
  { id: 'table-slots', title: 'Slots' },
  { id: 'table-expose', title: 'Expose' },
  { id: 'table-theme', title: 'GaTableTheme' },
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

const importCode = `import { GaTable, type GaTableColumn } from 'ga-ui-plus/base'`

const propsRows = [
  ['data', 'Row[]', '[]', '表格数据'],
  ['columns', 'GaTableColumn<Row>[]', '[]', '配置式列'],
  ['height', 'string | number', 'undefined', '固定表格高度'],
  ['maxHeight', 'string | number', 'undefined', '表格最大高度'],
  ['rowKey', 'string | ((row: Row) => string)', 'undefined', '行数据主键'],
  ['border', 'boolean', 'true', '是否显示纵向边框'],
  ['stripe', 'boolean', 'true', '是否显示斑马纹'],
  ['size', 'ComponentSize', 'undefined', '表格尺寸'],
  ['fit', 'boolean', 'true', '列宽是否自动撑开'],
  ['showHeader', 'boolean', 'true', '是否显示表头'],
  ['highlightCurrentRow', 'boolean', 'false', '是否高亮当前行'],
  ['emptyText', 'string', "'暂无数据'", '默认空状态的描述文字'],
  ['loading', 'boolean', 'false', '是否显示加载层'],
  ['loadingText', 'string', "'加载中...'", '加载层的提示文字'],
  ['theme', 'GaTableTheme', '内置颜色主题', '当前实例的颜色配置，支持部分覆盖'],
]

const columnRows = [
  ['key', 'PropertyKey', '仅作为配置列的 Vue key，不透传给 ElTableColumn'],
  ['slot', 'string', '指定单元格的命名插槽，不透传给 ElTableColumn'],
  ['type', 'GaTableColumnType', '列类型，例如 default、selection、index、expand'],
  ['label', 'string', '表头文字'],
  ['className', 'string', '列单元格类名'],
  ['labelClassName', 'string', '表头单元格类名'],
  ['property', 'string', 'Element Plus 列的 property'],
  ['prop', 'Extract<keyof Row, string> | (string & {})', '对应行数据字段'],
  ['width', 'string | number', '固定列宽'],
  ['minWidth', 'string | number', '最小列宽'],
  ['sortable', "boolean | 'custom'", '是否排序，custom 用于远程排序'],
  ['sortMethod', '(a: Row, b: Row) => number', '自定义排序函数'],
  ['sortBy', 'string | string[] | ((row: Row, index: number) => string)', '排序依据'],
  ['resizable', 'boolean', '是否允许拖动列宽'],
  ['columnKey', 'string', 'Element Plus 列标识'],
  ['align', "'left' | 'center' | 'right'", '单元格对齐方式'],
  ['headerAlign', "'left' | 'center' | 'right'", '表头对齐方式'],
  ['showOverflowTooltip', 'boolean', '溢出时显示提示'],
  ['fixed', "boolean | 'left' | 'right'", '固定列及方向'],
  ['formatter', '(row: Row, column: TableColumnCtx<Row>, cellValue: unknown, index: number) => VNode | string', '格式化单元格内容'],
  ['selectable', '(row: Row, index: number) => boolean', '选择列中判断行是否可选'],
  ['reserveSelection', 'boolean', '数据更新时保留选择'],
  ['filters', 'Array<{ text: string; value: string }>', '列筛选选项'],
  ['filterMethod', '(value: string, row: Row, column: TableColumnCtx<Row>) => void', '列筛选函数；运行时应返回布尔值'],
  ['filteredValue', 'string[]', '已选筛选值'],
  ['filterPlacement', 'string', '筛选弹层位置'],
  ['filterMultiple', 'boolean', '是否允许多选筛选'],
  ['index', 'number | ((index: number) => number)', '索引列起始值或计算函数'],
]

const eventsRows = [
  ['selection-change', '(selection: Row[])', '选择项变化'],
  ['row-click', '(row, column, event)', '点击表格行'],
  ['sort-change', '({ column, prop, order })', '排序条件变化'],
  ['current-change', '(currentRow, oldCurrentRow)', '当前高亮行变化'],
]

const slotsRows = [
  ['column-prepend', '—', '配置列之前插入列'],
  ['default', '—', '配置列之后插入列'],
  ['[column.slot]', 'GaTableCellScope<Row>', '配置列的动态命名插槽，包含 row、column、$index'],
  ['empty', '—', '替换默认 ElEmpty 空状态'],
  ['append', '—', '表格最后一行之后的追加内容'],
]

const exposeRows = [
  ['tableRef', 'TableInstance | undefined', '底层 ElTable 实例，可调用 clearSelection()、doLayout() 等'],
]

const themeRows = [
  ['backgroundColor', '#ffffff', '表格背景色'],
  ['rowBackgroundColor', '#ffffff', '普通行背景色'],
  ['textColor', '#344054', '正文文字颜色'],
  ['headerBackgroundColor', '#4f7db2', '表头背景色'],
  ['headerTextColor', '#f9fafb', '表头文字颜色'],
  ['borderColor', '#d0d5dd', '边框颜色'],
  ['stripeBackgroundColor', '#f8fafc', '斑马纹行背景色'],
  ['hoverBackgroundColor', '#eff8ff', '行悬停背景色'],
  ['currentRowBackgroundColor', '#d1e9ff', '当前高亮行背景色'],
  ['expandedRowBackgroundColor', '#f2f4f7', '展开行背景色'],
]
</script>

<style scoped>
.table-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 170px;
  gap: 60px;
  margin-top: 48px;
}

.table-content { min-width: 0; }

.table-page .doc-section h3 {
  margin: 36px 0 18px;
  color: #303133;
  font-size: 18px;
  scroll-margin-top: 24px;
}

.table-page .doc-section a { color: var(--docs-primary); text-decoration: none; }
.table-page .doc-section a:hover { text-decoration: underline; }

.table-preview {
  margin-top: 22px;
  padding: 20px 24px 24px;
  border: 1px solid var(--docs-border);
  border-radius: 6px;
}

.table-preview__label {
  display: block;
  margin-bottom: 20px;
  color: #909399;
  font-size: 12px;
}

.table-preview__scroll { overflow-x: auto; }
.table-preview__canvas { min-width: 580px; }

.table-toc {
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

.table-toc > span { color: #909399; font-size: 12px; font-weight: 700; }
.table-toc a { color: var(--docs-text-secondary); text-decoration: none; }
.table-toc a:hover, .table-toc a.is-active { color: var(--docs-primary); }

@media (max-width: 1000px) {
  .table-layout { grid-template-columns: minmax(0, 1fr); }
  .table-toc { display: none; }
}

@media (max-width: 720px) {
  .table-layout { margin-top: 40px; }
  .table-preview { padding: 18px 16px 20px; }
}
</style>

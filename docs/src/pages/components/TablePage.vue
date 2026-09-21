<template>
  <div class="doc-page">
    <h1>Table 表格</h1>
    <p class="doc-lead">
      <code>GaTable</code> 封装 Element Plus 的 <code>ElTable</code>，既可通过 <code>columns</code>
      配置列，也可通过插槽直接编写 <code>ElTableColumn</code>。未声明的属性和表格事件会经
      <code>$attrs</code> 透传到底层 <code>ElTable</code>。从 <code>ga-ui-plus/base</code> 导入。
    </p>

    <h2>基础用法</h2>
    <p>通过 <code>data</code> 与 <code>columns</code> 渲染表格；<code>border</code>、<code>stripe</code> 默认开启。</p>
    <DemoBlock :source="basicSource">
      <BasicDemo />
    </DemoBlock>

    <h2>配置式列与自定义单元格</h2>
    <p>
      在列配置中设置 <code>slot</code>，即可选择同名插槽渲染该列。插槽作用域保持 Element Plus
      单元格作用域，包含 <code>row</code>、<code>column</code> 和 <code>$index</code>。
      如果列声明了 <code>slot</code> 但没有提供对应插槽，该列仍使用原生单元格渲染。
    </p>
    <DemoBlock :source="slotSource">
      <SlotDemo />
    </DemoBlock>

    <h2>混合使用配置列与 ElTableColumn</h2>
    <p>
      <code>column-prepend</code> 插槽位于所有配置列之前；默认插槽位于所有配置列之后。
      可以用它们增加选择列、展开列或包含复杂模板的操作列。
    </p>
    <DemoBlock :source="mixSource">
      <MixDemo />
    </DemoBlock>

    <h2>颜色主题</h2>
    <p>
      <code>theme</code> 用于配置当前 <code>GaTable</code> 实例的颜色。主题支持部分覆盖，
      未传字段继续使用默认颜色主题，不会影响其他表格实例。
    </p>
    <DemoBlock :source="themeSource">
      <ThemeDemo />
    </DemoBlock>

    <h2>API</h2>

    <h3>Props</h3>
    <p>
      未在下表声明的低频 <code>ElTable</code> 属性可直接写在 <code>GaTable</code> 上；
      未声明的表格事件监听器也会通过 <code>$attrs</code> 绑定到底层表格，例如
      <code>table-layout="fixed"</code>、<code>scrollbar-always-on</code> 和 <code>@selection-change</code>。
    </p>
    <ApiTable :headers="['属性名', '说明', '类型', '默认值']" :rows="propsRows" />

    <h3>GaTableColumn</h3>
    <p>
      <code>GaTableColumn&lt;Row&gt;</code> 中除 <code>key</code>、<code>slot</code> 外的字段都会绑定到对应的
      <code>ElTableColumn</code>。传入 <code>Row</code> 泛型后，<code>prop</code> 可获得已知字段提示。
    </p>
    <ApiTable :headers="['字段', '说明', '类型']" :rows="columnRows" />
    <p>
      配置列的 Vue key 按 <code>key</code>、<code>prop</code>、最后是 <code>type + index</code> 的顺序生成。
      需要其他列能力时，可在默认插槽手写 <code>ElTableColumn</code>。
    </p>

    <h3>Slots</h3>
    <ApiTable :headers="['插槽名', '说明', '作用域']" :rows="slotsRows" />

    <h3>Exposes</h3>
    <p>
      Vue 会解包暴露的 ref，可直接通过 <code>tableRef.value?.tableRef?.clearSelection()</code>
      调用底层实例方法；应在组件挂载后（如按钮点击）调用。
    </p>
    <ApiTable :headers="['名称', '说明', '类型']" :rows="exposesRows" />

    <h2>样式配置</h2>
    <p><code>GaTableTheme</code> 支持以下字段，均可部分覆盖：</p>
    <ApiTable :headers="['字段', '说明']" :rows="themeRows" />

    <p>
      完整行为以
      <a href="https://element-plus.org/zh-CN/component/table.html" target="_blank" rel="noreferrer">Element Plus Table 文档</a>
      为准。
    </p>
  </div>
</template>

<script setup lang="ts">
import ApiTable from '../../components/ApiTable.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import BasicDemo from '../../demos/table/BasicDemo.vue'
import basicSource from '../../demos/table/BasicDemo.vue?raw'
import MixDemo from '../../demos/table/MixDemo.vue'
import mixSource from '../../demos/table/MixDemo.vue?raw'
import SlotDemo from '../../demos/table/SlotDemo.vue'
import slotSource from '../../demos/table/SlotDemo.vue?raw'
import ThemeDemo from '../../demos/table/ThemeDemo.vue'
import themeSource from '../../demos/table/ThemeDemo.vue?raw'

const propsRows = [
  ['data', '表格数据', 'Row[]', '[]'],
  ['columns', '配置式列', 'GaTableColumn<Row>[]', '[]'],
  ['height', '透传为 ElTable 的 height', 'string | number', '—'],
  ['maxHeight', '透传为 ElTable 的 max-height', 'string | number', '—'],
  ['rowKey', '行数据主键', 'string | ((row: Row) => string)', '—'],
  ['border', '是否显示纵向边框', 'boolean', 'true'],
  ['stripe', '是否显示斑马纹', 'boolean', 'true'],
  ['size', '表格尺寸', 'ComponentSize', '—'],
  ['fit', '列宽是否自动撑开', 'boolean', 'true'],
  ['showHeader', '是否显示表头', 'boolean', 'true'],
  ['highlightCurrentRow', '是否高亮当前行', 'boolean', 'false'],
  ['emptyText', '空数据文本，也是默认 ElEmpty 的描述', 'string', "'暂无数据'"],
  ['loading', '是否启用 Element Plus loading 指令', 'boolean', 'false'],
  ['loadingText', '透传为 element-loading-text', 'string', "'加载中...'"],
  ['theme', '当前表格实例颜色配置，支持部分覆盖', 'GaTableTheme', '默认颜色主题'],
]

const columnRows = [
  ['key', '仅控制配置列的 Vue key；不透传给 ElTableColumn', 'PropertyKey'],
  ['slot', '选择用于单元格渲染的命名插槽；不透传给 ElTableColumn', 'string'],
  ['type', "列类型，如 default、selection、index、expand", 'GaTableColumnType'],
  ['label', '列标题', 'string'],
  ['className', '列单元格类名', 'string'],
  ['labelClassName', '表头单元格类名', 'string'],
  ['property', 'Element Plus 列的 property', 'string'],
  ['prop', '行字段名；传入 Row 泛型可获得已知字段提示', 'Extract<keyof Row, string> | (string & {})'],
  ['width', '固定列宽', 'string | number'],
  ['minWidth', '最小列宽', 'string | number'],
  ['sortable', "是否排序或使用远程排序", "boolean | 'custom'"],
  ['sortMethod', '自定义排序方法', '(a: Row, b: Row) => number'],
  ['sortBy', '指定排序依据', 'string | string[] | ((row: Row, index: number) => string)'],
  ['resizable', '列宽是否可拖动', 'boolean'],
  ['columnKey', 'Element Plus 列标识', 'string'],
  ['align', '单元格对齐方式', "'left' | 'center' | 'right'"],
  ['headerAlign', '表头对齐方式', "'left' | 'center' | 'right'"],
  ['showOverflowTooltip', '内容溢出时是否显示 tooltip', 'boolean'],
  ['fixed', '是否固定列及固定方向', "boolean | 'left' | 'right'"],
  ['formatter', '单元格格式化函数', '(row, column, cellValue, index) => VNode | string'],
  ['selectable', '选择列的可选判断函数', '(row: Row, index: number) => boolean'],
  ['reserveSelection', '数据刷新后是否保留选择', 'boolean'],
  ['filters', '筛选选项', 'Array<{ text: string; value: string }>'],
  ['filterMethod', '筛选方法，原样透传给 Element Plus 的 filter-method', '(value, row, column) => void'],
  ['filteredValue', '已选筛选值', 'string[]'],
  ['filterPlacement', '筛选弹层位置', 'string'],
  ['filterMultiple', '是否允许多选筛选', 'boolean'],
  ['index', '索引列起始值或索引计算函数', 'number | ((index: number) => number)'],
]

const slotsRows = [
  ['column-prepend', '插入在所有配置列之前', '—'],
  ['default', '插入在所有配置列之后，通常用于手写 ElTableColumn', '—'],
  ['[column.slot]', '配置列的动态命名插槽', '{ row, column, $index }'],
  ['empty', '替换默认的 ElEmpty 空状态', '—'],
  ['append', '转发到 ElTable 的 append 插槽', '—'],
]

const exposesRows = [
  ['tableRef', '底层 ElTable 实例，可调用 clearSelection()、doLayout() 等方法', 'TableInstance | undefined'],
]

const themeRows = [
  ['backgroundColor', '表格整体背景色'],
  ['rowBackgroundColor', '普通数据行背景色'],
  ['textColor', '表格正文文字颜色'],
  ['headerBackgroundColor', '表头背景色'],
  ['headerTextColor', '表头文字颜色'],
  ['borderColor', '表格边框颜色'],
  ['stripeBackgroundColor', '斑马纹行背景色'],
  ['hoverBackgroundColor', '行悬停背景色'],
  ['currentRowBackgroundColor', '当前行高亮背景色'],
  ['expandedRowBackgroundColor', '展开行背景色'],
]
</script>

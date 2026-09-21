<template>
  <div class="doc-page">
    <h1>快速上手</h1>
    <p class="doc-lead">
      本页帮助你快速在项目中接入 ga-ui-plus：导出入口、一个完整示例、TypeScript 类型一览与属性透传规则。
    </p>

    <h2>导出入口</h2>
    <p>下表同时覆盖 JavaScript/TypeScript 模块入口与 CSS 样式入口：</p>
    <ApiTable
      :headers="['导出路径', '运行时导出', '类型导出']"
      :rows="[
        ['ga-ui-plus/base', 'GaDialog、GaMegaMenu、GaTable、GaPagination', '对应的对话框、大型菜单、表格、列、实例与分页类型'],
        ['ga-ui-plus/business', 'GaTablePagination、GaSearchBar、GaAsideMenu', '对应的表格分页、搜索栏与侧边栏菜单类型'],
        ['ga-ui-plus', '上述全部组件', '上述全部公开类型；这是聚合入口'],
        ['ga-ui-plus/resolver', 'GaUiResolver', 'Resolver 配置、解析结果与组件 Resolver 类型'],
        ['ga-ui-plus/style.css', '样式文件', '不适用'],
      ]"
    />
    <p>按职责导入：</p>
    <CodeBlock :code="importByScopeCode" />
    <p>也可以统一从聚合入口导入：</p>
    <CodeBlock :code="importAllCode" />

    <h2>一个完整的例子</h2>
    <p>先在应用入口引入样式，再在 Vue 单文件组件中直接导入所需组件：</p>
    <CodeBlock :code="quickstartCode" />

    <h2>TypeScript 类型</h2>
    <p>所有公开类型均可从聚合入口导入，也可从所属的 <code>base</code> 或 <code>business</code> 入口导入：</p>
    <ApiTable
      :headers="['类型', '用途']"
      :rows="typeRows"
    />

    <h2>属性透传与当前限制</h2>
    <ul>
      <li><code>GaDialog</code> 显式转发 <code>v-model</code>、全屏状态更新与对话框生命周期事件，并将其他 <code>$attrs</code> 绑定到内部 <code>ElDialog</code>。底层原生关闭按钮始终关闭，默认标题栏使用自绘全屏和关闭按钮；传入 <code>header</code> 插槽会替换整套默认标题栏。组件不内置 <code>footer</code> 内容或确认、取消等业务按钮。</li>
      <li><code>GaTable</code> 使用 <code>inheritAttrs: false</code>，并将普通 <code>$attrs</code> 直接绑定到内部 <code>ElTable</code>；未声明的 Element Plus 表格事件也随监听器一起透传。</li>
      <li><code>GaPagination</code> 使用相同策略，将普通 <code>$attrs</code> 绑定到内部 <code>ElPagination</code>。组件当前不转发分页插槽。</li>
      <li><code>GaSearchBar</code> 将普通 <code>$attrs</code> 绑定在根元素；内部 <code>ElForm</code> 使用组件维护的 draft 值。异步选项、远程搜索与分页均由消费方管理，组件不会请求数据、触发远程搜索或重置页码。</li>
      <li><code>GaAsideMenu</code> 固定菜单 <code>mode="vertical"</code>，菜单内容通过默认插槽直接使用 Element Plus 菜单节点。<code>collapse</code>、<code>width</code>、<code>collapseWidth</code> 与 <code>theme</code> 由组件接管，其余菜单 Props 传给内部 <code>ElMenu</code>；主题变量会同时传给折叠子菜单弹层。父容器需要提供明确高度，内部 <code>ElScrollbar</code> 才能正确滚动。</li>
      <li><code>GaTablePagination</code> 的普通 <code>$attrs</code> 绑定在根元素，不会自动分发给内部表格或分页；只转发明确声明的四个分页事件，不透传 <code>selection-change</code> 等表格事件，也不暴露底层 <code>tableRef</code>。需要这些能力时，请使用 <code>GaTable</code> 与 <code>GaPagination</code> 组合。</li>
      <li><code>GaTableColumn</code> 只覆盖当前类型文件声明的列字段。需要其他 Element Plus 列能力时，可在 <code>column-prepend</code> 或默认插槽中直接使用 <code>ElTableColumn</code>。</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import ApiTable from '../../components/ApiTable.vue'
import CodeBlock from '../../components/CodeBlock.vue'

const importByScopeCode = `import { GaDialog, GaPagination, GaTable } from 'ga-ui-plus/base'
import { GaSearchBar, GaTablePagination } from 'ga-ui-plus/business'`

const importAllCode = `import {
  GaDialog,
  GaPagination,
  GaSearchBar,
  GaTable,
  GaTablePagination,
  type GaTableColumn,
} from 'ga-ui-plus'`

const quickstartCode = `<template>
  <GaTable :data="rows" :columns="columns" row-key="id" />
</template>

<script setup lang="ts">
import { GaTable, type GaTableColumn } from 'ga-ui-plus'

interface UserRow {
  id: number
  name: string
}

const rows: UserRow[] = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
]

const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名', minWidth: 160 },
]
<\/script>`

const typeRows = [
  ['GaDialogProps', 'GaDialog 明确声明的常用 Props 子集'],
  ['GaDialogEmits', 'GaDialog 的模型更新与生命周期事件签名'],
  ['GaDialogHeaderSlotProps', 'header 插槽作用域，包含 close、titleId、titleClass'],
  ['GaDialogExpose', 'GaDialog 暴露实例类型，包含 DialogInstance | undefined 的 dialogRef'],
  ['GaTableProps<Row>', 'GaTable Props'],
  ['GaTableTheme', 'GaTable 的实例级颜色主题配置'],
  ['GaTableRowKey<Row>', 'rowKey 的字符串或函数类型'],
  ['GaTableColumn<Row>', '配置式列定义'],
  ['GaTableCellScope<Row>', '配置列命名插槽的作用域'],
  ['GaTableExpose', 'GaTable 暴露实例类型，包含 tableRef'],
  ['GaTableRow', '默认行数据基类型 Record<string, any>'],
  ['GaTableColumnType', '配置列 type 类型'],
  ['GaTableColumnAlign', '列对齐类型'],
  ['GaTableColumnFixed', '固定列类型'],
  ['GaPaginationProps', 'GaPagination Props'],
  ['GaPaginationTheme', 'GaPagination 的实例级颜色主题配置'],
  ['GaTablePaginationProps<Row>', '扁平的表格分页组合 Props'],
  ['GaSearchModel', '搜索栏模型，保留字符串键值的搜索条件'],
  ['GaSearchLabelMode', '搜索栏标签模式：label 或 none'],
  ['GaSearchSize', '搜索栏尺寸：large、default 或 small'],
  ['GaSearchBaseField', '搜索字段公共属性'],
  ['GaSearchInputField', 'input/textarea 搜索字段类型'],
  ['GaSearchOption', '选择字段选项'],
  ['GaSearchSelectField', 'select 搜索字段类型'],
  ['GaSearchDateField', '日期与日期范围搜索字段类型'],
  ['GaSearchCustomField', '自定义搜索字段类型'],
  ['GaSearchField', '全部搜索字段类型的联合类型'],
  ['GaSearchBarProps', 'GaSearchBar Props'],
  ['GaSearchChangePayload', '搜索字段变化事件参数'],
  ['GaSearchBarEmits', 'GaSearchBar 事件签名'],
  ['GaSearchBarExpose', 'GaSearchBar 暴露实例类型'],
  ['GaAsideMenuSlotProps', 'header/footer 插槽作用域，包含 collapse'],
  ['GaAsideMenuTheme', 'GaAsideMenu 主题颜色配置'],
  ['GaAsideMenuToggleSlotProps', 'collapse 插槽作用域，包含 collapse 与 toggle()'],
  ['GaAsideMenuProps', 'GaAsideMenu Props；在 Element Plus Menu Props 上增加折叠、宽度与主题控制'],
  ['GaAsideMenuEmits', 'GaAsideMenu 的折叠更新、切换与 select/open/close 事件签名'],
  ['GaAsideMenuExpose', 'GaAsideMenu 暴露实例类型，包含 menuRef 与 toggle()'],
  ['GaMegaMenuNavItem', '大型菜单导航项定义'],
  ['GaMegaMenuTheme', 'GaMegaMenu 分区主题配置'],
]
</script>

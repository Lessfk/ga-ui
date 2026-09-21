<template>
  <div class="doc-page">
    <h1>TablePagination 表格分页</h1>
    <p class="doc-lead">
      <code>GaTablePagination</code> 将 <code>GaTable</code> 与 <code>GaPagination</code> 组合为一个两行
      Grid。它使用扁平 Props：排除 <code>height</code>、<code>maxHeight</code> 与两侧 <code>theme</code>
      后组合表格和分页 Props，并通过 <code>tableTheme</code>、<code>paginationTheme</code>
      分别配置内部组件，不需要 <code>tableProps</code> 或 <code>paginationProps</code> 对象。从
      <code>ga-ui-plus/business</code> 导入。
    </p>

    <h2>基础用法</h2>
    <p>
      父容器需要提供明确高度，组件才能将剩余空间分配给内部表格。插槽会原样转发给内部
      <code>GaTable</code>，因此 <code>column-prepend</code>、配置列命名插槽、默认插槽等都可用。
    </p>
    <DemoBlock :source="basicSource">
      <BasicDemo />
    </DemoBlock>

    <h2>分别配置表格与分页主题</h2>
    <p>
      通过 <code>table-theme</code> 与 <code>pagination-theme</code> 分别配置内部组件颜色，
      两个主题都支持部分覆盖。
    </p>
    <DemoBlock :source="themeSource">
      <ThemeDemo />
    </DemoBlock>

    <h2>布局与高度要求</h2>
    <p>
      组件根节点使用两行 Grid：第一行 <code>minmax(0, 1fr)</code> 放置表格，第二行固定为
      <code>50px</code> 放置分页。内部 <code>GaTable</code> 固定使用 <code>height="100%"</code>，
      组合组件自身也使用 <code>height: 100%</code>。因此父容器必须有明确高度（例如
      <code>height: 600px</code>），并建议在 Flex 或 Grid 收缩链路上设置 <code>min-height: 0</code>。
    </p>

    <h2>当前限制</h2>
    <ul>
      <li>只转发明确声明的四个分页事件；<code>selection-change</code>、<code>row-click</code>、<code>sort-change</code> 等表格事件不会从内部 <code>GaTable</code> 透传。选择列可以显示并交互，但业务无法读取选择结果。</li>
      <li>当前不暴露底层 <code>tableRef</code>。</li>
      <li>不接受 <code>height</code>、<code>maxHeight</code>、<code>tableProps</code> 或 <code>paginationProps</code>；普通 <code>$attrs</code> 绑定在根元素，不会自动分发给内部表格或分页。</li>
      <li>需要上述能力时，请使用 <code>GaTable</code> 与 <code>GaPagination</code> 自行组合。</li>
    </ul>

    <h2>API</h2>

    <h3>Props</h3>
    <p>
      <code>GaTablePaginationProps&lt;Row&gt;</code> 是
      <code>Omit&lt;GaTableProps&lt;Row&gt;, 'height' | 'maxHeight' | 'theme'&gt; &amp;
      Omit&lt;GaPaginationProps, 'theme' | 'disabled'&gt;</code>，并另外提供
      <code>tableTheme</code> 与 <code>paginationTheme</code>。表格和分页共享同一个
      <code>size</code>；<code>loading</code> 同时控制表格加载状态和分页禁用状态。
    </p>
    <ApiTable :headers="['属性组', '属性', '默认行为']" :rows="propsRows" />
    <p>
      迁移提示：组合组件不接受含义不明确的 <code>theme</code>。原来的
      <code>:theme="paginationTheme"</code> 需要改为 <code>:pagination-theme="paginationTheme"</code>；
      表格主题使用 <code>:table-theme="tableTheme"</code>。
    </p>

    <h3>Events</h3>
    <ApiTable :headers="['事件名', '说明', '回调参数']" :rows="eventsRows" />

    <h3>Slots</h3>
    <p>
      组合组件会把收到的所有插槽及其作用域转发给内部 <code>GaTable</code>，可使用
      <code>column-prepend</code>、默认插槽、配置列命名插槽、<code>empty</code> 和
      <code>append</code>。这些插槽不会转发给分页组件。详见
      <a href="#/components/table">Table 表格</a> 的 Slots 说明。
    </p>
  </div>
</template>

<script setup lang="ts">
import ApiTable from '../../components/ApiTable.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import BasicDemo from '../../demos/table-pagination/BasicDemo.vue'
import basicSource from '../../demos/table-pagination/BasicDemo.vue?raw'
import ThemeDemo from '../../demos/table-pagination/ThemeDemo.vue'
import themeSource from '../../demos/table-pagination/ThemeDemo.vue?raw'

const propsRows = [
  ['表格数据与列', 'data、columns、rowKey', '与 GaTable 相同：[]、[]、—'],
  ['表格外观', 'border、stripe、fit、showHeader', '均为 true'],
  ['表格状态', 'highlightCurrentRow、emptyText、loading、loadingText', "false、'暂无数据'、false、'加载中...'；loading=true 时分页同时禁用"],
  ['主题配置', 'tableTheme', '传给内部 GaTable 的实例级颜色主题，支持部分覆盖'],
  ['主题配置', 'paginationTheme', '传给内部 GaPagination 的实例级颜色主题，支持部分覆盖'],
  ['共享尺寸', 'size', '同时传给 GaTable 与 GaPagination；未传时使用子组件默认行为'],
  ['分页模型', 'currentPage、pageSize', '与 GaPagination 相同：1、10'],
  ['分页数据', 'total、pageSizes', '与 GaPagination 相同：0、[10, 20, 30, 40, 50]'],
  ['分页外观', 'layout、background、position', 'layout、position 与 GaPagination 相同；background 默认为 true'],
]

const eventsRows = [
  ['update:current-page', '转发页码模型更新', '(currentPage: number)'],
  ['update:page-size', '转发页大小模型更新', '(pageSize: number)'],
  ['current-change', '当前页变化事件', '(currentPage: number)'],
  ['size-change', '每页条数变化事件', '(pageSize: number)'],
]
</script>

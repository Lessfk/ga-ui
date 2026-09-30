export const propsRows = [
  ['data', 'Row[]', '[]', '当前页的表格数据；组件不会自动分页'],
  ['columns', 'GaTableColumn<Row>[]', '[]', '表格列配置；详见 Table 文档'],
  ['rowKey', 'string | ((row: Row) => string)', 'undefined', '行唯一标识，使用选择保留等功能时需要设置'],
  ['border', 'boolean', 'true', '是否显示表格边框'],
  ['stripe', 'boolean', 'true', '是否显示斑马纹'],
  ['size', 'ComponentSize', "'default'", '同时传给表格和分页；支持 large、default、small'],
  ['fit', 'boolean', 'true', '表格列宽是否自动撑开'],
  ['showHeader', 'boolean', 'true', '是否显示表头'],
  ['highlightCurrentRow', 'boolean', 'false', '是否高亮当前行'],
  ['emptyText', 'string', "'暂无数据'", '表格无数据时的文案'],
  ['loading', 'boolean', 'false', '显示表格加载状态，同时禁用分页'],
  ['loadingText', 'string', "'加载中...'", '表格加载时的文案'],
  ['currentPage', 'number', '1', '当前页；支持 v-model:current-page'],
  ['pageSize', 'number', '10', '每页条数；支持 v-model:page-size'],
  ['total', 'number', '0', '完整数据集的总条数'],
  ['pageSizes', 'number[]', '[10, 20, 30, 40, 50]', '可选的每页条数'],
  ['layout', 'string', "'total, sizes, prev, pager, next, jumper'", '分页布局项及顺序'],
  ['background', 'boolean', 'true', '是否启用页码按钮背景'],
  ['position', "'left' | 'center' | 'right'", "'right'", '分页条的水平对齐方式'],
  ['tableTheme', 'GaTableTheme', '内置表格主题', '仅作用于内部 GaTable，支持部分覆盖'],
  ['paginationTheme', 'GaPaginationTheme', '内置分页主题', '仅作用于内部 GaPagination，支持部分覆盖'],
]

export const eventsRows = [
  ['update:current-page', '(currentPage: number)', '当前页变化；用于 v-model:current-page'],
  ['update:page-size', '(pageSize: number)', '每页条数变化；用于 v-model:page-size'],
  ['current-change', '(currentPage: number)', '当前页变化后触发'],
  ['size-change', '(pageSize: number)', '每页条数变化后触发'],
]

export const slotsRows = [
  ['default', '无', '向内部表格添加 ElTableColumn'],
  ['column-prepend', '无', '在配置列前插入 ElTableColumn'],
  ['自定义列名', 'GaTableCellScope<Row>', '与 columns 中的 slot 同名，接收 row、column、$index'],
  ['append', '无', '在表格最后一行之后插入内容'],
  ['empty', '无', '替换表格无数据时的内容'],
]

export const tableThemeRows = [
  ['backgroundColor', '#ffffff', '表格背景色'],
  ['rowBackgroundColor', '#ffffff', '普通行背景色'],
  ['textColor', '#344054', '正文文字颜色'],
  ['headerBackgroundColor', '#4F7DB2', '表头背景色'],
  ['headerTextColor', '#f9fafb', '表头文字颜色'],
  ['borderColor', '#d0d5dd', '边框颜色'],
  ['stripeBackgroundColor', '#f8fafc', '斑马纹行背景色'],
  ['hoverBackgroundColor', '#eff8ff', '行悬停背景色'],
  ['currentRowBackgroundColor', '#d1e9ff', '当前高亮行背景色'],
  ['expandedRowBackgroundColor', '#f2f4f7', '展开行背景色'],
]

export const paginationThemeRows = [
  ['backgroundColor', '#EEEEEF', '分页栏背景色'],
  ['textColor', '#606266', '总数、条数选择及跳页文字颜色'],
  ['buttonColor', '#7A7475', '普通按钮文字颜色'],
  ['buttonBackgroundColor', '#ffffff', '普通按钮背景色'],
  ['activeColor', '#ffffff', '当前页文字颜色'],
  ['activeBackgroundColor', '#4F7DB2', '当前页背景色'],
  ['hoverColor', '#ffffff', '悬停文字颜色'],
  ['hoverBackgroundColor', '#4f7db299', '悬停背景色'],
  ['disabledColor', '#606266', '禁用按钮文字颜色'],
  ['disabledBackgroundColor', '#fafafa', '禁用按钮背景色'],
]

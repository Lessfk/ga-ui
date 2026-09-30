export const propsRows = [
  ['modelValue', 'GaSearchModel', '必填', '搜索模型；支持 v-model'],
  ['fields', 'GaSearchField[]', '必填', '字段定义；按数组顺序显示'],
  ['labelMode', "'label' | 'none'", "'label'", '是否显示字段标签，可被字段配置覆盖'],
  ['labelPosition', "'left' | 'right' | 'top'", "'right'", '标签位置'],
  ['labelWidth', 'string | number', "'auto'", '全局标签宽度，可被字段配置覆盖'],
  ['size', "'large' | 'default' | 'small'", "'default'", '表单控件尺寸'],
  ['gutter', 'number', '16', '字段栅格间距，单位 px'],
  ['collapsed', 'boolean', 'true', '是否折叠；支持 v-model:collapsed'],
  ['collapsedCount', 'number', '3', '折叠时显示的非隐藏字段数量'],
  ['disabled', 'boolean', 'false', '禁用搜索字段，不影响操作按钮'],
  ['actionsLoading', 'boolean', 'false', '查询按钮显示加载状态，同时阻止提交'],
  ['actionsDisabled', 'boolean', 'false', '禁用操作按钮，不影响搜索字段'],
  ['rules', 'FormRules', 'undefined', 'Element Plus 表单校验规则'],
  ['validateOnSearch', 'boolean', 'false', '查询前是否执行表单校验'],
  ['actionsShowSearch', 'boolean', 'true', '是否显示默认查询按钮'],
  ['actionsShowReset', 'boolean', 'true', '是否显示默认重置按钮'],
  ['actionsShowCollapse', 'boolean', 'true', '字段可折叠时是否显示展开/收起按钮'],
]

export const fieldRows = [
  ['key', 'string', '必填；字段唯一标识，对应 modelValue 的键'],
  ['type', 'GaSearchField 类型', '必填；决定控件渲染方式'],
  ['label', 'string', '必填；显示标签和默认无障碍名称'],
  ['labelMode', "'label' | 'none'", '覆盖当前字段的标签显示方式'],
  ['labelWidth', 'string | number', '覆盖当前字段的标签宽度'],
  ['placeholder', 'string', '占位提示；优先于 componentProps.placeholder'],
  ['ariaLabel', 'string', '控件无障碍名称；默认使用 label'],
  ['defaultValue', 'unknown', '重置时优先使用的值'],
  ['disabled', 'boolean', '仅禁用当前字段'],
  ['hidden', 'boolean', '隐藏字段，不参与折叠数量计算'],
  ['span', 'ColProps[\'span\']', '默认占 6/24 列'],
  ['xs / sm / md / lg / xl', 'ColProps 对应断点类型', '按视口断点覆盖栅格宽度；不自动设置响应式值'],
  ['componentProps', 'Record<string, unknown>', '传给内置控件的额外属性；受控属性和监听器不会覆盖组件行为'],
]

export const fieldTypeRows = [
  ['input / textarea', '无', '单行或多行输入；input 回车不会自动查询'],
  ['select', 'options?: GaSearchOption[]', '静态选项；异步选项由业务方更新 fields'],
  ['date / datetime', 'format?: string; valueFormat?: string', '日期或日期时间；format 控制显示，valueFormat 控制模型值'],
  ['daterange / datetimerange', 'format?: string; valueFormat?: string', '日期范围；placeholder 用于起止两侧'],
  ['custom', 'field-{key} 插槽', '自定义控件需调用插槽的 update(value) 更新模型'],
]

export const optionRows = [
  ['label', 'string', '必填；选项文案'],
  ['value', 'string | number | boolean', '必填；选项值'],
  ['disabled', 'boolean', '是否禁用该选项'],
]

export const eventsRows = [
  ['update:modelValue', '(model: GaSearchModel)', '字段模型更新；用于 v-model'],
  ['update:collapsed', '(collapsed: boolean)', '折叠状态变化；用于 v-model:collapsed'],
  ['search', '(model: GaSearchModel)', '点击查询或调用 search() 且校验通过后触发'],
  ['reset', '(model: GaSearchModel)', '执行重置后触发，返回重置后的模型'],
  ['change', '(payload: GaSearchChangePayload)', '字段触发 change 时返回 key、value、model 和 field'],
  ['invalid', '(fields: unknown)', '启用查询校验且校验失败时触发'],
]

export const slotsRows = [
  ['field-{key}', '{ field, value, disabled, update }', '替换指定字段；调用 update(value) 同步模型'],
  ['prepend', '无', '在字段之前插入 ElRow 内容'],
  ['append', '无', '在字段之后、操作区之前插入 ElRow 内容'],
  ['actions', '操作作用域', '替换整个操作区，优先级最高'],
  ['actions-prepend', '操作作用域', '在默认按钮之前插入内容'],
  ['action-search', '操作作用域', '替换查询按钮；受 actionsShowSearch 控制'],
  ['action-reset', '操作作用域', '替换重置按钮；受 actionsShowReset 控制'],
  ['action-collapse', '操作作用域', '替换展开/收起按钮；受 actionsShowCollapse 控制'],
  ['actions-append', '操作作用域', '在默认按钮之后插入内容'],
]

export const exposeRows = [
  ['formRef', 'FormInstance | undefined', '内部 Element Plus 表单实例'],
  ['search', '() => Promise<boolean>', '执行查询，成功返回 true'],
  ['reset', '() => void', '按字段默认值或初始值重置'],
  ['validate', '() => Promise<boolean>', '执行表单校验'],
  ['clearValidate', '() => void', '清除校验状态'],
  ['toggle', '() => void', '切换折叠状态'],
]

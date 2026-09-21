<template>
  <div class="doc-page">
    <h1>SearchBar 搜索栏</h1>
    <p class="doc-lead">
      <code>GaSearchBar</code> 是一个数据驱动的搜索栏组件。通过 <code>fields</code> 描述字段类型、标签和布局，
      通过 <code>v-model</code> 管理搜索模型；组件负责表单展示、折叠和校验流程，查询数据、异步选项、
      远程搜索与分页状态由消费方维护。从 <code>ga-ui-plus/business</code> 导入。
    </p>

    <h2>基础用法</h2>
    <p>
      内置字段类型共 8 种：<code>input</code>、<code>textarea</code>、<code>select</code>、<code>date</code>、
      <code>datetime</code>、<code>daterange</code>、<code>datetimerange</code> 和 <code>custom</code>。
      日期字段的 <code>format</code> 用于显示，<code>valueFormat</code> 用于模型值。
    </p>
    <DemoBlock :source="basicSource">
      <BasicDemo />
    </DemoBlock>

    <h2>自定义操作区</h2>
    <p>
      操作区提供 <code>actions</code>、<code>actions-prepend</code>、<code>action-search</code>、
      <code>action-reset</code>、<code>action-collapse</code>、<code>actions-append</code> 插槽。
      <code>actions</code> 插槽优先级最高，存在时会替换整个操作区域；单按钮插槽仍受对应显示属性控制。
    </p>
    <DemoBlock :source="slotsSource">
      <SlotsDemo />
    </DemoBlock>

    <h2>标签与布局</h2>
    <ul>
      <li><code>labelMode</code> 只支持 <code>label</code> 和 <code>none</code>；字段可通过自身的 <code>labelMode</code> 覆盖搜索栏默认值。</li>
      <li><code>labelPosition</code> 支持 <code>left</code>、<code>right</code>、<code>top</code>，默认 <code>right</code>；<code>labelWidth</code> 可在搜索栏统一配置，字段值优先于全局值。</li>
      <li>每个字段可使用 <code>span</code>、<code>xs</code>、<code>sm</code>、<code>md</code>、<code>lg</code>、<code>xl</code> 设置栅格占比，<code>span</code> 默认值为 <code>6</code>；响应式断点仅在明确配置时生效。</li>
      <li>表单字段和操作区状态相互独立：<code>disabled</code> 只禁用搜索字段，<code>actionsDisabled</code> 只禁用操作按钮，<code>actionsLoading</code> 只控制查询加载状态。</li>
      <li>单行输入框按回车不会触发查询；查询只会由查询按钮、显式表单提交、自定义操作区或实例方法 <code>search()</code> 触发。</li>
    </ul>

    <h3>重置规则</h3>
    <p>
      执行重置时，字段存在 <code>defaultValue</code> 则优先使用该值，否则使用组件首次捕获的初始值；
      <code>fields</code> 中未声明的模型键会保留。分页不属于组件模型，页码由消费方自行维护。
    </p>

    <h2>API</h2>

    <h3>Props</h3>
    <ApiTable :headers="['属性名', '说明', '类型', '默认值']" :rows="propsRows" />

    <h3>GaSearchField 公共属性</h3>
    <ApiTable :headers="['字段', '说明', '类型']" :rows="fieldRows" />

    <h3>字段类型专属属性</h3>
    <ApiTable :headers="['字段类型', '专属属性', '说明']" :rows="fieldTypeRows" />

    <h3>Events</h3>
    <ApiTable :headers="['事件名', '说明', '回调参数']" :rows="eventsRows" />

    <h3>Slots</h3>
    <p>
      操作作用域包含
      <code>{ search, reset, validate, clearValidate, collapsed, toggle, actionsLoading, actionsDisabled }</code>。
    </p>
    <ApiTable :headers="['插槽名', '说明', '作用域']" :rows="slotsRows" />

    <h3>Exposes</h3>
    <p>内部表单使用组件维护的 draft 值；调用暴露方法时应在组件挂载后执行。</p>
    <ApiTable :headers="['名称', '说明', '类型']" :rows="exposesRows" />
  </div>
</template>

<script setup lang="ts">
import ApiTable from '../../components/ApiTable.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import BasicDemo from '../../demos/search-bar/BasicDemo.vue'
import basicSource from '../../demos/search-bar/BasicDemo.vue?raw'
import SlotsDemo from '../../demos/search-bar/SlotsDemo.vue'
import slotsSource from '../../demos/search-bar/SlotsDemo.vue?raw'

const propsRows = [
  ['modelValue', '搜索模型，支持 v-model', 'GaSearchModel', '必填'],
  ['fields', '搜索字段定义', 'GaSearchField[]', '必填'],
  ['labelMode', '默认标签模式', "GaSearchLabelMode", "'label'"],
  ['labelPosition', '标签位置，透传给 ElForm', "'left' | 'right' | 'top'", "'right'"],
  ['labelWidth', '表单标签宽度', 'string | number', "'auto'"],
  ['size', '搜索栏表单控件尺寸', "'large' | 'default' | 'small'", "'default'"],
  ['gutter', '字段栅格间距', 'number', '16'],
  ['collapsed', '是否折叠，支持 v-model:collapsed', 'boolean', 'true'],
  ['collapsedCount', '折叠时显示的字段数量', 'number', '3'],
  ['disabled', '是否禁用搜索字段，不影响操作区', 'boolean', 'false'],
  ['actionsLoading', '是否显示查询按钮加载状态，并阻止重复查询', 'boolean', 'false'],
  ['actionsDisabled', '是否禁用操作区按钮，不影响搜索字段', 'boolean', 'false'],
  ['rules', 'Element Plus 表单校验规则', 'FormRules', '—'],
  ['validateOnSearch', '搜索前是否校验表单', 'boolean', 'false'],
  ['actionsShowSearch', '是否显示搜索按钮', 'boolean', 'true'],
  ['actionsShowReset', '是否显示重置按钮', 'boolean', 'true'],
  ['actionsShowCollapse', '是否显示折叠按钮', 'boolean', 'true'],
]

const fieldRows = [
  ['key', '字段键，必填', 'string'],
  ['type', "字段类型，必填", "'input' | 'textarea' | 'select' | 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'custom'"],
  ['label', '字段标签', 'string'],
  ['labelMode', '当前字段的标签模式', 'GaSearchLabelMode'],
  ['labelWidth', '当前字段的标签宽度，优先于搜索栏全局值', 'string | number'],
  ['placeholder', '占位提示', 'string'],
  ['ariaLabel', '无可见标签时的无障碍标签', 'string'],
  ['defaultValue', '重置时优先使用的默认值', 'unknown'],
  ['disabled', '是否禁用当前字段', 'boolean'],
  ['hidden', '是否隐藏当前字段', 'boolean'],
  ['span', '默认栅格占比', 'number（默认 6）'],
  ['xs / sm / md / lg / xl', '各断点栅格占比，无默认值', 'number'],
  ['componentProps', '透传给内置字段组件的属性', 'Record<string, unknown>'],
]

const fieldTypeRows = [
  ['input', '—', '单行输入'],
  ['textarea', '—', '多行输入'],
  ['select', 'options?: GaSearchOption[]', '选择项；异步更新由消费方维护'],
  ['date / datetime / daterange / datetimerange', 'format、valueFormat', '日期显示格式和值格式'],
  ['custom', '—', '通过 field-{key} 插槽自定义内容'],
]

const eventsRows = [
  ['update:modelValue', '搜索模型变化', '(model: GaSearchModel)'],
  ['update:collapsed', '折叠状态变化', '(collapsed: boolean)'],
  ['search', '执行搜索', '(model: GaSearchModel)'],
  ['reset', '执行重置', '(model: GaSearchModel)'],
  ['change', '字段值变化', '(payload: GaSearchChangePayload)，含 key、value、model、field'],
  ['invalid', '校验失败；参数为 Element Plus 返回的校验字段信息', '(fields: unknown)'],
]

const slotsRows = [
  ['field-{key}', '自定义指定字段的渲染；update(value) 更新字段值', '{ field, value, disabled, update }'],
  ['prepend', '搜索栏内容前置区域', '—'],
  ['append', '搜索栏内容后置区域', '—'],
  ['actions', '替换整个操作区域（优先级最高）', '操作作用域'],
  ['actions-prepend', '在默认操作按钮之前追加内容', '操作作用域'],
  ['action-search', '只替换查询按钮', '操作作用域'],
  ['action-reset', '只替换重置按钮', '操作作用域'],
  ['action-collapse', '只替换展开/收起按钮', '操作作用域'],
  ['actions-append', '在默认操作按钮之后追加内容', '操作作用域'],
]

const exposesRows = [
  ['formRef', '内部 Element Plus 表单实例', 'FormInstance | undefined'],
  ['search', '执行搜索流程并返回是否成功', '() => Promise<boolean>'],
  ['reset', '按重置规则恢复模型', '() => void'],
  ['validate', '校验表单并返回是否通过', '() => Promise<boolean>'],
  ['clearValidate', '清除表单校验状态', '() => void'],
  ['toggle', '切换折叠状态', '() => void'],
]
</script>

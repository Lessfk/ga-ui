<template>
  <div class="doc-page search-bar-page">
    <header class="doc-intro">
      <p class="doc-eyebrow">业务组件 / SearchBar 搜索栏</p>
      <h1>SearchBar 搜索栏</h1>
      <p class="doc-lead">
        <code>GaSearchBar</code> 通过字段配置生成搜索表单，支持输入、选择、日期、
        自定义字段、折叠和校验。查询条件由业务页面维护，组件负责交互与事件。
      </p>
    </header>

    <div class="search-bar-layout">
      <article class="search-bar-content">
        <section id="search-bar-usage" class="doc-section">
          <h2>如何使用</h2>
          <p>
            安装并配置样式后，从 <code>ga-ui-plus/business</code> 导入组件及字段类型。
            使用 <code>GaUiResolver</code> 自动解析模板组件时可直接写
            <code>&lt;GaSearchBar /&gt;</code>；手动导入请参阅
            <RouterLink to="/guide/usage">接入指南</RouterLink>。
          </p>
          <DocsCodeBlock language="Vue" :code="importCode" />
          <p>
            用 <code>v-model</code> 绑定查询模型、<code>fields</code> 定义字段；在
            <code>search</code> 事件中使用返回的模型发请求或筛选数据。组件不会自动查询、
            管理异步选项或重置业务分页。
          </p>
        </section>

        <section id="search-bar-basic" class="doc-section">
          <h2>基础查询</h2>
          <p>
            内置 <code>input</code>、<code>textarea</code>、<code>select</code>、
            <code>date</code>、<code>datetime</code>、<code>daterange</code> 和
            <code>datetimerange</code> 字段。默认折叠显示前三个非隐藏字段；示例改为先显示两个，
            点击“展开”查看日期与负责人。
          </p>
          <div class="search-bar-preview">
            <span class="search-bar-preview__label">预览</span>
            <SearchBarBasicDemo />
          </div>
          <DocsCodeBlock language="SearchBarBasicDemo.vue" :code="basicSource" />
        </section>

        <section id="search-bar-validation" class="doc-section">
          <h2>校验与重置</h2>
          <p>
            传入 Element Plus <code>rules</code> 并启用 <code>validateOnSearch</code> 后，
            校验通过才触发 <code>search</code>；失败时触发 <code>invalid</code>。
            重置优先使用字段的 <code>defaultValue</code>，否则恢复组件首次捕获的初始值。
            日期字段的 <code>format</code> 控制显示，<code>valueFormat</code> 控制模型值。
          </p>
          <div class="search-bar-preview">
            <span class="search-bar-preview__label">预览</span>
            <SearchBarValidationDemo />
          </div>
          <DocsCodeBlock language="SearchBarValidationDemo.vue" :code="validationSource" />
        </section>

        <section id="search-bar-slots" class="doc-section">
          <h2>自定义字段与操作</h2>
          <p>
            <code>type: 'custom'</code> 的字段通过 <code>field-{key}</code> 插槽渲染，
            调用插槽的 <code>update(value)</code> 更新模型。操作区可按按钮覆盖，也可用
            <code>actions</code> 插槽替换整个区域；示例替换查询按钮并追加“保存条件”。
          </p>
          <div class="search-bar-preview">
            <span class="search-bar-preview__label">预览</span>
            <SearchBarSlotsDemo />
          </div>
          <DocsCodeBlock language="SearchBarSlotsDemo.vue" :code="slotsSource" />
        </section>

        <section id="search-bar-style" class="doc-section">
          <h2>样式风格</h2>
          <p>
            组件没有独立的 <code>theme</code> 属性。可通过 <code>labelMode</code>、
            <code>labelPosition</code>、<code>labelWidth</code>、<code>size</code> 和
            <code>gutter</code> 调整表单密度；字段的 <code>span</code> 与响应式断点配置控制宽度。
            需要品牌色时，可为组件加 class 并覆盖 Element Plus 的 CSS 变量。
          </p>
          <div class="search-bar-preview">
            <span class="search-bar-preview__label">预览</span>
            <SearchBarStyleDemo />
          </div>
          <DocsCodeBlock language="SearchBarStyleDemo.vue" :code="styleSource" />
        </section>

        <section id="search-bar-behavior" class="doc-section">
          <h2>交互与状态</h2>
          <p>
            字段编辑会触发 <code>update:modelValue</code>；内置控件触发自身的
            <code>change</code> 时再发出字段 <code>change</code> 事件。重置只处理
            <code>fields</code> 中声明的键，模型中其他键会保留。单行输入框按回车不会自动查询；
            可点击查询按钮或调用实例的 <code>search()</code>。
          </p>
          <p>
            <code>disabled</code> 只禁用字段，<code>actionsDisabled</code> 只禁用操作按钮，
            <code>actionsLoading</code> 显示查询加载状态并阻止重复提交。
            <code>hidden</code> 字段不显示，也不计入折叠数量。
          </p>
        </section>

        <section id="search-bar-api" class="doc-section">
          <h2>API</h2>

          <h3 id="search-bar-props">Props</h3>
          <DocsApiTable :headers="['属性', '类型', '默认值', '说明']" :rows="propsRows" />

          <h3 id="search-bar-fields">GaSearchField</h3>
          <p>字段 <code>key</code> 在同一个搜索栏内应唯一；未配置断点时沿用 <code>span</code>。</p>
          <DocsApiTable :headers="['字段', '类型', '说明']" :rows="fieldRows" />

          <h4>字段类型</h4>
          <DocsApiTable :headers="['类型', '专属配置', '说明']" :rows="fieldTypeRows" />

          <h4>GaSearchOption</h4>
          <DocsApiTable :headers="['字段', '类型', '说明']" :rows="optionRows" />

          <h3 id="search-bar-events">Events</h3>
          <DocsApiTable :headers="['事件', '参数', '说明']" :rows="eventsRows" />

          <h3 id="search-bar-slots-api">Slots</h3>
          <p>
            “操作作用域”包含 <code>search</code>、<code>reset</code>、<code>validate</code>、
            <code>clearValidate</code>、<code>collapsed</code>、<code>toggle</code>、
            <code>actionsLoading</code> 和 <code>actionsDisabled</code>。
          </p>
          <DocsApiTable :headers="['插槽', '作用域', '说明']" :rows="slotsRows" />

          <h3 id="search-bar-expose">Expose</h3>
          <DocsApiTable :headers="['属性 / 方法', '类型', '说明']" :rows="exposeRows" />
        </section>
      </article>

      <aside class="search-bar-toc" aria-label="本页目录">
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
import SearchBarBasicDemo from './SearchBarBasicDemo.vue'
import basicSource from './SearchBarBasicDemo.vue?raw'
import SearchBarValidationDemo from './SearchBarValidationDemo.vue'
import validationSource from './SearchBarValidationDemo.vue?raw'
import SearchBarSlotsDemo from './SearchBarSlotsDemo.vue'
import slotsSource from './SearchBarSlotsDemo.vue?raw'
import SearchBarStyleDemo from './SearchBarStyleDemo.vue'
import styleSource from './SearchBarStyleDemo.vue?raw'
import {
  eventsRows,
  exposeRows,
  fieldRows,
  fieldTypeRows,
  optionRows,
  propsRows,
  slotsRows,
} from './SearchBarApi'

const route = useRoute()
const importCode = `import { GaSearchBar, type GaSearchField, type GaSearchModel } from 'ga-ui-plus/business'`

const tocItems = [
  { id: 'search-bar-usage', title: '如何使用' },
  { id: 'search-bar-basic', title: '基础查询' },
  { id: 'search-bar-validation', title: '校验与重置' },
  { id: 'search-bar-slots', title: '自定义字段与操作' },
  { id: 'search-bar-style', title: '样式风格' },
  { id: 'search-bar-behavior', title: '交互与状态' },
  { id: 'search-bar-props', title: 'Props' },
  { id: 'search-bar-fields', title: 'GaSearchField' },
  { id: 'search-bar-events', title: 'Events' },
  { id: 'search-bar-slots-api', title: 'Slots' },
  { id: 'search-bar-expose', title: 'Expose' },
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
.search-bar-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 170px;
  gap: 60px;
  margin-top: 48px;
}

.search-bar-content { min-width: 0; }

.search-bar-page .doc-section h3 {
  margin: 36px 0 18px;
  color: #303133;
  font-size: 18px;
  scroll-margin-top: 24px;
}

.search-bar-page .doc-section h4 {
  margin: 28px 0 14px;
  color: #303133;
  font-size: 15px;
}

.search-bar-page .doc-section a { color: var(--docs-primary); text-decoration: none; }
.search-bar-page .doc-section a:hover { text-decoration: underline; }

.search-bar-preview {
  margin-top: 22px;
  padding: 20px 24px 24px;
  border: 1px solid var(--docs-border);
  border-radius: 6px;
}

.search-bar-preview__label {
  display: block;
  margin-bottom: 20px;
  color: #909399;
  font-size: 12px;
}

.search-bar-toc {
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

.search-bar-toc > span { color: #909399; font-size: 12px; font-weight: 700; }
.search-bar-toc a { color: var(--docs-text-secondary); text-decoration: none; }
.search-bar-toc a:hover, .search-bar-toc a.is-active { color: var(--docs-primary); }

@media (max-width: 1000px) {
  .search-bar-layout { grid-template-columns: minmax(0, 1fr); }
  .search-bar-toc { display: none; }
}

@media (max-width: 720px) {
  .search-bar-layout { margin-top: 40px; }
  .search-bar-preview { padding: 18px 16px 20px; }
}
</style>

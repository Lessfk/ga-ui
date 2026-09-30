<template>
  <div class="doc-page header-page">
    <header class="doc-intro">
      <p class="doc-eyebrow">业务组件 / Header 头部导航</p>
      <h1>Header 头部导航</h1>
      <p class="doc-lead">
        <code>GaHeader</code> 组合了 Element Plus 的头部容器与 ga-ui 的大型菜单，
        提供左、中、右三区布局。适用于需要品牌入口、分组导航和账户操作的业务系统。
      </p>
    </header>

    <div class="header-layout">
      <article class="header-content">
        <section id="header-usage" class="doc-section">
          <h2>如何使用</h2>
          <p>
            安装并配置样式后，从 <code>ga-ui-plus/business</code> 导入 <code>GaHeader</code>；
            菜单数据类型从 <code>ga-ui-plus/base</code> 导入。使用 <code>GaUiResolver</code>
            时可直接写 <code>&lt;GaHeader /&gt;</code>。样式引入方式参阅
            <RouterLink to="/guide/usage">接入指南</RouterLink>。
          </p>
          <DocsCodeBlock language="Vue" :code="importCode" />
          <p>
            <code>menus</code> 接收一级导航数据；有 <code>groups</code> 的项目可展开面板，
            没有 <code>groups</code> 的项目直接触发选择。<code>left</code> 与 <code>right</code>
            插槽分别放置品牌和操作区。
          </p>
        </section>

        <section id="header-basic" class="doc-section">
          <h2>基础导航</h2>
          <p>
            通过 <code>v-model:active-key</code> 和 <code>v-model:open-key</code> 同步当前页面与展开面板；
            <code>select</code> 返回一级或二级菜单的完整信息。示例也展示
            <code>open()</code>、<code>close()</code> 和 <code>toggle()</code> 实例方法。
          </p>
          <div class="header-preview">
            <span class="header-preview__label">预览</span>
            <div class="header-preview__scroll"><div class="header-preview__canvas"><HeaderBasicDemo /></div></div>
          </div>
          <DocsCodeBlock language="HeaderBasicDemo.vue" :code="basicSource" />
        </section>

        <section id="header-slots" class="doc-section">
          <h2>自定义内容</h2>
          <p>
            <code>menu-item</code>、<code>group-title</code>、<code>panel-item</code> 和
            <code>empty</code> 插槽沿用 MegaMenu 的作用域。空数组 <code>groups: []</code>
            仍会打开面板，可用 <code>empty</code> 替换默认空状态。
          </p>
          <div class="header-preview">
            <span class="header-preview__label">预览</span>
            <div class="header-preview__scroll"><div class="header-preview__canvas"><HeaderSlotsDemo /></div></div>
          </div>
          <DocsCodeBlock language="HeaderSlotsDemo.vue" :code="slotsSource" />
        </section>

        <section id="header-style" class="doc-section">
          <h2>样式风格</h2>
          <p>
            <code>height</code>、<code>padding</code> 和 <code>gap</code> 控制三区布局；
            <code>theme</code> 同时配置导航按钮和弹出面板。<code>backgroundColor</code>
            覆盖 <code>theme.menuBackgroundColor</code>，并同步到内部菜单背景。
            <code>panelWidth</code> 也会透传，默认跟随中间的一级菜单导航区域宽度。
          </p>
          <div class="header-preview">
            <span class="header-preview__label">预览</span>
            <div class="header-preview__scroll"><div class="header-preview__canvas"><HeaderThemeDemo /></div></div>
          </div>
          <DocsCodeBlock language="HeaderThemeDemo.vue" :code="themeSource" />
          <p>
            菜单面板通过 Teleport 挂载到 <code>body</code>，仍使用当前实例的主题。
            可通过 <code>left</code> 和 <code>right</code> 插槽分别调整品牌区与操作区，保持浅色主题下的文字对比度。
          </p>
        </section>

        <section id="header-behavior" class="doc-section">
          <h2>交互与状态</h2>
          <p>
            默认点击打开面板；设置 <code>trigger="hover"</code> 后，打开和关闭延时分别由
            <code>openDelay</code> 与 <code>closeDelay</code> 控制。<code>closeOnSelect</code>
            默认在选择二级项后关闭面板；禁用项不会触发选择。
          </p>
          <p>
            不传 <code>activeKey</code> 或 <code>openKey</code> 时，组件自行维护对应状态；
            一旦传入属性或使用 <code>v-model</code>，父组件需同步更新绑定值。
            <code>ariaLabel</code> 会用于头部和菜单导航的无障碍标签。
          </p>
        </section>

        <section id="header-api" class="doc-section">
          <h2>API</h2>
          <h3 id="header-props">Props</h3>
          <p>Header 自身的布局参数：</p>
          <DocsApiTable :headers="['属性', '类型', '默认值', '说明']" :rows="headerPropsRows" />
          <p>以下参数透传给内部的 <code>GaMegaMenu</code>：</p>
          <DocsApiTable :headers="['属性', '类型', '默认值', '说明']" :rows="menuPropsRows" />

          <h3 id="header-data">菜单数据</h3>
          <h4>GaMegaMenuNavItem</h4>
          <DocsApiTable :headers="['字段', '类型', '说明']" :rows="navItemRows" />
          <h4>GaMegaMenuGroup</h4>
          <DocsApiTable :headers="['字段', '类型', '说明']" :rows="groupRows" />
          <h4>GaMegaMenuItem</h4>
          <DocsApiTable :headers="['字段', '类型', '说明']" :rows="itemRows" />
          <p>
            <code>GaMegaMenuKey</code> 为 <code>string | number</code>；图标可传 Vue 组件，
            或传 <code>{ component, props? }</code>。数据结构与
            <RouterLink to="/components/mega-menu">MegaMenu 文档</RouterLink>一致。
          </p>

          <h3 id="header-events">Events</h3>
          <DocsApiTable :headers="['事件', '参数', '说明']" :rows="eventsRows" />
          <h4>GaMegaMenuSelectPayload</h4>
          <DocsApiTable :headers="['字段', '类型', '说明']" :rows="selectPayloadRows" />

          <h3 id="header-slots-api">Slots</h3>
          <DocsApiTable :headers="['插槽', '作用域', '说明']" :rows="slotsRows" />

          <h3 id="header-expose">Expose</h3>
          <DocsApiTable :headers="['属性 / 方法', '类型', '说明']" :rows="exposeRows" />

          <h3 id="header-theme">GaMegaMenuTheme</h3>
          <p>
            主题字段均可部分覆盖；未设置的字段使用默认值。面板颜色与一级导航颜色独立，
            <code>backgroundColor</code> 仅覆盖导航背景。
          </p>
          <template v-for="section in themeSections" :key="section.title">
            <h4>{{ section.title }}</h4>
            <DocsApiTable :headers="['字段', '类型', '默认值', '说明']" :rows="section.rows" />
          </template>
        </section>
      </article>

      <aside class="header-toc" aria-label="本页目录">
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
import { eventsRows, groupRows, itemRows, navItemRows, propsRows as menuPropsRows, selectPayloadRows, themeSections } from './MegaMenuApi'
import { exposeRows, headerPropsRows, slotsRows } from './HeaderApi'
import HeaderBasicDemo from './HeaderBasicDemo.vue'
import basicSource from './HeaderBasicDemo.vue?raw'
import HeaderSlotsDemo from './HeaderSlotsDemo.vue'
import slotsSource from './HeaderSlotsDemo.vue?raw'
import HeaderThemeDemo from './HeaderThemeDemo.vue'
import themeSource from './HeaderThemeDemo.vue?raw'

const route = useRoute()
const importCode = `import { GaHeader, type GaHeaderExpose } from 'ga-ui-plus/business'
import { type GaMegaMenuNavItem, type GaMegaMenuSelectPayload } from 'ga-ui-plus/base'`

const tocItems = [
  { id: 'header-usage', title: '如何使用' },
  { id: 'header-basic', title: '基础导航' },
  { id: 'header-slots', title: '自定义内容' },
  { id: 'header-style', title: '样式风格' },
  { id: 'header-behavior', title: '交互与状态' },
  { id: 'header-props', title: 'Props' },
  { id: 'header-data', title: '菜单数据' },
  { id: 'header-events', title: 'Events' },
  { id: 'header-slots-api', title: 'Slots' },
  { id: 'header-expose', title: 'Expose' },
  { id: 'header-theme', title: 'GaMegaMenuTheme' },
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
.header-layout { display: grid; grid-template-columns: minmax(0, 1fr) 170px; gap: 60px; margin-top: 48px; }
.header-content { min-width: 0; }
.header-page .doc-section h3 { margin: 36px 0 18px; color: #303133; font-size: 18px; scroll-margin-top: 24px; }
.header-page .doc-section h4 { margin: 28px 0 14px; color: #303133; font-size: 15px; }
.header-page .doc-section a { color: var(--docs-primary); text-decoration: none; }
.header-page .doc-section a:hover { text-decoration: underline; }
.header-preview { margin-top: 22px; padding: 20px 24px 24px; border: 1px solid var(--docs-border); border-radius: 6px; }
.header-preview__label { display: block; margin-bottom: 20px; color: #909399; font-size: 12px; }
.header-preview__scroll { overflow-x: auto; }
.header-preview__canvas { min-width: 610px; }
.header-toc { position: sticky; top: 36px; display: flex; height: max-content; max-height: calc(100dvh - 72px); flex-direction: column; gap: 14px; overflow-y: auto; padding-left: 18px; border-left: 1px solid var(--docs-border); font-size: 13px; }
.header-toc > span { color: #909399; font-size: 12px; font-weight: 700; }
.header-toc a { color: var(--docs-text-secondary); text-decoration: none; }
.header-toc a:hover, .header-toc a.is-active { color: var(--docs-primary); }
@media (max-width: 1000px) { .header-layout { grid-template-columns: minmax(0, 1fr); } .header-toc { display: none; } }
@media (max-width: 720px) { .header-layout { margin-top: 40px; } .header-preview { padding: 18px 16px 20px; } }
</style>

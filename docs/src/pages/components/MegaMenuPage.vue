<template>
  <div class="doc-page mega-page">
    <header class="doc-intro">
      <p class="doc-eyebrow">基础组件 / MegaMenu 大型菜单</p>
      <h1>MegaMenu 大型菜单</h1>
      <p class="doc-lead">
        <code>GaMegaMenu</code> 用于头部的多级导航。一级菜单可直接选择，带分组的菜单可展开二级面板。
        面板宽度可配置；组件还支持点击或悬停触发、内容插槽以及导航与面板独立配色。
      </p>
    </header>

    <div class="mega-layout">
      <article class="mega-content">
        <section id="mega-usage" class="doc-section">
          <h2>如何使用</h2>
          <p>
            安装并配置样式后，从 <code>ga-ui-plus/base</code> 导入组件和数据类型。
            使用 <code>GaUiResolver</code> 自动解析模板组件时可直接写
            <code>&lt;GaMegaMenu /&gt;</code>；手动导入时请按
            <RouterLink to="/guide/usage">接入指南</RouterLink>配置样式。
          </p>
          <DocsCodeBlock language="Vue" :code="importCode" />
          <p>
            <code>menus</code> 提供一级菜单。导航根节点高度为 <code>100%</code>，
            父容器需设置明确高度；面板通过 Teleport 挂载到 <code>body</code>，默认宽度跟随整个一级菜单导航区域。
          </p>
        </section>

        <section id="mega-basic" class="doc-section">
          <h2>基础用法</h2>
          <p>
            没有 <code>groups</code> 的一级菜单会直接触发 <code>select</code>；
            有 <code>groups</code> 的菜单点击后展开面板。通过
            <code>v-model:active-key</code> 和 <code>v-model:open-key</code>
            管理状态，也可以通过组件实例调用 <code>open()</code>、<code>close()</code>。
          </p>
          <div class="mega-preview">
            <span class="mega-preview__label">预览</span>
            <div class="mega-preview__scroll"><div class="mega-preview__canvas"><MegaMenuBasicDemo /></div></div>
          </div>
          <DocsCodeBlock language="MegaMenuBasicDemo.vue" :code="basicSource" />
        </section>

        <section id="mega-width" class="doc-section">
          <h2>面板宽度</h2>
          <p>
            <code>panelWidth</code> 默认是 <code>'menu'</code>，跟随整个一级菜单导航区域，
            而不是当前触发按钮。传入数字时按 px 处理；字符串支持
            <code>50%</code>、<code>720px</code>、<code>60vw</code> 等 CSS 宽度值。
            面板使用固定定位，因此百分比相对于视口宽度计算。
            面板左边缘对齐导航区域，空间不足时会移动并限制在视口内。
          </p>
          <div class="mega-preview">
            <span class="mega-preview__label">预览</span>
            <div class="mega-preview__scroll"><div class="mega-preview__canvas"><MegaMenuWidthDemo /></div></div>
          </div>
          <DocsCodeBlock language="MegaMenuWidthDemo.vue" :code="widthSource" />
        </section>

        <section id="mega-hover" class="doc-section">
          <h2>悬停展开</h2>
          <p>
            设置 <code>trigger="hover"</code> 后，鼠标进入带分组的一级菜单会延时展开；
            <code>openDelay</code> 与 <code>closeDelay</code> 的单位均为毫秒。
            键盘聚焦菜单项时立即展开，按 Escape 或点击外部可关闭面板。
          </p>
          <div class="mega-preview">
            <span class="mega-preview__label">预览</span>
            <div class="mega-preview__scroll"><div class="mega-preview__canvas"><MegaMenuHoverDemo /></div></div>
          </div>
          <DocsCodeBlock language="MegaMenuHoverDemo.vue" :code="hoverSource" />
        </section>

        <section id="mega-slots-demo" class="doc-section">
          <h2>自定义内容</h2>
          <p>
            使用 <code>menu-item</code>、<code>group-title</code>、<code>panel-item</code>
            和 <code>empty</code> 插槽替换对应内容。示例中的“工具”提供空分组，
            <code>close-on-select="false"</code> 让选择面板项后继续保持展开。
          </p>
          <div class="mega-preview">
            <span class="mega-preview__label">预览</span>
            <div class="mega-preview__scroll"><div class="mega-preview__canvas"><MegaMenuSlotsDemo /></div></div>
          </div>
          <DocsCodeBlock language="MegaMenuSlotsDemo.vue" :code="slotsSource" />
        </section>

        <section id="mega-style" class="doc-section">
          <h2>样式风格</h2>
          <p>
            默认主题为深蓝色。<code>theme</code> 支持部分覆盖，一级导航的
            <code>menu*</code>/<code>menuItem*</code> 字段与弹出面板的
            <code>panel*</code> 字段独立，可组合浅色导航或深色导航配浅色面板。
          </p>
          <div class="mega-preview">
            <span class="mega-preview__label">预览</span>
            <div class="mega-preview__scroll"><div class="mega-preview__canvas"><MegaMenuThemeDemo /></div></div>
          </div>
          <DocsCodeBlock language="MegaMenuThemeDemo.vue" :code="themeSource" />
          <p>
            面板虽挂载到 <code>body</code>，仍会使用当前组件实例的完整主题变量。
            尺寸、间距和圆角字段可传数字或 CSS 字符串；数字转换为 <code>px</code>。
          </p>
        </section>

        <section id="mega-behavior" class="doc-section">
          <h2>交互与状态</h2>
          <p>
            <code>select</code> 会返回来源为 <code>menu</code> 或 <code>panel</code> 的统一数据；
            选择二级项时默认先关闭面板，再触发 <code>select</code>。
            禁用项不可触发选择。<code>groups: []</code> 仍属于可展开菜单，打开后显示空状态。
          </p>
          <p>
            不传 <code>activeKey</code>/<code>openKey</code> 时组件自行维护状态；
            一旦传入这些属性或对应的 <code>v-model</code>，父组件应同步更新绑定值。
            <code>maxHeight</code> 控制面板内容的滚动高度，默认 <code>auto</code>。
          </p>
        </section>

        <section id="mega-api" class="doc-section">
          <h2>API</h2>

          <h3 id="mega-props">Props</h3>
          <DocsApiTable :headers="['属性', '类型', '默认值', '说明']" :rows="propsRows" />

          <h3 id="mega-data">数据结构</h3>
          <h4>GaMegaMenuNavItem</h4>
          <DocsApiTable :headers="['字段', '类型', '说明']" :rows="navItemRows" />
          <h4>GaMegaMenuGroup</h4>
          <DocsApiTable :headers="['字段', '类型', '说明']" :rows="groupRows" />
          <h4>GaMegaMenuItem</h4>
          <DocsApiTable :headers="['字段', '类型', '说明']" :rows="itemRows" />
          <p>
            <code>GaMegaMenuKey</code> 为 <code>string | number</code>。
            <code>GaMegaMenuIcon</code> 可直接传 Vue 组件，或传
            <code>{ component, props? }</code> 图标配置。
          </p>

          <h3 id="mega-events">Events</h3>
          <DocsApiTable :headers="['事件', '参数', '说明']" :rows="eventsRows" />
          <h4>GaMegaMenuSelectPayload</h4>
          <DocsApiTable :headers="['字段', '类型', '说明']" :rows="selectPayloadRows" />

          <h3 id="mega-slots">Slots</h3>
          <DocsApiTable :headers="['插槽', '作用域', '说明']" :rows="slotsRows" />

          <h3 id="mega-expose">Expose</h3>
          <DocsApiTable :headers="['方法', '类型', '说明']" :rows="exposeRows" />

          <h3 id="mega-theme">GaMegaMenuTheme</h3>
          <p>主题字段均可部分覆盖，未传字段使用组件默认值；导航与面板互不借用对方的颜色。</p>
          <template v-for="section in themeSections" :key="section.title">
            <h4>{{ section.title }}</h4>
            <DocsApiTable :headers="['字段', '类型', '默认值', '说明']" :rows="section.rows" />
          </template>
        </section>
      </article>

      <aside class="mega-toc" aria-label="本页目录">
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
import MegaMenuBasicDemo from './MegaMenuBasicDemo.vue'
import basicSource from './MegaMenuBasicDemo.vue?raw'
import MegaMenuWidthDemo from './MegaMenuWidthDemo.vue'
import widthSource from './MegaMenuWidthDemo.vue?raw'
import MegaMenuHoverDemo from './MegaMenuHoverDemo.vue'
import hoverSource from './MegaMenuHoverDemo.vue?raw'
import MegaMenuSlotsDemo from './MegaMenuSlotsDemo.vue'
import slotsSource from './MegaMenuSlotsDemo.vue?raw'
import MegaMenuThemeDemo from './MegaMenuThemeDemo.vue'
import themeSource from './MegaMenuThemeDemo.vue?raw'
import {
  eventsRows,
  exposeRows,
  groupRows,
  itemRows,
  navItemRows,
  propsRows,
  selectPayloadRows,
  slotsRows,
  themeSections,
} from './MegaMenuApi'

const route = useRoute()
const importCode = `import { GaMegaMenu, type GaMegaMenuNavItem } from 'ga-ui-plus/base'`

const tocItems = [
  { id: 'mega-usage', title: '如何使用' },
  { id: 'mega-basic', title: '基础用法' },
  { id: 'mega-width', title: '面板宽度' },
  { id: 'mega-hover', title: '悬停展开' },
  { id: 'mega-slots-demo', title: '自定义内容' },
  { id: 'mega-style', title: '样式风格' },
  { id: 'mega-behavior', title: '交互与状态' },
  { id: 'mega-props', title: 'Props' },
  { id: 'mega-data', title: '数据结构' },
  { id: 'mega-events', title: 'Events' },
  { id: 'mega-slots', title: 'Slots' },
  { id: 'mega-expose', title: 'Expose' },
  { id: 'mega-theme', title: 'GaMegaMenuTheme' },
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
.mega-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 170px;
  gap: 60px;
  margin-top: 48px;
}

.mega-content { min-width: 0; }

.mega-page .doc-section h3 {
  margin: 36px 0 18px;
  color: #303133;
  font-size: 18px;
  scroll-margin-top: 24px;
}

.mega-page .doc-section h4 {
  margin: 28px 0 14px;
  color: #303133;
  font-size: 15px;
}

.mega-page .doc-section a { color: var(--docs-primary); text-decoration: none; }
.mega-page .doc-section a:hover { text-decoration: underline; }

.mega-preview {
  margin-top: 22px;
  padding: 20px 24px 24px;
  border: 1px solid var(--docs-border);
  border-radius: 6px;
}

.mega-preview__label {
  display: block;
  margin-bottom: 20px;
  color: #909399;
  font-size: 12px;
}

.mega-preview__scroll { overflow-x: auto; }
.mega-preview__canvas { min-width: 560px; }

.mega-toc {
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

.mega-toc > span { color: #909399; font-size: 12px; font-weight: 700; }
.mega-toc a { color: var(--docs-text-secondary); text-decoration: none; }
.mega-toc a:hover, .mega-toc a.is-active { color: var(--docs-primary); }

@media (max-width: 1000px) {
  .mega-layout { grid-template-columns: minmax(0, 1fr); }
  .mega-toc { display: none; }
}

@media (max-width: 720px) {
  .mega-layout { margin-top: 40px; }
  .mega-preview { padding: 18px 16px 20px; }
}
</style>

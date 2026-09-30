<template>
  <div class="doc-page aside-menu-page">
    <header class="doc-intro">
      <p class="doc-eyebrow">业务组件 / AsideMenu 侧边栏菜单</p>
      <h1>AsideMenu 侧边栏菜单</h1>
      <p class="doc-lead">
        <code>GaAsideMenu</code> 将 Element Plus 的侧栏、滚动容器和纵向菜单组合在一起，
        提供宽度联动的折叠控制、头部与底部插槽，以及可传递到子菜单弹层的主题。
      </p>
    </header>

    <div class="aside-menu-layout">
      <article class="aside-menu-content">
        <section id="aside-menu-usage" class="doc-section">
          <h2>如何使用</h2>
          <p>
            安装并配置样式后，从 <code>ga-ui-plus/business</code> 导入组件；
            默认插槽直接使用 Element Plus 的 <code>ElMenuItem</code>、<code>ElSubMenu</code>
            和 <code>ElMenuItemGroup</code>。使用 <code>GaUiResolver</code> 自动解析时可直接写
            <code>&lt;GaAsideMenu /&gt;</code>；手动导入参阅
            <RouterLink to="/guide/usage">接入指南</RouterLink>。
          </p>
          <DocsCodeBlock language="Vue" :code="importCode" />
          <p>
            组件高度为 <code>100%</code>，父容器须提供明确高度；菜单区域会在剩余空间内滚动。
            <code>width</code> 和 <code>collapseWidth</code> 分别控制展开与折叠宽度，
            默认是 <code>240px</code> 与 <code>64px</code>。
          </p>
        </section>

        <section id="aside-menu-basic" class="doc-section">
          <h2>基础导航</h2>
          <p>
            通过 <code>v-model:collapse</code> 同步折叠状态，使用
            <code>defaultActive</code> 和 <code>defaultOpeneds</code> 设置初始激活项与展开项。
            <code>select</code> 返回菜单 <code>index</code>、<code>indexPath</code> 及原生菜单项参数；
            <code>open</code> 和 <code>close</code> 报告子菜单状态。
          </p>
          <div class="aside-menu-preview">
            <span class="aside-menu-preview__label">预览</span>
            <div class="aside-menu-preview__scroll"><div class="aside-menu-preview__canvas"><AsideMenuBasicDemo /></div></div>
          </div>
          <DocsCodeBlock language="AsideMenuBasicDemo.vue" :code="basicSource" />
        </section>

        <section id="aside-menu-slots" class="doc-section">
          <h2>自定义区域</h2>
          <p>
            <code>header</code> 和 <code>footer</code> 插槽可放品牌及账户信息；
            <code>collapse</code> 插槽可替换内置按钮，并通过作用域中的
            <code>toggle()</code> 切换状态。组件实例也暴露 <code>toggle()</code>，
            可从侧栏外部控制。
          </p>
          <div class="aside-menu-preview">
            <span class="aside-menu-preview__label">预览</span>
            <div class="aside-menu-preview__scroll"><div class="aside-menu-preview__canvas"><AsideMenuSlotsDemo /></div></div>
          </div>
          <DocsCodeBlock language="AsideMenuSlotsDemo.vue" :code="slotsSource" />
        </section>

        <section id="aside-menu-style" class="doc-section">
          <h2>样式风格</h2>
          <p>
            <code>theme</code> 可部分覆盖背景、文字、激活态、悬停态和分隔线颜色。
            折叠后子菜单弹层会获得同一实例的主题变量；传入的
            <code>popperClass</code> 与 <code>popperStyle</code> 也会保留。
            内置折叠按钮默认使用白色，浅色主题可覆盖按钮颜色或使用 <code>collapse</code> 插槽。
            切换下面的主题并折叠侧栏，可查看弹层配色。
          </p>
          <div class="aside-menu-preview">
            <span class="aside-menu-preview__label">预览</span>
            <div class="aside-menu-preview__scroll"><div class="aside-menu-preview__canvas"><AsideMenuThemeDemo /></div></div>
          </div>
          <DocsCodeBlock language="AsideMenuThemeDemo.vue" :code="themeSource" />
        </section>

        <section id="aside-menu-behavior" class="doc-section">
          <h2>交互与路由</h2>
          <p>
            <code>mode</code> 固定为 <code>vertical</code>；<code>collapse</code> 会同步作用于
            <code>ElAside</code> 宽度与 <code>ElMenu</code> 折叠状态。传入
            <code>router</code> 时，需在消费项目安装并配置 Vue Router；若仅根据菜单选择更新页面，
            监听 <code>select</code> 即可。
          </p>
          <p>
            未声明的属性会绑定在外层 <code>ElAside</code>，菜单相关 Props 会传给内部
            <code>ElMenu</code>。菜单的更多交互细节参阅
            <a href="https://element-plus.org/zh-CN/component/menu.html" target="_blank" rel="noopener noreferrer">Element Plus Menu 文档</a>。
          </p>
        </section>

        <section id="aside-menu-api" class="doc-section">
          <h2>API</h2>

          <h3 id="aside-menu-props">Props</h3>
          <p>
            <code>GaAsideMenuProps</code> 在 Element Plus Menu Props 基础上增加侧栏宽度与主题；
            <code>mode</code> 由组件固定，不能传入。
          </p>
          <DocsApiTable :headers="['属性', '类型', '默认值', '说明']" :rows="propsRows" />

          <h3 id="aside-menu-events">Events</h3>
          <DocsApiTable :headers="['事件', '参数', '说明']" :rows="eventsRows" />

          <h3 id="aside-menu-slots-api">Slots</h3>
          <DocsApiTable :headers="['插槽', '作用域', '说明']" :rows="slotsRows" />

          <h3 id="aside-menu-expose">Expose</h3>
          <DocsApiTable :headers="['属性 / 方法', '类型', '说明']" :rows="exposeRows" />

          <h3 id="aside-menu-theme">GaAsideMenuTheme</h3>
          <p>未传入的字段沿用默认主题。<code>backgroundColor</code> 与 <code>activeBackgroundColor</code> 支持 CSS 渐变；其余字段应使用颜色值。</p>
          <DocsApiTable :headers="['字段', '默认值', '说明']" :rows="themeRows" />
        </section>
      </article>

      <aside class="aside-menu-toc" aria-label="本页目录">
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
import AsideMenuBasicDemo from './AsideMenuBasicDemo.vue'
import basicSource from './AsideMenuBasicDemo.vue?raw'
import AsideMenuSlotsDemo from './AsideMenuSlotsDemo.vue'
import slotsSource from './AsideMenuSlotsDemo.vue?raw'
import AsideMenuThemeDemo from './AsideMenuThemeDemo.vue'
import themeSource from './AsideMenuThemeDemo.vue?raw'
import { eventsRows, exposeRows, propsRows, slotsRows, themeRows } from './AsideMenuApi'

const route = useRoute()
const importCode = `import { GaAsideMenu } from 'ga-ui-plus/business'
import { ElIcon, ElMenuItem, ElSubMenu } from 'element-plus'`

const tocItems = [
  { id: 'aside-menu-usage', title: '如何使用' },
  { id: 'aside-menu-basic', title: '基础导航' },
  { id: 'aside-menu-slots', title: '自定义区域' },
  { id: 'aside-menu-style', title: '样式风格' },
  { id: 'aside-menu-behavior', title: '交互与路由' },
  { id: 'aside-menu-props', title: 'Props' },
  { id: 'aside-menu-events', title: 'Events' },
  { id: 'aside-menu-slots-api', title: 'Slots' },
  { id: 'aside-menu-expose', title: 'Expose' },
  { id: 'aside-menu-theme', title: 'GaAsideMenuTheme' },
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
.aside-menu-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 170px;
  gap: 60px;
  margin-top: 48px;
}

.aside-menu-content { min-width: 0; }

.aside-menu-page .doc-section h3 {
  margin: 36px 0 18px;
  color: #303133;
  font-size: 18px;
  scroll-margin-top: 24px;
}

.aside-menu-page .doc-section a { color: var(--docs-primary); text-decoration: none; }
.aside-menu-page .doc-section a:hover { text-decoration: underline; }

.aside-menu-preview {
  margin-top: 22px;
  padding: 20px 24px 24px;
  border: 1px solid var(--docs-border);
  border-radius: 6px;
}

.aside-menu-preview__label {
  display: block;
  margin-bottom: 20px;
  color: #909399;
  font-size: 12px;
}

.aside-menu-preview__scroll { overflow-x: auto; }
.aside-menu-preview__canvas { min-width: 560px; }

.aside-menu-toc {
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

.aside-menu-toc > span { color: #909399; font-size: 12px; font-weight: 700; }
.aside-menu-toc a { color: var(--docs-text-secondary); text-decoration: none; }
.aside-menu-toc a:hover, .aside-menu-toc a.is-active { color: var(--docs-primary); }

@media (max-width: 1000px) {
  .aside-menu-layout { grid-template-columns: minmax(0, 1fr); }
  .aside-menu-toc { display: none; }
}

@media (max-width: 720px) {
  .aside-menu-layout { margin-top: 40px; }
  .aside-menu-preview { padding: 18px 16px 20px; }
}
</style>

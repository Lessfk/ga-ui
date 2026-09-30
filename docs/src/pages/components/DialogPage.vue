<template>
  <div class="doc-page dialog-page">
    <header class="doc-intro">
      <p class="doc-eyebrow">基础组件 / Dialog 对话框</p>
      <h1>Dialog 对话框</h1>
      <p class="doc-lead">
        <code>GaDialog</code> 基于 Element Plus Dialog，提供默认的全屏与关闭操作。
        使用 <code>v-model</code> 控制显隐，业务内容和底部按钮由插槽提供。
      </p>
    </header>

    <div class="dialog-layout">
      <article class="dialog-content">
        <section id="dialog-usage" class="doc-section">
          <h2>如何使用</h2>
          <p>
            安装并配置样式后，从 <code>ga-ui-plus/base</code> 导入组件。
            如果项目使用 <code>GaUiResolver</code> 自动解析模板组件，可以直接在模板中使用
            <code>&lt;GaDialog /&gt;</code>；手动导入时请按
            <RouterLink to="/guide/usage">接入指南</RouterLink>配置样式。
          </p>
          <DocsCodeBlock language="Vue" :code="importCode" />
          <p>
            对话框关闭了 Element Plus 的原生关闭按钮，默认标题栏提供全屏和关闭操作。
            <code>footer</code> 不内置确认、取消等业务按钮。
          </p>
        </section>

        <section id="dialog-basic" class="doc-section">
          <h2>基础用法</h2>
          <p>
            通过 <code>v-model</code> 控制显隐，<code>title</code> 和 <code>width</code>
            设置标题与宽度。示例使用 <code>footer</code> 插槽处理取消和保存。
          </p>
          <div class="dialog-preview">
            <span class="dialog-preview__label">预览</span>
            <DialogBasicDemo />
          </div>
          <DocsCodeBlock language="DialogBasicDemo.vue" :code="basicSource" />
        </section>

        <section id="dialog-fullscreen" class="doc-section">
          <h2>全屏切换</h2>
          <p>
            默认标题栏会显示全屏按钮。组件可以自行维护全屏状态；需要读取或控制状态时，
            使用 <code>v-model:fullscreen</code>。传入 <code>:show-fullscreen="false"</code>
            可隐藏按钮。
          </p>
          <div class="dialog-preview">
            <span class="dialog-preview__label">预览</span>
            <DialogFullscreenDemo />
          </div>
          <DocsCodeBlock language="DialogFullscreenDemo.vue" :code="fullscreenSource" />
        </section>

        <section id="dialog-custom" class="doc-section">
          <h2>自定义标题与关闭确认</h2>
          <p>
            <code>header</code> 插槽会完整替换默认标题栏。作用域提供
            <code>close</code>、<code>titleId</code>、<code>titleClass</code>；
            自定义标题应保留后两者，让对话框继续关联到标题。
          </p>
          <p>
            示例通过 <code>beforeClose(done)</code> 确认关闭。标题栏的
            <code>close()</code> 和底部通过 <code>dialogRef.handleClose()</code>
            发起的关闭会执行它。
          </p>
          <div class="dialog-preview">
            <span class="dialog-preview__label">预览</span>
            <DialogCustomDemo />
          </div>
          <DocsCodeBlock language="DialogCustomDemo.vue" :code="customSource" />
        </section>

        <section id="dialog-behavior" class="doc-section">
          <h2>关闭行为与属性透传</h2>
          <p>
            默认情况下，点击遮罩和按 Escape 不会关闭对话框。分别设置
            <code>close-on-click-modal</code> 和 <code>close-on-press-escape</code>
            为 <code>true</code> 后，这两种关闭请求也会进入 Element Plus 的
            <code>beforeClose</code> 流程。
          </p>
          <p>
            直接把 <code>v-model</code> 设为 <code>false</code> 是外部状态同步，
            不会执行 <code>beforeClose</code>。需要在业务按钮上做关闭确认时，
            请调用 <code>dialogRef.handleClose()</code>。
          </p>
          <p>
            未声明的属性和监听器会透传给内部 <code>ElDialog</code>，例如
            <code>lock-scroll</code>、<code>modal-class</code>。更多底层能力参见
            <a href="https://element-plus.org/zh-CN/component/dialog.html" target="_blank" rel="noopener noreferrer">Element Plus Dialog 文档</a>。
          </p>
        </section>

        <section id="dialog-api" class="doc-section">
          <h2>API</h2>
          <p>
            <code>GaDialogProps</code> 仅声明下表中的属性；其余受 Element Plus Dialog
            支持的属性可通过 <code>$attrs</code> 透传。
          </p>

          <h3 id="dialog-props">Props</h3>
          <DocsApiTable :headers="['属性', '类型', '默认值', '说明']" :rows="propsRows" />

          <h3 id="dialog-events">Events</h3>
          <DocsApiTable :headers="['事件', '参数', '说明']" :rows="eventsRows" />

          <h3 id="dialog-slots">Slots</h3>
          <DocsApiTable :headers="['插槽', '作用域', '说明']" :rows="slotsRows" />

          <h3 id="dialog-expose">Expose</h3>
          <DocsApiTable :headers="['名称', '类型', '说明']" :rows="exposeRows" />
        </section>
      </article>

      <aside class="dialog-toc" aria-label="本页目录">
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
import DialogBasicDemo from './DialogBasicDemo.vue'
import basicSource from './DialogBasicDemo.vue?raw'
import DialogCustomDemo from './DialogCustomDemo.vue'
import customSource from './DialogCustomDemo.vue?raw'
import DialogFullscreenDemo from './DialogFullscreenDemo.vue'
import fullscreenSource from './DialogFullscreenDemo.vue?raw'

const route = useRoute()

const tocItems = [
  { id: 'dialog-usage', title: '如何使用' },
  { id: 'dialog-basic', title: '基础用法' },
  { id: 'dialog-fullscreen', title: '全屏切换' },
  { id: 'dialog-custom', title: '自定义标题' },
  { id: 'dialog-behavior', title: '关闭行为' },
  { id: 'dialog-props', title: 'Props' },
  { id: 'dialog-events', title: 'Events' },
  { id: 'dialog-slots', title: 'Slots' },
  { id: 'dialog-expose', title: 'Expose' },
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

const importCode = `import { GaDialog } from 'ga-ui-plus/base'`

const propsRows = [
  ['modelValue', 'boolean', 'false', '是否显示对话框；支持 v-model'],
  ['title', 'string', "''", '默认标题栏中的标题'],
  ['width', 'string | number', 'Element Plus 默认（50%）', '对话框宽度'],
  ['top', 'string', 'Element Plus 默认（15vh）', '顶部距离；alignCenter=false 时生效'],
  ['fullscreen', 'boolean', 'false', '是否全屏；支持 v-model:fullscreen'],
  ['showFullscreen', 'boolean', 'true', '是否显示默认标题栏的全屏按钮'],
  ['appendToBody', 'boolean', 'true', '是否将对话框挂载到 body'],
  ['destroyOnClose', 'boolean', 'true', '关闭时销毁插槽内容'],
  ['center', 'boolean', 'false', '是否让标题和底部区域居中'],
  ['alignCenter', 'boolean', 'true', '是否让对话框在视口中居中'],
  ['draggable', 'boolean', 'true', '是否允许拖动'],
  ['showClose', 'boolean', 'true', '是否显示默认标题栏的关闭按钮'],
  ['closeOnClickModal', 'boolean', 'false', '是否允许点击遮罩关闭'],
  ['closeOnPressEscape', 'boolean', 'false', '是否允许按 Escape 关闭'],
  ['beforeClose', 'DialogBeforeCloseFn', 'undefined', '关闭请求执行前的回调；调用 done() 才会关闭'],
]

const eventsRows = [
  ['update:modelValue', '(value: boolean)', '显隐状态变化，用于 v-model'],
  ['update:fullscreen', '(value: boolean)', '全屏状态变化，用于 v-model:fullscreen'],
  ['open', '—', '开始打开'],
  ['opened', '—', '打开动画结束'],
  ['close', '—', '开始关闭'],
  ['closed', '—', '关闭动画结束'],
  ['open-auto-focus', '—', '打开后完成自动聚焦'],
  ['close-auto-focus', '—', '关闭后恢复聚焦'],
]

const slotsRows = [
  ['default', '—', '对话框主体内容'],
  ['header', '{ close, titleId, titleClass }', '完整替换默认标题栏；需要自行提供操作按钮'],
  ['footer', '—', '自定义底部内容；组件不提供默认业务按钮'],
]

const exposeRows = [
  ['dialogRef', 'DialogInstance | undefined', '底层 ElDialog 实例；可调用 handleClose()、resetPosition() 等方法'],
]
</script>

<style scoped>
.dialog-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 170px;
  gap: 60px;
  margin-top: 48px;
}

.dialog-content {
  min-width: 0;
}

.dialog-page .doc-section h3 {
  margin: 36px 0 18px;
  color: #303133;
  font-size: 18px;
  scroll-margin-top: 24px;
}

.dialog-page .doc-section a {
  color: var(--docs-primary);
  text-decoration: none;
}

.dialog-page .doc-section a:hover {
  text-decoration: underline;
}

.dialog-preview {
  min-height: 132px;
  margin-top: 22px;
  padding: 20px 24px 28px;
  border: 1px solid var(--docs-border);
  border-radius: 6px;
}

.dialog-preview__label {
  display: block;
  margin-bottom: 22px;
  color: #909399;
  font-size: 12px;
}

.dialog-toc {
  position: sticky;
  top: 36px;
  display: flex;
  height: max-content;
  flex-direction: column;
  gap: 16px;
  padding-left: 18px;
  border-left: 1px solid var(--docs-border);
  font-size: 13px;
}

.dialog-toc > span {
  color: #909399;
  font-size: 12px;
  font-weight: 700;
}

.dialog-toc a {
  color: var(--docs-text-secondary);
  text-decoration: none;
}

.dialog-toc a:hover,
.dialog-toc a.is-active {
  color: var(--docs-primary);
}

@media (max-width: 1000px) {
  .dialog-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .dialog-toc {
    display: none;
  }
}

@media (max-width: 720px) {
  .dialog-layout {
    margin-top: 40px;
  }

  .dialog-preview {
    padding: 18px 16px 24px;
  }
}
</style>

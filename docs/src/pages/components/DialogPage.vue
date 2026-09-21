<template>
  <div class="doc-page">
    <h1>Dialog 对话框</h1>
    <p class="doc-lead">
      <code>GaDialog</code> 是一个由 <code>v-model</code> 控制的 <code>ElDialog</code> 包装器。
      组件关闭了 Element Plus 原生关闭按钮，并在默认标题栏中渲染自己的全屏/还原按钮和关闭按钮；
      确认、取消等 footer 业务按钮由使用方提供。从 <code>ga-ui-plus/base</code> 导入。
    </p>

    <h2>基础用法</h2>
    <p>通过 <code>v-model</code> 控制显隐，<code>title</code>、<code>width</code> 配置标题与宽度，<code>footer</code> 插槽放置业务按钮。</p>
    <DemoBlock :source="basicSource">
      <BasicDemo />
    </DemoBlock>

    <h2>全屏切换</h2>
    <p>
      默认标题栏会显示全屏/还原按钮，无需绑定即可使用，组件会在内部维护全屏状态；
      需要读取或主动控制该状态时，使用 <code>v-model:fullscreen</code>。
      传 <code>:show-fullscreen="false"</code> 可隐藏全屏按钮。
    </p>
    <DemoBlock :source="fullscreenSource">
      <FullscreenDemo />
    </DemoBlock>

    <h2>自定义标题和底部操作</h2>
    <p>
      <code>header</code> 插槽提供 <code>close</code>、<code>titleId</code> 和 <code>titleClass</code>。
      使用 <code>titleId</code> 与 <code>titleClass</code> 可保留 Element Plus 为标题建立的可访问性关联。
      传入 <code>header</code> 插槽后，默认标题栏会被完整替换，默认的全屏按钮和关闭按钮也不会渲染，
      需要由使用方自行提供。
    </p>
    <DemoBlock :source="customHeaderSource">
      <CustomHeaderDemo />
    </DemoBlock>

    <h2>关闭行为与属性透传</h2>
    <p>
      <code>GaDialog</code> 将未声明的 <code>$attrs</code> 绑定到内部 <code>ElDialog</code>，因此可以继续使用
      <code>lock-scroll</code>、<code>modal-class</code> 等 Element Plus 属性，<code>before-close</code>
      也会原样传给 Element Plus。
    </p>
    <ul>
      <li>默认标题栏中的关闭按钮、<code>header</code> 插槽作用域中的 <code>close()</code>、暴露实例的 <code>dialogRef.handleClose()</code>、点击遮罩和按 Escape 都会进入 Element Plus 的关闭流程，因此会执行 <code>beforeClose(done)</code>。</li>
      <li>直接将 <code>v-model</code> 修改为 <code>false</code> 属于外部状态同步，不会执行 <code>beforeClose</code>；需要在业务按钮中触发关闭确认时，请调用 <code>dialogRef.handleClose()</code>。</li>
    </ul>

    <h2>API</h2>

    <h3>Props</h3>
    <p>
      <code>GaDialogProps</code> 只声明下表中的常用属性，不表示继承完整的 Element Plus DialogProps；
      其他受底层支持的属性可以通过 <code>$attrs</code> 透传。
    </p>
    <ApiTable :headers="['属性名', '说明', '类型', '默认值']" :rows="propsRows" />

    <h3>Events</h3>
    <ApiTable :headers="['事件名', '说明', '回调参数']" :rows="eventsRows" />

    <h3>Slots</h3>
    <ApiTable :headers="['插槽名', '说明', '作用域']" :rows="slotsRows" />

    <h3>Exposes</h3>
    <ApiTable :headers="['名称', '说明', '类型']" :rows="exposesRows" />

    <p>
      更多底层行为与透传属性请参见
      <a href="https://element-plus.org/zh-CN/component/dialog.html" target="_blank" rel="noreferrer">Element Plus Dialog 文档</a>。
    </p>
  </div>
</template>

<script setup lang="ts">
import ApiTable from '../../components/ApiTable.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import BasicDemo from '../../demos/dialog/BasicDemo.vue'
import basicSource from '../../demos/dialog/BasicDemo.vue?raw'
import CustomHeaderDemo from '../../demos/dialog/CustomHeaderDemo.vue'
import customHeaderSource from '../../demos/dialog/CustomHeaderDemo.vue?raw'
import FullscreenDemo from '../../demos/dialog/FullscreenDemo.vue'
import fullscreenSource from '../../demos/dialog/FullscreenDemo.vue?raw'

const propsRows = [
  ['modelValue', '对话框是否可见；支持 v-model', 'boolean', 'false'],
  ['title', '对话框标题', 'string', "''"],
  ['width', '对话框宽度', 'string | number', 'Element Plus 默认（50%）'],
  ['top', '对话框上边距', 'string', 'Element Plus 默认（15vh）'],
  ['fullscreen', '是否全屏显示；支持 v-model:fullscreen', 'boolean', 'false'],
  ['showFullscreen', '是否显示右上角全屏/还原按钮', 'boolean', 'true'],
  ['appendToBody', '是否将对话框挂载到 body', 'boolean', 'true'],
  ['destroyOnClose', '关闭时是否销毁插槽内容', 'boolean', 'true'],
  ['center', '是否让标题和底部区域居中', 'boolean', 'false'],
  ['alignCenter', '是否让对话框水平、垂直居中', 'boolean', 'true'],
  ['draggable', '是否允许拖动对话框', 'boolean', 'true'],
  ['showClose', '是否显示默认标题栏中的自定义关闭按钮；底层原生关闭按钮始终关闭', 'boolean', 'true'],
  ['closeOnClickModal', '是否允许点击遮罩关闭', 'boolean', 'false'],
  ['closeOnPressEscape', '是否允许按 Escape 关闭', 'boolean', 'false'],
  ['beforeClose', '传给底层 Element Plus 的关闭前回调；默认关闭按钮会触发，直接修改 v-model 不触发', 'DialogBeforeCloseFn', '—'],
]

const eventsRows = [
  ['update:modelValue', '底层模型变化时触发；用于 v-model', '(value: boolean)'],
  ['update:fullscreen', '点击全屏/还原按钮，或关闭时恢复内部全屏状态；用于 v-model:fullscreen', '(value: boolean)'],
  ['open', '对话框开始打开', '—'],
  ['opened', '对话框打开动画结束', '—'],
  ['close', '对话框开始关闭', '—'],
  ['closed', '底层关闭动画结束后触发', '—'],
  ['open-auto-focus', '打开后完成自动聚焦', '—'],
  ['close-auto-focus', '关闭后完成自动聚焦恢复', '—'],
]

const slotsRows = [
  ['default', '对话框主体内容', '—'],
  ['header', '完整替换默认标题栏；可调用 close() 并复用标题的可访问性属性，但需要自行提供全屏与关闭操作', '{ close, titleId, titleClass }'],
  ['footer', '自定义底部内容；组件不提供默认确认、取消等 footer 业务按钮', '—'],
]

const exposesRows = [
  ['dialogRef', '底层 ElDialog 实例，挂载后可调用 handleClose()、resetPosition() 等方法', 'DialogInstance | undefined'],
]
</script>

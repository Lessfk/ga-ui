<template>
  <div class="doc-page">
    <h1>Pagination 分页</h1>
    <p class="doc-lead">
      <code>GaPagination</code> 封装 Element Plus 的 <code>ElPagination</code>，增加
      <code>position</code> 对齐属性，并显式支持当前页与页大小的双向绑定。从
      <code>ga-ui-plus/base</code> 导入。
    </p>

    <h2>基础用法</h2>
    <p>
      通过 <code>v-model:current-page</code>、<code>v-model:page-size</code> 双向绑定分页模型，
      <code>total</code> 设置总条目数。
    </p>
    <DemoBlock :source="basicSource">
      <BasicDemo />
    </DemoBlock>

    <h2>对齐方式</h2>
    <p><code>position</code> 接受 <code>left</code>、<code>center</code>、<code>right</code>，默认值为 <code>right</code>。</p>
    <DemoBlock :source="positionSource">
      <PositionDemo />
    </DemoBlock>

    <h2>颜色主题</h2>
    <p>
      <code>theme</code> 用于配置当前分页实例的颜色，支持部分覆盖；配置会同时作用于普通模式和
      <code>background</code> 模式。背景类字段支持普通颜色、CSS 变量和渐变等合法的 CSS
      <code>background</code> 值。
    </p>
    <DemoBlock :source="themeSource">
      <ThemeDemo />
    </DemoBlock>

    <h2>API</h2>

    <h3>Props</h3>
    <p>
      未声明的属性与监听器经 <code>$attrs</code> 透传到底层 <code>ElPagination</code>，例如
      <code>hide-on-single-page</code>。
    </p>
    <ApiTable :headers="['属性名', '说明', '类型', '默认值']" :rows="propsRows" />

    <h3>Events</h3>
    <ApiTable :headers="['事件名', '说明', '回调参数']" :rows="eventsRows" />

    <h2>样式配置</h2>
    <p><code>GaPaginationTheme</code> 支持以下字段，均可部分覆盖：</p>
    <ApiTable :headers="['字段', '说明']" :rows="themeRows" />

    <p>
      更多低频能力参见
      <a href="https://element-plus.org/zh-CN/component/pagination.html" target="_blank" rel="noreferrer">Element Plus Pagination 文档</a>。
    </p>
  </div>
</template>

<script setup lang="ts">
import ApiTable from '../../components/ApiTable.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import BasicDemo from '../../demos/pagination/BasicDemo.vue'
import basicSource from '../../demos/pagination/BasicDemo.vue?raw'
import PositionDemo from '../../demos/pagination/PositionDemo.vue'
import positionSource from '../../demos/pagination/PositionDemo.vue?raw'
import ThemeDemo from '../../demos/pagination/ThemeDemo.vue'
import themeSource from '../../demos/pagination/ThemeDemo.vue?raw'

const propsRows = [
  ['currentPage', '当前页，支持 v-model:current-page', 'number', '1'],
  ['pageSize', '每页条数，支持 v-model:page-size', 'number', '10'],
  ['total', '总条目数', 'number', '0'],
  ['pageSizes', '可选的每页条数', 'number[]', '[10, 20, 30, 40, 50]'],
  ['size', '分页尺寸', 'ComponentSize', "'default'"],
  ['layout', '分页布局', 'string', "'total, sizes, prev, pager, next, jumper'"],
  ['background', '是否为分页按钮添加背景', 'boolean', 'false'],
  ['disabled', '是否禁用分页交互', 'boolean', 'false'],
  ['position', '水平对齐方式', "'left' | 'center' | 'right'", "'right'"],
  ['theme', '当前分页实例的颜色配置，支持部分覆盖', 'GaPaginationTheme', '默认颜色主题'],
]

const eventsRows = [
  ['update:current-page', '当前页变化；用于 v-model:current-page', '(currentPage: number)'],
  ['update:page-size', '每页条数变化；用于 v-model:page-size', '(pageSize: number)'],
  ['current-change', '底层分页当前页变化后同步触发', '(currentPage: number)'],
  ['size-change', '底层分页每页条数变化后同步触发', '(pageSize: number)'],
]

const themeRows = [
  ['backgroundColor', "整个分页容器背景，默认 '#EEEEEF'；组合组件可通过 paginationTheme 覆盖"],
  ['textColor', '总数、每页数量和跳转说明文字颜色'],
  ['buttonColor', '普通分页按钮和页码文字颜色'],
  ['buttonBackgroundColor', '普通分页按钮和页码背景色'],
  ['activeColor', '当前页文字颜色'],
  ['activeBackgroundColor', '当前页背景色'],
  ['hoverColor', '可交互分页项悬停文字颜色'],
  ['hoverBackgroundColor', '可交互分页项悬停背景色'],
  ['disabledColor', '禁用分页项文字颜色'],
  ['disabledBackgroundColor', '禁用分页项背景色'],
]
</script>

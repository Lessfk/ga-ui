import { mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import GaPagination from '../index.vue'

const paginationStyles = readFileSync(
  'src/base/components/pagination/style/index.scss',
  'utf8',
)

const ElPaginationStub = defineComponent({
  name: 'ElPagination',
  inheritAttrs: false,
  props: {
    currentPage: Number,
    pageSize: Number,
    total: Number,
    pageSizes: Array,
    size: String,
    layout: String,
    background: Boolean,
    theme: Object,
  },
  emits: ['current-change', 'size-change'],
  setup(_, { attrs }) {
    return () =>
      h('div', {
        ...attrs,
        class: ['el-pagination-stub', attrs.class],
      })
  },
})

function mountPagination(options: Parameters<typeof mount>[1] = {}) {
  return mount(GaPagination, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ElPagination: ElPaginationStub,
        ...options.global?.stubs,
      },
    },
  })
}

describe('GaPagination', () => {
  it('applies the complete default color theme', () => {
    const wrapper = mountPagination()
    const pagination = wrapper.get('.el-pagination-stub')

    const style = pagination.attributes('style') ?? ''

    expect(style).toContain(
      '--ga-pagination-text-color: #606266',
    )
    expect(style).toContain(
      '--ga-pagination-background: #EEEEEF',
    )
    expect(style).toContain(
      '--el-pagination-button-color: #7A7475',
    )
    expect(style).toContain(
      '--el-pagination-bg-color: #ffffff',
    )
    expect(style).toContain(
      '--el-pagination-button-bg-color: #ffffff',
    )
    expect(style).toContain(
      '--ga-pagination-active-color: #ffffff',
    )
    expect(style).toContain(
      '--ga-pagination-active-bg-color: #4F7DB2',
    )
    expect(style).toContain(
      '--el-pagination-hover-color: #ffffff',
    )
    expect(style).toContain(
      '--ga-pagination-hover-bg-color: #4f7db299',
    )
    expect(style).toContain(
      '--el-pagination-button-disabled-color: #606266',
    )
    expect(style).toContain(
      '--el-pagination-button-disabled-bg-color: #fafafa',
    )
  })

  it('merges a partial theme, reacts to updates, and preserves consumer styles', async () => {
    const wrapper = mountPagination({
      props: {
        theme: {
          backgroundColor: '#f5f7fa',
          activeColor: '#ffffff',
          activeBackgroundColor: '#409eff',
        },
      },
      attrs: {
        style: {
          width: '75%',
        },
      },
    })
    const pagination = wrapper.get('.el-pagination-stub')

    expect(pagination.attributes('style')).toContain(
      '--ga-pagination-background: #f5f7fa',
    )
    expect(pagination.attributes('style')).toContain(
      '--ga-pagination-active-color: #ffffff',
    )
    expect(pagination.attributes('style')).toContain(
      '--ga-pagination-active-bg-color: #409eff',
    )
    expect(pagination.attributes('style')).toContain(
      '--el-pagination-button-color: #7A7475',
    )
    expect(pagination.attributes('style')).toContain('width: 75%')
    expect(wrapper.findComponent(ElPaginationStub).props('theme')).toBeUndefined()

    await wrapper.setProps({
      theme: {
        activeBackgroundColor: '#67c23a',
      },
    })

    expect(pagination.attributes('style')).toContain(
      '--ga-pagination-active-bg-color: #67c23a',
    )
    expect(pagination.attributes('style')).toContain(
      '--ga-pagination-active-color: #ffffff',
    )
  })

  it('uses pagination disabled variables in background mode', () => {
    expect(paginationStyles).toMatch(
      /\.el-pagination\.ga-pagination\.is-background[\s\S]*\.btn-prev:disabled[\s\S]*color:\s*var\(--el-pagination-button-disabled-color\)[\s\S]*background:\s*var\(--el-pagination-button-disabled-bg-color\)/,
    )
  })

  it('uses theme variables for the container, text, buttons, active, and hover states', () => {
    expect(paginationStyles).toContain(
      'background: var(--ga-pagination-background)',
    )
    expect(paginationStyles).toContain(
      'color: var(--ga-pagination-text-color)',
    )
    expect(paginationStyles).toContain(
      '.el-pagination__editor.el-input:not(.is-disabled) .el-input__inner',
    )
    expect(paginationStyles).toContain(
      'background: var(--el-pagination-button-bg-color)',
    )
    expect(paginationStyles).toContain(
      'color: var(--ga-pagination-active-color)',
    )
    expect(paginationStyles).toContain(
      'background: var(--ga-pagination-active-bg-color)',
    )
    expect(paginationStyles).toContain(
      'background: var(--ga-pagination-hover-bg-color)',
    )
  })

  it('passes the approved defaults to ElPagination', () => {
    const wrapper = mountPagination()

    expect(wrapper.findComponent(ElPaginationStub).props()).toMatchObject({
      currentPage: 1,
      pageSize: 10,
      total: 100,
      pageSizes: [10, 20, 30, 40, 50],
      size: 'default',
      background: false,
      layout: 'total, sizes, prev, pager, next, jumper',
    })
  })

  it('lets consumers override the default pagination props', () => {
    const wrapper = mountPagination({
      props: {
        currentPage: 3,
        pageSize: 20,
        total: 86,
        pageSizes: [20, 40],
        size: 'small',
        background: false,
        layout: 'prev, pager, next',
      },
    })

    expect(wrapper.findComponent(ElPaginationStub).props()).toMatchObject({
      currentPage: 3,
      pageSize: 20,
      total: 86,
      pageSizes: [20, 40],
      size: 'small',
      background: false,
      layout: 'prev, pager, next',
    })
  })

  it('forwards disabled and hide-on-single-page attributes to ElPagination', () => {
    const wrapper = mountPagination({
      attrs: {
        disabled: true,
        'hide-on-single-page': true,
      },
    })

    const pagination = wrapper.find('.el-pagination-stub')

    expect(pagination.attributes('disabled')).toBe('true')
    expect(pagination.attributes('hide-on-single-page')).toBe('true')
  })

  it('emits v-model and current-change events when ElPagination changes page', () => {
    const wrapper = mountPagination()

    wrapper.findComponent(ElPaginationStub).vm.$emit('current-change', 4)

    expect(wrapper.emitted('update:current-page')).toEqual([[4]])
    expect(wrapper.emitted('current-change')).toEqual([[4]])
  })

  it('emits v-model and size-change events when ElPagination changes page size', () => {
    const wrapper = mountPagination()

    wrapper.findComponent(ElPaginationStub).vm.$emit('size-change', 30)

    expect(wrapper.emitted('update:page-size')).toEqual([[30]])
    expect(wrapper.emitted('size-change')).toEqual([[30]])
  })
})

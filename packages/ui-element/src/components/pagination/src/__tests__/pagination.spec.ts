import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import GaPagination from '../index.vue'

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
  it('passes the approved defaults to ElPagination', () => {
    const wrapper = mountPagination()

    expect(wrapper.findComponent(ElPaginationStub).props()).toMatchObject({
      currentPage: 1,
      pageSize: 10,
      total: 100,
      pageSizes: [10, 20, 30, 40, 50],
      size: 'default',
      background: true,
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

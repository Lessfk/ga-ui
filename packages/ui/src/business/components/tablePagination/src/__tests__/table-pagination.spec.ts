import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import GaTablePagination from '../index.vue'

const GaTableStub = defineComponent({
  name: 'GaTable',
  inheritAttrs: false,
  props: {
    data: Array,
    columns: Array,
    height: [String, Number],
    rowKey: [String, Function],
    border: {
      type: Boolean,
      default: undefined,
    },
    stripe: {
      type: Boolean,
      default: undefined,
    },
    size: String,
    fit: {
      type: Boolean,
      default: undefined,
    },
    showHeader: {
      type: Boolean,
      default: undefined,
    },
    highlightCurrentRow: {
      type: Boolean,
      default: undefined,
    },
    emptyText: String,
    loading: {
      type: Boolean,
      default: undefined,
    },
    loadingText: String,
  },
  setup(_, { attrs, slots }) {
    return () => h(
      'div',
      {
        ...attrs,
        class: ['ga-table-stub', attrs.class],
      },
      Object.entries(slots).flatMap(([name, slot]) =>
        slot?.({
          row: { status: 'enabled' },
          $index: 0,
          slotName: name,
        }) ?? [],
      ),
    )
  },
})

const GaPaginationStub = defineComponent({
  name: 'GaPagination',
  inheritAttrs: false,
  props: {
    currentPage: Number,
    pageSize: Number,
    total: Number,
    pageSizes: Array,
    size: String,
    layout: String,
    background: {
      type: Boolean,
      default: undefined,
    },
  },
  emits: ['current-change', 'size-change'],
  setup(_, { attrs }) {
    return () => h('div', {
      ...attrs,
      class: ['ga-pagination-stub', attrs.class],
    })
  },
})

function mountComposite(options: Parameters<typeof mount>[1] = {}) {
  return mount(GaTablePagination, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        GaTable: GaTableStub,
        GaPagination: GaPaginationStub,
        ...options.global?.stubs,
      },
    },
  })
}

describe('GaTablePagination', () => {
  it('routes flat table and pagination props to the correct child', () => {
    const data = [{ id: 1 }]
    const columns = [{ key: 'id', prop: 'id' }]
    const rowKey = (row: { id: number }) => String(row.id)
    const wrapper = mountComposite({
      props: {
        data,
        columns,
        rowKey,
        border: false,
        stripe: false,
        fit: false,
        showHeader: false,
        highlightCurrentRow: true,
        emptyText: 'No rows',
        loading: true,
        loadingText: 'Loading rows',
        currentPage: 2,
        pageSize: 20,
        total: 86,
        pageSizes: [10, 20, 40],
        layout: 'prev, pager, next',
        background: false,
      },
    })

    const table = wrapper.findComponent(GaTableStub)
    const pagination = wrapper.findComponent(GaPaginationStub)

    expect(wrapper.findAllComponents(GaTableStub)).toHaveLength(1)
    expect(wrapper.findAllComponents(GaPaginationStub)).toHaveLength(1)
    expect(table.props()).toMatchObject({
      data,
      columns,
      rowKey,
      border: false,
      stripe: false,
      fit: false,
      showHeader: false,
      highlightCurrentRow: true,
      emptyText: 'No rows',
      loading: true,
      loadingText: 'Loading rows',
      height: '100%',
    })
    expect(pagination.props()).toMatchObject({
      currentPage: 2,
      pageSize: 20,
      total: 86,
      pageSizes: [10, 20, 40],
      layout: 'prev, pager, next',
      background: false,
    })
    expect(table.attributes()).not.toHaveProperty('total')
    expect(table.attributes()).not.toHaveProperty('layout')
    expect(pagination.attributes()).not.toHaveProperty('data')
    expect(pagination.attributes()).not.toHaveProperty('columns')

    for (const attrName of [
      'currentPage',
      'current-page',
      'pageSize',
      'page-size',
      'total',
      'pageSizes',
      'page-sizes',
      'layout',
      'background',
    ]) {
      expect(table.vm.$attrs).not.toHaveProperty(attrName)
    }
    for (const attrName of [
      'data',
      'columns',
      'rowKey',
      'row-key',
      'border',
      'stripe',
      'fit',
      'showHeader',
      'show-header',
      'highlightCurrentRow',
      'highlight-current-row',
      'emptyText',
      'empty-text',
      'loading',
      'loadingText',
      'loading-text',
    ]) {
      expect(pagination.vm.$attrs).not.toHaveProperty(attrName)
    }
  })

  it('preserves child boolean defaults when flat props are omitted', () => {
    const wrapper = mountComposite()

    expect(wrapper.findComponent(GaTableStub).props()).toMatchObject({
      border: true,
      stripe: true,
      fit: true,
      showHeader: true,
      highlightCurrentRow: false,
      loading: false,
    })
    expect(wrapper.findComponent(GaPaginationStub).props('background')).toBe(true)
  })

  it('uses one size prop for both table and pagination', () => {
    const wrapper = mountComposite({
      props: {
        size: 'small',
      },
    })

    expect(wrapper.findComponent(GaTableStub).props('size')).toBe('small')
    expect(wrapper.findComponent(GaPaginationStub).props('size')).toBe('small')
  })

  it('owns the final table height and removes the legacy object props', () => {
    const wrapper = mountComposite({
      attrs: {
        height: 320,
        maxHeight: 500,
      },
    })
    const runtimeProps = (
      GaTablePagination as unknown as {
        props?: Record<string, unknown>
      }
    ).props ?? {}

    expect(wrapper.findComponent(GaTableStub).props('height')).toBe('100%')
    for (const propName of [
      'data',
      'columns',
      'rowKey',
      'border',
      'stripe',
      'size',
      'fit',
      'showHeader',
      'highlightCurrentRow',
      'emptyText',
      'loading',
      'loadingText',
      'currentPage',
      'pageSize',
      'total',
      'pageSizes',
      'layout',
      'background',
    ]) {
      expect(runtimeProps).toHaveProperty(propName)
    }
    expect(runtimeProps).not.toHaveProperty('height')
    expect(runtimeProps).not.toHaveProperty('maxHeight')
    expect(runtimeProps).not.toHaveProperty('tableProps')
    expect(runtimeProps).not.toHaveProperty('paginationProps')
  })

  it('merges consumer class and style onto the root container', () => {
    const wrapper = mountComposite({
      attrs: {
        id: 'users-table',
        'data-testid': 'users-table-pagination',
        'aria-label': 'User table pagination',
        class: 'consumer-table',
        style: {
          width: '75%',
        },
      },
    })
    const root = wrapper.find('.ga-table-pagination')

    expect(root.attributes('id')).toBe('users-table')
    expect(root.attributes('data-testid')).toBe('users-table-pagination')
    expect(root.attributes('aria-label')).toBe('User table pagination')
    expect(root.classes()).toContain('consumer-table')
    expect(root.attributes('style')).toContain('width: 75%')

    for (const child of [
      wrapper.findComponent(GaTableStub),
      wrapper.findComponent(GaPaginationStub),
    ]) {
      expect(child.vm.$attrs).not.toHaveProperty('id')
      expect(child.vm.$attrs).not.toHaveProperty('data-testid')
      expect(child.vm.$attrs).not.toHaveProperty('aria-label')
      expect(child.vm.$attrs).not.toHaveProperty('class')
      expect(child.vm.$attrs).not.toHaveProperty('style')
    }
  })

  it('emits the current-page v-model update and change event', () => {
    const wrapper = mountComposite({
      props: {
        currentPage: 2,
        pageSize: 20,
        total: 86,
      },
    })

    wrapper.findComponent(GaPaginationStub).vm.$emit('current-change', 3)

    expect(wrapper.emitted('update:current-page')).toEqual([[3]])
    expect(wrapper.emitted('current-change')).toEqual([[3]])
    expect(wrapper.emitted('update:page-size')).toBeUndefined()
    expect(wrapper.emitted('size-change')).toBeUndefined()
    expect(wrapper.emitted('update:pagination-props')).toBeUndefined()
  })

  it('emits the page-size v-model update and change event', () => {
    const wrapper = mountComposite({
      props: {
        currentPage: 2,
        pageSize: 20,
        total: 86,
      },
    })

    wrapper.findComponent(GaPaginationStub).vm.$emit('size-change', 40)

    expect(wrapper.emitted('update:page-size')).toEqual([[40]])
    expect(wrapper.emitted('size-change')).toEqual([[40]])
    expect(wrapper.emitted('update:current-page')).toBeUndefined()
    expect(wrapper.emitted('current-change')).toBeUndefined()
    expect(wrapper.emitted('update:pagination-props')).toBeUndefined()
  })

  it('forwards every table slot and its scope', () => {
    const wrapper = mountComposite({
      slots: {
        default: (scope) => h('span', { class: 'slot-default' }, scope.slotName),
        'column-prepend': (scope) => h(
          'span',
          { class: 'slot-column-prepend' },
          scope.slotName,
        ),
        empty: (scope) => h('span', { class: 'slot-empty' }, scope.slotName),
        append: (scope) => h('span', { class: 'slot-append' }, scope.slotName),
        status: (scope) => h(
          'span',
          { class: 'slot-status' },
          `${scope.row.status}:${scope.$index}`,
        ),
      },
    })
    const table = wrapper.findComponent(GaTableStub)

    expect(table.find('.slot-default').text()).toBe('default')
    expect(table.find('.slot-column-prepend').text()).toBe('column-prepend')
    expect(table.find('.slot-empty').text()).toBe('empty')
    expect(table.find('.slot-append').text()).toBe('append')
    expect(table.find('.slot-status').text()).toBe('enabled:0')
  })
})

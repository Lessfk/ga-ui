import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import GaTable from '../index.vue'

const slotRow = {
  name: '张三',
  status: 'enabled',
}

const ElTableStub = defineComponent({
  name: 'ElTable',
  inheritAttrs: false,
  emits: ['selection-change', 'current-change'],
  props: {
    data: Array,
    height: [String, Number],
    maxHeight: [String, Number],
    rowKey: [String, Function],
    border: Boolean,
    stripe: Boolean,
    size: String,
    fit: Boolean,
    showHeader: Boolean,
    highlightCurrentRow: Boolean,
    emptyText: String,
    elementLoadingText: String,
  },
  setup(props, { attrs, slots, expose }) {
    expose({
      clearSelection: () => undefined,
      doLayout: () => undefined,
    })

    return () =>
      h(
        'div',
        {
          ...attrs,
          class: ['el-table-stub', attrs.class],
        },
        [
          h('div', { class: 'table-columns' }, slots.default?.()),
          slots.empty?.(),
          slots.append?.(),
        ],
      )
  },
})

const ElTableColumnStub = defineComponent({
  name: 'ElTableColumn',
  props: {
    prop: String,
    label: String,
    type: String,
    width: [String, Number],
  },
  setup(props, { slots }) {
    return () => {
      const slotContent = slots.default?.({
        row: slotRow,
        column: {
          property: props.prop,
          label: props.label,
        },
        $index: 0,
      })

      return h(
        'div',
        {
          class: 'el-table-column-stub',
          'data-prop': props.prop,
          'data-label': props.label,
          'data-type': props.type,
          'data-width': props.width,
        },
        slotContent?.length
          ? slotContent
          : `native:${props.prop ?? props.type ?? 'column'}`,
      )
    }
  },
})

const ElEmptyStub = defineComponent({
  name: 'ElEmpty',
  props: {
    description: String,
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'el-empty-stub' },
        props.description,
      )
  },
})

const ElPaginationStub = defineComponent({
  name: 'ElPagination',
  setup() {
    return () => h('div')
  },
})

function mountTable(options: Parameters<typeof mount>[1] = {}) {
  return mount(GaTable, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ElTable: ElTableStub,
        ElTableColumn: ElTableColumnStub,
        ElEmpty: ElEmptyStub,
        ElPagination: ElPaginationStub,
        ...options.global?.stubs,
      },
    },
  })
}

describe('GaTable', () => {
  it('passes the approved defaults to ElTable', () => {
    const wrapper = mountTable()

    expect(wrapper.findComponent(ElTableStub).props()).toMatchObject({
      data: [],
      border: true,
      stripe: true,
      fit: true,
      showHeader: true,
      highlightCurrentRow: false,
      emptyText: '暂无数据',
      elementLoadingText: '加载中...',
    })
  })

  it('renders ElTable as its root without an autoHeight API', () => {
    const wrapper = mountTable()
    const table = wrapper.findComponent(ElTableStub)
    const runtimeProps = (
      GaTable as unknown as { props?: Record<string, unknown> }
    ).props

    expect(wrapper.element).toBe(table.element)
    expect(runtimeProps).not.toHaveProperty('autoHeight')
  })

  it('forwards explicit zero height and maxHeight to ElTable', () => {
    const wrapper = mountTable({
      props: {
        height: 0,
        maxHeight: 0,
      },
    })

    expect(wrapper.findComponent(ElTableStub).props()).toMatchObject({
      height: 0,
      maxHeight: 0,
    })
  })

  it('renders ElEmpty as the default empty slot content', () => {
    const wrapper = mountTable()

    expect(wrapper.findComponent(ElEmptyStub).props('description')).toBe('暂无数据')
  })

  it('uses emptyText as the default ElEmpty description', () => {
    const wrapper = mountTable({
      props: {
        emptyText: '没有订单',
      },
    })

    expect(wrapper.findComponent(ElEmptyStub).props('description')).toBe('没有订单')
  })

  it('lets the consumer empty slot replace the default ElEmpty', () => {
    const wrapper = mountTable({
      slots: {
        empty: () => h('span', { class: 'custom-empty' }, '请先创建数据'),
      },
    })

    expect(wrapper.find('.custom-empty').text()).toBe('请先创建数据')
    expect(wrapper.findComponent(ElEmptyStub).exists()).toBe(false)
  })

  it('renders configuration columns and forwards column props', () => {
    const wrapper = mountTable({
      props: {
        columns: [
          { key: 'name', prop: 'name', label: '姓名', width: 160 },
          { key: 'status', prop: 'status', label: '状态' },
        ],
      },
    })

    const columns = wrapper.findAllComponents(ElTableColumnStub)

    expect(columns).toHaveLength(2)
    expect(columns[0].props()).toMatchObject({
      prop: 'name',
      label: '姓名',
      width: 160,
    })
    expect(columns[1].props()).toMatchObject({
      prop: 'status',
      label: '状态',
    })
  })

  it('renders prepended, configured, and default-slot columns in order', () => {
    const wrapper = mountTable({
      props: {
        columns: [{ key: 'name', prop: 'name', label: '姓名' }],
      },
      slots: {
        'column-prepend': () => h('span', { 'data-column': 'prepend' }, 'prepend'),
        default: () => h('span', { 'data-column': 'default' }, 'default'),
      },
    })

    const children = wrapper.find('.table-columns').element.children

    expect(children).toHaveLength(3)
    expect(children[0].getAttribute('data-column')).toBe('prepend')
    expect(children[1].getAttribute('data-prop')).toBe('name')
    expect(children[2].getAttribute('data-column')).toBe('default')
  })

  it('forwards the native cell scope to a configured named slot', () => {
    const receivedScopes: unknown[] = []
    const wrapper = mountTable({
      props: {
        columns: [
          { key: 'status', prop: 'status', label: '状态', slot: 'status' },
        ],
      },
      slots: {
        status: (scope) => {
          receivedScopes.push(scope)
          return h('span', { class: 'status-cell' }, `状态：${scope.row.status}`)
        },
      },
    })

    expect(wrapper.find('.status-cell').text()).toBe('状态：enabled')
    expect(receivedScopes[0]).toMatchObject({
      row: slotRow,
      column: {
        property: 'status',
        label: '状态',
      },
      $index: 0,
    })
  })

  it('keeps native cell rendering when the configured slot is missing', () => {
    const wrapper = mountTable({
      props: {
        columns: [
          { key: 'status', prop: 'status', label: '状态', slot: 'status' },
        ],
      },
    })

    expect(wrapper.find('[data-prop="status"]').text()).toBe('native:status')
  })

  it('forwards empty and append slots to ElTable', () => {
    const wrapper = mountTable({
      slots: {
        empty: () => h('span', { class: 'empty-content' }, '暂无订单'),
        append: () => h('span', { class: 'append-content' }, '已经到底了'),
      },
    })

    expect(wrapper.find('.empty-content').text()).toBe('暂无订单')
    expect(wrapper.find('.append-content').text()).toBe('已经到底了')
  })

  it('forwards low-frequency attributes to ElTable', () => {
    const wrapper = mountTable({
      attrs: {
        'table-layout': 'fixed',
        'scrollbar-always-on': true,
      },
    })

    const table = wrapper.find('.el-table-stub')

    expect(table.attributes('table-layout')).toBe('fixed')
    expect(table.attributes('scrollbar-always-on')).toBe('true')
  })

  it('does not render pagination', () => {
    const wrapper = mountTable()
    const runtimeProps = (
      GaTable as unknown as { props?: Record<string, unknown> }
    ).props

    expect(wrapper.findComponent(ElPaginationStub).exists()).toBe(false)
    expect(runtimeProps).not.toHaveProperty('pagination')
  })

  it('keeps the native ElTable selection-change event passthrough', () => {
    const receivedSelections: unknown[] = []
    const wrapper = mountTable({
      attrs: {
        onSelectionChange: (selection: unknown) => {
          receivedSelections.push(selection)
        },
      },
    })
    const selection = [slotRow]

    wrapper.findComponent(ElTableStub).vm.$emit('selection-change', selection)

    expect(receivedSelections).toEqual([selection])
  })

  it('keeps the native ElTable current-change event passthrough', () => {
    const receivedChanges: Array<[unknown, unknown]> = []
    const wrapper = mountTable({
      attrs: {
        onCurrentChange: (currentRow: unknown, oldCurrentRow: unknown) => {
          receivedChanges.push([currentRow, oldCurrentRow])
        },
      },
    })
    const currentRow = { id: 2, name: 'current' }
    const oldCurrentRow = { id: 1, name: 'old' }

    wrapper
      .findComponent(ElTableStub)
      .vm.$emit('current-change', currentRow, oldCurrentRow)

    expect(receivedChanges).toEqual([[currentRow, oldCurrentRow]])
    expect(receivedChanges[0][0]).toBe(currentRow)
    expect(receivedChanges[0][1]).toBe(oldCurrentRow)
  })

  it('exposes the underlying table instance', () => {
    const wrapper = mountTable()

    expect(wrapper.vm.tableRef).toBeDefined()
    expect(wrapper.vm.tableRef.clearSelection).toBeTypeOf('function')
  })
})

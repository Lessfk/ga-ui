import { readFileSync } from 'node:fs'

import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import GaTable from '../index.vue'

const tableStyles = readFileSync(
  'src/base/components/table/style/index.scss',
  'utf8',
)
const normalizedTableStyles = tableStyles.replace(/\s+/g, ' ')

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
  it('keeps the expanded row theme background while hovering', () => {
    expect(normalizedTableStyles).toContain(
      '.el-table.ga-table .el-table__expanded-cell:hover { background-color: var(--el-table-expanded-cell-bg-color) !important; }',
    )
  })

  it('applies the header theme background to grouped headers', () => {
    expect(normalizedTableStyles).toContain(
      '.el-table.ga-table thead.is-group th.el-table__cell { background: var(--el-table-header-bg-color); }',
    )
  })

  it('themes striped rows without overriding hover or current rows', () => {
    expect(normalizedTableStyles).toContain(
      '.el-table.ga-table.el-table--striped { .el-table__body { tr.el-table__row--striped:not(.hover-row):not(.current-row) { td.el-table__cell { background-color: var(--ga-table-stripe-bg-color); } } } }',
    )
  })

  it('applies the complete default color theme', () => {
    const wrapper = mountTable()
    const style = (wrapper.find('.el-table-stub').element as HTMLElement).style

    expect(style.getPropertyValue('--el-table-bg-color')).toBe('#ffffff')
    expect(style.getPropertyValue('--el-table-tr-bg-color')).toBe('#ffffff')
    expect(style.getPropertyValue('--el-table-text-color')).toBe('#303133')
    expect(style.getPropertyValue('--el-table-header-bg-color')).toBe('#f6f6f6')
    expect(style.getPropertyValue('--el-table-header-text-color')).toBe('#2b3b5e')
    expect(style.getPropertyValue('--el-table-border-color')).toBe('#e5e7eb')
    expect(style.getPropertyValue('--ga-table-stripe-bg-color')).toBe(
      'var(--el-fill-color-lighter)',
    )
    expect(style.getPropertyValue('--el-table-row-hover-bg-color')).toBe('#f6f6f6')
    expect(style.getPropertyValue('--el-table-current-row-bg-color')).toBe('#ecf5ff')
    expect(style.getPropertyValue('--el-table-expanded-cell-bg-color')).toBe('#fafafa')
  })

  it('merges a partial theme with defaults', () => {
    const wrapper = mountTable({
      props: {
        theme: {
          backgroundColor: '#101828',
          headerTextColor: '#f9fafb',
        },
      },
    })
    const style = (wrapper.find('.el-table-stub').element as HTMLElement).style

    expect(style.getPropertyValue('--el-table-bg-color')).toBe('#101828')
    expect(style.getPropertyValue('--el-table-header-text-color')).toBe('#f9fafb')
    expect(style.getPropertyValue('--el-table-tr-bg-color')).toBe('#ffffff')
  })

  it('updates theme variables reactively', async () => {
    const wrapper = mountTable({
      props: {
        theme: {
          textColor: '#344054',
        },
      },
    })

    await wrapper.setProps({
      theme: {
        textColor: '#f2f4f7',
        borderColor: '#475467',
      },
    })

    const style = (wrapper.find('.el-table-stub').element as HTMLElement).style
    expect(style.getPropertyValue('--el-table-text-color')).toBe('#f2f4f7')
    expect(style.getPropertyValue('--el-table-border-color')).toBe('#475467')
  })

  it('preserves consumer styles alongside theme variables', () => {
    const wrapper = mountTable({
      attrs: {
        style: {
          width: '80%',
          '--consumer-table-token': '#409eff',
        },
      },
    })
    const style = (wrapper.find('.el-table-stub').element as HTMLElement).style

    expect(style.width).toBe('80%')
    expect(style.getPropertyValue('--consumer-table-token')).toBe('#409eff')
    expect(style.getPropertyValue('--el-table-bg-color')).toBe('#ffffff')
  })

  it('lets consumer CSS variables override theme variables', () => {
    const wrapper = mountTable({
      props: {
        theme: {
          backgroundColor: '#101828',
        },
      },
      attrs: {
        style: {
          '--el-table-bg-color': '#fef3c7',
        },
      },
    })
    const style = (wrapper.find('.el-table-stub').element as HTMLElement).style

    expect(style.getPropertyValue('--el-table-bg-color')).toBe('#fef3c7')
  })

  it('updates forwarded attributes and consumer styles dynamically', async () => {
    const wrapper = mountTable({
      attrs: {
        'table-layout': 'fixed',
        style: {
          width: '80%',
          '--consumer-table-token': '#409eff',
        },
      },
    })

    await wrapper.setProps({
      'table-layout': 'auto',
      style: {
        width: '90%',
        '--consumer-table-token': '#67c23a',
      },
    } as never)

    const table = wrapper.find('.el-table-stub')
    const style = (table.element as HTMLElement).style

    expect(table.attributes('table-layout')).toBe('auto')
    expect(style.width).toBe('90%')
    expect(style.getPropertyValue('--consumer-table-token')).toBe('#67c23a')
  })

  it('keeps theme defaults when fields are explicitly undefined', () => {
    const wrapper = mountTable({
      props: {
        theme: {
          backgroundColor: undefined,
          hoverBackgroundColor: undefined,
        },
      },
    })
    const style = (wrapper.find('.el-table-stub').element as HTMLElement).style

    expect(style.getPropertyValue('--el-table-bg-color')).toBe('#ffffff')
    expect(style.getPropertyValue('--el-table-row-hover-bg-color')).toBe('#f6f6f6')
  })

  it('does not forward theme to ElTable', () => {
    const wrapper = mountTable({
      props: {
        theme: {
          backgroundColor: '#101828',
        },
      },
    })

    expect(wrapper.findComponent(ElTableStub).attributes()).not.toHaveProperty('theme')
  })

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

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { ApiEntry } from '../content/types'
import ApiTable from './ApiTable.vue'
import CopyButton from './CopyButton.vue'

const longType =
  'Record<string, Array<{ label: string; value: string | number }>>'

function mountTable(section: 'props' | 'events', entries: ApiEntry[]) {
  return mount(ApiTable, { props: { section, entries } })
}

describe('ApiTable', () => {
  it('renders a semantic Props table with defaults and missing values', () => {
    const wrapper = mountTable('props', [
      {
        name: 'options',
        description: '可选项配置',
        type: longType,
        default: '[]',
      },
      {
        name: 'disabled',
        description: '是否禁用',
        type: 'boolean',
      },
    ])

    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAll('th').map((cell) => cell.text())).toEqual([
      '名称',
      '说明',
      '类型',
      '默认值',
    ])
    expect(wrapper.findAll('tbody tr')[0].findAll('td')[3].text()).toBe('[]')
    expect(wrapper.findAll('tbody tr')[1].findAll('td')[3].text()).toBe('—')
  })

  it('renders event parameters in the fourth column', () => {
    const wrapper = mountTable('events', [
      {
        name: 'change',
        description: '值变化时触发',
        type: '(value: string) => void',
        parameters: 'value: string',
      },
      {
        name: 'clear',
        description: '清空时触发',
        type: '() => void',
      },
    ])

    expect(wrapper.findAll('th').map((cell) => cell.text())).toEqual([
      '名称',
      '说明',
      '类型',
      '参数',
    ])
    expect(wrapper.findAll('tbody tr')[0].findAll('td')[3].text()).toBe(
      'value: string',
    )
    expect(wrapper.findAll('tbody tr')[1].findAll('td')[3].text()).toBe('—')
  })

  it('keeps long type text intact and exposes it through CopyButton', () => {
    const wrapper = mountTable('props', [
      {
        name: 'options',
        description: '可选项配置',
        type: longType,
      },
    ])

    expect(wrapper.get('code').text()).toBe(longType)
    expect(wrapper.getComponent(CopyButton).props('text')).toBe(longType)
  })

  it('exposes the horizontal table region to keyboard users', () => {
    const wrapper = mountTable('props', [
      { name: 'value', description: '绑定值', type: 'string' },
    ])
    const scrollRegion = wrapper.get('.ga-docs-api-table__scroll')

    expect(scrollRegion.attributes('role')).toBe('region')
    expect(scrollRegion.attributes('tabindex')).toBe('0')
    expect(scrollRegion.attributes('aria-label')).toBe('Props API 表格')
  })
})

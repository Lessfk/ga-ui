import { describe, expect, it } from 'vitest'

import { generatedComponentApi } from '../generated/component-api'
import {
  assertApiDescriptions,
  type ApiOverrides,
  mergeComponentApi,
} from './api'
import { apiOverrides } from './api-overrides'

const generated = {
  props: [{ name: 'disabled', type: 'boolean', required: false }],
  events: [
    {
      name: 'change',
      type: 'event',
      required: false,
      parameters: 'value: number',
    },
  ],
  slots: [],
  expose: [],
}

describe('mergeComponentApi', () => {
  it('adds descriptions and defaults without losing generated types', () => {
    const result = mergeComponentApi('sample', generated, {
      props: {
        disabled: { description: '是否禁用组件', default: 'false' },
      },
    })

    expect(result.props[0]).toEqual({
      name: 'disabled',
      type: 'boolean',
      required: false,
      description: '是否禁用组件',
      default: 'false',
    })
  })

  it('rejects overrides for API names that are not generated', () => {
    expect(() =>
      mergeComponentApi('sample', generated, {
        props: { missing: { description: '无效字段' } },
      }),
    ).toThrow('sample.props.missing')
  })

  it('allows manual events and slots for wrapper passthrough APIs', () => {
    const result = mergeComponentApi('sample', generated, {
      extra: {
        events: [
          { name: 'select', type: 'event', description: '选择发生变化' },
        ],
        slots: [
          { name: 'empty', type: '无作用域参数', description: '空状态内容' },
        ],
      },
    })

    expect(result.events.at(-1)?.name).toBe('select')
    expect(result.slots.at(-1)?.name).toBe('empty')
  })

  it('rejects duplicate names within manual API entries', () => {
    expect(() =>
      mergeComponentApi('sample', generated, {
        extra: {
          events: [
            { name: 'select', type: 'event', description: '第一次声明' },
            { name: 'select', type: 'event', description: '重复声明' },
          ],
        },
      }),
    ).toThrow('sample.events.select')
  })

  it('does not expose mutable references to manual override entries', () => {
    const overrides: ApiOverrides = {
      extra: {
        events: [
          { name: 'select', type: 'event', description: '选择发生变化' },
        ],
      },
    }
    const result = mergeComponentApi('sample', generated, overrides)

    result.events.at(-1)!.description = '已修改'

    expect(overrides.extra?.events?.[0].description).toBe('选择发生变化')
  })

  it('provides descriptions for every generated and manual API entry', () => {
    const slugs = Object.keys(
      generatedComponentApi,
    ) as Array<keyof typeof generatedComponentApi>

    expect(() => {
      for (const slug of slugs) {
        const api = mergeComponentApi(
          slug,
          generatedComponentApi[slug],
          apiOverrides[slug],
        )
        assertApiDescriptions(slug, api)
      }
    }).not.toThrow()
  })

  it('keeps override component keys synchronized with generated APIs', () => {
    expect(Object.keys(apiOverrides).sort()).toEqual(
      Object.keys(generatedComponentApi).sort(),
    )
  })

  it('reports the exact path for a missing API description', () => {
    const api = mergeComponentApi(
      'dialog',
      generatedComponentApi.dialog,
      apiOverrides.dialog,
    )
    api.props[0].description = ''

    expect(() => assertApiDescriptions('dialog', api)).toThrow(
      `dialog.props.${api.props[0].name}`,
    )
  })

  it('preserves inline code markers from migrated Markdown cells', () => {
    expect(apiOverrides.dialog.props.modelValue.description).toContain(
      '`v-model`',
    )
  })

  it('splits code-wrapped API names and parallel defaults correctly', () => {
    expect(apiOverrides['aside-menu'].props.showTimeout.description).toBe(
      '展开与关闭延时',
    )
    expect(apiOverrides['aside-menu'].props.hideTimeout.description).toBe(
      '展开与关闭延时',
    )
    expect(apiOverrides['table-pagination'].props.loading.default).toBe('false')
    expect(apiOverrides['table-pagination'].props.loadingText.default).toBe(
      "'加载中...'",
    )

    const extraNames = Object.values(
      apiOverrides as Record<string, ApiOverrides>,
    )
      .flatMap((override) => Object.values(override.extra ?? {}))
      .flat()
      .map((entry) => entry.name)

    expect(extraNames.some((name) => name.includes('`'))).toBe(false)
  })

  it('normalizes displayed method names before classifying expose entries', () => {
    expect(apiOverrides['aside-menu'].expose.toggle.description).toContain(
      '切换折叠状态',
    )
    expect(apiOverrides['search-bar'].expose.search.description).toContain(
      '执行查询',
    )

    const extraNames = Object.values(
      apiOverrides as Record<string, ApiOverrides>,
    )
      .flatMap((override) => Object.values(override.extra ?? {}))
      .flat()
      .map((entry) => entry.name)

    expect(extraNames.some((name) => name.endsWith('()'))).toBe(false)
  })
})

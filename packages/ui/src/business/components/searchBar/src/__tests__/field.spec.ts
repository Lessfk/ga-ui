import { describe, expect, it } from 'vitest'

import {
  buildResetModel,
  captureInitialValues,
  cloneSearchModel,
  resolveFieldAriaLabel,
  resolveFieldPlaceholder,
  sanitizeComponentProps,
} from '../field'
import type { GaSearchField } from '../props'

const fields: GaSearchField[] = [
  { key: 'keyword', type: 'input', label: '关键词' },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    defaultValue: 'enabled',
    options: [],
  },
  { key: 'createdAt', type: 'date', label: '创建日期' },
]

describe('search field helpers', () => {
  it('generates placeholders by field family', () => {
    expect(resolveFieldPlaceholder(fields[0], 'placeholder')).toBe('请输入关键词')
    expect(resolveFieldPlaceholder(fields[1], 'placeholder')).toBe('请选择状态')
    expect(resolveFieldPlaceholder(fields[2], 'placeholder')).toBe('请选择创建日期')
    expect(resolveFieldPlaceholder(fields[0], 'none')).toBeUndefined()
  })

  it('keeps explicit placeholders and accessible labels', () => {
    const field: GaSearchField = {
      key: 'keyword',
      type: 'input',
      label: '关键词',
      placeholder: '姓名或手机号',
      ariaLabel: '用户关键词',
    }

    expect(resolveFieldPlaceholder(field, 'placeholder')).toBe('姓名或手机号')
    expect(resolveFieldAriaLabel(field)).toBe('用户关键词')
  })

  it('removes props controlled by the field adapters', () => {
    const result = sanitizeComponentProps({
      clearable: true,
      modelValue: 'ignored',
      type: 'month',
      disabled: true,
      placeholder: 'ignored',
      'aria-label': 'ignored',
      'onUpdate:modelValue': () => undefined,
      onChange: () => undefined,
    })

    expect(result).toEqual({ clearable: true })
  })

  it('clones nested query values without sharing arrays or dates', () => {
    const source = {
      range: ['2026-08-01', '2026-08-18'],
      meta: { enabled: true },
      date: new Date('2026-08-18T00:00:00.000Z'),
    }
    const cloned = cloneSearchModel(source)

    expect(cloned).toEqual(source)
    expect(cloned).not.toBe(source)
    expect(cloned.range).not.toBe(source.range)
    expect(cloned.meta).not.toBe(source.meta)
    expect(cloned.date).not.toBe(source.date)
  })

  it('uses field defaults, then initial values, and preserves unknown keys', () => {
    const connection = new Map([['region', 'cn']])
    const resetFields: GaSearchField[] = [
      ...fields,
      {
        key: 'tags',
        type: 'select',
        label: '标签',
        defaultValue: ['enabled'],
        options: [],
      },
    ]
    const initial = captureInitialValues(
      { keyword: 'initial', status: 'disabled', traceId: 'trace-1' },
      resetFields,
    )
    const reset = buildResetModel(
      {
        keyword: 'changed',
        status: 'pending',
        traceId: 'trace-2',
        connection,
      },
      resetFields,
      initial,
    )
    const nextReset = buildResetModel(reset, resetFields, initial)

    expect(reset).toEqual({
      keyword: 'initial',
      status: 'enabled',
      traceId: 'trace-2',
      createdAt: undefined,
      tags: ['enabled'],
      connection,
    })
    expect(reset.connection).toBe(connection)
    expect(nextReset.tags).toEqual(['enabled'])
    expect(nextReset.tags).not.toBe(reset.tags)
  })
})

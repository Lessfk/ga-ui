import { describe, expect, it } from 'vitest'

import { getColumnKey, getColumnProps } from '../column'

describe('GaTable column helpers', () => {
  it('prefers key over prop when generating the Vue key', () => {
    expect(getColumnKey({ key: 'user-name', prop: 'name' }, 0)).toBe('user-name')
  })

  it('uses prop when an explicit key is absent', () => {
    expect(getColumnKey({ prop: 'name' }, 0)).toBe('name')
  })

  it('uses the column type and index as the final key fallback', () => {
    expect(getColumnKey({ type: 'selection' }, 2)).toBe('selection-2')
    expect(getColumnKey({}, 3)).toBe('column-3')
  })

  it('removes wrapper-only fields before binding props to ElTableColumn', () => {
    expect(
      getColumnProps({
        key: 'name-column',
        slot: 'name',
        prop: 'name',
        label: '姓名',
        width: 160,
      }),
    ).toEqual({
      prop: 'name',
      label: '姓名',
      width: 160,
    })
  })
})

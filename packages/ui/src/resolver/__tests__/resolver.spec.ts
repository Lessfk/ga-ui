import { describe, expect, it } from 'vitest'

import { GaUiResolver } from '../index'

describe('GaUiResolver', () => {
  it.each([
    ['GaDialog', 'ga-ui-plus/base', ['dialog']],
    ['GaMegaMenu', 'ga-ui-plus/base', ['scrollbar']],
    ['GaPagination', 'ga-ui-plus/base', ['pagination']],
    [
      'GaTable',
      'ga-ui-plus/base',
      ['table', 'table-column', 'empty', 'loading'],
    ],
    [
      'GaAsideMenu',
      'ga-ui-plus/business',
      ['aside', 'menu', 'scrollbar'],
    ],
    [
      'GaSearchBar',
      'ga-ui-plus/business',
      [
        'form',
        'form-item',
        'row',
        'col',
        'button',
        'input',
        'select',
        'option',
        'date-picker',
      ],
    ],
    [
      'GaTablePagination',
      'ga-ui-plus/business',
      ['table', 'table-column', 'empty', 'loading', 'pagination'],
    ],
  ])('resolves %s with its default style dependencies', (name, from, styles) => {
    const result = GaUiResolver().resolve(name)

    expect(result).toEqual({
      name,
      from,
      sideEffects: [
        'ga-ui-plus/style.css',
        ...styles.map(
          (style) => `element-plus/es/components/${style}/style/css`,
        ),
      ],
    })
  })

  it('can disable the GA UI stylesheet', () => {
    expect(
      GaUiResolver({ importStyle: false }).resolve('GaMegaMenu'),
    ).toEqual({
      name: 'GaMegaMenu',
      from: 'ga-ui-plus/base',
      sideEffects: ['element-plus/es/components/scrollbar/style/css'],
    })
  })

  it('can disable Element Plus styles for full stylesheet consumers', () => {
    expect(
      GaUiResolver({ elementPlusStyle: false }).resolve('GaMegaMenu'),
    ).toEqual({
      name: 'GaMegaMenu',
      from: 'ga-ui-plus/base',
      sideEffects: ['ga-ui-plus/style.css'],
    })
  })

  it('omits sideEffects when both style options are disabled', () => {
    expect(
      GaUiResolver({
        importStyle: false,
        elementPlusStyle: false,
      }).resolve('GaMegaMenu'),
    ).toEqual({
      name: 'GaMegaMenu',
      from: 'ga-ui-plus/base',
    })
  })

  it('does not resolve unknown components', () => {
    expect(GaUiResolver().resolve('GaUnknown')).toBeUndefined()
  })
})

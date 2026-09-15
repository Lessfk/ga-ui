import { describe, expect, it } from 'vitest'

import { componentCatalog } from './catalog'
import { buildComponentGroups, buildSearchEntries } from './navigation'

describe('component documentation catalog', () => {
  it('registers every public component with unique names and slugs', () => {
    expect(componentCatalog.map((item) => item.name)).toEqual([
      'GaDialog',
      'GaMegaMenu',
      'GaPagination',
      'GaTable',
      'GaAsideMenu',
      'GaSearchBar',
      'GaTablePagination',
    ])
    expect(new Set(componentCatalog.map((item) => item.slug)).size).toBe(7)
  })

  it('groups base and business components in stable order', () => {
    const groups = buildComponentGroups(componentCatalog)

    expect(groups.map((group) => group.key)).toEqual(['base', 'business'])
    expect(groups[0].items.map((item) => item.slug)).toEqual([
      'dialog',
      'mega-menu',
      'pagination',
      'table',
    ])
    expect(groups[1].items.map((item) => item.slug)).toEqual([
      'aside-menu',
      'search-bar',
      'table-pagination',
    ])
  })

  it('creates searchable component entries with route targets', () => {
    const entries = buildSearchEntries(componentCatalog)

    expect(entries[0]).toMatchObject({
      label: 'Dialog 对话框',
      path: '/components/dialog',
    })
    expect(entries.some((entry) => entry.keywords.includes('GaSearchBar'))).toBe(true)
  })
})

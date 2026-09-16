import { describe, expect, it } from 'vitest'

import { createSearchEntries, searchDocs } from './search'

const entries = createSearchEntries()

describe('documentation search', () => {
  it('finds components by title', () => {
    expect(searchDocs('Dialog', entries)[0].path).toBe('/components/dialog')
  })

  it('keeps the component page first when searching its public name', () => {
    expect(searchDocs('GaDialog', entries)[0]).toMatchObject({
      path: '/components/dialog',
      meta: '组件',
    })
  })

  it('finds props and links to their sections', () => {
    expect(searchDocs('beforeClose', entries)[0].path).toBe(
      '/components/dialog#props',
    )
    expect(searchDocs('actionsLoading', entries)[0].path).toBe(
      '/components/search-bar#props',
    )
  })

  it('returns all matching public events', () => {
    const paths = searchDocs('select', entries).map((entry) => entry.path)
    expect(paths).toContain('/components/mega-menu#events')
    expect(paths).toContain('/components/aside-menu#events')
  })

  it('returns an empty array for an unknown query', () => {
    expect(searchDocs('not-a-ga-ui-api', entries)).toEqual([])
  })
})

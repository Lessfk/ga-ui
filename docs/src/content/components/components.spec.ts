import { describe, expect, it } from 'vitest'

import { componentCatalog } from '../catalog'
import { loadComponentDoc } from '../component-docs'

const expectedDemoIds: Record<string, string[]> = {
  dialog: ['basic', 'lifecycle'],
  'mega-menu': ['basic', 'theme'],
  pagination: ['basic', 'theme'],
  table: ['basic', 'selection'],
  'aside-menu': ['basic', 'theme'],
  'search-bar': ['basic', 'advanced'],
  'table-pagination': ['basic', 'loading'],
}

describe('standalone component documentation', () => {
  it('does not discover colocated spec files as component documents', async () => {
    await expect(loadComponentDoc('components.spec')).rejects.toThrow(
      'Unknown component document: components.spec',
    )
  })

  for (const item of componentCatalog) {
    it(
      `${item.name} has complete standalone documentation`,
      async () => {
        const doc = await loadComponentDoc(item.slug)

        expect(doc.name).toBe(item.name)
        expect(doc.description.trim()).not.toBe('')
        expect(doc.importCode).toContain(item.name)
        expect(doc.importCode).toContain("import 'ga-ui-plus/style.css'")
        expect(doc.usage).toContain(`<${item.name}`)
        expect(doc.demos.map((demo) => demo.id)).toEqual(
          expectedDemoIds[item.slug],
        )
        expect(new Set(doc.demos.map((demo) => demo.id)).size).toBe(
          doc.demos.length,
        )
        expect(
          doc.demos.every((demo) => demo.source.includes('<template')),
        ).toBe(true)
        expect(doc.api.props.length).toBeGreaterThan(0)
      },
      15_000,
    )
  }
})

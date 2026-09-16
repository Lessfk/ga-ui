import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import DemoBlock from '../../components/DemoBlock.vue'
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

  it(
    'renders and remounts all fourteen live demos',
    async () => {
      const nativeGetComputedStyle = window.getComputedStyle.bind(window)
      const computedStyleSpy = vi
        .spyOn(window, 'getComputedStyle')
        .mockImplementation((element, pseudoElement) => {
          const style = nativeGetComputedStyle(element, pseudoElement)
          if (!element.matches('.el-form-item__label')) return style

          return new Proxy(style, {
            get(target, property) {
              if (property === 'width') return '100px'
              const value = Reflect.get(target, property, target)
              return typeof value === 'function' ? value.bind(target) : value
            },
          })
        })

      try {
        for (const item of componentCatalog) {
          const doc = await loadComponentDoc(item.slug)

          for (const demo of doc.demos) {
            const wrapper = mount(DemoBlock, {
              props: {
                title: demo.title,
                description: demo.description,
                demo: demo.component,
                source: demo.source,
              },
            })
            await flushPromises()

            const surface = wrapper.get('.ga-docs-demo__surface')
            const initialRoot = surface.element.firstElementChild
            expect(
              initialRoot,
              `${item.name}/${demo.id} should render visible DOM`,
            ).not.toBeNull()

            await wrapper.get('[data-action="reset-demo"]').trigger('click')
            await flushPromises()

            expect(
              surface.element.firstElementChild,
              `${item.name}/${demo.id} should remount after reset`,
            ).not.toBe(initialRoot)
            wrapper.unmount()
          }
        }
      } finally {
        computedStyleSpy.mockRestore()
      }
    },
    30_000,
  )
})

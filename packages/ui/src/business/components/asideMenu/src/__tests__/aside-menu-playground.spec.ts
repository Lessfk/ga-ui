import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'
import { describe, expect, it } from 'vitest'

describe('GaAsideMenu playground preview', () => {
  it('binds legacy Element Plus menu components locally', () => {
    const filename = resolve(
      process.cwd(),
      '../../playground/src/demos/AsideMenuDemo.vue',
    )
    const source = readFileSync(filename, 'utf8')
    const { descriptor } = parse(source, { filename })
    const script = compileScript(descriptor, { id: 'aside-menu-demo' })
    const template = compileTemplate({
      filename,
      id: 'aside-menu-demo',
      source: descriptor.template?.content ?? '',
      compilerOptions: { bindingMetadata: script.bindings },
    })

    expect(template.errors).toEqual([])
    expect(template.code).not.toMatch(
      /resolveComponent\("el-(?:menu-item|menu-item-group|sub-menu)"\)/,
    )
    expect(template.code).toContain('$setup["ElMenuItem"]')
    expect(template.code).toContain('$setup["ElMenuItemGroup"]')
    expect(template.code).toContain('$setup["ElSubMenu"]')
  })
})

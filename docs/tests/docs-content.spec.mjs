import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'

const pages = [
  'dialog',
  'mega-menu',
  'pagination',
  'table',
  'aside-menu',
  'search-bar',
  'table-pagination',
]

for (const page of pages) {
  test(`${page} exposes demos and API reference`, async () => {
    const content = await readFile(
      new URL(`../site/components/${page}.md`, import.meta.url),
      'utf8',
    )

    const previews = [...content.matchAll(/<DemoPreview/g)]
    const sourceIncludes = [...content.matchAll(/<<<\s+([^\s]+\.vue)/g)]

    assert.ok(previews.length > 0)
    assert.equal(sourceIncludes.length, previews.length)

    for (const [, sourcePath] of sourceIncludes) {
      await access(
        new URL(`../site/components/${sourcePath}`, import.meta.url),
      )
    }

    assert.match(content, /## API/)
    assert.match(content, /### Props/)
    assert.match(content, /### Events/)
    assert.match(content, /### Slots/)
    assert.match(content, /### Expose/)
  })
}

test('site config enables navigation, local search, dark mode, and resolvers', async () => {
  const config = await readFile(
    new URL('../.vitepress/config.mts', import.meta.url),
    'utf8',
  )

  assert.match(config, /provider:\s*'local'/)
  assert.match(config, /darkModeSwitchLabel/)
  assert.match(config, /ElementPlusResolver/)
  assert.match(config, /GaUiResolver/)

  for (const page of pages) {
    assert.match(config, new RegExp(`/components/${page}`))
  }
})

test('dialog demo uses editable form models', async () => {
  const content = await readFile(
    new URL('../site/demos/dialog/BasicDemo.vue', import.meta.url),
    'utf8',
  )

  assert.match(content, /v-model="form\.name"/)
  assert.match(content, /v-model="form\.enabled"/)
})

test('search bar docs describe Enter submission accurately', async () => {
  const content = await readFile(
    new URL('../site/components/search-bar.md', import.meta.url),
    'utf8',
  )

  assert.match(content, /按 Enter.*触发查询/)
  assert.doesNotMatch(content, /按 Enter 不会/)
})

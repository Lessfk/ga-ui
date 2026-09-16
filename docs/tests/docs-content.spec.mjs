import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import test from 'node:test'

const docsFile = (path) => new URL(`../${path}`, import.meta.url)

async function listCssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const target = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory)
      if (entry.isDirectory()) return listCssFiles(target)
      return entry.name.endsWith('.css') ? [target] : []
    }),
  )
  return files.flat()
}

function findUnsafeSelectors(styles) {
  const withoutComments = styles.replace(/\/\*[\s\S]*?\*\//g, '')
  return [...withoutComments.matchAll(/([^{}]+)\{/g)]
    .flatMap((match) => match[1].split(','))
    .map((selector) => selector.trim())
    .filter((selector) => !selector.startsWith('@'))
    .filter((selector) => /\.el-|\.ga-(?!docs-)/.test(selector))
}

test('docs is a standalone Vue and Vite application', async () => {
  const packageJson = JSON.parse(
    await readFile(docsFile('package.json'), 'utf8'),
  )
  const viteConfig = await readFile(docsFile('vite.config.ts'), 'utf8')

  assert.equal(packageJson.scripts.dev.includes('vite'), true)
  assert.equal(packageJson.scripts.build.includes('vite build'), true)
  assert.equal(packageJson.dependencies['vue-router'].startsWith('^4.'), true)
  assert.equal('vitepress' in packageJson.devDependencies, false)

  await access(docsFile('index.html'))
  await access(docsFile('vite.config.ts'))
  await access(docsFile('src/main.ts'))
  await access(docsFile('src/App.vue'))

  assert.match(viteConfig, /include: \['src\/\*\*\/\*\.spec\.ts'\]/)
  assert.match(viteConfig, /passWithNoTests: true/)
})

test('root scripts continue to expose the docs project', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../../package.json', import.meta.url), 'utf8'),
  )

  assert.equal(packageJson.scripts['docs:dev'], 'pnpm --filter ga-ui-docs dev')
  assert.equal(packageJson.scripts['docs:test'], 'pnpm --filter ga-ui-docs test')
  assert.equal(packageJson.scripts['docs:build'], 'pnpm --filter ga-ui-docs build')
})

test('retired VitePress sources are removed from the standalone app', async () => {
  await assert.rejects(access(docsFile('.vitepress')))
  await assert.rejects(access(docsFile('site')))
  await assert.rejects(access(docsFile('scripts/migrate-api-overrides.mjs')))
  await access(docsFile('tests/e2e/docs_app.py'))
})

test('documentation styles stay isolated from Element Plus and ga-ui-plus', async () => {
  const styleFiles = await listCssFiles(docsFile('src/styles/'))
  const unsafeSelectors = (
    await Promise.all(
      styleFiles.map(async (file) =>
        findUnsafeSelectors(await readFile(file, 'utf8')),
      ),
    )
  ).flat()

  assert.deepEqual(unsafeSelectors, [])
})

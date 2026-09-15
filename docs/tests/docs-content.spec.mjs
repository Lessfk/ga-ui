import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'

const docsFile = (path) => new URL(`../${path}`, import.meta.url)

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

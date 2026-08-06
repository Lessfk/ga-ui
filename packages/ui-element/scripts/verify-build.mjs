import assert from 'node:assert/strict'
import { access, readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const distUrl = new URL('../dist/', import.meta.url)
const requiredFiles = [
  'index.js',
  'index.d.ts',
  'base/index.js',
  'base/index.d.ts',
  'business/index.js',
  'business/index.d.ts',
  'style.css',
]

await Promise.all(
  requiredFiles.map(async (relativePath) => {
    const fileUrl = new URL(relativePath, distUrl)
    await access(fileUrl)
    assert.equal(
      (await stat(fileUrl)).isFile(),
      true,
      `${fileURLToPath(fileUrl)} must be a file`,
    )
  }),
)

const css = await readFile(new URL('style.css', distUrl), 'utf8')
assert.ok(css.trim().length > 0, 'dist/style.css must not be empty')
for (const selector of [
  /\.el-table\.ga-table/,
  /\.el-pagination\.ga-pagination/,
  /\.ga-table-pagination/,
]) {
  assert.match(css, selector)
}

const [base, business, root] = await Promise.all([
  import(new URL('base/index.js', distUrl)),
  import(new URL('business/index.js', distUrl)),
  import(new URL('index.js', distUrl)),
])

assert.deepEqual(Object.keys(base).sort(), ['GaPagination', 'GaTable'])
assert.deepEqual(Object.keys(business).sort(), ['GaTablePagination'])
assert.deepEqual(Object.keys(root).sort(), [
  'GaPagination',
  'GaTable',
  'GaTablePagination',
])

console.log('Verified ga-ui multi-entry build output.')

import assert from 'node:assert/strict'

const [root, base, business] = await Promise.all([
  import('ga-ui-plus'),
  import('ga-ui-plus/base'),
  import('ga-ui-plus/business'),
])

assert.ok('GaTable' in base)
assert.ok('GaPagination' in base)
assert.ok('GaDialog' in base)
assert.ok(!('GaTablePagination' in base))
assert.ok(!('GaAsideMenu' in base))

assert.ok('GaTablePagination' in business)
assert.ok('GaAsideMenu' in business)
assert.ok(!('GaDialog' in business))
assert.ok(!('GaTable' in business))
assert.ok(!('GaPagination' in business))

assert.ok('GaTable' in root)
assert.ok('GaPagination' in root)
assert.ok('GaDialog' in root)
assert.ok('GaTablePagination' in root)
assert.ok('GaAsideMenu' in root)

console.log('Verified ga-ui-plus package exports')

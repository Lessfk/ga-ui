import assert from 'node:assert/strict'

const [root, base, business] = await Promise.all([
  import('ga-ui'),
  import('ga-ui/base'),
  import('ga-ui/business'),
])

assert.ok('GaTable' in base)
assert.ok('GaPagination' in base)
assert.ok(!('GaTablePagination' in base))

assert.ok('GaTablePagination' in business)
assert.ok(!('GaTable' in business))
assert.ok(!('GaPagination' in business))

assert.ok('GaTable' in root)
assert.ok('GaPagination' in root)
assert.ok('GaTablePagination' in root)

console.log('Verified ga-ui package exports')

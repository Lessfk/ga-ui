import assert from 'node:assert/strict'
import { access, readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

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
  /\.el-dialog\.ga-dialog/,
  /\.el-table\.ga-table/,
  /\.el-pagination\.ga-pagination/,
  /\.ga-table-pagination/,
]) {
  assert.match(css, selector)
}

const distPath = fileURLToPath(distUrl)
const declarationPaths = new Set()

async function collectDeclarationPaths(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      await collectDeclarationPaths(entryPath)
    } else if (entry.name.endsWith('.d.ts')) {
      declarationPaths.add(path.resolve(entryPath))
    }
  }
}

function collectRelativeSpecifiers(sourceFile) {
  const specifiers = []

  function visit(node) {
    let specifier

    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      specifier = node.moduleSpecifier.text
    } else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteralLike(node.argument.literal)
    ) {
      specifier = node.argument.literal.text
    }

    if (specifier?.startsWith('.')) {
      specifiers.push(specifier)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return specifiers
}

function declarationTargetPath(declarationPath, specifier) {
  const declarationSpecifier = specifier
    .replace(/\.mjs$/, '.d.mts')
    .replace(/\.cjs$/, '.d.cts')
    .replace(/\.js$/, '.d.ts')

  return path.resolve(path.dirname(declarationPath), declarationSpecifier)
}

await collectDeclarationPaths(distPath)

let relativeSpecifierCount = 0

for (const declarationPath of declarationPaths) {
  const content = await readFile(declarationPath, 'utf8')
  const sourceFile = ts.createSourceFile(
    declarationPath,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  assert.equal(
    sourceFile.parseDiagnostics.length,
    0,
    `${declarationPath} must parse as a TypeScript declaration file`,
  )

  for (const specifier of collectRelativeSpecifiers(sourceFile)) {
    relativeSpecifierCount += 1
    assert.match(
      specifier,
      /\.(?:mjs|cjs|js)$/,
      `${declarationPath} has a NodeNext-incompatible relative specifier: ${specifier}`,
    )
    assert.ok(
      declarationPaths.has(declarationTargetPath(declarationPath, specifier)),
      `${declarationPath} has an unresolved declaration specifier: ${specifier}`,
    )
  }
}

assert.ok(
  relativeSpecifierCount > 0,
  'dist declarations must contain relative declaration specifiers to verify',
)

const [base, business, root] = await Promise.all([
  import(new URL('base/index.js', distUrl)),
  import(new URL('business/index.js', distUrl)),
  import(new URL('index.js', distUrl)),
])

assert.deepEqual(Object.keys(base).sort(), ['GaDialog', 'GaPagination', 'GaTable'])
assert.deepEqual(Object.keys(business).sort(), ['GaTablePagination'])
assert.deepEqual(Object.keys(root).sort(), [
  'GaDialog',
  'GaPagination',
  'GaTable',
  'GaTablePagination',
])

console.log(
  `Verified ga-ui multi-entry build output and ${relativeSpecifierCount} relative declaration specifiers.`,
)

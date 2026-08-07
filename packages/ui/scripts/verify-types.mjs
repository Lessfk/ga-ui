import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const packageUrl = new URL('../package.json', import.meta.url)
const directTypeScriptPackageUrl = new URL(
  '../node_modules/typescript/package.json',
  import.meta.url,
)
const packageJson = JSON.parse(await readFile(packageUrl, 'utf8'))

assert.equal(
  packageJson.devDependencies?.typescript,
  '5.8.3',
  'NodeNext verification must pin TypeScript 5.8.3 as a direct devDependency',
)
await access(directTypeScriptPackageUrl)
assert.equal(ts.version, '5.8.3', 'NodeNext consumer verification requires TypeScript 5.8.3')

const configPath = fileURLToPath(
  new URL('./fixtures/node-next-consumer/tsconfig.json', import.meta.url),
)
const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile)

if (error) {
  console.error(ts.formatDiagnosticsWithColorAndContext([error], {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
  }))
  process.exit(1)
}

const parsedConfig = ts.parseJsonConfigFileContent(
  config,
  ts.sys,
  path.dirname(configPath),
  undefined,
  configPath,
)
const program = ts.createProgram({
  rootNames: parsedConfig.fileNames,
  options: parsedConfig.options,
})
const diagnostics = [
  ...parsedConfig.errors,
  ...ts.getPreEmitDiagnostics(program),
]

if (diagnostics.length > 0) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
  }))
  process.exit(1)
}

console.log('Verified ga-ui-plus NodeNext declarations with TypeScript 5.8.3')

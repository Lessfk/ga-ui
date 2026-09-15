import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

import { apiManifest } from './api-manifest.mjs'

const docsRoot = path.dirname(
  fileURLToPath(new URL('../package.json', import.meta.url)),
)

function resolveSource(source) {
  return path.resolve(docsRoot, source)
}

function createChecker(entry) {
  const rootNames = [entry.source, entry.secondarySource]
    .filter(Boolean)
    .map(resolveSource)
  const program = ts.createProgram(rootNames, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    strictNullChecks: true,
  })

  const diagnostics = ts.getPreEmitDiagnostics(program).filter((diagnostic) => {
    if (diagnostic.code !== 2307 || !diagnostic.file) return true

    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    const match = /Cannot find module '(.+\.vue)'/.exec(message)
    if (!match) return true

    const vueFile = path.resolve(path.dirname(diagnostic.file.fileName), match[1])
    return !existsSync(vueFile)
  })
  if (diagnostics.length > 0) {
    const host = {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => docsRoot,
      getNewLine: () => '\n',
    }
    throw new Error(
      `TypeScript API extraction failed:\n${ts.formatDiagnostics(
        diagnostics,
        host,
      )}`,
    )
  }

  return { program, checker: program.getTypeChecker() }
}

function exportedSymbol(checker, sourceFile, name) {
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  if (!moduleSymbol) throw new Error(`Cannot inspect module for ${sourceFile.fileName}`)

  const symbol = checker
    .getExportsOfModule(moduleSymbol)
    .find((candidate) => candidate.name === name)

  if (!symbol) throw new Error(`Cannot find exported type ${name}`)

  return symbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(symbol)
    : symbol
}

function symbolType(checker, symbol) {
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]
  return checker.getTypeOfSymbolAtLocation(symbol, declaration)
}

function typeParameterDefaults(checker, symbol) {
  const declaration = symbol.declarations?.find(
    (candidate) =>
      (ts.isInterfaceDeclaration(candidate) ||
        ts.isTypeAliasDeclaration(candidate)) &&
      candidate.typeParameters?.length,
  )

  if (!declaration?.typeParameters) return new Map()

  return new Map(
    declaration.typeParameters.flatMap((parameter) => {
      if (!parameter.default) return []
      const type = checker.getTypeFromTypeNode(parameter.default)
      return [
        [
          parameter.name.text,
          checker.typeToString(
            type,
            undefined,
            ts.TypeFormatFlags.NoTruncation,
          ),
        ],
      ]
    }),
  )
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function applyTypeParameterDefaults(typeText, defaults) {
  let result = typeText
  for (const [name, defaultType] of defaults) {
    result = result.replace(
      new RegExp(`\\b${escapeRegExp(name)}\\b`, 'g'),
      defaultType,
    )
  }
  return result
}

function objectEntries(checker, sourceFile, typeName) {
  if (!typeName) return []

  const symbol = exportedSymbol(checker, sourceFile, typeName)
  const type = checker.getDeclaredTypeOfSymbol(symbol)
  const defaults = typeParameterDefaults(checker, symbol)

  return checker.getPropertiesOfType(type).map((property) => ({
    name: property.name,
    type: applyTypeParameterDefaults(
      checker.typeToString(
        symbolType(checker, property),
        undefined,
        ts.TypeFormatFlags.NoTruncation,
      ),
      defaults,
    ),
    required: (property.flags & ts.SymbolFlags.Optional) === 0,
  }))
}

function literalEventNames(type) {
  if (type.isUnion()) return type.types.flatMap(literalEventNames)
  return type.isStringLiteral() ? [type.value] : []
}

function eventEntries(checker, sourceFile, typeName) {
  if (!typeName) return []

  const symbol = exportedSymbol(checker, sourceFile, typeName)
  const type = checker.getDeclaredTypeOfSymbol(symbol)
  const signatures = type.getCallSignatures()
  if (signatures.length === 0) {
    throw new Error(`Unsupported event declaration: ${typeName} has no call signatures`)
  }

  const entries = signatures.flatMap((signature) => {
    const parameters = signature.getParameters()
    if (parameters.length === 0) {
      throw new Error(`Unsupported event declaration: ${typeName} has no event parameter`)
    }

    const eventType = symbolType(checker, parameters[0])
    const eventNames = literalEventNames(eventType)
    if (eventNames.length === 0) {
      throw new Error(
        `Unsupported event declaration: ${typeName} must use literal event names`,
      )
    }

    const parameterText = parameters
      .slice(1)
      .map((parameter) => {
        const declaration = parameter.valueDeclaration ?? parameter.declarations?.[0]
        const optional =
          (parameter.flags & ts.SymbolFlags.Optional) !== 0 ||
          (ts.isParameter(declaration) && Boolean(declaration.questionToken))
        let typeText = checker.typeToString(
          symbolType(checker, parameter),
          undefined,
          ts.TypeFormatFlags.NoTruncation,
        )
        if (optional) typeText = typeText.replace(/\s*\|\s*undefined$/, '')

        return `${parameter.name}${optional ? '?' : ''}: ${typeText}`
      })
      .join(', ')

    return eventNames.map((name) => ({
      name,
      type: 'event',
      required: false,
      parameters: parameterText,
    }))
  })

  const duplicate = entries.find(
    (entry, index) => entries.findIndex((item) => item.name === entry.name) !== index,
  )
  if (duplicate) {
    throw new Error(`Duplicate event declaration: ${typeName}.${duplicate.name}`)
  }

  return entries
}

function slotEntries(entry) {
  const slots = Object.entries(entry.slots ?? {}).map(([name, type]) => ({
    name,
    type: type ?? '无作用域参数',
    required: false,
  }))

  if (entry === apiManifest['search-bar']) {
    slots.push(
      ...[
        ['field-{key}', '{ field, value, disabled, update }'],
        ['prepend', '无作用域参数'],
        ['append', '无作用域参数'],
        ['actions', 'GaSearchBarActionSlotProps'],
        ['actions-prepend', 'GaSearchBarActionSlotProps'],
        ['actions-append', 'GaSearchBarActionSlotProps'],
        ['action-search', 'GaSearchBarActionSlotProps'],
        ['action-reset', 'GaSearchBarActionSlotProps'],
        ['action-collapse', 'GaSearchBarActionSlotProps'],
      ].map(([name, type]) => ({ name, type, required: false })),
    )
  }

  return slots
}

export function extractComponentApi(slug) {
  const entry = apiManifest[slug]
  if (!entry) throw new Error(`Unknown component API manifest: ${slug}`)

  const { program, checker } = createChecker(entry)
  const sourceFile = program.getSourceFile(resolveSource(entry.source))
  const secondaryFile = entry.secondarySource
    ? program.getSourceFile(resolveSource(entry.secondarySource))
    : sourceFile

  if (!sourceFile || !secondaryFile) {
    throw new Error(`Cannot load API source for ${slug}`)
  }

  return {
    props: objectEntries(checker, sourceFile, entry.props),
    events: eventEntries(checker, sourceFile, entry.emits),
    slots: slotEntries(entry),
    expose: objectEntries(checker, secondaryFile, entry.expose),
  }
}

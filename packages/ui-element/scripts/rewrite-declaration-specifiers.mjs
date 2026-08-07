import path from 'node:path'
import { writeFile } from 'node:fs/promises'

import ts from 'typescript'

function collectModuleSpecifierNodes(sourceFile) {
  const specifierNodes = []

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      specifierNodes.push(node.moduleSpecifier)
    } else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteralLike(node.argument.literal)
    ) {
      specifierNodes.push(node.argument.literal)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return specifierNodes
}

function declarationRuntimeExtension(declarationPath) {
  if (declarationPath.endsWith('.d.mts')) {
    return '.mjs'
  }

  if (declarationPath.endsWith('.d.cts')) {
    return '.cjs'
  }

  return '.js'
}

function declarationPathForRuntimeSpecifier(declarationPath, specifier) {
  const declarationSpecifier = specifier
    .replace(/\.mjs$/, '.d.mts')
    .replace(/\.cjs$/, '.d.cts')
    .replace(/\.js$/, '.d.ts')

  return path.resolve(path.dirname(declarationPath), declarationSpecifier)
}

function nodeNextSpecifier(declarationPath, specifier, declarationPaths) {
  if (/\.(?:mjs|cjs|js)$/.test(specifier)) {
    const targetPath = declarationPathForRuntimeSpecifier(
      declarationPath,
      specifier,
    )

    if (!declarationPaths.has(targetPath)) {
      throw new Error(
        `${declarationPath} has an unresolved declaration specifier: ${specifier}`,
      )
    }

    return specifier
  }

  const unresolvedPath = path.resolve(path.dirname(declarationPath), specifier)
  const directCandidates = [
    `${unresolvedPath}.d.ts`,
    `${unresolvedPath}.d.mts`,
    `${unresolvedPath}.d.cts`,
  ].filter((candidate) => declarationPaths.has(candidate))
  const directoryCandidates = [
    path.join(unresolvedPath, 'index.d.ts'),
    path.join(unresolvedPath, 'index.d.mts'),
    path.join(unresolvedPath, 'index.d.cts'),
  ].filter((candidate) => declarationPaths.has(candidate))
  const candidates = [...directCandidates, ...directoryCandidates]

  if (candidates.length !== 1) {
    throw new Error(
      `${declarationPath} must resolve ${specifier} to exactly one declaration file; found ${candidates.length}`,
    )
  }

  const targetPath = candidates[0]
  const runtimeExtension = declarationRuntimeExtension(targetPath)

  if (directoryCandidates.includes(targetPath)) {
    return `${specifier.replace(/\/$/, '')}/index${runtimeExtension}`
  }

  return `${specifier}${runtimeExtension}`
}

function rewriteDeclaration(declarationPath, content, declarationPaths) {
  const sourceFile = ts.createSourceFile(
    declarationPath,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const replacements = collectModuleSpecifierNodes(sourceFile)
    .filter((node) => node.text.startsWith('.'))
    .map((node) => ({
      start: node.getStart(sourceFile) + 1,
      end: node.getEnd() - 1,
      value: nodeNextSpecifier(declarationPath, node.text, declarationPaths),
    }))
    .filter(({ start, end, value }) => content.slice(start, end) !== value)
    .sort((left, right) => right.start - left.start)

  return replacements.reduce(
    (result, { start, end, value }) =>
      `${result.slice(0, start)}${value}${result.slice(end)}`,
    content,
  )
}

export async function rewriteDeclarationSpecifiers(emittedFiles) {
  const declarationFiles = new Map(
    [...emittedFiles.entries()]
      .filter(([filePath]) => filePath.endsWith('.d.ts'))
      .map(([filePath, content]) => [path.resolve(filePath), { filePath, content }]),
  )
  const declarationPaths = new Set(declarationFiles.keys())

  for (const [declarationPath, declaration] of declarationFiles) {
    const content = rewriteDeclaration(
      declarationPath,
      declaration.content,
      declarationPaths,
    )

    if (content !== declaration.content) {
      emittedFiles.set(declaration.filePath, content)
      await writeFile(declaration.filePath, content, 'utf8')
    }
  }
}

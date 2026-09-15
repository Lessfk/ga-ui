import { readFile, writeFile } from 'node:fs/promises'

const slugs = [
  'dialog',
  'mega-menu',
  'pagination',
  'table',
  'aside-menu',
  'search-bar',
  'table-pagination',
]
const sectionHeadings = {
  props: /^### Props$/m,
  events: /^### Events$/m,
  slots: /^### Slots$/m,
  expose: /^### Expose(?: API)?$/m,
}

function cleanCell(value) {
  const trimmed = value.trim().replaceAll('\\|', '|')
  const codeSpan = /^`([^`]*)`$/.exec(trimmed)
  return codeSpan ? codeSpan[1] : trimmed
}

function splitRow(line) {
  return line.slice(1, -1).split(/(?<!\\)\|/).map(cleanCell)
}

function splitNames(value) {
  return value
    .split(/\s+\/\s+/)
    .map(cleanCell)
    .map((name) => name.replace(/\(\)$/, ''))
}

function splitParallelValues(value, count) {
  if (!value) return Array.from({ length: count }, () => '')

  const values = value.split(/\s+\/\s+/).map(cleanCell)
  if (values.length === count) return values

  const sharedValue = cleanCell(value)
  return Array.from({ length: count }, () => sharedValue)
}

function collectTableLines(lines, start) {
  const table = []
  for (let index = start; index < lines.length; index += 1) {
    if (!lines[index].trim().startsWith('|')) break
    table.push(lines[index])
  }
  return table
}

function sectionTable(markdown, heading) {
  const match = heading.exec(markdown)
  if (!match) return []

  const section = markdown.slice(match.index + match[0].length).split(/^### /m)[0]
  const lines = section.split(/\r?\n/)
  const start = lines.findIndex((line) => line.trim().startsWith('|'))
  if (start < 0) return []

  const table = collectTableLines(lines, start)
  const rows = table
    .filter((line) => line.trim().startsWith('|'))
    .map(splitRow)

  return rows.slice(2).map((cells) =>
    Object.fromEntries(
      rows[0].map((header, index) => [header, cells[index] ?? '']),
    ),
  )
}

function parseGeneratedSource(source) {
  const json = source
    .replace(/^.*?=\s*/s, '')
    .replace(/\s+as const\s*$/s, '')
  return JSON.parse(json)
}

function entryNames(api, section) {
  return new Set(api[section].map((entry) => entry.name))
}

function assertUniqueExtras(slug, result) {
  for (const [section, entries] of Object.entries(result.extra)) {
    const names = new Set()
    for (const entry of entries) {
      if (names.has(entry.name)) {
        throw new Error(`Duplicate manual API: ${slug}.${section}.${entry.name}`)
      }
      names.add(entry.name)
    }
  }
}

const generatedSource = await readFile(
  new URL('../src/generated/component-api.ts', import.meta.url),
  'utf8',
)
const generated = parseGeneratedSource(generatedSource)
const allOverrides = {}

for (const slug of slugs) {
  const markdown = await readFile(
    new URL(`../site/components/${slug}.md`, import.meta.url),
    'utf8',
  )
  const result = { extra: {} }

  for (const [section, heading] of Object.entries(sectionHeadings)) {
    const known = entryNames(generated[slug], section)
    for (const row of sectionTable(markdown, heading)) {
      const nameCell =
        row['属性'] ??
        row['属性或方法'] ??
        row['方法'] ??
        row['事件'] ??
        row['插槽'] ??
        ''

      const names = splitNames(nameCell)
      const defaults = splitParallelValues(row['默认值'] ?? '', names.length)
      const types = splitParallelValues(row['类型'] ?? '', names.length)

      for (const [index, name] of names.entries()) {
        if (!name) continue

        const patch = {
          description: row['说明'] || '参见组件公开类型定义',
          ...(defaults[index] ? { default: defaults[index] } : {}),
          ...(row['参数'] || row['作用域']
            ? { parameters: row['参数'] || row['作用域'] }
            : {}),
        }

        if (known.has(name)) {
          result[section] ??= {}
          result[section][name] = patch
        } else {
          result.extra[section] ??= []
          result.extra[section].push({
            name,
            type: section === 'events' ? 'event' : types[index] || '未声明',
            ...patch,
          })
        }
      }
    }

    for (const entry of generated[slug][section]) {
      result[section] ??= {}
      result[section][entry.name] ??= {
        description: `${entry.name} 配置，类型以组件公开声明为准。`,
      }
    }
  }

  assertUniqueExtras(slug, result)
  if (Object.keys(result.extra).length === 0) delete result.extra
  allOverrides[slug] = result
}

const output =
  "import type { generatedComponentApi } from '../generated/component-api'\n" +
  "import type { ApiOverrides } from './api'\n\n" +
  `export const apiOverrides = ${JSON.stringify(
    allOverrides,
    null,
    2,
  )} satisfies Record<keyof typeof generatedComponentApi, ApiOverrides>\n`

await writeFile(
  new URL('../src/content/api-overrides.ts', import.meta.url),
  output,
  'utf8',
)

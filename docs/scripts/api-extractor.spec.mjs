import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { extractComponentApi } from './api-extractor.mjs'
import { apiManifest } from './api-manifest.mjs'

test('extracts required and optional search bar props', () => {
  const api = extractComponentApi('search-bar')
  const modelValue = api.props.find((item) => item.name === 'modelValue')
  const actionsLoading = api.props.find((item) => item.name === 'actionsLoading')

  assert.equal(modelValue.required, true)
  assert.equal(actionsLoading.required, false)
  assert.match(actionsLoading.type, /boolean/)
})

test('extracts literal event names and expose methods', () => {
  const dialog = extractComponentApi('dialog')
  const searchBar = extractComponentApi('search-bar')

  assert.equal(dialog.events.some((item) => item.name === 'closed'), true)
  assert.equal(searchBar.events.some((item) => item.name === 'search'), true)
  assert.equal(searchBar.expose.some((item) => item.name === 'reset'), true)
})

test('extracts named slot scope types', () => {
  const megaMenu = extractComponentApi('mega-menu')

  assert.equal(megaMenu.slots.some((item) => item.name === 'menu-item'), true)
  assert.match(
    megaMenu.slots.find((item) => item.name === 'panel-item').type,
    /GaMegaMenuPanelItemSlotProps/,
  )
})

test('preserves undefined unions and optional event parameters', () => {
  const megaMenu = extractComponentApi('mega-menu')
  const table = extractComponentApi('table')
  const asideMenu = extractComponentApi('aside-menu')

  assert.match(
    megaMenu.props.find((item) => item.name === 'openKey').type,
    /undefined/,
  )
  assert.match(
    megaMenu.events.find((item) => item.name === 'update:openKey').parameters,
    /key: GaMegaMenuKey \| undefined/,
  )
  assert.match(
    table.expose.find((item) => item.name === 'tableRef').type,
    /undefined/,
  )
  assert.match(
    asideMenu.events.find((item) => item.name === 'select').parameters,
    /routerResult\?: Promise<unknown>/,
  )
})

test('applies declared generic defaults to generated property types', () => {
  const table = extractComponentApi('table')
  const tablePagination = extractComponentApi('table-pagination')

  assert.equal(
    table.props.find((item) => item.name === 'data').type,
    'GaTableRow[] | undefined',
  )
  assert.equal(
    table.props.find((item) => item.name === 'columns').type,
    'GaTableColumn<GaTableRow>[] | undefined',
  )
  assert.equal(
    tablePagination.props.find((item) => item.name === 'rowKey').type,
    'GaTableRowKey<GaTableRow> | undefined',
  )
})

test('rejects compiler diagnostics and unsupported event declarations', async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'ga-ui-api-'))
  const diagnosticSource = path.join(temporaryRoot, 'diagnostic.ts')
  const unsupportedSource = path.join(temporaryRoot, 'unsupported.ts')
  const emptySource = path.join(temporaryRoot, 'empty.ts')
  const missingVueSource = path.join(temporaryRoot, 'missing-vue.ts')

  await writeFile(
    diagnosticSource,
    "import type { Missing } from './missing'\nexport interface BrokenProps { value?: Missing }\n",
    'utf8',
  )
  await writeFile(
    unsupportedSource,
    'export interface UnsupportedEmits { (event: string): void }\n',
    'utf8',
  )
  await writeFile(
    emptySource,
    'export interface EmptyEmits {}\n',
    'utf8',
  )
  await writeFile(
    missingVueSource,
    "import type Missing from './Missing.vue'\nexport interface MissingVueProps { value?: Missing }\n",
    'utf8',
  )

  apiManifest.diagnostic = {
    source: diagnosticSource,
    props: 'BrokenProps',
    emits: null,
    expose: null,
    slots: {},
  }
  apiManifest.unsupported = {
    source: unsupportedSource,
    props: null,
    emits: 'UnsupportedEmits',
    expose: null,
    slots: {},
  }
  apiManifest.empty = {
    source: emptySource,
    props: null,
    emits: 'EmptyEmits',
    expose: null,
    slots: {},
  }
  apiManifest['missing-vue'] = {
    source: missingVueSource,
    props: 'MissingVueProps',
    emits: null,
    expose: null,
    slots: {},
  }

  try {
    assert.throws(
      () => extractComponentApi('diagnostic'),
      /TypeScript API extraction failed/,
    )
    assert.throws(
      () => extractComponentApi('unsupported'),
      /Unsupported event declaration/,
    )
    assert.throws(
      () => extractComponentApi('empty'),
      /Unsupported event declaration/,
    )
    assert.throws(
      () => extractComponentApi('missing-vue'),
      /TypeScript API extraction failed/,
    )
  } finally {
    delete apiManifest.diagnostic
    delete apiManifest.unsupported
    delete apiManifest.empty
    delete apiManifest['missing-vue']
    await rm(temporaryRoot, { recursive: true, force: true })
  }
})

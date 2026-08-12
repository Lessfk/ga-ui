import { describe, expect, it } from 'vitest'

import type { GaAsideMenuNode } from '../../types'
import {
  getAsideMenuConfigurationWarnings,
  normalizeAsideMenuNodes,
} from '../menu-items'

describe('GaAsideMenu menu item helpers', () => {
  it('treats omitted node configuration as empty', () => {
    expect(normalizeAsideMenuNodes(undefined)).toEqual([])
    expect(getAsideMenuConfigurationWarnings(undefined, true)).toEqual([])
  })

  it('ignores malformed nodes without blocking valid siblings', () => {
    const nodes = [
      { type: 'item', index: 42, label: 'Broken index' },
      {
        type: 'submenu',
        index: 'broken-children',
        label: 'Broken children',
        children: null,
      },
      null,
      { type: 'unknown', label: 'Unknown' },
      { type: 'item', index: 'users', label: 'Users' },
    ] as unknown as readonly GaAsideMenuNode[]

    expect(normalizeAsideMenuNodes(nodes)).toEqual([
      { type: 'item', index: 'users', label: 'Users' },
    ])
    expect(getAsideMenuConfigurationWarnings(nodes, false)).toEqual([
      'Menu item "Broken index" requires a non-empty index.',
      'Submenu "broken-children" requires children to be an array.',
      'Invalid menu node was ignored.',
    ])
  })

  it('filters hidden nodes and empty containers without mutating input', () => {
    const nodes: GaAsideMenuNode[] = [
      { type: 'item', index: 'visible', label: 'Visible' },
      { type: 'item', index: 'hidden', label: 'Hidden', hidden: true },
      {
        type: 'submenu',
        index: 'empty-submenu',
        label: 'Empty submenu',
        children: [
          { type: 'item', index: 'hidden-child', label: 'Hidden', hidden: true },
        ],
      },
      {
        type: 'group',
        label: 'Reports',
        children: [
          { type: 'item', index: 'report', label: 'Report' },
          { type: 'item', index: 'hidden-report', label: 'Hidden', hidden: true },
        ],
      },
    ]
    const snapshot = structuredClone(nodes)

    expect(normalizeAsideMenuNodes(nodes)).toEqual([
      { type: 'item', index: 'visible', label: 'Visible' },
      {
        type: 'group',
        label: 'Reports',
        children: [{ type: 'item', index: 'report', label: 'Report' }],
      },
    ])
    expect(nodes).toEqual(snapshot)
  })

  it('reports empty and duplicate indexes plus empty visible containers', () => {
    const nodes: GaAsideMenuNode[] = [
      { type: 'item', index: '', label: 'No index' },
      { type: 'item', index: 'users', label: 'Users' },
      { type: 'item', index: 'users', label: 'Duplicate users' },
      {
        type: 'submenu',
        index: 'system',
        label: 'System',
        children: [
          { type: 'item', index: 'hidden', label: 'Hidden', hidden: true },
        ],
      },
      { type: 'group', label: 'Empty group', children: [] },
    ]

    expect(getAsideMenuConfigurationWarnings(nodes, false)).toEqual([
      'Menu item "No index" requires a non-empty index.',
      'Duplicate menu index "users".',
      'Submenu "system" has no visible children.',
      'Menu group "Empty group" has no visible children.',
    ])
  })

  it('reports when the default slot takes priority over items', () => {
    expect(
      getAsideMenuConfigurationWarnings(
        [{ type: 'item', index: 'users', label: 'Users' }],
        true,
      ),
    ).toContain(
      'The default slot and items were both provided; the default slot takes precedence.',
    )
  })
})

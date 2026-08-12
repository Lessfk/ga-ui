import type {
  GaAsideMenuGroup,
  GaAsideMenuItem,
  GaAsideMenuNode,
  GaAsideSubMenu,
} from '../types'

const hasVisibleChildren = (
  node: GaAsideSubMenu | GaAsideMenuGroup,
) => normalizeAsideMenuNodes(node.children).length > 0

export function normalizeAsideMenuNodes(
  nodes: readonly GaAsideMenuNode[],
): GaAsideMenuNode[] {
  return nodes.flatMap((node) => {
    if (node.hidden) return []
    if (node.type === 'item') return [node]

    const children = normalizeAsideMenuNodes(node.children)
    if (children.length === 0) return []

    if (node.type === 'group') {
      return [
        {
          ...node,
          children: children as Array<GaAsideMenuItem | GaAsideSubMenu>,
        },
      ]
    }

    return [{ ...node, children }]
  })
}

export function getAsideMenuConfigurationWarnings(
  nodes: readonly GaAsideMenuNode[],
  hasDefaultSlot: boolean,
): string[] {
  const warnings: string[] = []
  const indexes = new Set<string>()

  if (hasDefaultSlot && nodes.length > 0) {
    warnings.push(
      'The default slot and items were both provided; the default slot takes precedence.',
    )
  }

  const visit = (node: GaAsideMenuNode) => {
    if (node.hidden) return

    if (node.type !== 'group') {
      const index = node.index.trim()

      if (!index) {
        const type = node.type === 'item' ? 'Menu item' : 'Submenu'
        warnings.push(`${type} "${node.label}" requires a non-empty index.`)
      } else if (indexes.has(index)) {
        warnings.push(`Duplicate menu index "${index}".`)
      } else {
        indexes.add(index)
      }
    }

    if (node.type === 'item') return

    if (!hasVisibleChildren(node)) {
      const type = node.type === 'group' ? 'Menu group' : 'Submenu'
      const name = node.type === 'group' ? node.label : node.index
      warnings.push(`${type} "${name}" has no visible children.`)
    }

    node.children.forEach(visit)
  }

  nodes.forEach(visit)
  return [...new Set(warnings)]
}

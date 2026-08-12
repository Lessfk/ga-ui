import type {
  GaAsideMenuGroup,
  GaAsideMenuItem,
  GaAsideMenuNode,
  GaAsideSubMenu,
} from '../types'

type AsideMenuNodeRecord = Record<string, unknown>

const isNodeRecord = (node: unknown): node is AsideMenuNodeRecord =>
  typeof node === 'object' && node !== null

const hasValidIndex = (node: AsideMenuNodeRecord) =>
  typeof node.index === 'string' && node.index.trim().length > 0

const isContainer = (
  node: AsideMenuNodeRecord,
): node is AsideMenuNodeRecord & { type: 'group' | 'submenu' } =>
  node.type === 'group' || node.type === 'submenu'

const normalizeNodes = (nodes: unknown): GaAsideMenuNode[] => {
  if (!Array.isArray(nodes)) return []

  return nodes.flatMap<GaAsideMenuNode>((node) => {
    if (!isNodeRecord(node) || node.hidden === true) return []

    if (node.type === 'item') {
      return hasValidIndex(node) ? [node as unknown as GaAsideMenuItem] : []
    }

    if (!isContainer(node)) return []
    if (node.type === 'submenu' && !hasValidIndex(node)) return []
    if (!Array.isArray(node.children)) return []

    const children = normalizeNodes(node.children)
    if (children.length === 0) return []

    if (node.type === 'group') {
      return [
        {
          ...node,
          children: children as Array<GaAsideMenuItem | GaAsideSubMenu>,
        } as GaAsideMenuGroup,
      ]
    }

    return [{ ...node, children } as GaAsideSubMenu]
  })
}

const nodeLabel = (node: AsideMenuNodeRecord) =>
  typeof node.label === 'string' ? node.label : ''

const hasVisibleChildren = (node: AsideMenuNodeRecord) =>
  normalizeNodes(node.children).length > 0

export function normalizeAsideMenuNodes(
  nodes: readonly GaAsideMenuNode[] | undefined,
): GaAsideMenuNode[] {
  return normalizeNodes(nodes)
}

export function getAsideMenuConfigurationWarnings(
  nodes: readonly GaAsideMenuNode[] | undefined,
  hasDefaultSlot: boolean,
): string[] {
  const configuredNodes: readonly unknown[] = Array.isArray(nodes) ? nodes : []
  const warnings: string[] = []
  const indexes = new Set<string>()

  if (hasDefaultSlot && configuredNodes.length > 0) {
    warnings.push(
      'The default slot and items were both provided; the default slot takes precedence.',
    )
  }

  const visit = (node: unknown) => {
    if (!isNodeRecord(node)) {
      warnings.push('Invalid menu node was ignored.')
      return
    }

    if (node.hidden === true) return

    if (node.type !== 'item' && !isContainer(node)) {
      warnings.push('Invalid menu node was ignored.')
      return
    }

    if (node.type !== 'group') {
      const index = typeof node.index === 'string' ? node.index.trim() : ''

      if (!index) {
        const type = node.type === 'item' ? 'Menu item' : 'Submenu'
        warnings.push(
          `${type} "${nodeLabel(node)}" requires a non-empty index.`,
        )
      } else if (indexes.has(index)) {
        warnings.push(`Duplicate menu index "${index}".`)
      } else {
        indexes.add(index)
      }
    }

    if (node.type === 'item') return

    if (!Array.isArray(node.children)) {
      const type = node.type === 'group' ? 'Menu group' : 'Submenu'
      const name = node.type === 'group' ? nodeLabel(node) : node.index
      warnings.push(
        `${type} "${String(name ?? '')}" requires children to be an array.`,
      )
      return
    }

    if (!hasVisibleChildren(node)) {
      const type = node.type === 'group' ? 'Menu group' : 'Submenu'
      const name = node.type === 'group' ? nodeLabel(node) : node.index
      warnings.push(`${type} "${name}" has no visible children.`)
    }

    node.children.forEach(visit)
  }

  configuredNodes.forEach(visit)
  return [...new Set(warnings)]
}

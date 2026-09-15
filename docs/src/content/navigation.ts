import type {
  ComponentCatalogItem,
  NavigationGroup,
  SearchEntry,
} from './types'

const categoryLabels = {
  base: '基础组件',
  business: '业务组件',
} as const

export function buildComponentGroups(
  catalog: ComponentCatalogItem[],
): NavigationGroup[] {
  return (['base', 'business'] as const).map((key) => ({
    key,
    label: categoryLabels[key],
    items: catalog.filter((item) => item.category === key),
  }))
}

export function buildSearchEntries(
  catalog: ComponentCatalogItem[],
): SearchEntry[] {
  return catalog.map((item) => ({
    label: item.title,
    description: item.description,
    path: `/components/${item.slug}`,
    keywords: [item.name, item.slug, item.title],
  }))
}

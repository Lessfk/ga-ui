import { generatedComponentApi } from '../generated/component-api'
import { mergeComponentApi } from './api'
import { apiOverrides } from './api-overrides'
import { componentCatalog } from './catalog'
import type { ApiSectionName, SearchEntry } from './types'

const sectionLabels: Record<ApiSectionName, string> = {
  props: 'Props',
  events: 'Events',
  slots: 'Slots',
  expose: 'Expose',
}

function hasGeneratedApi(
  slug: string,
): slug is keyof typeof generatedComponentApi {
  return Object.prototype.hasOwnProperty.call(generatedComponentApi, slug)
}

export function createSearchEntries(): SearchEntry[] {
  return componentCatalog.flatMap((component) => {
    if (!hasGeneratedApi(component.slug)) {
      throw new Error(`Missing generated component API: ${component.slug}`)
    }
    const slug = component.slug
    const api = mergeComponentApi(
      slug,
      generatedComponentApi[slug],
      apiOverrides[slug],
    )
    const componentEntry: SearchEntry = {
      label: component.title,
      description: component.description,
      path: `/components/${component.slug}`,
      keywords: [component.name, component.slug, component.title],
      meta: '组件',
    }
    const apiEntries = (Object.keys(api) as ApiSectionName[]).flatMap(
      (section) =>
        api[section].map((entry) => ({
          label: entry.name,
          description: entry.description ?? '',
          path: `/components/${component.slug}#${section}`,
          keywords: [
            entry.name,
            component.name,
            component.title,
            sectionLabels[section],
          ],
          meta: `${component.title} · ${sectionLabels[section]}`,
        })),
    )
    return [componentEntry, ...apiEntries]
  })
}

function scoreEntry(query: string, entry: SearchEntry): number {
  const values = [entry.label, ...entry.keywords].map((value) =>
    value.toLocaleLowerCase('zh-CN'),
  )
  const componentBonus = entry.meta === '组件' ? -5 : 0
  if (values.some((value) => value === query)) return componentBonus
  if (values.some((value) => value.startsWith(query))) return 10 + componentBonus
  if (values.some((value) => value.includes(query))) return 20 + componentBonus
  if (entry.description.toLocaleLowerCase('zh-CN').includes(query)) {
    return 30 + componentBonus
  }
  return Number.POSITIVE_INFINITY
}

export function searchDocs(
  query: string,
  entries: SearchEntry[],
): SearchEntry[] {
  const normalized = query.trim().toLocaleLowerCase('zh-CN')
  if (!normalized) return []

  return entries
    .map((entry) => ({ entry, score: scoreEntry(normalized, entry) }))
    .filter((result) => Number.isFinite(result.score))
    .sort(
      (left, right) =>
        left.score - right.score ||
        left.entry.label.localeCompare(right.entry.label, 'zh-CN'),
    )
    .slice(0, 12)
    .map((result) => result.entry)
}

import type {
  ApiEntry,
  ApiSectionName,
  ComponentApiDefinition,
  ReadonlyComponentApiDefinition,
} from './types'

type EntryPatch = Pick<ApiEntry, 'description' | 'default' | 'parameters'>
type SectionOverrides = Partial<Record<string, EntryPatch>>

export interface ApiOverrides {
  props?: SectionOverrides
  events?: SectionOverrides
  slots?: SectionOverrides
  expose?: SectionOverrides
  extra?: Partial<Record<ApiSectionName, ApiEntry[]>>
}

export function mergeComponentApi(
  slug: string,
  generated: ReadonlyComponentApiDefinition,
  overrides: ApiOverrides,
): ComponentApiDefinition {
  const sections: ApiSectionName[] = ['props', 'events', 'slots', 'expose']

  return Object.fromEntries(
    sections.map((section) => {
      const entries = generated[section].map((entry) => ({ ...entry }))
      const patches = overrides[section] ?? {}

      for (const [name, patch] of Object.entries(patches)) {
        const entry = entries.find((candidate) => candidate.name === name)
        if (!entry) {
          throw new Error(`Unknown API override: ${slug}.${section}.${name}`)
        }
        Object.assign(entry, patch)
      }

      const extras = overrides.extra?.[section] ?? []
      const extraNames = new Set<string>()
      const duplicate = extras.find((extra) => {
        if (entries.some((entry) => entry.name === extra.name)) return true
        if (extraNames.has(extra.name)) return true
        extraNames.add(extra.name)
        return false
      })
      if (duplicate) {
        throw new Error(
          `Duplicate manual API: ${slug}.${section}.${duplicate.name}`,
        )
      }

      return [section, [...entries, ...extras.map((entry) => ({ ...entry }))]]
    }),
  ) as unknown as ComponentApiDefinition
}

export function assertApiDescriptions(
  slug: string,
  api: ComponentApiDefinition,
): void {
  for (const [section, entries] of Object.entries(api)) {
    for (const entry of entries) {
      if (!entry.description?.trim()) {
        throw new Error(
          `Missing API description: ${slug}.${section}.${entry.name}`,
        )
      }
    }
  }
}

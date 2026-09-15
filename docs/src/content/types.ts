import type { Component } from 'vue'

export type ComponentCategory = 'base' | 'business'
export type ApiSectionName = 'props' | 'events' | 'slots' | 'expose'

export interface ComponentCatalogItem {
  name: string
  slug: string
  title: string
  category: ComponentCategory
  description: string
}

export interface DemoDefinition {
  id: string
  title: string
  description: string
  component: Component
  source: string
}

export interface ApiEntry {
  name: string
  type: string
  required?: boolean
  default?: string
  description?: string
  parameters?: string
}

export interface ComponentApiDefinition {
  props: ApiEntry[]
  events: ApiEntry[]
  slots: ApiEntry[]
  expose: ApiEntry[]
}

export type ReadonlyComponentApiDefinition = {
  readonly [Section in ApiSectionName]: readonly ApiEntry[]
}

export interface ComponentDocDefinition extends ComponentCatalogItem {
  importCode: string
  usage: string
  demos: DemoDefinition[]
  api: ComponentApiDefinition
  notes: string[]
}

export interface NavigationGroup {
  key: ComponentCategory
  label: string
  items: ComponentCatalogItem[]
}

export interface SearchEntry {
  label: string
  description: string
  path: string
  keywords: string[]
  meta?: string
}

export interface GuideSection {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
  code?: string
  language?: string
}

export interface GuideDefinition {
  slug: string
  title: string
  description: string
  sections: GuideSection[]
}

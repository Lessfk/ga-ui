import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'

export interface PageOutlineItem {
  id: string
  label: string
  level: 2 | 3
}

interface PageOutlineContext {
  items: Ref<PageOutlineItem[]>
  setItems: (items: PageOutlineItem[]) => void
}

const pageOutlineKey: InjectionKey<PageOutlineContext> = Symbol('page-outline')

export function providePageOutline(): PageOutlineContext {
  const items = ref<PageOutlineItem[]>([])
  const context = {
    items,
    setItems: (value: PageOutlineItem[]) => {
      items.value = value
    },
  }
  provide(pageOutlineKey, context)
  return context
}

export function usePageOutline(): PageOutlineContext {
  const context = inject(pageOutlineKey)
  if (!context) throw new Error('Page outline provider is missing')
  return context
}

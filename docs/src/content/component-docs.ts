import type { ComponentDocDefinition } from './types'

type ComponentDocModule = { default: ComponentDocDefinition }
export type ComponentDocModules = Record<
  string,
  () => Promise<ComponentDocModule>
>

const defaultModules = import.meta.glob<ComponentDocModule>('./components/*.ts')

export function createComponentDocLoader(
  modules: ComponentDocModules = defaultModules,
) {
  return async (slug: string): Promise<ComponentDocDefinition> => {
    const loader = modules[`./components/${slug}.ts`]
    if (!loader) throw new Error(`Unknown component document: ${slug}`)
    return (await loader()).default
  }
}

export const loadComponentDoc = createComponentDocLoader()

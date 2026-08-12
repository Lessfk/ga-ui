import type { MenuInstance } from 'element-plus'
import { nextTick, ref, watch } from 'vue'
import type { Ref } from 'vue'

import type { GaAsideMenuProps } from '../types'

interface UseAsideMenuStateOptions {
  props: Readonly<
    Pick<GaAsideMenuProps, 'collapse' | 'active' | 'defaultActive'>
  >
  menuRef: Ref<MenuInstance | undefined>
  onCollapseUpdate: (value: boolean) => void
  onToggle: (value: boolean) => void
  onActiveUpdate: (value: string) => void
}

export function useAsideMenuState(options: UseAsideMenuStateOptions) {
  const currentCollapse = ref(options.props.collapse ?? false)
  const currentActive = ref(
    options.props.active ?? options.props.defaultActive ?? '',
  )

  watch(
    () => options.props.collapse,
    (value) => {
      currentCollapse.value = value ?? false
    },
  )
  watch(
    () => options.props.active,
    (value) => {
      if (value === undefined) return
      currentActive.value = value
      void nextTick(() => options.menuRef.value?.updateActiveIndex(value))
    },
  )

  const setCollapse = (value: boolean) => {
    if (currentCollapse.value === value) return
    currentCollapse.value = value
    options.onCollapseUpdate(value)
    options.onToggle(value)
  }

  const toggleCollapse = () => {
    setCollapse(!currentCollapse.value)
  }

  const selectActive = (value: string) => {
    if (currentActive.value === value) return
    currentActive.value = value
    options.onActiveUpdate(value)
  }

  return { currentActive, currentCollapse, selectActive, toggleCollapse }
}

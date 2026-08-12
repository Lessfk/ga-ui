import { Fragment, cloneVNode, defineComponent, isVNode } from 'vue'
import type { Component, Slot, VNode, VNodeChild } from 'vue'
import { ElMenuItem, ElMenuItemGroup, ElSubMenu } from 'element-plus'

const activeClass = 'ga-aside-menu__submenu--active'
const popperClass = 'ga-aside-menu__submenu-popper'

const componentName = (component: VNode['type']) => {
  if (typeof component !== 'object' && typeof component !== 'function') return
  return (component as Component & { name?: string }).name
}

const isComponent = (
  vnode: VNode,
  component: Component,
  name: string,
) => vnode.type === component || componentName(vnode.type) === name

const vnodeSlots = (vnode: VNode): Record<string, unknown> | undefined =>
  typeof vnode.children === 'object' &&
  vnode.children !== null &&
  !Array.isArray(vnode.children)
    ? (vnode.children as Record<string, unknown>)
    : undefined

const processChildren = (
  children: VNodeChild | readonly VNodeChild[],
  active: string,
  popperClassFallback?: string,
): { children: VNodeChild[]; containsActive: boolean } => {
  let containsActive = false
  const childNodes = (
    Array.isArray(children) ? [...children] : [children]
  ) as VNodeChild[]
  const processedChildren = childNodes.map((child) => {
    const processed = processChild(child, active, popperClassFallback)
    containsActive ||= processed.containsActive
    return processed.child
  })

  return { children: processedChildren, containsActive }
}

const processChild = (
  child: VNodeChild,
  active: string,
  popperClassFallback?: string,
): { child: VNodeChild; containsActive: boolean } => {
  if (!isVNode(child)) return { child, containsActive: false }

  if (isComponent(child, ElMenuItem, 'ElMenuItem')) {
    return {
      child,
      containsActive: child.props?.index === active,
    }
  }

  if (child.type === Fragment && Array.isArray(child.children)) {
    const processed = processChildren(
      child.children,
      active,
      popperClassFallback,
    )
    const cloned = cloneVNode(child)
    cloned.children = processed.children
    return { child: cloned, containsActive: processed.containsActive }
  }

  const isSubMenu = isComponent(child, ElSubMenu, 'ElSubMenu')
  const isItemGroup = isComponent(child, ElMenuItemGroup, 'ElMenuItemGroup')

  if (!isSubMenu && !isItemGroup) {
    return { child, containsActive: false }
  }

  const slots = vnodeSlots(child)
  const defaultSlot = slots?.default

  if (typeof defaultSlot !== 'function') {
    return { child, containsActive: false }
  }

  const processed = processChildren(
    (defaultSlot as Slot)(),
    active,
    popperClassFallback,
  )
  const userPopperClass = child.props?.popperClass ?? popperClassFallback
  const cloned = cloneVNode(child, {
    ...(isSubMenu && processed.containsActive ? { class: activeClass } : {}),
    ...(isSubMenu
      ? {
          popperClass: [userPopperClass, popperClass]
            .filter(Boolean)
            .join(' '),
        }
      : {}),
  })
  cloned.children = {
    ...slots,
    default: () => processed.children,
  }

  return {
    child: cloned,
    containsActive: processed.containsActive,
  }
}

export default defineComponent({
  name: 'GaMenuSlotTree',
  props: {
    active: {
      type: String,
      required: true,
    },
    popperClassFallback: String,
  },
  setup(props, { slots }) {
    return () =>
      processChildren(
        slots.default?.() ?? [],
        props.active,
        props.popperClassFallback,
      ).children
  },
})

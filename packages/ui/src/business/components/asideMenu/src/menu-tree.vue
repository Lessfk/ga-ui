<template>
  <template
    v-for="(node, nodeIndex) in props.nodes"
    :key="nodeKey(node, nodeIndex)"
  >
    <ElMenuItem
      v-if="node.type === 'item'"
      :index="node.index"
      :disabled="node.disabled"
    >
      <ElIcon v-if="node.icon" aria-hidden="true">
        <component :is="node.icon" />
      </ElIcon>
      <template #title>{{ node.label }}</template>
    </ElMenuItem>
    <ElSubMenu
      v-else-if="node.type === 'submenu'"
      :index="node.index"
      :disabled="node.disabled"
      :popper-class="submenuPopperClass"
      :class="{
        'ga-aside-menu__submenu--active': containsActive(node.children),
      }"
    >
      <template #title>
        <ElIcon v-if="node.icon" aria-hidden="true">
          <component :is="node.icon" />
        </ElIcon>
        <span>{{ node.label }}</span>
      </template>
      <GaMenuTree
        :nodes="node.children"
        :active="props.active"
        :popper-class-fallback="props.popperClassFallback"
      />
    </ElSubMenu>
    <ElMenuItemGroup v-else :title="node.label">
      <GaMenuTree
        :nodes="node.children"
        :active="props.active"
        :popper-class-fallback="props.popperClassFallback"
      />
    </ElMenuItemGroup>
  </template>
</template>

<script setup lang="ts">
import { ElIcon, ElMenuItem, ElMenuItemGroup, ElSubMenu } from 'element-plus'
import { computed } from 'vue'

import type { GaAsideMenuNode } from '../types'

defineOptions({ name: 'GaMenuTree' })

const props = withDefaults(
  defineProps<{
    nodes: readonly GaAsideMenuNode[]
    active?: string
    popperClassFallback?: string
  }>(),
  { active: '' },
)

const submenuPopperClass = computed(() =>
  [props.popperClassFallback, 'ga-aside-menu__submenu-popper']
    .filter(Boolean)
    .join(' '),
)

const containsActive = (nodes: readonly GaAsideMenuNode[]): boolean =>
  nodes.some((node) => {
    if (node.type === 'item') return node.index === props.active
    return containsActive(node.children)
  })

const nodeKey = (node: GaAsideMenuNode, nodeIndex: number) =>
  node.type === 'group'
    ? `group:${node.label}:${nodeIndex}`
    : `${node.type}:${node.index}`
</script>

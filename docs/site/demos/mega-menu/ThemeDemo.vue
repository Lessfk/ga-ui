<script setup lang="ts">
import { Grid, Operation, Tickets } from '@element-plus/icons-vue'
import { markRaw, ref } from 'vue'
import type {
  GaMegaMenuKey,
  GaMegaMenuNavItem,
  GaMegaMenuTheme,
} from 'ga-ui-plus/base'

const activeKey = ref<GaMegaMenuKey>('orders')

const menus: GaMegaMenuNavItem[] = [
  { key: 'dashboard', label: '工作台', icon: markRaw(Grid) },
  {
    key: 'operations',
    label: '运营中心',
    icon: markRaw(Operation),
    groups: [
      {
        key: 'order-group',
        title: '订单业务',
        items: [
          {
            key: 'orders',
            label: '订单管理',
            description: '查询和处理业务订单',
            icon: markRaw(Tickets),
          },
        ],
      },
    ],
  },
]

const theme: GaMegaMenuTheme = {
  menuBackgroundColor: '#163d38',
  menuItemBackgroundColor: '#24564e',
  menuItemHoverBackgroundColor: '#2d675d',
  menuItemActiveBackgroundColor: '#087b62',
  menuItemFontSize: 15,
  menuItemBorderRadius: 6,
  panelBackgroundColor: '#f5faf8',
  panelBorderColor: '#bfd8d1',
  panelGroupTitleColor: '#526f68',
  panelItemTextColor: '#173d35',
  panelItemBackgroundColor: '#ffffff',
  panelItemBorderColor: '#d5e5e0',
  panelItemHoverBackgroundColor: '#e7f4f0',
  panelItemActiveBackgroundColor: '#cfeae2',
  panelItemDescriptionColor: '#617a74',
  panelItemIconColor: '#087b62',
  panelItemIconBackgroundColor: '#dff1eb',
}
</script>

<template>
  <div class="theme-demo">
    <GaMegaMenu
      v-model:active-key="activeKey"
      :menus="menus"
      :theme="theme"
      :max-column-width="300"
    />
  </div>
</template>

<style scoped>
.theme-demo {
  min-width: 620px;
  height: 70px;
  background: #163d38;
}

.theme-demo :deep(.ga-mega-menu) {
  height: 100%;
}
</style>

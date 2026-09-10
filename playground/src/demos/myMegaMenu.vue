<template>
  <div class="myMegaMenu">
    <GaMegaMenu v-model:active-key="activeKey" v-model:open-key="openKey" :menus="menus" trigger="hover" :theme="themes"
      @select="handleSelect"></GaMegaMenu>

  </div>


</template>

<script setup lang="ts">
import { GaMegaMenu } from 'ga-ui-plus/base'
import { computed, markRaw, ref } from 'vue'
import {
  Bell,
  DataAnalysis,
  Document,
  House,
  Lock,
  Monitor,
  Setting,
  Tickets,
  User,
} from '@element-plus/icons-vue'
import {
  ElAvatar,
  ElButton,
  ElSegmented,
  ElSlider,
} from 'element-plus'
import type {
  GaMegaMenuExpose,
  GaMegaMenuKey,
  GaMegaMenuNavItem,
  GaMegaMenuSelectPayload,
  GaMegaMenuTheme,
  GaMegaMenuTrigger,
} from 'ga-ui-plus/base'

const activeKey = ref<GaMegaMenuKey>('overview')
const openKey = ref<GaMegaMenuKey | undefined>()

const menus: GaMegaMenuNavItem[] = [
  {
    key: 'home',
    label: '工作台',
    icon: markRaw(House),
  },
  {
    key: 'system',
    label: '系统管理',
    icon: markRaw(Monitor),
    groups: [
      {
        key: 'organization',
        title: '组织与权限',
        items: [
          {
            key: 'users',
            label: '用户管理',
            description: '管理用户账号、状态和基础资料',
            icon: markRaw(User),
          },
          {
            key: 'permissions',
            label: '角色权限',
            description: '配置角色权限和数据访问范围',
            icon: markRaw(Lock),
          },
        ],
      },
      {
        key: 'organization',
        title: '组织与权限',
        items: [
          {
            key: 'users',
            label: '用户管理',
            description: '管理用户账号、状态和基础资料',
            icon: markRaw(User),
          },
          {
            key: 'permissions',
            label: '角色权限',
            description: '配置角色权限和数据访问范围',
            icon: markRaw(Lock),
          },
        ],
      },
      {
        key: 'organization',
        title: '组织与权限',
        items: [
          {
            key: 'users',
            label: '用户管理',
            description: '管理用户账号、状态和基础资料',
            icon: markRaw(User),
          },
          {
            key: 'permissions',
            label: '角色权限',
            description: '配置角色权限和数据访问范围',
            icon: markRaw(Lock),
          },
        ],
      },
      {
        key: 'organization',
        title: '组织与权限',
        items: [
          {
            key: 'users',
            label: '用户管理',
            description: '管理用户账号、状态和基础资料',
            icon: markRaw(User),
          },
          {
            key: 'permissions',
            label: '角色权限角色权限角色权限',
            description: '配置角色权限和数据访问范围配置角色权限和数据访问范围配置角色权限和数据访问范围配置角色权限和数据访问范围',
            icon: markRaw(Lock),
          },
        ],
      },
      {
        key: 'platform',
        title: '平台配置',
        items: [
          {
            key: 'settings',
            label: '系统设置',
            description: '维护系统参数和全局业务规则',
            icon: {
              component: markRaw(Setting),
              props: {
                style: { color: '#d5e6ff' },
              },
            },
          },
          {
            key: 'notifications',
            label: '通知中心',
            description: '配置通知模板和消息发送渠道',
            icon: markRaw(Bell),
          },
          {
            key: 'menu-config',
            label: '菜单配置',
            icon: markRaw(Document),
          },
        ],
      },
    ],
  },
  {
    key: 'operations',
    label: '数据运营中心',
    icon: markRaw(DataAnalysis),
    groups: [
      {
        key: 'analytics',
        title: '数据分析',
        items: [
          {
            key: 'overview',
            label: '经营总览',
            description: '查看业务趋势和核心经营指标',
            icon: markRaw(DataAnalysis),
          },
          {
            key: 'orders',
            label: '订单分析',
            description: '分析订单来源、转化和履约情况',
            icon: markRaw(Tickets),
          },
        ],
      },
    ],
  },
  {
    key: 'docs',
    label: '帮助与文档',
    icon: markRaw(Document),
  },
]


const themes: GaMegaMenuTheme = {
  menuBackgroundColor: '#2f436b', //整体背景颜色
  menuGap: 8, //菜单项之间的间距
  menuItemTextColor: '#ffffff', // 菜单项文字颜色
  menuItemBackgroundColor: '#3d527c', // 菜单项背景颜色
  menuItemHoverBackgroundColor: '#465d89', // 菜单项悬停背景颜色
  menuItemActiveBackgroundColor: '#315c96', // 菜单项激活背景颜色
  menuItemActiveBorderColor: '#4c78b1', // 菜单项激活边框颜色
  menuItemBorderRadius: 8, // 菜单项边框半径
  menuItemHorizontalPadding: 20, // 菜单项水平内边距
  menuItemVerticalSpace: 20, // 菜单项垂直间距
  menuItemIconSize: 20, // 菜单项图标大小
  menuItemFontSize: 16, // 菜单项文字大小
  panelBackgroundColor: '#f4f7fb', // 面板背景颜色
  panelBorderColor: '#d8e1ed', // 面板边框颜色
  panelTopBorderColor: '#d8e1ed', // 面板顶部边框颜色
  panelGroupTitleColor: '#52657d', // 面板组标题颜色
  panelItemTextColor: '#253858', // 面板项文字颜色
  panelItemBackgroundColor: '#ffffff', // 面板项背景颜色
  panelItemBorderColor: '#d8e1ed', // 面板项边框颜色
  panelItemHoverTextColor: '#1d4f91', // 面板项悬停文字颜色
  panelItemHoverBackgroundColor: '#eaf2ff', // 面板项悬停背景颜色
  panelItemHoverBorderColor: '#b8d0ee', // 面板项悬停边框颜色
  panelItemActiveTextColor: '#173f73', // 面板项激活文字颜色
  panelItemActiveBackgroundColor: '#dceaff', // 面板项激活背景颜色
  panelItemActiveBorderColor: '#8eb3df', // 面板项激活边框颜色
  panelItemDescriptionColor: '#66788e', // 面板项描述文字颜色
  panelItemIconColor: '#315c96',  // 面板项图标颜色
  panelItemIconBackgroundColor: '#e6eef8', // 面板项图标背景颜色
  panelItemBorderRadius: 6, // 面板项边框半径
}

const handleSelect = (payload: GaMegaMenuSelectPayload) => {
  console.log('Selected menu item:', payload)
  // activeKey.value = payload.key
}
</script>

<style lang="scss" scoped>
.myMegaMenu {
  height: 70px;
  overflow: auto;
  background-color: #1f2d4c;
}
</style>

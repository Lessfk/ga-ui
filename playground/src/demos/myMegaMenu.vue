<template>
  <div class="myMegaMenu">
    <GaMegaMenu  :menus="menus" trigger="hover" :theme="themes"></GaMegaMenu>

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
  menuBackgroundColor: 'transparent',
  menuItemTextColor: '#ffffff',
  menuItemBackgroundColor: '#3d527c',
  menuItemHoverBackgroundColor: '#465d89',
  menuItemActiveBackgroundColor: '#315c96',
  menuItemActiveBorderColor: '#4c78b1',
  menuItemBorderRadius: 12,
  menuItemHorizontalPadding: 20,
  menuItemVerticalSpace: 25,
  menuItemIconSize: 20,
  menuItemFontSize: 16,
  panelBackgroundColor: '#2f436b',
  panelTextColor: '#ffffff',
  panelBorderColor: 'transparent',
  panelGroupTitleColor: '#b7c4da',
  panelItemTextColor: '#ffffff',
  panelItemBackgroundColor: '#3d527c',
  panelItemHoverBackgroundColor: '#465d89',
  panelItemActiveBackgroundColor: '#315c96',
  panelItemActiveBorderColor: '#4c78b1',
  panelItemDescriptionColor: '#b7c4da',
  panelItemBorderRadius: 12,
}
</script>

<style lang="scss" scoped>
.myMegaMenu {  
  height: 70px;
  overflow: auto;
  background-color: #1f2d4c;
} 
</style>

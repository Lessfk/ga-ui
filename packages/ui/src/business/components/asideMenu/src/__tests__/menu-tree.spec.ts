import { mount } from '@vue/test-utils'
import { defineComponent, h, markRaw } from 'vue'
import { describe, expect, it } from 'vitest'

import type { GaAsideMenuNode } from '../../types'
import GaMenuTree from '../menu-tree.vue'

const slotStub = (name: string, tag: string) =>
  defineComponent({
    name,
    inheritAttrs: false,
    props: {
      index: String,
      title: String,
      disabled: Boolean,
      popperClass: String,
    },
    setup(props, { attrs, slots }) {
      return () =>
        h(
          tag,
          {
            ...attrs,
            class: [name, attrs.class],
            'data-index': props.index,
            'data-disabled': String(props.disabled),
            'data-popper-class': props.popperClass,
          },
          [
            slots.title
              ? h('span', { class: 'title' }, slots.title())
              : props.title,
            slots.default?.(),
          ],
        )
    },
  })

const ElMenuItemStub = slotStub('ElMenuItem', 'li')
const ElSubMenuStub = slotStub('ElSubMenu', 'section')
const ElMenuItemGroupStub = slotStub('ElMenuItemGroup', 'div')
const ElIconStub = defineComponent({
  name: 'ElIcon',
  setup(_, { slots }) {
    return () => h('i', { class: 'ElIcon' }, slots.default?.())
  },
})
const TestIcon = markRaw(
  defineComponent({
    name: 'TestIcon',
    setup: () => () => h('svg', { class: 'test-icon' }),
  }),
)

describe('GaMenuTree', () => {
  it('moves the active marker between containing submenus', async () => {
    const nodes: GaAsideMenuNode[] = [
      {
        type: 'submenu',
        index: 'system',
        label: 'System',
        children: [
          {
            type: 'submenu',
            index: 'accounts',
            label: 'Accounts',
            children: [{ type: 'item', index: 'users', label: 'Users' }],
          },
        ],
      },
      {
        type: 'submenu',
        index: 'reports',
        label: 'Reports',
        children: [{ type: 'item', index: 'audit', label: 'Audit' }],
      },
    ]

    const wrapper = mount(GaMenuTree, {
      props: { nodes, active: 'users' },
      global: {
        stubs: {
          ElMenuItem: ElMenuItemStub,
          ElSubMenu: ElSubMenuStub,
          ElMenuItemGroup: ElMenuItemGroupStub,
          ElIcon: ElIconStub,
        },
      },
    })

    expect(wrapper.find('[data-index="system"]').classes()).toContain(
      'ga-aside-menu__submenu--active',
    )
    expect(wrapper.find('[data-index="accounts"]').classes()).toContain(
      'ga-aside-menu__submenu--active',
    )
    expect(wrapper.find('[data-index="reports"]').classes()).not.toContain(
      'ga-aside-menu__submenu--active',
    )
    expect(wrapper.find('[data-index="system"]').attributes(
      'data-popper-class',
    )).toBe('ga-aside-menu__submenu-popper')
    expect(wrapper.find('[data-index="accounts"]').attributes(
      'data-popper-class',
    )).toBe('ga-aside-menu__submenu-popper')

    await wrapper.setProps({ active: 'audit' })

    expect(wrapper.find('[data-index="system"]').classes()).not.toContain(
      'ga-aside-menu__submenu--active',
    )
    expect(wrapper.find('[data-index="accounts"]').classes()).not.toContain(
      'ga-aside-menu__submenu--active',
    )
    expect(wrapper.find('[data-index="reports"]').classes()).toContain(
      'ga-aside-menu__submenu--active',
    )
  })

  it('renders items, submenus, groups, icons, and disabled state recursively', () => {
    const nodes: GaAsideMenuNode[] = [
      {
        type: 'submenu',
        index: 'system',
        label: 'System',
        icon: TestIcon,
        children: [
          {
            type: 'group',
            label: 'Accounts',
            children: [
              {
                type: 'item',
                index: 'users',
                label: 'Users',
                disabled: true,
              },
            ],
          },
          {
            type: 'group',
            label: 'Accounts',
            children: [{ type: 'item', index: 'audit', label: 'Audit' }],
          },
        ],
      },
    ]

    const wrapper = mount(GaMenuTree, {
      props: { nodes },
      global: {
        stubs: {
          ElMenuItem: ElMenuItemStub,
          ElSubMenu: ElSubMenuStub,
          ElMenuItemGroup: ElMenuItemGroupStub,
          ElIcon: ElIconStub,
        },
      },
    })

    expect(wrapper.find('[data-index="system"] > .title').text()).toContain(
      'System',
    )
    expect(wrapper.find('.test-icon').exists()).toBe(true)
    expect(wrapper.findAllComponents(ElMenuItemGroupStub)).toHaveLength(2)
    expect(wrapper.find('[data-index="users"]').text()).toContain('Users')
    expect(
      wrapper.find('[data-index="users"]').attributes('data-disabled'),
    ).toBe('true')
    expect(wrapper.find('[data-index="audit"]').text()).toContain('Audit')
  })

  it('reactively appends its internal class to the fallback popper class recursively', async () => {
    const nodes: GaAsideMenuNode[] = [
      {
        type: 'submenu',
        index: 'system',
        label: 'System',
        children: [
          {
            type: 'submenu',
            index: 'accounts',
            label: 'Accounts',
            children: [],
          },
        ],
      },
    ]

    const wrapper = mount(GaMenuTree, {
      props: { nodes, popperClassFallback: 'root-popper' },
      global: {
        stubs: {
          ElMenuItem: ElMenuItemStub,
          ElSubMenu: ElSubMenuStub,
          ElMenuItemGroup: ElMenuItemGroupStub,
          ElIcon: ElIconStub,
        },
      },
    })

    expect(wrapper.find('[data-index="system"]').attributes(
      'data-popper-class',
    )).toBe('root-popper ga-aside-menu__submenu-popper')
    expect(wrapper.find('[data-index="accounts"]').attributes(
      'data-popper-class',
    )).toBe('root-popper ga-aside-menu__submenu-popper')

    await wrapper.setProps({ popperClassFallback: 'next-popper' })

    expect(wrapper.find('[data-index="system"]').attributes(
      'data-popper-class',
    )).toBe('next-popper ga-aside-menu__submenu-popper')
    expect(wrapper.find('[data-index="accounts"]').attributes(
      'data-popper-class',
    )).toBe('next-popper ga-aside-menu__submenu-popper')
  })
})

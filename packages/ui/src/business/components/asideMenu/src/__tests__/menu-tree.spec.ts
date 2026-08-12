import { mount } from '@vue/test-utils'
import { defineComponent, h, markRaw } from 'vue'
import { describe, expect, it } from 'vitest'

import type { GaAsideMenuNode } from '../../types'
import GaMenuTree from '../menu-tree.vue'

const slotStub = (name: string, tag: string) =>
  defineComponent({
    name,
    inheritAttrs: false,
    props: { index: String, title: String, disabled: Boolean },
    setup(props, { attrs, slots }) {
      return () =>
        h(
          tag,
          {
            ...attrs,
            class: name,
            'data-index': props.index,
            'data-disabled': String(props.disabled),
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
})

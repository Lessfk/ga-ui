import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import GaAsideMenu from '../index.vue'

const ElAsideStub = defineComponent({
  name: 'ElAside',
  inheritAttrs: false,
  props: {
    width: String,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'aside',
        {
          ...attrs,
          class: ['el-aside-stub', attrs.class],
          'data-width': props.width,
        },
        slots.default?.(),
      )
  },
})

const ElScrollbarStub = defineComponent({
  name: 'ElScrollbar',
  setup(_, { slots }) {
    return () =>
      h('section', { class: 'el-scrollbar-stub' }, slots.default?.())
  },
})

const ElMenuStub = defineComponent({
  name: 'ElMenu',
  inheritAttrs: false,
  props: {
    mode: String,
    collapse: Boolean,
    collapseTransition: Boolean,
    defaultActive: String,
    ellipsis: Boolean,
    persistent: Boolean,
    uniqueOpened: Boolean,
    router: Boolean,
  },
  emits: ['select', 'open', 'close'],
  setup(_, { attrs, expose, slots }) {
    expose({
      open: () => undefined,
      close: () => undefined,
      updateActiveIndex: () => undefined,
    })

    return () =>
      h(
        'nav',
        {
          ...attrs,
          class: ['el-menu-stub', attrs.class],
        },
        slots.default?.(),
      )
  },
})

const ElMenuItemStub = defineComponent({
  name: 'ElMenuItem',
  props: {
    index: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'button',
        { class: 'el-menu-item-stub', 'data-index': props.index },
        slots.default?.(),
      )
  },
})

function mountAsideMenu(options: Parameters<typeof mount>[1] = {}) {
  return mount(GaAsideMenu, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ElAside: ElAsideStub,
        ElScrollbar: ElScrollbarStub,
        ElMenu: ElMenuStub,
        ElMenuItem: ElMenuItemStub,
        ...options.global?.stubs,
      },
    },
  })
}

describe('GaAsideMenu', () => {
  it('combines Element Plus aside, scrollbar, and menu with layout slots', () => {
    const wrapper = mountAsideMenu({
      props: {
        width: '248px',
        defaultActive: 'dashboard',
        uniqueOpened: true,
        router: true,
      },
      slots: {
        header: '<div class="header-slot">GA Admin</div>',
        default:
          '<el-menu-item index="dashboard">Dashboard</el-menu-item>',
        footer: '<div class="footer-slot">Administrator</div>',
      },
    })

    expect(wrapper.classes()).toContain('ga-aside-menu')
    expect(wrapper.findComponent(ElAsideStub).props('width')).toBe('248px')
    expect(wrapper.findComponent(ElScrollbarStub).exists()).toBe(true)
    expect(wrapper.findComponent(ElMenuStub).props()).toMatchObject({
      mode: 'vertical',
      collapse: false,
      collapseTransition: true,
      defaultActive: 'dashboard',
      ellipsis: true,
      persistent: true,
      uniqueOpened: true,
      router: true,
    })
    expect(wrapper.find('.header-slot').text()).toBe('GA Admin')
    expect(wrapper.find('.el-menu-item-stub').text()).toBe('Dashboard')
    expect(wrapper.find('.footer-slot').text()).toBe('Administrator')
  })

  it('lets the collapse slot toggle the sidebar and exposes its state', async () => {
    const wrapper = mountAsideMenu({
      props: {
        collapse: false,
        width: '260px',
      },
      slots: {
        collapse:
          '<template #default="{ collapse, toggle }"><button class="custom-toggle" @click="toggle">{{ collapse ? "Expand" : "Collapse" }}</button></template>',
      },
    })

    expect(wrapper.find('.custom-toggle').text()).toBe('Collapse')

    await wrapper.find('.custom-toggle').trigger('click')
    await nextTick()

    expect(wrapper.findComponent(ElMenuStub).props('collapse')).toBe(true)
    expect(wrapper.findComponent(ElAsideStub).props('width')).toBe('64px')
    expect(wrapper.find('.custom-toggle').text()).toBe('Expand')
    expect(wrapper.emitted('update:collapse')).toEqual([[true]])
    expect(wrapper.emitted('toggle')).toEqual([[true]])
  })

  it('provides an accessible default collapse control', async () => {
    const wrapper = mountAsideMenu()
    const button = wrapper.get('.ga-aside-menu__collapse-button')

    expect(button.attributes('aria-label')).toBe('折叠菜单')

    await button.trigger('click')

    expect(button.attributes('aria-label')).toBe('展开菜单')
    expect(wrapper.emitted('update:collapse')).toEqual([[true]])
  })

  it('synchronizes external collapse changes', async () => {
    const wrapper = mountAsideMenu({
      props: {
        collapse: false,
      },
    })

    await wrapper.setProps({ collapse: true })

    expect(wrapper.findComponent(ElMenuStub).props('collapse')).toBe(true)
    expect(wrapper.findComponent(ElAsideStub).props('width')).toBe('64px')
  })

  it('waits for the parent to accept collapse changes in controlled mode', async () => {
    const wrapper = mountAsideMenu({
      props: {
        collapse: false,
        'onUpdate:collapse': () => undefined,
      },
    })

    await wrapper.get('.ga-aside-menu__collapse-button').trigger('click')

    expect(wrapper.findComponent(ElMenuStub).props('collapse')).toBe(false)
    expect(wrapper.findComponent(ElAsideStub).props('width')).toBe('240px')
    expect(wrapper.emitted('update:collapse')).toEqual([[true]])
    expect(wrapper.emitted('toggle')).toEqual([[true]])
  })

  it('forwards Element Plus menu events and exposes the menu instance', () => {
    const wrapper = mountAsideMenu()
    const menu = wrapper.findComponent(ElMenuStub)
    const item = { index: 'users', indexPath: ['system', 'users'] }
    const routerResult = Promise.resolve()

    menu.vm.$emit('select', 'users', ['system', 'users'], item, routerResult)
    menu.vm.$emit('open', 'system', ['system'])
    menu.vm.$emit('close', 'system', ['system'])

    expect(wrapper.emitted('select')).toEqual([
      ['users', ['system', 'users'], item, routerResult],
    ])
    expect(wrapper.emitted('open')).toEqual([['system', ['system']]])
    expect(wrapper.emitted('close')).toEqual([['system', ['system']]])
    expect(wrapper.vm.menuRef).toBeTruthy()
    expect(typeof wrapper.vm.toggle).toBe('function')
  })
})

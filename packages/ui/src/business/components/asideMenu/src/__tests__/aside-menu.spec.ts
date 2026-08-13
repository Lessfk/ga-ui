import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import asideMenuStyles from '../../style/index.scss?raw'
import GaAsideMenu from '../index.vue'

const asideMenuStyleSource =
  asideMenuStyles ||
  readFileSync(
    resolve(
      process.cwd(),
      'src/business/components/asideMenu/style/index.scss',
    ),
    'utf8',
  )

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
    popperClass: String,
    popperStyle: [String, Object],
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
  const defaultBackground =
    'radial-gradient(130% 55% at 40% -10%, rgba(96, 165, 250, 0.28) 0%, transparent 62%),radial-gradient(85% 40% at 95% 100%, rgba(125, 211, 252, 0.1) 0%, transparent 55%),linear-gradient(168deg, #1d4480 0%, #122c5c 48%, #0a1a3d 100%)'

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

  it('applies theme variables to the sidebar and collapsed menu poppers', () => {
    const wrapper = mountAsideMenu({
      props: {
        popperClass: 'consumer-popper',
        popperStyle: { zIndex: 3000 },
        theme: {
          backgroundColor: '#101828',
          textColor: '#d0d5dd',
          activeTextColor: '#ffffff',
          activeBackgroundColor: '#155eef',
          hoverBackgroundColor: '#1d2939',
          borderColor: '#344054',
        },
      },
    })

    expect(wrapper.attributes('style')).toContain(
      '--ga-aside-menu-bg-color: #101828',
    )
    expect(wrapper.attributes('style')).toContain(
      '--ga-aside-menu-active-bg-color: #155eef',
    )

    const menu = wrapper.findComponent(ElMenuStub)
    expect(menu.props('popperClass')).toBe(
      'consumer-popper ga-aside-menu__popper',
    )
    expect(menu.props('popperStyle')).toMatchObject({
      zIndex: 3000,
      '--ga-aside-menu-bg-color': '#101828',
      '--ga-aside-menu-text-color': '#d0d5dd',
      '--ga-aside-menu-active-text-color': '#ffffff',
      '--ga-aside-menu-active-bg-color': '#155eef',
      '--ga-aside-menu-hover-bg-color': '#1d2939',
      '--ga-aside-menu-border-color': '#344054',
    })
  })

  it('uses the built-in theme when no theme prop is provided', () => {
    const wrapper = mountAsideMenu()

    expect(wrapper.attributes('style')).toContain(
      `--ga-aside-menu-bg-color: ${defaultBackground}`,
    )
    expect(wrapper.attributes('style')).toContain(
      '--ga-aside-menu-text-color: #d0d5dd',
    )
    expect(wrapper.attributes('style')).toContain(
      '--ga-aside-menu-active-text-color: #ffffff',
    )
    expect(wrapper.attributes('style')).toContain(
      '--ga-aside-menu-active-bg-color: linear-gradient(90deg, #4f6ef7, #7a5cf7)',
    )
    expect(wrapper.attributes('style')).toContain(
      '--ga-aside-menu-hover-bg-color: rgba(59, 130, 246, 0.16)',
    )
    expect(wrapper.attributes('style')).toContain(
      '--ga-aside-menu-border-color: #344054',
    )

    expect(wrapper.findComponent(ElMenuStub).props('popperStyle')).toMatchObject({
      '--ga-aside-menu-bg-color': defaultBackground,
      '--ga-aside-menu-text-color': '#d0d5dd',
      '--ga-aside-menu-active-text-color': '#ffffff',
      '--ga-aside-menu-active-bg-color':
        'linear-gradient(90deg, #4f6ef7, #7a5cf7)',
      '--ga-aside-menu-hover-bg-color': 'rgba(59, 130, 246, 0.16)',
      '--ga-aside-menu-border-color': '#344054',
    })
  })

  it('merges a partial theme with the built-in theme', () => {
    const wrapper = mountAsideMenu({
      props: {
        theme: {
          activeBackgroundColor: '#ff4d4f',
        },
      },
    })

    expect(wrapper.attributes('style')).toContain(
      `--ga-aside-menu-bg-color: ${defaultBackground}`,
    )
    expect(wrapper.attributes('style')).toContain(
      '--ga-aside-menu-active-bg-color: #ff4d4f',
    )
    expect(wrapper.attributes('style')).toContain(
      '--ga-aside-menu-text-color: #d0d5dd',
    )
  })

  it('merges theme variables with string popper styles', () => {
    const wrapper = mountAsideMenu({
      props: {
        popperStyle: 'z-index: 3000',
        theme: {
          backgroundColor: '#101828',
        },
      },
    })

    const popperStyle = wrapper.findComponent(ElMenuStub).props(
      'popperStyle',
    ) as string

    expect(popperStyle).toContain('z-index: 3000')
    expect(popperStyle).toContain('--ga-aside-menu-bg-color: #101828')
  })

  it('highlights an active top-level submenu while the menu is collapsed', () => {
    expect(asideMenuStyleSource).toMatch(
      /\.el-menu--collapse\s*>\s*\.el-sub-menu\.is-active\s*>\s*\.el-sub-menu__title\s*\{[^}]*background:/s,
    )
  })

  it('uses the background shorthand for collapsed poppers so gradients work', () => {
    expect(asideMenuStyleSource).toMatch(
      /\.el-popper\.ga-aside-menu__popper[^\{]*\{[^}]*background:\s*var\(\s*--ga-aside-menu-bg-color/s,
    )
    expect(asideMenuStyleSource).toMatch(
      /\.ga-aside-menu__popper[^}]*\.el-menu--popup\s*\{[^}]*background:\s*var\(\s*--ga-aside-menu-bg-color/s,
    )
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

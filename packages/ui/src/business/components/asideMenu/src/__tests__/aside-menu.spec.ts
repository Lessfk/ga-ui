import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import asideMenuStyles from '../../style/index.scss?raw'
import GaAsideMenu from '../index.vue'
import type { GaAsideMenuExpose } from '../types/index'

const asideMenuStyleSource =
  asideMenuStyles ||
  readFileSync(
    resolve(process.cwd(), 'src/business/components/asideMenu/style/index.scss'),
    'utf8',
  )

const ElAsideStub = defineComponent({
  name: 'ElAside',
  inheritAttrs: false,
  props: {
    width: String,
  },
  setup(_, { attrs, slots }) {
    return () =>
      h(
        'aside',
        {
          ...attrs,
          class: ['el-aside-stub', attrs.class],
        },
        slots.default?.(),
      )
  },
})

const ElScrollbarStub = defineComponent({
  name: 'ElScrollbar',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class: ['el-scrollbar-stub', attrs.class],
        },
        slots.default?.(),
      )
  },
})

const ElMenuStub = defineComponent({
  name: 'ElMenu',
  inheritAttrs: false,
  props: {
    mode: String,
    collapse: Boolean,
    defaultActive: String,
    defaultOpeneds: Array,
    uniqueOpened: Boolean,
    router: Boolean,
    menuTrigger: String,
    backgroundColor: String,
    textColor: String,
    activeTextColor: String,
    closeOnClickOutside: Boolean,
    collapseTransition: {
      type: Boolean,
      default: undefined,
    },
    ellipsis: {
      type: Boolean,
      default: undefined,
    },
    popperOffset: Number,
    popperEffect: String,
    popperClass: String,
    showTimeout: Number,
    hideTimeout: Number,
  },
  emits: ['select', 'open', 'close'],
  setup(_, { attrs, slots }) {
    return () =>
      h(
        'ul',
        {
          ...attrs,
          class: ['el-menu-stub', attrs.class],
        },
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
        ...options.global?.stubs,
      },
    },
  })
}

describe('GaAsideMenu', () => {
  it('uses the default width when expanded', () => {
    const wrapper = mountAsideMenu()

    expect(wrapper.findComponent(ElAsideStub).props('width')).toBe('240px')
  })

  it('lets the collapsed menu determine its own width when collapse is set', () => {
    const wrapper = mountAsideMenu({
      props: {
        collapse: true,
      },
    })

    expect(wrapper.findComponent(ElAsideStub).props('width')).toBe('auto')
    expect(wrapper.findComponent(ElMenuStub).props('collapse')).toBe(true)
  })

  it('honours a custom width', () => {
    const wrapper = mountAsideMenu({
      props: {
        width: '300px',
      },
    })

    expect(wrapper.findComponent(ElAsideStub).props('width')).toBe('300px')
  })

  it('forces vertical mode and forwards menu props to ElMenu', () => {
    const wrapper = mountAsideMenu({
      attrs: {
        mode: 'horizontal',
      },
      props: {
        defaultActive: '1-1',
        defaultOpeneds: ['1'],
        uniqueOpened: true,
        router: true,
        menuTrigger: 'click',
        backgroundColor: '#001529',
        textColor: '#bfbfbf',
        activeTextColor: '#ffffff',
        closeOnClickOutside: true,
        collapseTransition: false,
        ellipsis: false,
        popperOffset: 12,
        popperEffect: 'light',
        popperClass: 'custom-popper',
        showTimeout: 100,
        hideTimeout: 200,
      },
    })

    const menu = wrapper.findComponent(ElMenuStub)

    expect(menu.props('mode')).toBe('vertical')
    expect(menu.props()).toMatchObject({
      collapse: false,
      defaultActive: '1-1',
      defaultOpeneds: ['1'],
      uniqueOpened: true,
      router: true,
      menuTrigger: 'click',
      backgroundColor: '#001529',
      textColor: '#bfbfbf',
      activeTextColor: '#ffffff',
      closeOnClickOutside: true,
      collapseTransition: false,
      ellipsis: false,
      popperOffset: 12,
      popperEffect: 'light',
      popperClass: 'custom-popper',
      showTimeout: 100,
      hideTimeout: 200,
    })
  })

  it('renders header and footer slots only when provided', () => {
    const withoutSlots = mountAsideMenu()

    expect(withoutSlots.find('.ga-aside-menu__header').exists()).toBe(false)
    expect(withoutSlots.find('.ga-aside-menu__footer').exists()).toBe(false)

    const withSlots = mountAsideMenu({
      slots: {
        header: '<div class="aside-logo">LOGO</div>',
        footer: '<div class="aside-toggle">折叠</div>',
      },
    })

    expect(withSlots.find('.ga-aside-menu__header .aside-logo').exists()).toBe(
      true,
    )
    expect(
      withSlots.find('.ga-aside-menu__footer .aside-toggle').exists(),
    ).toBe(true)
  })

  it('renders the default slot inside the menu within the scrollbar body', () => {
    const wrapper = mountAsideMenu({
      slots: {
        default: '<li class="menu-child">菜单项</li>',
      },
    })

    expect(
      wrapper.find('.el-scrollbar-stub .el-menu-stub .menu-child').exists(),
    ).toBe(true)
  })

  it('re-emits select with the full Element Plus payload', () => {
    const wrapper = mountAsideMenu()
    const item = { index: '1-1', indexPath: ['1', '1-1'] }
    const routerResult = Promise.resolve()

    wrapper
      .findComponent(ElMenuStub)
      .vm.$emit('select', '1-1', ['1', '1-1'], item, routerResult)

    expect(wrapper.emitted('select')).toEqual([
      ['1-1', ['1', '1-1'], item, routerResult],
    ])
  })

  it('re-emits open and close with index and indexPath', () => {
    const wrapper = mountAsideMenu()

    wrapper.findComponent(ElMenuStub).vm.$emit('open', '1', ['1'])
    wrapper.findComponent(ElMenuStub).vm.$emit('close', '1', ['1'])

    expect(wrapper.emitted('open')).toEqual([['1', ['1']]])
    expect(wrapper.emitted('close')).toEqual([['1', ['1']]])
  })

  it('exposes the underlying menu instance', () => {
    const wrapper = mountAsideMenu()

    expect((wrapper.vm as unknown as GaAsideMenuExpose).menuRef).toBe(
      wrapper.findComponent(ElMenuStub).vm,
    )
  })

  it('passes the collapse state to the header slot scope', () => {
    const expanded = mountAsideMenu({
      slots: {
        header: ({ collapse }: { collapse: boolean }) =>
          h('div', { class: 'logo' }, collapse ? '图标' : '完整标志'),
      },
    })

    expect(expanded.find('.logo').text()).toBe('完整标志')

    const collapsed = mountAsideMenu({
      props: {
        collapse: true,
      },
      slots: {
        header: ({ collapse }: { collapse: boolean }) =>
          h('div', { class: 'logo' }, collapse ? '图标' : '完整标志'),
      },
    })

    expect(collapsed.find('.logo').text()).toBe('图标')
  })

  it('renders the default trigger and toggles collapse from inside', async () => {
    const wrapper = mountAsideMenu()
    const button = wrapper.find('.ga-aside-menu__trigger-btn')

    expect(button.exists()).toBe(true)
    expect(button.attributes('aria-label')).toBe('折叠菜单')
    expect(button.find('span').exists()).toBe(true)

    await button.trigger('click')

    expect(wrapper.emitted('update:collapse')).toEqual([[true]])
    expect(wrapper.emitted('toggle')).toEqual([[true]])
    expect(wrapper.findComponent(ElAsideStub).props('width')).toBe('auto')
    expect(wrapper.findComponent(ElMenuStub).props('collapse')).toBe(true)
    expect(button.attributes('aria-label')).toBe('展开菜单')
    expect(button.find('span').exists()).toBe(false)

    await button.trigger('click')

    expect(wrapper.emitted('update:collapse')).toEqual([[true], [false]])
    expect(wrapper.emitted('toggle')).toEqual([[true], [false]])
    expect(wrapper.findComponent(ElAsideStub).props('width')).toBe('240px')
  })

  it('lets the trigger slot override the default and use the slot scope', async () => {
    const wrapper = mountAsideMenu({
      slots: {
        trigger: ({
          collapse,
          toggle,
        }: {
          collapse: boolean
          toggle: () => void
        }) =>
          h(
            'button',
            { class: 'custom-trigger', onClick: toggle },
            collapse ? '展开菜单' : '折叠菜单',
          ),
      },
    })

    expect(wrapper.find('.ga-aside-menu__trigger-btn').exists()).toBe(false)

    const custom = wrapper.find('.custom-trigger')

    expect(custom.text()).toBe('折叠菜单')

    await custom.trigger('click')

    expect(wrapper.emitted('update:collapse')).toEqual([[true]])
    expect(wrapper.emitted('toggle')).toEqual([[true]])
    expect(wrapper.find('.custom-trigger').text()).toBe('展开菜单')
  })

  it('exposes the toggle method', () => {
    const wrapper = mountAsideMenu()

    expect(
      typeof (wrapper.vm as unknown as GaAsideMenuExpose).toggle,
    ).toBe('function')
  })

  it('compensates Element Plus collapse styles for menu item groups', () => {
    expect(asideMenuStyleSource).toContain(
      '.el-menu.ga-aside-menu__menu.el-menu--collapse',
    )
    expect(asideMenuStyleSource).toContain('.el-menu-item-group__title')
    expect(asideMenuStyleSource).toContain(
      '.el-menu-item-group > ul > .el-menu-item',
    )
  })
})

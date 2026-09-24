import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import type { PropType } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  GaMegaMenuExpose,
  GaMegaMenuKey,
  GaMegaMenuNavItem,
  GaMegaMenuSelectPayload,
  GaMegaMenuTheme,
  GaMegaMenuTrigger,
} from '../../../../../base/index'
import headerStyles from '../../style/index.scss?raw'
import type { GaHeaderExpose } from '../../types/index'
import GaHeader from '../index.vue'

const headerStyleSource =
  headerStyles ||
  readFileSync(
    resolve(process.cwd(), 'src/business/components/header/style/index.scss'),
    'utf8',
  )

const menus: GaMegaMenuNavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
  },
  {
    key: 'products',
    label: 'Products',
    groups: [
      {
        key: 'platform',
        title: 'Platform',
        items: [
          {
            key: 'analytics',
            label: 'Analytics',
            description: 'Business performance',
          },
        ],
      },
    ],
  },
  {
    key: 'empty',
    label: 'Empty',
    groups: [],
  },
]

const menuItemScope = {
  menu: menus[1],
  active: true,
  open: true,
}
const groupTitleScope = {
  menu: menus[1],
  group: menus[1].groups![0],
}
const panelItemScope = {
  ...groupTitleScope,
  item: menus[1].groups![0].items[0],
  active: true,
}
const emptyScope = {
  menu: menus[2],
}

const openSpy = vi.fn<(key: GaMegaMenuKey) => void>()
const closeSpy = vi.fn<() => void>()
const toggleSpy = vi.fn<(key: GaMegaMenuKey) => void>()

const ElHeaderStub = defineComponent({
  name: 'ElHeader',
  inheritAttrs: false,
  props: {
    height: String,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'header',
        {
          ...attrs,
          class: ['el-header-stub', attrs.class],
          'data-height': props.height,
        },
        slots.default?.(),
      )
  },
})

const GaMegaMenuStub = defineComponent({
  name: 'GaMegaMenu',
  props: {
    menus: {
      type: Array as PropType<GaMegaMenuNavItem[]>,
      default: () => [],
    },
    activeKey: [String, Number] as PropType<GaMegaMenuKey>,
    openKey: [String, Number] as PropType<GaMegaMenuKey>,
    trigger: String as PropType<GaMegaMenuTrigger>,
    openDelay: Number,
    closeDelay: Number,
    minColumnWidth: Number,
    maxColumnWidth: Number,
    maxHeight: [String, Number] as PropType<string | number>,
    closeOnSelect: {
      type: Boolean,
      default: true,
    },
    theme: Object as PropType<GaMegaMenuTheme>,
    ariaLabel: String,
  },
  emits: [
    'update:activeKey',
    'update:openKey',
    'select',
    'open',
    'close',
  ],
  setup(_, { expose, slots }) {
    expose({
      open: openSpy,
      close: closeSpy,
      toggle: toggleSpy,
    } satisfies GaMegaMenuExpose)

    return () =>
      h('nav', { class: 'ga-mega-menu-stub' }, [
        h(
          'div',
          { class: 'menu-item-slot' },
          slots['menu-item']?.(menuItemScope),
        ),
        h(
          'div',
          { class: 'group-title-slot' },
          slots['group-title']?.(groupTitleScope),
        ),
        h(
          'div',
          { class: 'panel-item-slot' },
          slots['panel-item']?.(panelItemScope),
        ),
        h('div', { class: 'empty-slot' }, slots.empty?.(emptyScope)),
      ])
  },
})

function mountHeader(options: Parameters<typeof mount>[1] = {}) {
  return mount(GaHeader, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ElHeader: ElHeaderStub,
        GaMegaMenu: GaMegaMenuStub,
        ...options.global?.stubs,
      },
    },
  })
}

describe('GaHeader', () => {
  beforeEach(() => {
    openSpy.mockClear()
    closeSpy.mockClear()
    toggleSpy.mockClear()
  })

  it('renders the Element Plus header, layout slots, menus, attrs, and CSS variables', () => {
    const wrapper = mountHeader({
      attrs: {
        'aria-label': '应用头部',
        'data-tracking': 'business-header',
        title: 'Business navigation',
        style: { color: 'rgb(255, 255, 255)' },
      },
      props: {
        height: 72,
        padding: '0 32px',
        gap: 24,
        menus,
        theme: {
          menuBackgroundColor: '#123456',
        },
      },
      slots: {
        left: '<strong class="brand">GA Admin</strong>',
        right: '<button class="account">Account</button>',
      },
    })

    const root = wrapper.get('header')

    expect(wrapper.classes()).toContain('ga-header')
    expect(wrapper.findComponent(ElHeaderStub).props('height')).toBe('72px')
    expect(root.attributes('data-tracking')).toBe('business-header')
    expect(root.attributes('aria-label')).toBe('应用头部')
    expect(root.attributes('title')).toBe('Business navigation')
    expect(root.element.style.color).toBe('rgb(255, 255, 255)')
    expect(wrapper.get('.brand').text()).toBe('GA Admin')
    expect(wrapper.get('.account').text()).toBe('Account')
    expect(wrapper.findComponent(GaMegaMenuStub).props('menus')).toEqual(menus)
    expect(wrapper.findComponent(GaMegaMenuStub).props('ariaLabel')).toBe(
      '应用头部',
    )
    expect(root.element.style.getPropertyValue('--ga-header-gap')).toBe('24px')
    expect(root.element.style.getPropertyValue('--ga-header-padding')).toBe(
      '0 32px',
    )
    expect(
      root.element.style.getPropertyValue('--ga-header-background'),
    ).toBe('#123456')
  })

  it('updates the background using prop, theme, and default precedence', async () => {
    const wrapper = mountHeader({
      props: {
        menus,
        theme: {
          menuBackgroundColor: '#334155',
        },
      },
    })
    const root = wrapper.get('header')
    const megaMenu = wrapper.findComponent(GaMegaMenuStub)

    expect(
      root.element.style.getPropertyValue('--ga-header-background'),
    ).toBe('#334155')
    expect(megaMenu.props('theme')).toMatchObject({
      menuBackgroundColor: '#334155',
    })

    await wrapper.setProps({ backgroundColor: '#0f172a' })
    expect(
      root.element.style.getPropertyValue('--ga-header-background'),
    ).toBe('#0f172a')
    expect(megaMenu.props('theme')).toMatchObject({
      menuBackgroundColor: '#0f172a',
    })

    await wrapper.setProps({
      backgroundColor: undefined,
      theme: { menuBackgroundColor: '#475569' },
    })
    expect(
      root.element.style.getPropertyValue('--ga-header-background'),
    ).toBe('#475569')
    expect(megaMenu.props('theme')).toMatchObject({
      menuBackgroundColor: '#475569',
    })

    await wrapper.setProps({ theme: {} })
    expect(
      root.element.style.getPropertyValue('--ga-header-background'),
    ).toBe('#2f436b')
  })

  it('reacts to dynamic attrs and consumer styles', async () => {
    const context = ref('initial')
    const className = ref('initial-header')
    const color = ref('rgb(255, 0, 0)')
    const Host = defineComponent({
      setup() {
        return () =>
          h(GaHeader, {
            'data-context': context.value,
            class: className.value,
            style: { color: color.value },
            menus,
          })
      },
    })
    const wrapper = mount(Host, {
      global: {
        stubs: {
          ElHeader: ElHeaderStub,
          GaMegaMenu: GaMegaMenuStub,
        },
      },
    })
    context.value = 'updated'
    className.value = 'updated-header'
    color.value = 'rgb(0, 0, 255)'
    await nextTick()
    const root = wrapper.get('header')

    expect(root.attributes('data-context')).toBe('updated')
    expect(root.classes()).toContain('updated-header')
    expect(root.classes()).not.toContain('initial-header')
    expect(root.element.style.color).toBe('rgb(0, 0, 255)')
  })

  it('forwards the complete MegaMenu configuration contract', () => {
    const theme: GaMegaMenuTheme = {
      menuBackgroundColor: '#1e293b',
      menuGap: 12,
      panelPadding: 28,
    }
    const wrapper = mountHeader({
      props: {
        menus,
        trigger: 'hover',
        openDelay: 240,
        closeDelay: 360,
        minColumnWidth: 280,
        maxColumnWidth: 520,
        maxHeight: 640,
        closeOnSelect: false,
        theme,
        ariaLabel: 'Primary business navigation',
      },
    })

    expect(wrapper.findComponent(GaMegaMenuStub).props()).toMatchObject({
      menus,
      trigger: 'hover',
      openDelay: 240,
      closeDelay: 360,
      minColumnWidth: 280,
      maxColumnWidth: 520,
      maxHeight: 640,
      closeOnSelect: false,
      theme,
      ariaLabel: 'Primary business navigation',
    })
  })

  it('preserves and reactively updates the MegaMenu close-on-select default', async () => {
    const wrapper = mountHeader({ props: { menus } })
    const megaMenu = wrapper.findComponent(GaMegaMenuStub)

    expect(megaMenu.props('closeOnSelect')).toBe(true)

    await wrapper.setProps({ closeOnSelect: false })
    expect(megaMenu.props('closeOnSelect')).toBe(false)

    await wrapper.setProps({ closeOnSelect: undefined })
    expect(megaMenu.props('closeOnSelect')).toBe(true)
  })

  it('updates uncontrolled state and re-emits all MegaMenu events unchanged', async () => {
    const wrapper = mountHeader({ props: { menus } })
    const megaMenu = wrapper.findComponent(GaMegaMenuStub)
    const selectPayload: GaMegaMenuSelectPayload = {
      key: 'analytics',
      source: 'panel',
      menu: menus[1],
      group: menus[1].groups![0],
      item: menus[1].groups![0].items[0],
      nativeEvent: new MouseEvent('click'),
    }

    megaMenu.vm.$emit('update:activeKey', 'analytics')
    megaMenu.vm.$emit('update:openKey', 'products')
    megaMenu.vm.$emit('select', selectPayload)
    megaMenu.vm.$emit('open', 'products', menus[1])
    megaMenu.vm.$emit('close', 'products', menus[1])
    await nextTick()

    expect(megaMenu.props('activeKey')).toBe('analytics')
    expect(megaMenu.props('openKey')).toBe('products')
    expect(wrapper.emitted('update:activeKey')).toEqual([['analytics']])
    expect(wrapper.emitted('update:openKey')).toEqual([['products']])
    expect(wrapper.emitted('select')).toEqual([[selectPayload]])
    expect(wrapper.emitted('open')).toEqual([['products', menus[1]]])
    expect(wrapper.emitted('close')).toEqual([['products', menus[1]]])
  })

  it('keeps controlled camelCase and kebab-case state until props change', async () => {
    const wrapper = mountHeader({
      props: {
        activeKey: 'dashboard',
        'open-key': 'products',
        menus,
      } as never,
    })
    const megaMenu = wrapper.findComponent(GaMegaMenuStub)

    megaMenu.vm.$emit('update:activeKey', 'analytics')
    megaMenu.vm.$emit('update:openKey', undefined)
    await nextTick()

    expect(megaMenu.props('activeKey')).toBe('dashboard')
    expect(megaMenu.props('openKey')).toBe('products')
    expect(wrapper.emitted('update:activeKey')).toEqual([['analytics']])
    expect(wrapper.emitted('update:openKey')).toEqual([[undefined]])

    await wrapper.setProps({
      activeKey: 'analytics',
      'open-key': undefined,
    } as never)

    expect(megaMenu.props('activeKey')).toBe('analytics')
    expect(megaMenu.props('openKey')).toBeUndefined()
  })

  it('reacts when controlled state is added with an explicit undefined value', async () => {
    const controlled = ref(false)
    const Host = defineComponent({
      setup() {
        return () =>
          h(GaHeader, {
            menus,
            ...(controlled.value ? { openKey: undefined } : {}),
          })
      },
    })
    const wrapper = mount(Host, {
      global: {
        stubs: {
          ElHeader: ElHeaderStub,
          GaMegaMenu: GaMegaMenuStub,
        },
      },
    })
    const megaMenu = wrapper.findComponent(GaMegaMenuStub)

    megaMenu.vm.$emit('update:openKey', 'products')
    await nextTick()
    expect(megaMenu.props('openKey')).toBe('products')

    controlled.value = true
    await nextTick()
    expect(megaMenu.props('openKey')).toBeUndefined()

    controlled.value = false
    await nextTick()
    expect(megaMenu.props('openKey')).toBe('products')
  })

  it('forwards all MegaMenu slot scopes unchanged', () => {
    const menuItemSlot = vi.fn((scope: typeof menuItemScope) =>
      h(
        'span',
        { class: 'custom-menu-item' },
        `${scope.menu.key}:${scope.active}:${scope.open}`,
      ),
    )
    const groupTitleSlot = vi.fn((scope: typeof groupTitleScope) =>
      h(
        'span',
        { class: 'custom-group-title' },
        `${scope.menu.key}:${scope.group.key}`,
      ),
    )
    const panelItemSlot = vi.fn((scope: typeof panelItemScope) =>
      h(
        'span',
        { class: 'custom-panel-item' },
        `${scope.menu.key}:${scope.group.key}:${scope.item.key}:${scope.active}`,
      ),
    )
    const emptySlot = vi.fn((scope: typeof emptyScope) =>
      h('span', { class: 'custom-empty' }, String(scope.menu.key)),
    )
    const wrapper = mountHeader({
      props: { menus },
      slots: {
        'menu-item': menuItemSlot,
        'group-title': groupTitleSlot,
        'panel-item': panelItemSlot,
        empty: emptySlot,
      },
    })

    expect(menuItemSlot).toHaveBeenCalledWith(menuItemScope)
    expect(groupTitleSlot).toHaveBeenCalledWith(groupTitleScope)
    expect(panelItemSlot).toHaveBeenCalledWith(panelItemScope)
    expect(emptySlot).toHaveBeenCalledWith(emptyScope)
    expect(wrapper.get('.custom-menu-item').text()).toBe(
      'products:true:true',
    )
    expect(wrapper.get('.custom-group-title').text()).toBe(
      'products:platform',
    )
    expect(wrapper.get('.custom-panel-item').text()).toBe(
      'products:platform:analytics:true',
    )
    expect(wrapper.get('.custom-empty').text()).toBe('empty')
  })

  it('delegates exposed open, close, and toggle methods to MegaMenu', () => {
    const wrapper = mountHeader({ props: { menus } })
    const exposed = wrapper.vm as unknown as GaHeaderExpose

    exposed.open('products')
    exposed.close()
    exposed.toggle('empty')

    expect(exposed.megaMenuRef).toBeDefined()
    expect(openSpy).toHaveBeenCalledWith('products')
    expect(closeSpy).toHaveBeenCalledOnce()
    expect(toggleSpy).toHaveBeenCalledWith('empty')
  })

  it('defines the three-column grid and constrained center region in SCSS', () => {
    expect(headerStyleSource).toMatch(
      /grid-template-columns:\s*max-content minmax\(0,\s*1fr\) max-content;/,
    )
    expect(headerStyleSource).toMatch(
      /\.ga-header__center\s*\{[^}]*min-width:\s*0;[^}]*height:\s*100%;/s,
    )
    expect(headerStyleSource).toMatch(
      /\.ga-header__center\s*>\s*\.ga-mega-menu\s*\{[^}]*height:\s*100%;/s,
    )
  })
})

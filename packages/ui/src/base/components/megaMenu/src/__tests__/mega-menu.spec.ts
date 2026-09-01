import { mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineComponent, h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

const megaMenuStyles = readFileSync(
  resolve(process.cwd(), 'src/base/components/megaMenu/style/index.scss'),
  'utf8',
)

const ElScrollbarStub = defineComponent({
  name: 'ElScrollbar',
  props: {
    maxHeight: [String, Number],
  },
  setup(_, { attrs, slots }) {
    return () => h('div', { ...attrs }, slots.default?.())
  },
})

const DirectIcon = defineComponent({
  name: 'DirectIcon',
  setup() {
    return () => h('svg', { class: 'direct-icon' })
  },
})

const ConfigIcon = defineComponent({
  name: 'ConfigIcon',
  props: {
    tone: String,
  },
  setup(props) {
    return () => h('svg', { class: 'config-icon', 'data-tone': props.tone })
  },
})

const menus = [
  {
    key: 'home',
    label: '工作台',
    icon: DirectIcon,
  },
  {
    key: 'system',
    label: '系统管理',
    groups: [
      {
        key: 'operations',
        title: '运营中心',
        items: [
          {
            key: 'overview',
            label: '数据总览',
            description: '查看核心业务指标',
            icon: {
              component: ConfigIcon,
              props: {
                tone: 'primary',
              },
            },
          },
        ],
      },
    ],
  },
]

async function loadMegaMenu() {
  try {
    return (await import('../index.vue')).default
  } catch {
    return undefined
  }
}

async function mountMegaMenu(options: Record<string, unknown> = {}) {
  const component = await loadMegaMenu()
  expect(component).toBeDefined()
  if (!component) return undefined

  return mount(component, {
    attachTo: options.attachTo as Element | string | undefined,
    props: {
      menus,
      ...(options.props as Record<string, unknown> | undefined),
    },
    slots: options.slots,
    global: {
      stubs: {
        ElScrollbar: ElScrollbarStub,
        teleport: options.stubTeleport === false ? false : true,
      },
    },
  })
}

afterEach(() => {
  vi.useRealTimers()
})

describe('GaMegaMenu', () => {
  it(
    'renders native content-width menu buttons and Vue component icons',
    async () => {
      const wrapper = await mountMegaMenu()
      if (!wrapper) return

      expect(wrapper.findAll('.ga-mega-menu__nav-item')).toHaveLength(2)
      expect(wrapper.find('.direct-icon').exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'ElMenu' }).exists()).toBe(false)
    },
    10_000,
  )

  it('selects an ordinary top-level menu and emits its complete payload', async () => {
    const wrapper = await mountMegaMenu()
    if (!wrapper) return

    await wrapper.get('[data-menu-key="home"]').trigger('click')

    expect(wrapper.emitted('update:activeKey')).toEqual([['home']])
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({
      key: 'home',
      source: 'menu',
      menu: menus[0],
    })
  })

  it('toggles a grouped menu in click mode', async () => {
    const wrapper = await mountMegaMenu()
    if (!wrapper) return

    const trigger = wrapper.get('[data-menu-key="system"]')
    await trigger.trigger('click')

    expect(wrapper.find('.ga-mega-menu__panel').exists()).toBe(true)
    expect(wrapper.emitted('update:openKey')).toEqual([['system']])
    expect(wrapper.emitted('open')?.[0]?.[0]).toBe('system')

    await trigger.trigger('click')

    expect(wrapper.find('.ga-mega-menu__panel').exists()).toBe(false)
    expect(wrapper.emitted('close')?.[0]?.[0]).toBe('system')
  })

  it('opens and closes the panel with configured hover delays', async () => {
    vi.useFakeTimers()
    const wrapper = await mountMegaMenu({
      props: {
        trigger: 'hover',
        openDelay: 80,
        closeDelay: 120,
      },
    })
    if (!wrapper) return

    await wrapper.get('[data-menu-key="system"]').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(79)
    expect(wrapper.find('.ga-mega-menu__panel').exists()).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    expect(wrapper.find('.ga-mega-menu__panel').exists()).toBe(true)

    await wrapper.get('.ga-mega-menu').trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(119)
    expect(wrapper.find('.ga-mega-menu__panel').exists()).toBe(true)

    await vi.advanceTimersByTimeAsync(1)
    expect(wrapper.find('.ga-mega-menu__panel').exists()).toBe(false)
  })

  it('cancels a pending hover open when the trigger changes', async () => {
    vi.useFakeTimers()
    const wrapper = await mountMegaMenu({
      props: {
        trigger: 'hover',
        openDelay: 80,
      },
    })
    if (!wrapper) return

    await wrapper.get('[data-menu-key="system"]').trigger('mouseenter')
    await wrapper.setProps({ trigger: 'click' })
    await vi.advanceTimersByTimeAsync(80)

    expect(wrapper.find('.ga-mega-menu__panel').exists()).toBe(false)
  })

  it('does not open a menu that becomes disabled during the hover delay', async () => {
    vi.useFakeTimers()
    const wrapper = await mountMegaMenu({
      props: {
        trigger: 'hover',
        openDelay: 80,
      },
    })
    if (!wrapper) return

    await wrapper.get('[data-menu-key="system"]').trigger('mouseenter')
    await wrapper.setProps({
      menus: menus.map((menu) =>
        menu.key === 'system' ? { ...menu, disabled: true } : menu,
      ),
    })
    await vi.advanceTimersByTimeAsync(80)

    expect(wrapper.find('.ga-mega-menu__panel').exists()).toBe(false)
  })

  it('keeps controlled open state until the parent updates the prop', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        openKey: 'system',
      },
    })
    if (!wrapper) return

    await wrapper.get('[data-menu-key="system"]').trigger('click')

    expect(wrapper.emitted('update:openKey')).toEqual([[undefined]])
    expect(wrapper.find('.ga-mega-menu__panel').exists()).toBe(true)

    await wrapper.setProps({ openKey: undefined })
    expect(wrapper.find('.ga-mega-menu__panel').exists()).toBe(false)
  })

  it('keeps controlled active state until the parent updates the prop', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        activeKey: 'home',
        openKey: 'system',
      },
    })
    if (!wrapper) return

    await wrapper.get('[data-item-key="overview"]').trigger('click')

    expect(wrapper.get('[data-menu-key="home"]').classes()).toContain(
      'is-active',
    )
    expect(wrapper.get('[data-menu-key="system"]').classes()).not.toContain(
      'is-active',
    )

    await wrapper.setProps({ activeKey: 'overview' })
    expect(wrapper.get('[data-menu-key="system"]').classes()).toContain(
      'is-active',
    )
  })

  it('keeps open state uncontrolled when only an update listener is provided', async () => {
    const onUpdateOpenKey = vi.fn()
    const wrapper = await mountMegaMenu({
      props: {
        'onUpdate:openKey': onUpdateOpenKey,
      },
    })
    if (!wrapper) return

    await wrapper.get('[data-menu-key="system"]').trigger('click')

    expect(onUpdateOpenKey).toHaveBeenCalledWith('system')
    expect(wrapper.find('.ga-mega-menu__panel').exists()).toBe(true)
  })

  it('keeps active state uncontrolled when only an update listener is provided', async () => {
    const onUpdateActiveKey = vi.fn()
    const wrapper = await mountMegaMenu({
      props: {
        'onUpdate:activeKey': onUpdateActiveKey,
      },
    })
    if (!wrapper) return

    await wrapper.get('[data-menu-key="home"]').trigger('click')

    expect(onUpdateActiveKey).toHaveBeenCalledWith('home')
    expect(wrapper.get('[data-menu-key="home"]').classes()).toContain(
      'is-active',
    )
  })

  it('teleports the panel and positions it below the navigation root', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        openKey: 'system',
      },
    })
    if (!wrapper) return

    vi.spyOn(
      wrapper.get('.ga-mega-menu').element,
      'getBoundingClientRect',
    ).mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 0,
      bottom: 72,
      left: 0,
      width: 0,
      height: 72,
      toJSON: () => ({}),
    })

    window.dispatchEvent(new Event('resize'))
    await wrapper.vm.$nextTick()

    expect(wrapper.get('teleport-stub').attributes('to')).toBe('body')
    expect(wrapper.get('.ga-mega-menu__panel').attributes('style')).toContain(
      '--ga-mega-menu-panel-top: 72px',
    )
  })

  it('applies theme and column variables directly to the teleported panel', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        openKey: 'system',
        minColumnWidth: 360,
        maxColumnWidth: 390,
        theme: {
          menuBackgroundColor: '#10233f',
          panelBackgroundColor: '#182d4d',
        },
      },
    })
    if (!wrapper) return

    const panelStyle = wrapper
      .get('.ga-mega-menu__panel')
      .attributes('style')

    expect(panelStyle).toContain('--ga-mega-menu-menu-bg-color: #10233f')
    expect(panelStyle).toContain('--ga-mega-menu-panel-bg-color: #182d4d')
    expect(panelStyle).toContain(
      '--ga-mega-menu-min-column-width: 360px',
    )
    expect(panelStyle).toContain(
      '--ga-mega-menu-max-column-width: 390px',
    )
  })

  it('treats pointer events inside the teleported panel as internal', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = await mountMegaMenu({
      attachTo: host,
      stubTeleport: false,
    })
    if (!wrapper) return

    await wrapper.get('[data-menu-key="system"]').trigger('click')
    const panel = document.querySelector<HTMLElement>('.ga-mega-menu__panel')

    expect(panel).not.toBeNull()
    expect(host.querySelector('.ga-mega-menu__panel')).toBeNull()
    panel?.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(document.querySelector('.ga-mega-menu__panel')).not.toBeNull()

    wrapper.unmount()
    host.remove()
  })

  it('closes a teleported panel when Escape is pressed inside it', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = await mountMegaMenu({
      attachTo: host,
      stubTeleport: false,
    })
    if (!wrapper) return

    await wrapper.get('[data-menu-key="system"]').trigger('click')
    const panelItem = document.querySelector<HTMLElement>(
      '[data-item-key="overview"]',
    )

    expect(panelItem).not.toBeNull()
    panelItem?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await wrapper.vm.$nextTick()

    expect(document.querySelector('.ga-mega-menu__panel')).toBeNull()

    wrapper.unmount()
    host.remove()
  })

  it('keeps a hover panel open while moving into the teleported panel', async () => {
    vi.useFakeTimers()
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = await mountMegaMenu({
      attachTo: host,
      stubTeleport: false,
      props: {
        trigger: 'hover',
        openDelay: 20,
        closeDelay: 80,
      },
    })
    if (!wrapper) return

    await wrapper.get('[data-menu-key="system"]').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(20)

    const panel = document.querySelector<HTMLElement>('.ga-mega-menu__panel')
    expect(panel).not.toBeNull()

    await wrapper.get('.ga-mega-menu').trigger('mouseleave')
    panel?.dispatchEvent(new Event('mouseenter'))
    await vi.advanceTimersByTimeAsync(80)

    expect(document.querySelector('.ga-mega-menu__panel')).not.toBeNull()

    panel?.dispatchEvent(new Event('mouseleave'))
    await vi.advanceTimersByTimeAsync(80)

    expect(document.querySelector('.ga-mega-menu__panel')).toBeNull()

    wrapper.unmount()
    host.remove()
  })

  it('selects a panel item, closes the panel, and highlights its owning menu', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        activeKey: 'overview',
      },
    })
    if (!wrapper) return

    expect(wrapper.get('[data-menu-key="system"]').classes()).toContain(
      'is-active',
    )

    await wrapper.get('[data-menu-key="system"]').trigger('click')
    expect(wrapper.get('.config-icon').attributes('data-tone')).toBe('primary')

    await wrapper.get('[data-item-key="overview"]').trigger('click')

    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({
      key: 'overview',
      source: 'panel',
      menu: menus[1],
      group: menus[1].groups[0],
      item: menus[1].groups[0].items[0],
    })
    expect(wrapper.find('.ga-mega-menu__panel').exists()).toBe(false)
  })

  it('emits close before select when selecting an item closes the panel', async () => {
    const eventOrder: string[] = []
    const wrapper = await mountMegaMenu({
      props: {
        onClose: () => eventOrder.push('close'),
        onSelect: () => eventOrder.push('select'),
      },
    })
    if (!wrapper) return

    await wrapper.get('[data-menu-key="system"]').trigger('click')
    eventOrder.length = 0

    await wrapper.get('[data-item-key="overview"]').trigger('click')

    expect(eventOrder).toEqual(['close', 'select'])
  })

  it('maps theme values to component CSS variables', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        theme: {
          menuBackgroundColor: '#14213d',
          menuItemActiveBackgroundColor: '#2563eb',
          menuItemBorderRadius: 12,
          menuItemIconSize: '24px',
          menuItemFontSize: 18,
        },
      },
    })
    if (!wrapper) return

    const style = wrapper.get('.ga-mega-menu').attributes('style')
    expect(style).toContain('--ga-mega-menu-menu-bg-color: #14213d')
    expect(style).toContain(
      '--ga-mega-menu-menu-item-active-bg-color: #2563eb',
    )
    expect(style).toContain('--ga-mega-menu-menu-item-radius: 12px')
    expect(style).toContain('--ga-mega-menu-menu-item-icon-size: 24px')
    expect(style).toContain('--ga-mega-menu-menu-item-font-size: 18px')
  })

  it('maps independent menu and panel theme values to region variables', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        openKey: 'system',
        theme: {
          menuBackgroundColor: '#10233f',
          menuItemBackgroundColor: '#18385f',
          menuItemHoverBackgroundColor: '#24517f',
          menuItemActiveBackgroundColor: '#2563eb',
          menuItemDisabledBackgroundColor: '#24364f',
          menuItemFocusOutlineColor: '#93c5fd',
          menuItemFontSize: 18,
          menuItemFontWeight: 600,
          menuItemIconSize: '1.5rem',
          panelBackgroundColor: '#f8fafc',
          panelGroupTitleColor: '#475569',
          panelItemTextColor: '#1e293b',
          panelItemBackgroundColor: '#ffffff',
          panelItemHoverBackgroundColor: '#eff6ff',
          panelItemActiveBackgroundColor: '#dbeafe',
          panelItemDisabledBackgroundColor: '#f1f5f9',
          panelItemFocusOutlineColor: '#2563eb',
          panelItemLabelFontSize: 15,
          panelItemDescriptionColor: '#64748b',
          panelItemIconBackgroundColor: '#e2e8f0',
          panelEmptyTextColor: '#64748b',
        },
      },
    })
    if (!wrapper) return

    const rootStyle = wrapper.get('.ga-mega-menu').attributes('style')
    const panelStyle = wrapper.get('.ga-mega-menu__panel').attributes('style')

    expect(rootStyle).toContain('--ga-mega-menu-menu-bg-color: #10233f')
    expect(rootStyle).toContain(
      '--ga-mega-menu-menu-item-bg-color: #18385f',
    )
    expect(rootStyle).toContain(
      '--ga-mega-menu-menu-item-font-size: 18px',
    )
    expect(rootStyle).toContain(
      '--ga-mega-menu-menu-item-font-weight: 600',
    )
    expect(rootStyle).toContain(
      '--ga-mega-menu-menu-item-icon-size: 1.5rem',
    )
    expect(panelStyle).toContain('--ga-mega-menu-panel-bg-color: #f8fafc')
    expect(panelStyle).toContain(
      '--ga-mega-menu-panel-item-text-color: #1e293b',
    )
    expect(panelStyle).toContain(
      '--ga-mega-menu-panel-item-bg-color: #ffffff',
    )
    expect(panelStyle).toContain(
      '--ga-mega-menu-panel-item-label-font-size: 15px',
    )
    expect(panelStyle).toContain(
      '--ga-mega-menu-panel-item-description-color: #64748b',
    )
  })

  it('keeps panel defaults when only menu values are overridden', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        theme: {
          menuBackgroundColor: '#111827',
          menuItemBackgroundColor: '#1f2937',
        },
      },
    })
    if (!wrapper) return

    const style = wrapper.get('.ga-mega-menu').attributes('style')
    expect(style).toContain('--ga-mega-menu-menu-bg-color: #111827')
    expect(style).toContain('--ga-mega-menu-menu-item-bg-color: #1f2937')
    expect(style).toContain('--ga-mega-menu-panel-bg-color: #2f436b')
    expect(style).toContain('--ga-mega-menu-panel-item-bg-color: #3d527c')
  })

  it('keeps menu defaults when only panel values are overridden', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        theme: {
          panelBackgroundColor: '#ffffff',
          panelItemBackgroundColor: '#f8fafc',
        },
      },
    })
    if (!wrapper) return

    const style = wrapper.get('.ga-mega-menu').attributes('style')
    expect(style).toContain('--ga-mega-menu-menu-bg-color: #2f436b')
    expect(style).toContain('--ga-mega-menu-menu-item-bg-color: #3d527c')
    expect(style).toContain('--ga-mega-menu-panel-bg-color: #ffffff')
    expect(style).toContain('--ga-mega-menu-panel-item-bg-color: #f8fafc')
  })

  it('uses the complete default theme when theme is not provided', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        theme: undefined,
      },
    })

    const style = wrapper?.get('.ga-mega-menu').attributes('style') ?? ''
    expect(style).toContain('--ga-mega-menu-menu-bg-color: #2f436b')
    expect(style).toContain('--ga-mega-menu-menu-item-text-color: #ffffff')
    expect(style).toContain('--ga-mega-menu-menu-item-font-size: 20px')
    expect(style).toContain('--ga-mega-menu-panel-item-bg-color: #3d527c')
  })

  it('keeps default values when a partial theme is provided', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        theme: {
          menuItemFontSize: '1.125rem',
        },
      },
    })
    if (!wrapper) return

    const style = wrapper.get('.ga-mega-menu').attributes('style')
    expect(style).toContain('--ga-mega-menu-menu-bg-color: #2f436b')
    expect(style).toContain(
      '--ga-mega-menu-menu-item-font-size: 1.125rem',
    )
  })

  it('allows menu and panel item content to be customized with slots', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        openKey: 'system',
      },
      slots: {
        'menu-item': ({ menu }: { menu: (typeof menus)[number] }) =>
          h('span', { class: 'custom-menu-item' }, `菜单:${menu.label}`),
        'panel-item': ({ item }: { item: { label: string } }) =>
          h('span', { class: 'custom-panel-item' }, `面板:${item.label}`),
      },
    })
    if (!wrapper) return

    expect(wrapper.get('.custom-menu-item').text()).toContain('菜单:工作台')
    expect(wrapper.get('.custom-panel-item').text()).toBe('面板:数据总览')
  })

  it('marks items without a meaningful description as label-only', async () => {
    const wrapper = await mountMegaMenu({
      props: {
        menus: [
          {
            key: 'system',
            label: '系统管理',
            groups: [
              {
                key: 'settings',
                items: [
                  { key: 'missing', label: '未传描述' },
                  { key: 'empty', label: '空描述', description: '' },
                  { key: 'blank', label: '空白描述', description: '   ' },
                  {
                    key: 'detail',
                    label: '正常描述',
                    description: '存在有效描述',
                  },
                ],
              },
            ],
          },
        ],
        openKey: 'system',
      },
    })
    if (!wrapper) return

    for (const key of ['missing', 'empty', 'blank']) {
      expect(wrapper.get(`[data-item-key="${key}"]`).classes()).toContain(
        'is-label-only',
      )
    }

    expect(wrapper.get('[data-item-key="detail"]').classes()).not.toContain(
      'is-label-only',
    )
    expect(wrapper.findAll('.ga-mega-menu__item-description')).toHaveLength(1)
  })

  it('exposes default and normalized panel column widths', async () => {
    const defaultWrapper = await mountMegaMenu()
    const defaultStyle =
      defaultWrapper?.get('.ga-mega-menu').attributes('style') ?? ''

    expect(defaultStyle).toContain('--ga-mega-menu-min-column-width: 240px')
    expect(defaultStyle).toContain('--ga-mega-menu-max-column-width: 420px')

    const normalizedWrapper = await mountMegaMenu({
      props: {
        minColumnWidth: 360,
        maxColumnWidth: 320,
      },
    })
    const normalizedStyle =
      normalizedWrapper?.get('.ga-mega-menu').attributes('style') ?? ''

    expect(normalizedStyle).toContain(
      '--ga-mega-menu-min-column-width: 360px',
    )
    expect(normalizedStyle).toContain(
      '--ga-mega-menu-max-column-width: 360px',
    )

    const invalidWrapper = await mountMegaMenu({
      props: {
        maxColumnWidth: Number.NaN,
      },
    })
    const invalidStyle =
      invalidWrapper?.get('.ga-mega-menu').attributes('style') ?? ''

    expect(invalidStyle).toContain('--ga-mega-menu-max-column-width: 420px')
  })

  it('uses adaptive panel height by default and for explicit auto', async () => {
    const defaultWrapper = await mountMegaMenu({
      props: { openKey: 'system' },
    })
    const explicitWrapper = await mountMegaMenu({
      props: { openKey: 'system', maxHeight: 'auto' },
    })

    expect(
      defaultWrapper?.findComponent({ name: 'ElScrollbar' }).props('maxHeight'),
    ).toBeUndefined()
    expect(
      explicitWrapper
        ?.findComponent({ name: 'ElScrollbar' })
        .props('maxHeight'),
    ).toBeUndefined()
  })

  it('passes configured panel maximum heights to ElScrollbar', async () => {
    const numericWrapper = await mountMegaMenu({
      props: { openKey: 'system', maxHeight: 460 },
    })
    const cssWrapper = await mountMegaMenu({
      props: { openKey: 'system', maxHeight: '50vh' },
    })

    expect(
      numericWrapper?.findComponent({ name: 'ElScrollbar' }).props('maxHeight'),
    ).toBe(460)
    expect(
      cssWrapper?.findComponent({ name: 'ElScrollbar' }).props('maxHeight'),
    ).toBe('50vh')
  })

  it('centers a panel icon beside description content', async () => {
    expect(megaMenuStyles).toMatch(
      /&__item-icon\s*\{[\s\S]*?align-self:\s*center;/,
    )
  })

  it('styles menu and panel regions with independent CSS variables', () => {
    expect(megaMenuStyles).toContain(
      'var(--ga-mega-menu-menu-bg-color',
    )
    expect(megaMenuStyles).toContain(
      'var(--ga-mega-menu-menu-item-bg-color',
    )
    expect(megaMenuStyles).toContain(
      'var(--ga-mega-menu-menu-item-hover-bg-color',
    )
    expect(megaMenuStyles).toContain(
      'var(--ga-mega-menu-menu-item-active-bg-color',
    )
    expect(megaMenuStyles).toMatch(
      /var\(\s*--ga-mega-menu-menu-item-disabled-bg-color/,
    )
    expect(megaMenuStyles).toContain(
      'var(--ga-mega-menu-menu-item-focus-outline-color',
    )
    expect(megaMenuStyles).toContain(
      'var(--ga-mega-menu-panel-bg-color',
    )
    expect(megaMenuStyles).toContain(
      'var(--ga-mega-menu-panel-item-bg-color',
    )
    expect(megaMenuStyles).toContain(
      'var(--ga-mega-menu-panel-item-hover-bg-color',
    )
    expect(megaMenuStyles).toContain(
      'var(--ga-mega-menu-panel-item-active-bg-color',
    )
    expect(megaMenuStyles).toMatch(
      /var\(\s*--ga-mega-menu-panel-item-disabled-bg-color/,
    )
    expect(megaMenuStyles).toContain(
      'var(--ga-mega-menu-panel-item-focus-outline-color',
    )
    expect(megaMenuStyles).toMatch(
      /var\(\s*--ga-mega-menu-panel-item-icon-bg-color/,
    )
    expect(megaMenuStyles).toContain(
      'var(--ga-mega-menu-panel-empty-padding',
    )
    expect(megaMenuStyles).not.toContain('--ga-mega-menu-item-bg-color')
    expect(megaMenuStyles).not.toContain('--ga-mega-menu-text-color')
  })

  it('uses a fixed full-viewport panel without a panelWidth prop', async () => {
    const component = await loadMegaMenu()
    const runtimeProps =
      (component as { props?: Record<string, unknown> } | undefined)?.props ??
      {}

    expect(runtimeProps).not.toHaveProperty('panelWidth')
    expect(megaMenuStyles).toMatch(
      /&__panel\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?width:\s*100vw;/,
    )
    expect(megaMenuStyles).not.toContain('--ga-mega-menu-panel-left')
  })

  it('inherits root and menu height without fixed 64px minimums', () => {
    expect(megaMenuStyles).not.toMatch(/min-height:\s*64px;/)
    expect(megaMenuStyles).toContain(
      'min-height: var(--ga-mega-menu-panel-item-min-height, 64px)',
    )
  })
})

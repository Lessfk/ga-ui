import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, type Ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ApiTable from '../components/ApiTable.vue'
import DemoBlock from '../components/DemoBlock.vue'
import { providePageOutline, type PageOutlineItem } from '../composables/usePageOutline'
import {
  createComponentDocLoader,
  type ComponentDocModules,
} from '../content/component-docs'
import type { ComponentDocDefinition } from '../content/types'
import ComponentView from './ComponentView.vue'

const { loadComponentDocMock } = vi.hoisted(() => ({
  loadComponentDocMock: vi.fn(),
}))

vi.mock('../content/component-docs', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../content/component-docs')>()
  return { ...actual, loadComponentDoc: loadComponentDocMock }
})

const FirstDemo = defineComponent({
  name: 'FirstDemo',
  setup: () => () => h('div', 'first demo'),
})
const SecondDemo = defineComponent({
  name: 'SecondDemo',
  setup: () => () => h('div', 'second demo'),
})

const sampleDefinition: ComponentDocDefinition = {
  name: 'GaSample',
  slug: 'sample',
  title: 'Sample 示例组件',
  category: 'base',
  description: '用于验证通用组件文档页面。',
  importCode: "import { GaSample } from 'ga-ui-plus/base'",
  usage: '<GaSample v-model="value" />',
  demos: [
    {
      id: 'basic',
      title: '基础用法',
      description: '第一个案例',
      component: FirstDemo,
      source: '<template><GaSample /></template>',
    },
    {
      id: 'advanced',
      title: '进阶用法',
      description: '第二个案例',
      component: SecondDemo,
      source: '<template><GaSample advanced /></template>',
    },
  ],
  api: {
    props: [
      { name: 'modelValue', description: '绑定值', type: 'string' },
    ],
    events: [
      {
        name: 'update:modelValue',
        description: '绑定值变化',
        type: '(value: string) => void',
        parameters: 'value: string',
      },
    ],
    slots: [
      { name: 'default', description: '默认内容', type: '() => unknown' },
    ],
    expose: [
      { name: 'focus', description: '聚焦组件', type: '() => void' },
    ],
  },
  notes: ['受控模式下需要同步更新绑定值。'],
}

function loaderFor(definitions: Record<string, ComponentDocDefinition>) {
  const modules: ComponentDocModules = Object.fromEntries(
    Object.entries(definitions).map(([slug, definition]) => [
      `./components/${slug}.ts`,
      async () => ({ default: definition }),
    ]),
  )
  return createComponentDocLoader(modules)
}

function mountView(initialSlug = 'sample') {
  const slug = ref(initialSlug)
  let outlineItems!: Ref<PageOutlineItem[]>
  const Host = defineComponent({
    name: 'ComponentViewHost',
    setup() {
      outlineItems = providePageOutline().items
      return () => h(ComponentView, { slug: slug.value })
    },
  })
  const wrapper = mount(Host, {
    global: {
      stubs: {
        RouterLink: {
          props: ['to'],
          template: '<a :href="to"><slot /></a>',
        },
      },
    },
  })
  return { outlineItems, slug, wrapper }
}

describe('component document loader', () => {
  it('rejects an absent slug with a clear error', async () => {
    await expect(createComponentDocLoader({})('missing')).rejects.toThrow(
      'Unknown component document: missing',
    )
  })
})

describe('ComponentView', () => {
  beforeEach(() => {
    loadComponentDocMock.mockReset()
    loadComponentDocMock.mockImplementation(loaderFor({ sample: sampleDefinition }))
  })

  it('renders a complete registry-driven component page and outline', async () => {
    const { outlineItems, wrapper } = mountView()
    await flushPromises()

    expect(wrapper.get('h1').text()).toBe(sampleDefinition.title)
    expect(wrapper.text()).toContain(sampleDefinition.description)
    expect(wrapper.text()).toContain(sampleDefinition.importCode)
    expect(wrapper.text()).toContain(sampleDefinition.usage)
    expect(wrapper.findAllComponents(DemoBlock)).toHaveLength(2)
    expect(wrapper.findAllComponents(ApiTable)).toHaveLength(4)
    expect(wrapper.findAll('h2').map((heading) => heading.text())).toEqual(
      expect.arrayContaining([
        '使用方式',
        '示例',
        'Props',
        'Events',
        'Slots',
        'Expose',
      ]),
    )
    expect(wrapper.text()).toContain(sampleDefinition.notes[0])
    expect(outlineItems.value.map((item) => item.id)).toEqual([
      'usage',
      'examples',
      'props',
      'events',
      'slots',
      'expose',
    ])
  })

  it('reacts to slug changes and ignores stale requests', async () => {
    let resolveSample!: (definition: ComponentDocDefinition) => void
    let resolveLatest!: (definition: ComponentDocDefinition) => void
    const latestDefinition = {
      ...sampleDefinition,
      slug: 'latest',
      title: 'Latest 最新组件',
      api: { ...sampleDefinition.api, expose: [] },
    }
    loadComponentDocMock.mockImplementation((slug: string) => {
      return new Promise<ComponentDocDefinition>((resolve) => {
        if (slug === 'sample') resolveSample = resolve
        else resolveLatest = resolve
      })
    })
    const { outlineItems, slug, wrapper } = mountView()
    slug.value = 'latest'
    await nextTick()

    resolveLatest(latestDefinition)
    await flushPromises()
    resolveSample(sampleDefinition)
    await flushPromises()

    expect(wrapper.get('h1').text()).toBe(latestDefinition.title)
    expect(outlineItems.value.map((item) => item.id)).not.toContain('expose')
  })

  it('renders an ElResult with the slug and a component-entry action on failure', async () => {
    loadComponentDocMock.mockRejectedValue(
      new Error('Unknown component document: missing'),
    )
    const { outlineItems, wrapper } = mountView('missing')
    await flushPromises()

    expect(wrapper.findComponent({ name: 'ElResult' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('missing')
    expect(wrapper.get('a').text()).toContain('返回组件入口')
    expect(wrapper.get('a').attributes('href')).toBe('/components/dialog')
    expect(wrapper.find('a button').exists()).toBe(false)
    expect(outlineItems.value).toEqual([])
  })

  it('clears the outline when a pending page is unmounted', async () => {
    let resolveRequest!: (definition: ComponentDocDefinition) => void
    loadComponentDocMock.mockImplementation(
      () =>
        new Promise<ComponentDocDefinition>((resolve) => {
          resolveRequest = resolve
        }),
    )
    const { outlineItems, wrapper } = mountView()
    outlineItems.value = [{ id: 'stale', label: '旧页面', level: 2 }]

    wrapper.unmount()
    resolveRequest(sampleDefinition)
    await flushPromises()

    expect(outlineItems.value).toEqual([])
  })
})

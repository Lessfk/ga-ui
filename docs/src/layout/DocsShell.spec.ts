import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { flushPromises, mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { defineComponent, h, nextTick, onMounted } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'

import { usePageOutline } from '../composables/usePageOutline'
import DocsShell from './DocsShell.vue'

const docsStyles = readFileSync(
  resolve(process.cwd(), 'src/styles/index.css'),
  'utf8',
)

const RoutePage = defineComponent({
  setup() {
    const outline = usePageOutline()
    onMounted(() => {
      outline.setItems([{ id: 'usage', label: '基础用法', level: 2 }])
    })
    return () => h('section', { id: 'usage' }, '页面内容')
  },
})

async function mountShell() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: RoutePage },
      { path: '/components/:slug', component: RoutePage },
      { path: '/:pathMatch(.*)*', component: RoutePage },
    ],
  })
  await router.push('/components/search-bar')
  await router.isReady()
  const wrapper = mount(DocsShell, {
    attachTo: document.body,
    global: { plugins: [router, ElementPlus] },
  })
  await nextTick()
  return { router, wrapper }
}

describe('DocsShell', () => {
  it('renders brand, component groups, active route, and page outline', async () => {
    const { wrapper } = await mountShell()
    expect(wrapper.text()).toContain('GA UI Plus')
    expect(wrapper.text()).toContain('基础组件')
    expect(wrapper.text()).toContain('业务组件')
    expect(
      wrapper.get('input[placeholder="搜索组件或 API"]').attributes('aria-label'),
    ).toBe('搜索组件或 API')
    expect(wrapper.get('[aria-current="page"]').attributes('href')).toBe(
      '/components/search-bar',
    )
    expect(wrapper.get('a[href="#usage"]').text()).toBe('基础用法')
    wrapper.unmount()
  })

  it('shows matching component search results', async () => {
    const { router, wrapper } = await mountShell()
    await wrapper
      .get('input[placeholder="搜索组件或 API"]')
      .setValue('gasearchbar')
    await nextTick()
    expect(document.body.textContent).toContain('SearchBar 搜索栏')

    await wrapper
      .get('input[placeholder="搜索组件或 API"]')
      .setValue('字段配置')
    await nextTick()
    expect(document.body.textContent).toContain('SearchBar 搜索栏')

    wrapper.findComponent({ name: 'ElAutocomplete' }).vm.$emit('select', {
      label: 'Dialog 对话框',
      path: '/components/dialog',
    })
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/components/dialog')
    wrapper.unmount()
  })

  it('keeps the 248px sidebar when only the outline is hidden', () => {
    const breakpoint = docsStyles.slice(
      docsStyles.indexOf('@media (max-width: 1179px)'),
    )

    expect(breakpoint).toMatch(
      /\.ga-docs-shell__body\s*{\s*grid-template-columns:\s*248px minmax\(0,\s*1fr\)/,
    )
    expect(breakpoint).toContain('.ga-docs-outline')
    expect(breakpoint).not.toContain('.ga-docs-header')
    expect(breakpoint).not.toContain('.ga-docs-shell__content')
  })

  it('keeps guide and home code blocks horizontally scrollable', () => {
    expect(docsStyles).not.toMatch(
      /\.ga-docs-(?:home|guide)__section\s*>\s*\.ga-docs-source-code\s*{[^}]*overflow:\s*hidden/s,
    )
  })
})

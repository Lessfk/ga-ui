import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from '../App.vue'
import { router, waitForHashTarget } from './index'

afterEach(() => vi.useRealTimers())

describe('documentation app router outlet', () => {
  it('renders the active route through RouterView', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
      ],
    })
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          RouterView: {
            template: '<div data-testid="router-view" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="router-view"]').exists()).toBe(true)
  })

  it('waits for an asynchronously rendered hash target', async () => {
    vi.useFakeTimers()
    const target = waitForHashTarget('#late-section', 2, 10)
    const section = document.createElement('section')
    section.id = 'late-section'
    document.body.append(section)

    await vi.runAllTimersAsync()

    await expect(target).resolves.toBe(true)
    section.remove()
  })

  it('keeps waiting when a dynamic component chunk takes longer than one second', async () => {
    vi.useFakeTimers()
    const target = waitForHashTarget('#slow-section')

    await vi.advanceTimersByTimeAsync(1_500)
    const section = document.createElement('section')
    section.id = 'slow-section'
    document.body.append(section)

    await expect(target).resolves.toBe(true)
    section.remove()
  })

  it('supports hash targets whose ids contain selector metacharacters', async () => {
    const section = document.createElement('section')
    section.id = 'api:props[0]'
    document.body.append(section)

    await expect(waitForHashTarget('#api:props[0]', 1, 0)).resolves.toBe(true)
    section.remove()
  })

  it('cancels a pending hash target wait without leaving a timer behind', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const target = waitForHashTarget('#missing-section', 100, 50, controller.signal)

    expect(vi.getTimerCount()).toBe(1)
    controller.abort()

    await expect(target).resolves.toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not apply a scroll position from a cancelled navigation', async () => {
    vi.useFakeTimers()
    const scrollBehavior = router.options.scrollBehavior
    expect(scrollBehavior).toBeTypeOf('function')

    const staleScroll = scrollBehavior!(
      { hash: '#missing-section' } as never,
      {} as never,
      null,
    )
    const currentScroll = scrollBehavior!(
      { hash: '' } as never,
      {} as never,
      null,
    )

    await expect(staleScroll).resolves.toBe(false)
    await expect(currentScroll).resolves.toEqual({ top: 0 })
    expect(vi.getTimerCount()).toBe(0)
  })
})

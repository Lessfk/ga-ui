import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import CopyButton from './CopyButton.vue'

describe('CopyButton', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('announces successful copy feedback', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    const wrapper = mount(CopyButton, { props: { text: 'source' } })

    await wrapper.get('button').trigger('click')
    await flushPromises()

    const status = wrapper.get('[role="status"]')
    expect(status.attributes('aria-live')).toBe('polite')
    expect(status.text()).toBe('已复制')
  })

  it('ignores stale clipboard results from an earlier click', async () => {
    let resolveFirst!: () => void
    let rejectFirst!: (reason?: unknown) => void
    let resolveSecond!: () => void
    const first = new Promise<void>((resolve, reject) => {
      resolveFirst = resolve
      rejectFirst = reject
    })
    const second = new Promise<void>((resolve) => {
      resolveSecond = resolve
    })
    const writeText = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockImplementationOnce(() => first)
      .mockImplementationOnce(() => second)
    const wrapper = mount(CopyButton, { props: { text: 'source' } })

    await wrapper.get('button').trigger('click')
    await wrapper.get('button').trigger('click')
    expect(writeText).toHaveBeenCalledTimes(2)

    resolveSecond()
    await flushPromises()
    rejectFirst(new Error('stale failure'))
    await flushPromises()

    expect(wrapper.get('[role="status"]').text()).toBe('已复制')
    resolveFirst()
  })

  it('does not schedule feedback cleanup after unmount', async () => {
    let resolveCopy!: () => void
    const pendingCopy = new Promise<void>((resolve) => {
      resolveCopy = resolve
    })
    vi.spyOn(navigator.clipboard, 'writeText').mockReturnValue(pendingCopy)
    const wrapper = mount(CopyButton, { props: { text: 'source' } })

    await wrapper.get('button').trigger('click')
    wrapper.unmount()
    resolveCopy()
    await flushPromises()

    expect(vi.getTimerCount()).toBe(0)
  })
})

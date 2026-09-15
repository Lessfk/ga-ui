import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import DemoBlock from './DemoBlock.vue'

const CounterDemo = defineComponent({
  setup() {
    const count = ref(0)
    return () =>
      h(
        'button',
        {
          class: 'counter-demo',
          onClick: () => count.value++,
        },
        String(count.value),
      )
  },
})

describe('DemoBlock', () => {
  beforeEach(() => {
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('expands the exact source passed to the live demo', async () => {
    const wrapper = mount(DemoBlock, {
      props: {
        title: '计数器',
        description: '测试案例',
        demo: CounterDemo,
        source: '<template>counter</template>',
      },
    })
    expect(wrapper.find('[data-testid="source-code"]').exists()).toBe(false)
    await wrapper.get('[data-action="toggle-source"]').trigger('click')
    expect(wrapper.get('[data-testid="source-code"]').text()).toContain(
      '<template>counter</template>',
    )
  })

  it('copies source code', async () => {
    const wrapper = mount(DemoBlock, {
      props: {
        title: '计数器',
        description: '',
        demo: CounterDemo,
        source: '<template>counter</template>',
      },
    })
    await wrapper.get('[data-action="copy-source"]').trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '<template>counter</template>',
    )
  })

  it('remounts the demo to restore its initial state', async () => {
    const wrapper = mount(DemoBlock, {
      props: {
        title: '计数器',
        description: '',
        demo: CounterDemo,
        source: 'source',
      },
    })
    await wrapper.get('.counter-demo').trigger('click')
    expect(wrapper.get('.counter-demo').text()).toBe('1')
    await wrapper.get('[data-action="reset-demo"]').trigger('click')
    expect(wrapper.get('.counter-demo').text()).toBe('0')
  })

  it('keeps the demo component out of Vue reactive proxies', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    mount(DemoBlock, {
      props: {
        title: '计数器',
        description: '',
        demo: CounterDemo,
        source: 'source',
      },
    })

    expect(warn.mock.calls.flat().join(' ')).not.toContain(
      'made a reactive object',
    )
  })
})

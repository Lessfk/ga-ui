import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import App from '../App.vue'

describe('documentation app router outlet', () => {
  it('renders the active route through RouterView', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: {
            template: '<div data-testid="router-view" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="router-view"]').exists()).toBe(true)
  })
})

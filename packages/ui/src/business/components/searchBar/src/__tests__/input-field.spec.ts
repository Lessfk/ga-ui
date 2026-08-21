import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import SearchInputField from '../fields/input-field.vue'

const ElInputStub = defineComponent({
  name: 'ElInput',
  inheritAttrs: false,
  props: {
    modelValue: [String, Number],
    type: String,
    disabled: Boolean,
    placeholder: String,
  },
  emits: ['update:modelValue', 'change', 'keydown'],
  setup(props, { attrs, emit }) {
    return () =>
      h(props.type === 'textarea' ? 'textarea' : 'input', {
        ...attrs,
        class: 'el-input-stub',
        onInput: (event: Event) =>
          emit(
            'update:modelValue',
            (event.target as HTMLInputElement).value,
          ),
        onChange: (event: Event) =>
          emit('change', (event.target as HTMLInputElement).value),
        onKeydown: (event: KeyboardEvent) => emit('keydown', event),
      })
  },
})

describe('SearchInputField', () => {
  it('forwards safe props and protects controlled bindings', () => {
    const wrapper = mount(SearchInputField, {
      props: {
        modelValue: 'alice',
        field: {
          key: 'keyword',
          type: 'input',
          label: '关键词',
          componentProps: {
            clearable: true,
            modelValue: 'ignored',
            disabled: false,
          },
        },
        disabled: true,
        placeholder: '姓名或手机号',
        ariaLabel: '用户关键词',
      },
      global: { stubs: { ElInput: ElInputStub } },
    })

    const input = wrapper.get('.el-input-stub')
    expect(input.attributes('clearable')).toBe('true')
    expect(wrapper.findComponent(ElInputStub).props()).toMatchObject({
      modelValue: 'alice',
      type: 'text',
      disabled: true,
      placeholder: '姓名或手机号',
    })
    expect(input.attributes('aria-label')).toBe('用户关键词')
  })

  it('emits model and change values', () => {
    const wrapper = mount(SearchInputField, {
      props: {
        modelValue: '',
        field: { key: 'keyword', type: 'input', label: '关键词' },
        disabled: false,
        ariaLabel: '关键词',
      },
      global: { stubs: { ElInput: ElInputStub } },
    })

    wrapper.findComponent(ElInputStub).vm.$emit('update:modelValue', 'bob')
    wrapper.findComponent(ElInputStub).vm.$emit('change', 'bob')
    expect(wrapper.emitted('update:modelValue')).toEqual([['bob']])
    expect(wrapper.emitted('change')).toEqual([['bob']])
  })

  it('does not search on Enter for inputs or textareas', async () => {
    const input = mount(SearchInputField, {
      props: {
        field: { key: 'keyword', type: 'input', label: '关键词' },
        disabled: false,
        ariaLabel: '关键词',
      },
      global: { stubs: { ElInput: ElInputStub } },
    })
    const textarea = mount(SearchInputField, {
      props: {
        field: { key: 'notes', type: 'textarea', label: '备注' },
        disabled: false,
        ariaLabel: '备注',
      },
      global: { stubs: { ElInput: ElInputStub } },
    })

    await input.get('.el-input-stub').trigger('keydown.enter')
    await textarea.get('.el-input-stub').trigger('keydown.enter')
    expect(input.emitted('search')).toBeUndefined()
    expect(textarea.emitted('search')).toBeUndefined()
    expect(textarea.get('textarea').exists()).toBe(true)
  })

  it('does not search while an IME composition is active', async () => {
    const wrapper = mount(SearchInputField, {
      props: {
        field: { key: 'keyword', type: 'input', label: '关键词' },
        disabled: false,
        ariaLabel: '关键词',
      },
      global: { stubs: { ElInput: ElInputStub } },
    })

    await wrapper.get('.el-input-stub').trigger('keydown', {
      key: 'Enter',
      isComposing: true,
    })
    await wrapper.get('.el-input-stub').trigger('keydown', {
      key: 'Enter',
      keyCode: 229,
    })

    expect(wrapper.emitted('search')).toBeUndefined()
  })

  it('prevents native form submission for input Enter only', async () => {
    const input = mount(SearchInputField, {
      props: {
        field: { key: 'keyword', type: 'input', label: '关键词' },
        disabled: false,
        ariaLabel: '关键词',
      },
      global: { stubs: { ElInput: ElInputStub } },
    })
    const textarea = mount(SearchInputField, {
      props: {
        field: { key: 'notes', type: 'textarea', label: '备注' },
        disabled: false,
        ariaLabel: '备注',
      },
      global: { stubs: { ElInput: ElInputStub } },
    })
    const inputEnter = new KeyboardEvent('keydown', {
      key: 'Enter',
      cancelable: true,
    })
    const textareaEnter = new KeyboardEvent('keydown', {
      key: 'Enter',
      cancelable: true,
    })

    input.get('.el-input-stub').element.dispatchEvent(inputEnter)
    textarea.get('.el-input-stub').element.dispatchEvent(textareaEnter)
    await input.vm.$nextTick()

    expect(inputEnter.defaultPrevented).toBe(true)
    expect(textareaEnter.defaultPrevented).toBe(false)
  })
})

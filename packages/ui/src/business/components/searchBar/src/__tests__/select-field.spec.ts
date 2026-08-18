import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import SearchSelectField from '../fields/select-field.vue'

const ElSelectStub = defineComponent({
  name: 'ElSelect',
  inheritAttrs: false,
  props: {
    modelValue: null,
    disabled: Boolean,
    placeholder: String,
    ariaLabel: String,
  },
  emits: ['update:modelValue', 'change'],
  setup(_, { attrs, slots }) {
    return () =>
      h(
        'div',
        { ...attrs, class: 'el-select-stub' },
        slots.default?.(),
      )
  },
})

const ElOptionStub = defineComponent({
  name: 'ElOption',
  props: {
    label: String,
    value: null,
    disabled: Boolean,
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'el-option-stub',
        'data-label': props.label,
        'data-value': String(props.value),
        'data-value-type': typeof props.value,
        'data-disabled': String(props.disabled),
      })
  },
})

describe('SearchSelectField', () => {
  it('renders configured options and forwards safe select props', () => {
    const wrapper = mount(SearchSelectField, {
      props: {
        modelValue: 'enabled',
        field: {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [
            { label: '启用', value: 'enabled' },
            { label: '禁用', value: 'disabled', disabled: true },
          ],
          componentProps: {
            clearable: true,
            multiple: true,
            modelValue: 'ignored',
            disabled: true,
          },
        },
        disabled: false,
        placeholder: '请选择状态',
        ariaLabel: '状态',
      },
      global: {
        stubs: {
          ElSelect: ElSelectStub,
          ElOption: ElOptionStub,
        },
      },
    })

    const options = wrapper.findAll('.el-option-stub')
    expect(options).toHaveLength(2)
    expect(options[0].attributes('data-label')).toBe('启用')
    expect(options[0].attributes('data-value')).toBe('enabled')
    expect(options[1].attributes('data-disabled')).toBe('true')
    expect(wrapper.get('.el-select-stub').attributes('clearable')).toBe('true')
    expect(wrapper.get('.el-select-stub').attributes('multiple')).toBe('true')
    expect(wrapper.findComponent(ElSelectStub).props()).toMatchObject({
      modelValue: 'enabled',
      disabled: false,
      placeholder: '请选择状态',
      ariaLabel: '状态',
    })
  })

  it('updates reactive mixed-type options with unique vnode keys', async () => {
    const wrapper = mount(SearchSelectField, {
      props: {
        field: {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [{ label: '数字一', value: 1 }],
        },
        disabled: false,
        ariaLabel: '状态',
      },
      global: {
        stubs: {
          ElSelect: ElSelectStub,
          ElOption: ElOptionStub,
        },
      },
    })

    await wrapper.setProps({
      field: {
        key: 'status',
        type: 'select',
        label: '状态',
        options: [
          { label: '数字一', value: 1 },
          { label: '字符串一', value: '1' },
        ],
      },
    })

    const options = wrapper.findAllComponents(ElOptionStub)
    expect(options.map((option) => option.vm.$.vnode.key)).toEqual([
      'number:1',
      'string:1',
    ])
    expect(options.map((option) => option.attributes('data-value-type'))).toEqual([
      'number',
      'string',
    ])
  })

  it('emits scalar values for single select and arrays for multiple select', () => {
    const single = mount(SearchSelectField, {
      props: {
        field: {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [],
        },
        disabled: false,
        ariaLabel: '状态',
      },
      global: {
        stubs: {
          ElSelect: ElSelectStub,
          ElOption: ElOptionStub,
        },
      },
    })

    const multiple = mount(SearchSelectField, {
      props: {
        field: {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [],
          componentProps: { multiple: true },
        },
        disabled: false,
        ariaLabel: '状态',
      },
      global: {
        stubs: {
          ElSelect: ElSelectStub,
          ElOption: ElOptionStub,
        },
      },
    })

    single.findComponent(ElSelectStub).vm.$emit('update:modelValue', 'enabled')
    single.findComponent(ElSelectStub).vm.$emit('change', 'enabled')
    multiple.findComponent(ElSelectStub).vm.$emit(
      'update:modelValue',
      ['enabled'],
    )
    multiple.findComponent(ElSelectStub).vm.$emit('change', ['enabled'])

    expect(single.emitted('update:modelValue')).toEqual([['enabled']])
    expect(single.emitted('change')).toEqual([['enabled']])
    expect(multiple.emitted('update:modelValue')).toEqual([[['enabled']]])
    expect(multiple.emitted('change')).toEqual([[['enabled']]])
  })
})

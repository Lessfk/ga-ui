import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import SearchDateField from '../fields/date-field.vue'

const ElDatePickerStub = defineComponent({
  name: 'ElDatePicker',
  inheritAttrs: false,
  props: {
    modelValue: null,
    type: String,
    format: String,
    valueFormat: String,
    disabled: Boolean,
    placeholder: String,
    startPlaceholder: String,
    endPlaceholder: String,
    ariaLabel: String,
  },
  emits: ['update:modelValue', 'change'],
  setup(_, { attrs }) {
    return () => h('div', { ...attrs, class: 'el-date-picker-stub' })
  },
})

describe('SearchDateField', () => {
  it('forwards configured formats and protects controlled props', () => {
    const wrapper = mount(SearchDateField, {
      props: {
        modelValue: ['2026-08-01', '2026-08-18'],
        field: {
          key: 'createdAt',
          type: 'daterange',
          label: '创建日期',
          format: 'YYYY年MM月DD日',
          valueFormat: 'YYYY-MM-DD',
          componentProps: {
            unlinkPanels: true,
            type: 'monthrange',
            format: 'ignored',
            valueFormat: 'ignored',
            disabled: false,
            placeholder: 'ignored',
            startPlaceholder: 'ignored start',
            endPlaceholder: 'ignored end',
            'aria-label': 'ignored',
          },
        },
        disabled: true,
        placeholder: '请选择创建日期',
        ariaLabel: '创建日期范围',
      },
      global: { stubs: { ElDatePicker: ElDatePickerStub } },
    })

    expect(wrapper.findComponent(ElDatePickerStub).props()).toMatchObject({
      modelValue: ['2026-08-01', '2026-08-18'],
      type: 'daterange',
      format: 'YYYY年MM月DD日',
      valueFormat: 'YYYY-MM-DD',
      disabled: true,
      startPlaceholder: '请选择创建日期',
      endPlaceholder: '请选择创建日期',
      ariaLabel: '创建日期范围',
    })
    expect(wrapper.get('.el-date-picker-stub').attributes('unlinkpanels')).toBe(
      'true',
    )
  })

  it('emits date model and change values', async () => {
    const externalUpdate = vi.fn()
    const externalChange = vi.fn()
    const wrapper = mount(SearchDateField, {
      props: {
        field: {
          key: 'createdAt',
          type: 'date',
          label: '创建日期',
          componentProps: {
            modelValue: 'ignored',
            'onUpdate:modelValue': externalUpdate,
            onChange: externalChange,
          },
        },
        disabled: false,
        ariaLabel: '创建日期',
      },
      global: { stubs: { ElDatePicker: ElDatePickerStub } },
    })

    await wrapper
      .findComponent(ElDatePickerStub)
      .vm.$emit('update:modelValue', '2026-08-18')
    await wrapper
      .findComponent(ElDatePickerStub)
      .vm.$emit('change', '2026-08-18')

    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-08-18']])
    expect(wrapper.emitted('change')).toEqual([['2026-08-18']])
    expect(externalUpdate).not.toHaveBeenCalled()
    expect(externalChange).not.toHaveBeenCalled()
  })
})

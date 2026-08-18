import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import SearchFieldRenderer from '../field-renderer.vue'
import type { GaSearchField } from '../props'

function createAdapterStub(name: string, className: string) {
  return defineComponent({
    name,
    props: {
      modelValue: null,
      field: Object,
      disabled: Boolean,
      placeholder: String,
      ariaLabel: String,
    },
    emits: ['update:modelValue', 'change', 'search'],
    setup() {
      return () => h('div', { class: className })
    },
  })
}

const SearchInputFieldStub = createAdapterStub(
  'SearchInputField',
  'search-input-field-stub',
)
const SearchSelectFieldStub = createAdapterStub(
  'SearchSelectField',
  'search-select-field-stub',
)
const SearchDateFieldStub = createAdapterStub(
  'SearchDateField',
  'search-date-field-stub',
)
const adapterStubs = {
  SearchInputField: SearchInputFieldStub,
  SearchSelectField: SearchSelectFieldStub,
  SearchDateField: SearchDateFieldStub,
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('SearchFieldRenderer', () => {
  it.each([
    [
      'input',
      { key: 'keyword', type: 'input', label: '关键词' },
      'SearchInputField',
    ],
    [
      'textarea',
      { key: 'notes', type: 'textarea', label: '备注' },
      'SearchInputField',
    ],
    [
      'select',
      { key: 'status', type: 'select', label: '状态', options: [] },
      'SearchSelectField',
    ],
    [
      'date',
      { key: 'createdAt', type: 'date', label: '创建日期' },
      'SearchDateField',
    ],
    [
      'datetime',
      { key: 'createdAt', type: 'datetime', label: '创建时间' },
      'SearchDateField',
    ],
    [
      'daterange',
      { key: 'createdAt', type: 'daterange', label: '创建日期' },
      'SearchDateField',
    ],
    [
      'datetimerange',
      { key: 'createdAt', type: 'datetimerange', label: '创建时间' },
      'SearchDateField',
    ],
  ] as Array<[string, GaSearchField, string]>)(
    'dispatches %s fields',
    (_, field, componentName) => {
      const wrapper = mount(SearchFieldRenderer, {
        props: {
          modelValue: undefined,
          field,
          disabled: false,
          labelMode: 'label',
        },
        global: { stubs: adapterStubs },
      })

      expect(wrapper.findComponent({ name: componentName }).exists()).toBe(true)
    },
  )

  it('prioritizes a custom slot and emits its updates', async () => {
    const wrapper = mount(SearchFieldRenderer, {
      props: {
        modelValue: 'alice',
        field: { key: 'keyword', type: 'input', label: '关键词' },
        disabled: false,
        labelMode: 'placeholder',
      },
      slots: {
        default: ({ value, update }) =>
          h(
            'button',
            {
              class: 'custom-field',
              onClick: () => update(`${value}-custom`),
            },
            'custom',
          ),
      },
      global: { stubs: adapterStubs },
    })

    expect(wrapper.find('.custom-field').exists()).toBe(true)
    expect(wrapper.findComponent(SearchInputFieldStub).exists()).toBe(false)

    await wrapper.get('.custom-field').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['alice-custom']])
    expect(wrapper.emitted('change')).toEqual([['alice-custom']])
  })

  it('resolves placeholder and accessible label for built-in fields', () => {
    const wrapper = mount(SearchFieldRenderer, {
      props: {
        modelValue: '',
        field: {
          key: 'keyword',
          type: 'input',
          label: '关键词',
          ariaLabel: '用户关键词',
        },
        disabled: true,
        labelMode: 'placeholder',
      },
      global: { stubs: adapterStubs },
    })

    expect(wrapper.findComponent(SearchInputFieldStub).props()).toMatchObject({
      modelValue: '',
      disabled: true,
      placeholder: '请输入关键词',
      ariaLabel: '用户关键词',
    })
  })

  it('forwards built-in field events', () => {
    const wrapper = mount(SearchFieldRenderer, {
      props: {
        modelValue: '',
        field: { key: 'keyword', type: 'input', label: '关键词' },
        disabled: false,
        labelMode: 'label',
      },
      global: { stubs: adapterStubs },
    })
    const input = wrapper.findComponent(SearchInputFieldStub)

    input.vm.$emit('update:modelValue', 'alice')
    input.vm.$emit('change', 'alice')
    input.vm.$emit('search')

    expect(wrapper.emitted('update:modelValue')).toEqual([['alice']])
    expect(wrapper.emitted('change')).toEqual([['alice']])
    expect(wrapper.emitted('search')).toHaveLength(1)
  })

  it.each([
    [
      { key: 'status', type: 'select', label: '状态', options: [] },
      SearchSelectFieldStub,
      'enabled',
    ],
    [
      { key: 'createdAt', type: 'date', label: '创建日期' },
      SearchDateFieldStub,
      '2026-08-18',
    ],
  ] as Array<[GaSearchField, typeof SearchSelectFieldStub, unknown]>)(
    'forwards select and date field events',
    (field, adapter, value) => {
      const wrapper = mount(SearchFieldRenderer, {
        props: {
          field,
          disabled: false,
          labelMode: 'label',
        },
        global: { stubs: adapterStubs },
      })
      const component = wrapper.findComponent(adapter)

      component.vm.$emit('update:modelValue', value)
      component.vm.$emit('change', value)

      expect(wrapper.emitted('update:modelValue')).toEqual([[value]])
      expect(wrapper.emitted('change')).toEqual([[value]])
    },
  )

  it('warns once for each missing custom slot state', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    const wrapper = mount(SearchFieldRenderer, {
      props: {
        field: { key: 'departmentId', type: 'custom', label: '部门' },
        disabled: false,
        labelMode: 'label',
      },
      global: { stubs: adapterStubs },
    })

    await wrapper.setProps({
      field: { key: 'departmentId', type: 'custom', label: '部门' },
    })
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenLastCalledWith(
      '[GaSearchBar] Missing slot "field-departmentId" for custom field.',
    )

    await wrapper.setProps({
      field: { key: 'roleId', type: 'custom', label: '角色' },
    })
    expect(warn).toHaveBeenCalledTimes(2)
    expect(warn).toHaveBeenLastCalledWith(
      '[GaSearchBar] Missing slot "field-roleId" for custom field.',
    )

    await wrapper.setProps({
      field: { key: 'keyword', type: 'input', label: '关键词' },
    })
    await wrapper.setProps({
      field: { key: 'roleId', type: 'custom', label: '角色' },
    })
    expect(warn).toHaveBeenCalledTimes(3)
  })
})

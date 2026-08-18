import { mount } from '@vue/test-utils'
import { defineComponent, h, inject, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import GaSearchBar from '../index.vue'

const clearValidateSpy = vi.fn()

const ElFormStub = defineComponent({
  name: 'ElForm',
  inheritAttrs: false,
  props: {
    model: Object,
    rules: Object,
    labelWidth: [String, Number],
    disabled: Boolean,
  },
  setup(_, { attrs, slots, expose }) {
    const validationFailure = inject<unknown>(
      'formValidationFailure',
      undefined,
    )
    expose({
      validate: () =>
        validationFailure
          ? Promise.reject(validationFailure)
          : Promise.resolve(true),
      clearValidate: clearValidateSpy,
    })
    return () =>
      h('form', { ...attrs, class: 'el-form-stub' }, slots.default?.())
  },
})

const ElFormItemStub = defineComponent({
  name: 'ElFormItem',
  props: {
    prop: String,
    label: String,
    labelWidth: [String, Number],
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'el-form-item-stub' }, [
        props.label ? h('label', props.label) : null,
        slots.default?.(),
      ])
  },
})

const ElRowStub = defineComponent({
  name: 'ElRow',
  props: { gutter: Number },
  setup(_, { slots }) {
    return () => h('div', { class: 'el-row-stub' }, slots.default?.())
  },
})

const ElColStub = defineComponent({
  name: 'ElCol',
  props: {
    span: Number,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object],
  },
  setup(_, { attrs, slots }) {
    return () =>
      h('div', { ...attrs, class: 'el-col-stub' }, slots.default?.())
  },
})

const ElButtonStub = defineComponent({
  name: 'ElButton',
  inheritAttrs: false,
  props: {
    type: String,
    nativeType: String,
    loading: Boolean,
    disabled: Boolean,
    link: Boolean,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          class: 'el-button-stub',
          type: props.nativeType ?? 'button',
          disabled: props.disabled,
        },
        slots.default?.(),
      )
  },
})

const SearchFieldRendererStub = defineComponent({
  name: 'SearchFieldRenderer',
  props: {
    modelValue: null,
    field: { type: Object, required: true },
    disabled: Boolean,
    labelMode: String,
  },
  emits: ['update:modelValue', 'change', 'search'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'div',
        {
          class: 'search-field-renderer-stub',
          'data-key': (props.field as { key: string }).key,
        },
        slots.default?.({
          field: props.field,
          value: props.modelValue,
          disabled: props.disabled,
          update: (value: unknown) => {
            emit('update:modelValue', value)
            emit('change', value)
          },
        }),
      )
  },
})

const searchBarStubs = {
  ElForm: ElFormStub,
  ElFormItem: ElFormItemStub,
  ElRow: ElRowStub,
  ElCol: ElColStub,
  ElButton: ElButtonStub,
  SearchFieldRenderer: SearchFieldRendererStub,
}

function mountSearchBar(options: NonNullable<Parameters<typeof mount>[1]>) {
  return mount(GaSearchBar, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ...searchBarStubs,
        ...options.global?.stubs,
      },
    },
  })
}

beforeEach(() => {
  clearValidateSpy.mockClear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GaSearchBar layout', () => {
  it('renders only collapsed visible fields and excludes hidden fields', () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: '', status: '', hiddenValue: 'keep' },
        fields: [
          { key: 'keyword', type: 'input', label: '关键词' },
          { key: 'status', type: 'select', label: '状态', options: [] },
          { key: 'createdAt', type: 'date', label: '日期' },
          {
            key: 'hiddenValue',
            type: 'input',
            label: '隐藏',
            hidden: true,
          },
        ],
        collapsed: true,
        collapsedCount: 2,
      },
    })

    expect(wrapper.findAll('.search-field-renderer-stub')).toHaveLength(2)
    expect(wrapper.text()).not.toContain('隐藏')
  })

  it('uses per-field label modes and responsive columns', () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        labelMode: 'placeholder',
        labelWidth: 96,
        fields: [
          {
            key: 'keyword',
            type: 'input',
            label: '关键词',
            labelMode: 'label',
            span: 6,
            xs: 24,
            sm: 12,
            md: 8,
            lg: 6,
          },
          { key: 'status', type: 'select', label: '状态', options: [] },
        ],
      },
    })

    const items = wrapper.findAllComponents({ name: 'ElFormItem' })
    expect(items[0].props()).toMatchObject({
      label: '关键词',
      labelWidth: 96,
    })
    expect(items[1].props()).toMatchObject({ labelWidth: 0 })

    const columns = wrapper.findAllComponents({ name: 'ElCol' })
    expect(columns[0].props()).toMatchObject({
      span: 6,
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 6,
    })
    expect(columns[1].props()).toMatchObject({
      span: 6,
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 6,
    })
  })

  it('emits immutable model and change payloads', async () => {
    const model = { keyword: '', traceId: 'trace-1' }
    const wrapper = mountSearchBar({
      props: {
        modelValue: model,
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
      },
    })
    const field = wrapper.findComponent({ name: 'SearchFieldRenderer' })

    field.vm.$emit('update:modelValue', 'alice')
    field.vm.$emit('change', 'alice')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual({
      keyword: 'alice',
      traceId: 'trace-1',
    })
    expect(wrapper.emitted('update:modelValue')?.[0][0]).not.toBe(model)
    expect(wrapper.emitted('change')?.[0][0]).toMatchObject({
      key: 'keyword',
      value: 'alice',
      model: { keyword: 'alice', traceId: 'trace-1' },
    })
    expect(wrapper.emitted('change')?.[0][0].model).not.toBe(model)
  })

  it('syncs external model updates into the draft model', async () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: 'alice' },
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
      },
    })

    await wrapper.setProps({ modelValue: { keyword: 'bob' } })

    expect(
      wrapper.findComponent(SearchFieldRendererStub).props('modelValue'),
    ).toBe('bob')
  })

  it('renders structural, field override, and actions slots', () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: '' },
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
      },
      slots: {
        prepend: '<div class="prepend-slot">前置</div>',
        append: '<div class="append-slot">后置</div>',
        'field-keyword': '<div class="keyword-slot">自定义关键词</div>',
        actions: '<div class="actions-slot">自定义操作</div>',
      },
    })

    expect(wrapper.find('.prepend-slot').exists()).toBe(true)
    expect(wrapper.find('.append-slot').exists()).toBe(true)
    expect(wrapper.find('.keyword-slot').exists()).toBe(true)
    expect(wrapper.find('.actions-slot').exists()).toBe(true)
  })

  it('hides the actions column when no actions are available', () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        fields: [],
        showSearch: false,
        showReset: false,
        showCollapse: false,
      },
    })

    expect(wrapper.find('.ga-search-bar__actions-col').exists()).toBe(false)
  })

  it('updates the actions column when a dynamic slot appears', async () => {
    const showActions = ref(false)
    const Parent = defineComponent({
      setup() {
        return () =>
          h(
            GaSearchBar,
            {
              modelValue: {},
              fields: [],
              showSearch: false,
              showReset: false,
              showCollapse: false,
            },
            showActions.value
              ? {
                  actions: () =>
                    h('div', { class: 'dynamic-actions-slot' }, '操作'),
                }
              : {},
          )
      },
    })
    const wrapper = mount(Parent, {
      global: { stubs: searchBarStubs },
    })

    expect(wrapper.find('.ga-search-bar__actions-col').exists()).toBe(false)

    showActions.value = true
    await nextTick()

    expect(wrapper.find('.ga-search-bar__actions-col').exists()).toBe(true)
    expect(wrapper.find('.dynamic-actions-slot').exists()).toBe(true)
  })

  it('toggles collapsed state and emits its model update', async () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        collapsed: true,
        collapsedCount: 1,
        fields: [
          { key: 'keyword', type: 'input', label: '关键词' },
          { key: 'status', type: 'select', label: '状态', options: [] },
        ],
      },
    })

    await wrapper.get('[data-action="toggle"]').trigger('click')

    expect(wrapper.emitted('update:collapsed')).toEqual([[false]])
    expect(wrapper.findAll('.search-field-renderer-stub')).toHaveLength(2)
  })

  it('syncs external collapsed state updates', async () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        collapsed: true,
        collapsedCount: 1,
        fields: [
          { key: 'keyword', type: 'input', label: '关键词' },
          { key: 'status', type: 'select', label: '状态', options: [] },
        ],
      },
    })

    await wrapper.setProps({ collapsed: false })

    expect(wrapper.findAll('.search-field-renderer-stub')).toHaveLength(2)
  })

  it('uses the parent collapsed value when v-model is controlled', async () => {
    const collapsed = ref(true)
    const updateCollapsed = vi.fn()
    const Parent = defineComponent({
      setup() {
        return () =>
          h(GaSearchBar, {
            modelValue: {},
            collapsed: collapsed.value,
            collapsedCount: 1,
            fields: [
              { key: 'keyword', type: 'input', label: '关键词' },
              {
                key: 'status',
                type: 'select',
                label: '状态',
                options: [],
              },
            ],
            'onUpdate:collapsed': updateCollapsed,
          })
      },
    })
    const wrapper = mount(Parent, {
      global: { stubs: searchBarStubs },
    })

    await wrapper.get('[data-action="toggle"]').trigger('click')

    expect(updateCollapsed).toHaveBeenCalledWith(false)
    expect(wrapper.findAll('.search-field-renderer-stub')).toHaveLength(1)

    collapsed.value = false
    await nextTick()
    expect(wrapper.findAll('.search-field-renderer-stub')).toHaveLength(2)
  })

  it('warns once per duplicate field key state', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const duplicateFields = [
      { key: 'keyword', type: 'input' as const, label: '关键词' },
      { key: 'keyword', type: 'input' as const, label: '重复关键词' },
    ]
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        fields: duplicateFields,
      },
    })

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenLastCalledWith(
      '[GaSearchBar] Duplicate field key "keyword".',
    )

    await wrapper.setProps({ fields: [...duplicateFields] })
    expect(warn).toHaveBeenCalledTimes(1)

    await wrapper.setProps({
      fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
    })
    await wrapper.setProps({ fields: duplicateFields })
    expect(warn).toHaveBeenCalledTimes(2)
  })
})

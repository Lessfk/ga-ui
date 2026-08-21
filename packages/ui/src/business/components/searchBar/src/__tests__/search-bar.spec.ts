import { mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { defineComponent, h, inject, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import GaSearchBar from '../index.vue'
import type { GaSearchBarExpose } from '../props'

const clearValidateSpy = vi.fn()
const searchBarStyles = readFileSync(
  'src/business/components/searchBar/style/index.scss',
  'utf8',
)

const ElFormStub = defineComponent({
  name: 'ElForm',
  inheritAttrs: false,
  props: {
    model: Object,
    rules: Object,
    labelWidth: [String, Number],
    labelPosition: String,
    size: String,
    disabled: Boolean,
  },
  setup(_, { attrs, slots, expose }) {
    const validationFailure = inject<unknown>(
      'formValidationFailure',
      undefined,
    )
    const formValidation = inject<(() => Promise<boolean>) | undefined>(
      'formValidation',
      undefined,
    )
    expose({
      validate: () =>
        formValidation
          ? formValidation()
          : validationFailure
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
  },
  emits: ['update:modelValue', 'change'],
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
  it('pushes the actions column to the right edge of its flex row', () => {
    expect(searchBarStyles).toMatch(
      /&__actions-col\s*{[\s\S]*?margin-left:\s*auto/,
    )
  })

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

  it('默认折叠按钮隐藏时，自定义 actions 仍能控制字段折叠', async () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        fields: [
          { key: 'keyword', type: 'input', label: '关键词' },
          { key: 'status', type: 'select', label: '状态', options: [] },
        ],
        collapsed: true,
        collapsedCount: 1,
        actionsShowSearch: false,
        actionsShowReset: false,
        actionsShowCollapse: false,
      },
      slots: {
        actions: ({ toggle }: { toggle: () => void }) =>
          h(
            'button',
            { class: 'custom-collapse-toggle', type: 'button', onClick: toggle },
            '展开',
          ),
      },
    })

    expect(wrapper.findAll('.search-field-renderer-stub')).toHaveLength(1)
    expect(wrapper.find('[data-action="toggle"]').exists()).toBe(false)

    await wrapper.get('.custom-collapse-toggle').trigger('click')

    expect(wrapper.emitted('update:collapsed')).toEqual([[false]])
    expect(wrapper.findAll('.search-field-renderer-stub')).toHaveLength(2)
  })

  it('uses per-field label modes without adding responsive defaults', () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        labelMode: 'none',
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
    })
    expect(columns[0].props('xl')).toBeUndefined()
    expect(columns[1].props('span')).toBe(6)
    for (const breakpoint of ['xs', 'sm', 'md', 'lg', 'xl']) {
      expect(columns[1].props(breakpoint)).toBeUndefined()
    }
  })

  it('passes label position and lets fields override the label width', () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        labelPosition: 'top',
        labelWidth: 96,
        fields: [
          {
            key: 'keyword',
            type: 'input',
            label: '很长的关键词标签',
            labelWidth: 160,
          },
          {
            key: 'status',
            type: 'select',
            label: '状态',
            options: [],
          },
        ],
      },
    })

    expect(wrapper.findComponent(ElFormStub).props()).toMatchObject({
      labelPosition: 'top',
      labelWidth: 96,
    })

    const items = wrapper.findAllComponents(ElFormItemStub)
    expect(items[0].props('labelWidth')).toBe(160)
    expect(items[1].props('labelWidth')).toBe(96)
  })

  it('passes the default and configured size to ElForm', async () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        fields: [],
      },
    })
    const runtimeProps = (
      GaSearchBar as unknown as { props?: Record<string, unknown> }
    ).props ?? {}

    expect(runtimeProps).toHaveProperty('size')
    expect(wrapper.findComponent(ElFormStub).props('size')).toBe('default')

    await wrapper.setProps({ size: 'small' })

    expect(wrapper.findComponent(ElFormStub).props('size')).toBe('small')
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

  it('separates field disabled state from default action controls', () => {
    const actionsDisabled = mountSearchBar({
      props: {
        modelValue: {},
        fields: [
          { key: 'keyword', type: 'input', label: '关键词' },
          { key: 'status', type: 'select', label: '状态', options: [] },
        ],
        collapsedCount: 1,
        actionsDisabled: true,
      },
    })

    expect(actionsDisabled.findComponent(ElFormStub).props('disabled')).toBe(false)
    expect(
      actionsDisabled.findComponent(SearchFieldRendererStub).props('disabled'),
    ).toBe(false)
    for (const action of ['search', 'reset', 'toggle']) {
      expect(
        actionsDisabled.get(`[data-action="${action}"]`).attributes(),
      ).toHaveProperty('disabled')
    }

    const fieldsDisabled = mountSearchBar({
      props: {
        modelValue: {},
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
        disabled: true,
      },
    })

    expect(fieldsDisabled.findComponent(ElFormStub).props('disabled')).toBe(false)
    expect(
      fieldsDisabled.findComponent(SearchFieldRendererStub).props('disabled'),
    ).toBe(true)
    expect(
      fieldsDisabled.get('[data-action="search"]').attributes(),
    ).not.toHaveProperty('disabled')
    expect(
      fieldsDisabled.get('[data-action="reset"]').attributes(),
    ).not.toHaveProperty('disabled')
  })

  it('uses action-prefixed props and slot scope names only', () => {
    let actionsScope: Record<string, unknown> = {}
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        fields: [],
        actionsLoading: true,
        actionsDisabled: true,
        actionsShowSearch: false,
        actionsShowReset: false,
        actionsShowCollapse: false,
      },
      slots: {
        actions: (scope) => {
          actionsScope = scope
          return h('div', { class: 'actions-scope' })
        },
      },
    })
    const runtimeProps = (
      GaSearchBar as unknown as { props?: Record<string, unknown> }
    ).props ?? {}

    for (const propName of [
      'actionsLoading',
      'actionsDisabled',
      'actionsShowSearch',
      'actionsShowReset',
      'actionsShowCollapse',
    ]) {
      expect(runtimeProps).toHaveProperty(propName)
    }
    for (const legacyPropName of [
      'loading',
      'showSearch',
      'showReset',
      'showCollapse',
    ]) {
      expect(runtimeProps).not.toHaveProperty(legacyPropName)
    }
    expect(actionsScope).toMatchObject({
      actionsLoading: true,
      actionsDisabled: true,
    })
    expect(actionsScope).not.toHaveProperty('loading')
    expect(actionsScope).not.toHaveProperty('disabled')
    expect(wrapper.find('.actions-scope').exists()).toBe(true)
  })

  it('supports granular slots for every default action', () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        fields: [
          { key: 'keyword', type: 'input', label: '关键词' },
          { key: 'status', type: 'select', label: '状态', options: [] },
        ],
        collapsed: true,
        collapsedCount: 1,
      },
      slots: {
        'actions-prepend': () => h('span', { class: 'actions-prepend' }),
        'action-search': () => h('button', { class: 'custom-search' }),
        'action-reset': () => h('button', { class: 'custom-reset' }),
        'action-collapse': () => h('button', { class: 'custom-collapse' }),
        'actions-append': () => h('span', { class: 'actions-append' }),
      },
    })

    expect(wrapper.find('.actions-prepend').exists()).toBe(true)
    expect(wrapper.find('.custom-search').exists()).toBe(true)
    expect(wrapper.find('.custom-reset').exists()).toBe(true)
    expect(wrapper.find('.custom-collapse').exists()).toBe(true)
    expect(wrapper.find('.actions-append').exists()).toBe(true)
    expect(wrapper.find('[data-action="search"]').exists()).toBe(false)
    expect(wrapper.find('[data-action="reset"]').exists()).toBe(false)
    expect(wrapper.find('[data-action="toggle"]').exists()).toBe(false)
  })

  it('replaces one action while retaining defaults and appending content', async () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: 'alice' },
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
      },
      slots: {
        'action-search': ({ search }) =>
          h(
            'button',
            { class: 'custom-search', type: 'button', onClick: search },
            '自定义查询',
          ),
        'actions-append': () =>
          h('button', { class: 'export-action', type: 'button' }, '导出'),
      },
    })

    expect(wrapper.find('[data-action="search"]').exists()).toBe(false)
    expect(wrapper.find('[data-action="reset"]').exists()).toBe(true)
    expect(wrapper.find('.export-action').exists()).toBe(true)

    await wrapper.get('.custom-search').trigger('click')

    expect(wrapper.emitted('search')).toEqual([[{ keyword: 'alice' }]])
  })

  it('shows the actions column for an additive slot without defaults', () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        fields: [],
        actionsShowSearch: false,
        actionsShowReset: false,
        actionsShowCollapse: false,
      },
      slots: {
        'actions-append': () =>
          h('button', { class: 'append-only-action' }, '导出'),
      },
    })

    expect(wrapper.find('.ga-search-bar__actions-col').exists()).toBe(true)
    expect(wrapper.find('.append-only-action').exists()).toBe(true)
  })

  it('hides the actions column when no actions are available', () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: {},
        fields: [],
        actionsShowSearch: false,
        actionsShowReset: false,
        actionsShowCollapse: false,
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
              actionsShowSearch: false,
              actionsShowReset: false,
              actionsShowCollapse: false,
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

describe('GaSearchBar actions', () => {
  it('validates before search and emits a cloned draft model', async () => {
    const model = { keyword: 'alice' }
    const wrapper = mountSearchBar({
      props: {
        modelValue: model,
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
        validateOnSearch: true,
      },
    })

    const searched = await (
      wrapper.vm as unknown as GaSearchBarExpose
    ).search()

    expect(searched).toBe(true)
    expect(wrapper.emitted('search')).toEqual([[{ keyword: 'alice' }]])
    expect(wrapper.emitted('search')?.[0][0]).not.toBe(model)
  })

  it('searches the latest same-tick field update', async () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: '' },
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
      },
    })
    const field = wrapper.findComponent(SearchFieldRendererStub)

    field.vm.$emit('update:modelValue', 'alice')
    const searched = await (
      wrapper.vm as unknown as GaSearchBarExpose
    ).search()

    expect(searched).toBe(true)
    expect(wrapper.emitted('search')).toEqual([[{ keyword: 'alice' }]])
  })

  it('clears internal searching state after a completed search', async () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: 'alice' },
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
      },
    })
    const exposed = wrapper.vm as unknown as GaSearchBarExpose

    const firstSearch = await exposed.search()
    const secondSearch = await exposed.search()
    await nextTick()

    expect(firstSearch).toBe(true)
    expect(secondSearch).toBe(true)
    expect(wrapper.emitted('search')).toEqual([
      [{ keyword: 'alice' }],
      [{ keyword: 'alice' }],
    ])
    expect(wrapper.findAllComponents(ElButtonStub)[0].props('loading')).toBe(
      false,
    )
  })

  it('emits invalid and blocks search after failed validation', async () => {
    const invalidFields = { keyword: [{ message: '必填' }] }
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: '' },
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
        validateOnSearch: true,
      },
      global: {
        provide: { formValidationFailure: invalidFields },
      },
    })

    const searched = await (
      wrapper.vm as unknown as GaSearchBarExpose
    ).search()

    expect(searched).toBe(false)
    expect(wrapper.emitted('search')).toBeUndefined()
    expect(wrapper.emitted('invalid')).toEqual([[invalidFields]])
  })

  it('rethrows validator errors instead of reporting invalid fields', async () => {
    const validatorError = new Error('validator failed')
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: '' },
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
        validateOnSearch: true,
      },
      global: {
        provide: { formValidationFailure: validatorError },
      },
    })
    const exposed = wrapper.vm as unknown as GaSearchBarExpose

    await expect(exposed.validate()).rejects.toBe(validatorError)
    await expect(exposed.search()).rejects.toBe(validatorError)
    expect(wrapper.emitted('invalid')).toBeUndefined()
    expect(wrapper.emitted('search')).toBeUndefined()
  })

  it('blocks concurrent searches while asynchronous validation is pending', async () => {
    let resolveValidation!: (valid: boolean) => void
    const validationPromise = new Promise<boolean>((resolve) => {
      resolveValidation = resolve
    })
    const formValidation = vi.fn(() => validationPromise)
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: 'alice' },
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
        validateOnSearch: true,
      },
      global: {
        provide: { formValidation },
      },
    })
    const exposed = wrapper.vm as unknown as GaSearchBarExpose

    const firstSearch = exposed.search()
    const secondSearch = exposed.search()
    const validationCalls = formValidation.mock.calls.length
    resolveValidation(true)
    const results = await Promise.all([firstSearch, secondSearch])

    expect(validationCalls).toBe(1)
    expect(results).toEqual([true, false])
    expect(wrapper.emitted('search')).toEqual([[{ keyword: 'alice' }]])
  })

  it('emits the model snapshot that began asynchronous validation', async () => {
    let resolveValidation!: (valid: boolean) => void
    const validationPromise = new Promise<boolean>((resolve) => {
      resolveValidation = resolve
    })
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: 'alice' },
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
        validateOnSearch: true,
      },
      global: {
        provide: {
          formValidation: () => validationPromise,
        },
      },
    })
    const exposed = wrapper.vm as unknown as GaSearchBarExpose

    const searching = exposed.search()
    wrapper
      .findComponent(SearchFieldRendererStub)
      .vm.$emit('update:modelValue', 'bob')
    resolveValidation(true)

    expect(await searching).toBe(true)
    expect(wrapper.emitted('search')).toEqual([[{ keyword: 'alice' }]])
  })

  it('blocks searches for action state but not disabled fields', async () => {
    const loading = mountSearchBar({
      props: {
        modelValue: {},
        fields: [],
        actionsLoading: true,
      },
    })
    const actionsDisabled = mountSearchBar({
      props: {
        modelValue: {},
        fields: [],
        actionsDisabled: true,
      },
    })
    const fieldsDisabled = mountSearchBar({
      props: {
        modelValue: {},
        fields: [],
        disabled: true,
      },
    })

    expect(
      await (loading.vm as unknown as GaSearchBarExpose).search(),
    ).toBe(false)
    expect(
      await (actionsDisabled.vm as unknown as GaSearchBarExpose).search(),
    ).toBe(false)
    expect(
      await (fieldsDisabled.vm as unknown as GaSearchBarExpose).search(),
    ).toBe(true)
    expect(loading.emitted('search')).toBeUndefined()
    expect(actionsDisabled.emitted('search')).toBeUndefined()
    expect(fieldsDisabled.emitted('search')).toEqual([[{}]])
  })

  it('resets defaults and initial fields while preserving current unknown keys', async () => {
    const initialModel = {
      keyword: 'initial',
      status: 'disabled',
      page: 2,
    }
    const wrapper = mountSearchBar({
      props: {
        modelValue: initialModel,
        fields: [
          { key: 'keyword', type: 'input', label: '关键词' },
          {
            key: 'status',
            type: 'select',
            label: '状态',
            defaultValue: 'enabled',
            options: [],
          },
        ],
      },
    })

    await wrapper.setProps({
      modelValue: {
        keyword: 'changed',
        status: 'pending',
        page: 8,
      },
    })
    ;(wrapper.vm as unknown as GaSearchBarExpose).reset()

    const resetModel = {
      keyword: 'initial',
      status: 'enabled',
      page: 8,
    }
    const updates = wrapper.emitted('update:modelValue') ?? []
    expect(updates[updates.length - 1]?.[0]).toEqual(resetModel)
    expect(wrapper.emitted('reset')).toEqual([[resetModel]])
    expect(wrapper.emitted('reset')?.[0][0]).not.toBe(initialModel)
    expect(clearValidateSpy).toHaveBeenCalledTimes(1)
  })

  it('captures the first value of fields added after mount', async () => {
    const keywordField = {
      key: 'keyword',
      type: 'input' as const,
      label: '关键词',
    }
    const statusField = {
      key: 'status',
      type: 'select' as const,
      label: '状态',
      options: [],
    }
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: 'initial' },
        fields: [keywordField],
      },
    })

    await wrapper.setProps({
      modelValue: { keyword: 'changed', status: 'enabled' },
      fields: [keywordField, statusField],
    })
    await wrapper.setProps({
      modelValue: { keyword: 'changed-again', status: 'disabled' },
    })
    ;(wrapper.vm as unknown as GaSearchBarExpose).reset()

    expect(wrapper.emitted('reset')).toEqual([
      [{ keyword: 'initial', status: 'enabled' }],
    ])
  })

  it('routes default form submit and reset button through component actions', async () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: 'initial' },
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
      },
    })
    wrapper
      .findComponent(SearchFieldRendererStub)
      .vm.$emit('update:modelValue', 'changed')

    expect(wrapper.get('[data-action="search"]').attributes('type')).toBe(
      'submit',
    )
    await wrapper.get('.el-form-stub').trigger('submit')
    await wrapper.get('[data-action="reset"]').trigger('click')

    expect(wrapper.emitted('search')).toEqual([[{ keyword: 'changed' }]])
    expect(wrapper.emitted('reset')).toEqual([[{ keyword: 'initial' }]])
  })

  it('exposes form methods', async () => {
    const wrapper = mountSearchBar({
      props: {
        modelValue: { keyword: '' },
        fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
      },
    })
    const exposed = wrapper.vm as unknown as GaSearchBarExpose

    expect(exposed.formRef).toBeDefined()
    expect(await exposed.validate()).toBe(true)
    exposed.clearValidate()
    exposed.toggle()
    await wrapper.vm.$nextTick()

    expect(clearValidateSpy).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('update:collapsed')).toHaveLength(1)
  })
})

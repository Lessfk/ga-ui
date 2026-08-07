import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import GaDialog from '../index.vue'

const titleId = 'el-dialog-title'
const titleClass = 'el-dialog__title'
const handleClose = () => undefined
const resetPosition = () => undefined

const ElDialogStub = defineComponent({
  name: 'ElDialog',
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    title: String,
    width: [String, Number],
    top: String,
    fullscreen: Boolean,
    appendToBody: Boolean,
    destroyOnClose: Boolean,
    center: Boolean,
    alignCenter: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    showClose: Boolean,
    closeOnClickModal: Boolean,
    closeOnPressEscape: Boolean,
    beforeClose: Function,
    modal: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'update:modelValue',
    'open',
    'opened',
    'close',
    'closed',
    'openAutoFocus',
    'closeAutoFocus',
    'custom-event',
  ],
  setup(props, { attrs, expose, slots }) {
    expose({
      handleClose,
      resetPosition,
    })

    return () =>
      h(
        'section',
        {
          ...attrs,
          class: ['el-dialog-stub', attrs.class],
        },
        [
          slots.header?.({
            close: handleClose,
            titleId,
            titleClass,
          }) ?? h('div', { class: 'native-title' }, props.title),
          slots.default?.(),
          slots.footer
            ? h('footer', { class: 'el-dialog__footer' }, slots.footer())
            : undefined,
        ],
      )
  },
})

function mountDialog(options: Parameters<typeof mount>[1] = {}) {
  return mount(GaDialog, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ElDialog: ElDialogStub,
        ...options.global?.stubs,
      },
    },
  })
}

describe('GaDialog', () => {
  it('passes the Element Plus-compatible defaults to ElDialog', () => {
    const wrapper = mountDialog()

    expect(wrapper.findComponent(ElDialogStub).props()).toMatchObject({
      modelValue: false,
      title: '',
      fullscreen: false,
      appendToBody: false,
      destroyOnClose: false,
      center: false,
      alignCenter: false,
      draggable: false,
      showClose: true,
      closeOnClickModal: true,
      closeOnPressEscape: true,
    })
  })

  it('lets consumers override every selected dialog prop', () => {
    const beforeClose = (done: () => void) => done()
    const wrapper = mountDialog({
      props: {
        modelValue: true,
        title: 'Edit profile',
        width: 640,
        top: '8vh',
        fullscreen: true,
        appendToBody: true,
        destroyOnClose: true,
        center: true,
        alignCenter: true,
        draggable: true,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose,
      },
    })

    const dialogProps = wrapper.findComponent(ElDialogStub).props()

    expect(dialogProps).toMatchObject({
      modelValue: true,
      title: 'Edit profile',
      width: 640,
      top: '8vh',
      fullscreen: true,
      appendToBody: true,
      destroyOnClose: true,
      center: true,
      alignCenter: true,
      draggable: true,
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
    })
    expect(dialogProps.beforeClose).toBe(beforeClose)
  })

  it('forwards low-frequency props, attributes, and listeners through $attrs', () => {
    const receivedPayloads: unknown[] = []
    const payload = { source: 'consumer' }
    const wrapper = mountDialog({
      attrs: {
        modal: false,
        'data-dialog': 'account-settings',
        onCustomEvent: (value: unknown) => receivedPayloads.push(value),
      },
    })
    const dialog = wrapper.findComponent(ElDialogStub)

    dialog.vm.$emit('custom-event', payload)

    expect(dialog.props('modal')).toBe(false)
    expect(dialog.attributes('data-dialog')).toBe('account-settings')
    expect(receivedPayloads).toEqual([payload])
    expect(receivedPayloads[0]).toBe(payload)
  })

  it('forwards the controlled model and lifecycle events', () => {
    const wrapper = mountDialog()
    const dialog = wrapper.findComponent(ElDialogStub)

    dialog.vm.$emit('update:modelValue', true)
    dialog.vm.$emit('open')
    dialog.vm.$emit('opened')
    dialog.vm.$emit('close')
    dialog.vm.$emit('closed')
    dialog.vm.$emit('openAutoFocus')
    dialog.vm.$emit('closeAutoFocus')

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('open')).toEqual([[]])
    expect(wrapper.emitted('opened')).toEqual([[]])
    expect(wrapper.emitted('close')).toEqual([[]])
    expect(wrapper.emitted('closed')).toEqual([[]])
    expect(wrapper.emitted('open-auto-focus')).toEqual([[]])
    expect(wrapper.emitted('close-auto-focus')).toEqual([[]])
  })

  it('renders the default, scoped header, and footer slots unchanged', () => {
    const receivedScopes: Array<Record<string, unknown>> = []
    const wrapper = mountDialog({
      slots: {
        default: () => h('p', { class: 'dialog-content' }, 'Profile fields'),
        header: (scope) => {
          receivedScopes.push(scope)
          return h('h2', { class: 'custom-header' }, scope.titleId as string)
        },
        footer: () => h('span', { class: 'custom-footer' }, 'Footer content'),
      },
    })

    expect(wrapper.find('.dialog-content').text()).toBe('Profile fields')
    expect(wrapper.find('.custom-header').text()).toBe(titleId)
    expect(wrapper.find('.custom-footer').text()).toBe('Footer content')
    expect(receivedScopes[0]).toEqual({
      close: handleClose,
      titleId,
      titleClass,
    })
  })

  it('preserves the native title fallback and adds no footer or buttons by default', () => {
    const wrapper = mountDialog({
      props: {
        title: 'Native dialog title',
      },
      slots: {
        default: () => h('p', { class: 'dialog-content' }, 'Dialog body'),
      },
    })

    expect(wrapper.find('.native-title').text()).toBe('Native dialog title')
    expect(wrapper.find('.dialog-content').text()).toBe('Dialog body')
    expect(wrapper.find('.el-dialog__footer').exists()).toBe(false)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('exposes the underlying ElDialog instance', () => {
    const wrapper = mountDialog()

    expect(wrapper.vm.dialogRef).toBeDefined()
    expect(wrapper.vm.dialogRef.handleClose).toBeTypeOf('function')
    expect(wrapper.vm.dialogRef.resetPosition).toBeTypeOf('function')
  })
})

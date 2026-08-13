import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
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
      default: undefined,
    },
    draggable: {
      type: Boolean,
      default: undefined,
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
  it('passes its defaults to ElDialog and disables the native close button', () => {
    const wrapper = mountDialog()

    expect(wrapper.findComponent(ElDialogStub).props()).toMatchObject({
      modelValue: false,
      title: '',
      width: undefined,
      top: undefined,
      fullscreen: false,
      appendToBody: true,
      destroyOnClose: true,
      center: false,
      alignCenter: true,
      draggable: true,
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      beforeClose: undefined,
    })

    expect(wrapper.find('.ga-dialog__header').exists()).toBe(true)
    expect(wrapper.find('.ga-dialog__fullscreenbtn').exists()).toBe(true)
    expect(wrapper.find('.ga-dialog__closebtn').exists()).toBe(true)
  })

  it('forwards selected props while keeping the native close button disabled', () => {
    const beforeClose = (done: () => void) => done()
    const wrapper = mountDialog({
      props: {
        modelValue: true,
        title: 'Edit profile',
        width: 640,
        top: '8vh',
        fullscreen: true,
        appendToBody: false,
        destroyOnClose: false,
        center: true,
        alignCenter: false,
        draggable: false,
        showClose: false,
        closeOnClickModal: true,
        closeOnPressEscape: true,
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
      appendToBody: false,
      destroyOnClose: false,
      center: true,
      alignCenter: false,
      draggable: false,
      showClose: false,
      closeOnClickModal: true,
      closeOnPressEscape: true,
    })
    expect(dialogProps.beforeClose).toBe(beforeClose)
    expect(wrapper.find('.ga-dialog__closebtn').exists()).toBe(false)
  })

  it('forwards undeclared attributes and listeners to ElDialog', () => {
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
  })

  it('renders an accessible default header and optional footer', () => {
    const wrapper = mountDialog({
      props: {
        title: 'Account settings',
      },
      attrs: {
        'header-aria-level': 3,
      },
      slots: {
        default: () => h('p', { class: 'dialog-content' }, 'Profile fields'),
        footer: () => h('span', { class: 'custom-footer' }, 'Save changes'),
      },
    })

    const title = wrapper.get(`#${titleId}`)

    expect(title.text()).toBe('Account settings')
    expect(title.classes()).toContain(titleClass)
    expect(title.attributes('role')).toBe('heading')
    expect(title.attributes('aria-level')).toBe('3')
    expect(wrapper.get('.dialog-content').text()).toBe('Profile fields')
    expect(wrapper.get('.custom-footer').text()).toBe('Save changes')
    expect(wrapper.get('.ga-dialog__fullscreenbtn').attributes()).toMatchObject({
      type: 'button',
      title: '全屏',
      'aria-label': '全屏',
    })
    expect(wrapper.get('.ga-dialog__closebtn').attributes()).toMatchObject({
      type: 'button',
      title: '关闭',
      'aria-label': '关闭',
    })
  })

  it('replaces the complete default header when the header slot is provided', () => {
    const receivedScopes: Array<Record<string, unknown>> = []
    const wrapper = mountDialog({
      slots: {
        header: (scope) => {
          receivedScopes.push(scope)
          return h('h2', { class: 'custom-header' }, scope.titleId as string)
        },
      },
    })

    expect(wrapper.get('.custom-header').text()).toBe(titleId)
    expect(wrapper.find('.ga-dialog__header').exists()).toBe(false)
    expect(wrapper.find('.ga-dialog__fullscreenbtn').exists()).toBe(false)
    expect(wrapper.find('.ga-dialog__closebtn').exists()).toBe(false)
    expect(receivedScopes[0]).toEqual({
      close: handleClose,
      titleId,
      titleClass,
    })
  })

  it('lets showFullscreen and showClose control the custom header buttons', () => {
    const wrapper = mountDialog({
      props: {
        showFullscreen: false,
        showClose: false,
      },
    })

    expect(wrapper.find('.ga-dialog__fullscreenbtn').exists()).toBe(false)
    expect(wrapper.find('.ga-dialog__closebtn').exists()).toBe(false)
  })

  it('toggles fullscreen state and emits update:fullscreen', async () => {
    const wrapper = mountDialog()
    const button = wrapper.get('.ga-dialog__fullscreenbtn')

    expect(button.attributes('title')).toBe('全屏')

    await button.trigger('click')

    expect(wrapper.findComponent(ElDialogStub).props('fullscreen')).toBe(true)
    expect(wrapper.emitted('update:fullscreen')).toEqual([[true]])
    expect(button.attributes('title')).toBe('退出全屏')
    expect(button.attributes('aria-label')).toBe('退出全屏')

    await button.trigger('click')

    expect(wrapper.findComponent(ElDialogStub).props('fullscreen')).toBe(false)
    expect(wrapper.emitted('update:fullscreen')).toEqual([[true], [false]])
  })

  it('synchronizes external fullscreen changes', async () => {
    const wrapper = mountDialog({ props: { fullscreen: false } })

    await wrapper.setProps({ fullscreen: true })

    expect(wrapper.findComponent(ElDialogStub).props('fullscreen')).toBe(true)
    expect(wrapper.get('.ga-dialog__fullscreenbtn').attributes('title')).toBe(
      '退出全屏',
    )
  })

  it('the custom close button closes immediately without invoking beforeClose', async () => {
    let beforeCloseCalls = 0
    const beforeClose = () => {
      beforeCloseCalls += 1
    }
    const wrapper = mountDialog({
      props: {
        modelValue: true,
        beforeClose,
      },
    })

    await wrapper.get('.ga-dialog__fullscreenbtn').trigger('click')
    await wrapper.get('.ga-dialog__closebtn').trigger('click')

    expect(beforeCloseCalls).toBe(0)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('update:fullscreen')).toEqual([[true], [false]])
    expect(wrapper.emitted('closed')).toEqual([[]])
    expect(wrapper.findComponent(ElDialogStub).props('fullscreen')).toBe(false)
  })

  it('forwards ElDialog model and lifecycle events', async () => {
    const wrapper = mountDialog()
    const dialog = wrapper.findComponent(ElDialogStub)

    dialog.vm.$emit('update:modelValue', true)
    dialog.vm.$emit('open')
    dialog.vm.$emit('opened')
    dialog.vm.$emit('close')
    dialog.vm.$emit('openAutoFocus')
    dialog.vm.$emit('closeAutoFocus')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('open')).toEqual([[]])
    expect(wrapper.emitted('opened')).toEqual([[]])
    expect(wrapper.emitted('close')).toEqual([[]])
    expect(wrapper.emitted('open-auto-focus')).toEqual([[]])
    expect(wrapper.emitted('close-auto-focus')).toEqual([[]])
  })

  it('handles the ElDialog closed event with the same close finalization', async () => {
    const wrapper = mountDialog({ props: { fullscreen: false } })
    const dialog = wrapper.findComponent(ElDialogStub)

    await wrapper.get('.ga-dialog__fullscreenbtn').trigger('click')
    dialog.vm.$emit('closed')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('update:fullscreen')).toEqual([[true], [false]])
    expect(wrapper.emitted('closed')).toEqual([[]])
    expect(dialog.props('fullscreen')).toBe(false)
  })

  it('exposes the underlying ElDialog instance', () => {
    const wrapper = mountDialog()

    expect(wrapper.vm.dialogRef).toBeDefined()
    expect(wrapper.vm.dialogRef.handleClose).toBeTypeOf('function')
    expect(wrapper.vm.dialogRef.resetPosition).toBeTypeOf('function')
  })
})

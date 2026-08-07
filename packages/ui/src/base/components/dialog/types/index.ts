import type { DialogInstance, DialogProps } from 'element-plus'

export type GaDialogProps = Pick<
  DialogProps,
  | 'modelValue'
  | 'title'
  | 'width'
  | 'top'
  | 'fullscreen'
  | 'appendToBody'
  | 'destroyOnClose'
  | 'center'
  | 'alignCenter'
  | 'draggable'
  | 'showClose'
  | 'closeOnClickModal'
  | 'closeOnPressEscape'
  | 'beforeClose'
>

export interface GaDialogEmits {
  (event: 'update:modelValue', value: boolean): void
  (
    event:
      | 'open'
      | 'opened'
      | 'close'
      | 'closed'
      | 'open-auto-focus'
      | 'close-auto-focus',
  ): void
}

export interface GaDialogHeaderSlotProps {
  close: () => void
  titleId: string
  titleClass: string
}

export interface GaDialogExpose {
  dialogRef: DialogInstance | undefined
}

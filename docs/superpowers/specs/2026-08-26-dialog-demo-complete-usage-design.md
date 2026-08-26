# GaDialog Complete Playground Demo Design

## Goal

Replace the minimal DialogDemo with one PC-focused interactive example that
demonstrates GaDialog's complete public surface without changing GaDialog.

## Structure

The page contains four unframed areas:

1. A toolbar with the demo title, current dialog state, reset, and close
   commands.
2. A compact control surface for dialog props such as width, alignment,
   draggable behavior, close controls, fullscreen control, and close guards.
3. Scenario launch buttons for basic content, custom header, form content, and
   long scrollable content. All scenarios reuse one GaDialog instance.
4. A footer summary with current state and a lifecycle event log.

## Dialog Scenarios

- `basic`: default header, regular content, and standard footer actions.
- `custom`: scoped `header` slot using `close`, `titleId`, and `titleClass`.
- `form`: Element Plus form controls inside the default slot and save loading.
- `long`: enough content to demonstrate scrolling and fullscreen behavior.

## API Coverage

The demo exercises:

- `v-model` and `v-model:fullscreen`.
- `title`, `width`, `top`, `appendToBody`, `destroyOnClose`, `center`,
  `alignCenter`, `draggable`, `showClose`, `showFullscreen`,
  `closeOnClickModal`, `closeOnPressEscape`, and `beforeClose`.
- Default, `header`, and `footer` slots.
- `open`, `opened`, `close`, `closed`, `open-auto-focus`, and
  `close-auto-focus` events.
- `dialogRef.handleClose()` and `dialogRef.resetPosition()`.
- `$attrs` forwarding through `modal-class` and `header-aria-level`.

## Close Behavior

When the close guard is enabled, `beforeClose` uses
`ElMessageBox.confirm`. Confirming calls `done`; canceling keeps the dialog
open. Footer cancel and toolbar close use `dialogRef.handleClose()` so they
exercise the same guarded Element Plus close flow. Successful form submission
updates demo state and then closes through the instance.

## Visual Direction

Match the existing Playground's quiet operational-tool style: compact controls,
small radii, neutral surfaces, clear state labels, and dense event information.
Do not add a marketing hero or nested cards.

## Verification

Run the Playground build, verify all four scenarios in the browser, exercise
the prop controls and instance methods, confirm lifecycle logs update, and run
`git diff --check`.

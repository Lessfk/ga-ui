# GaDialog Complete Playground Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite DialogDemo as a complete interactive GaDialog API and scenario demo.

**Architecture:** Keep one GaDialog instance and switch its content from a scenario state. Bind the public props to a compact control surface, centralize guarded close behavior through the exposed Element Plus instance, and record every lifecycle event in a visible log.

**Tech Stack:** Vue 3, TypeScript, Element Plus, GaDialog, SCSS, Vite

---

### Task 1: Build the interactive control surface

**Files:**
- Modify: `playground/src/demos/DialogDemo.vue`

- [x] Replace the single launch button with a toolbar and scenario buttons.
- [x] Add controls for width, alignment, dragging, close buttons, fullscreen,
  modal click, Escape, close guard, append-to-body, and destroy-on-close.
- [x] Bind the controls to one GaDialog instance and show current state.

### Task 2: Add complete slot and scenario examples

**Files:**
- Modify: `playground/src/demos/DialogDemo.vue`

- [x] Add basic, custom-header, form, and long-content scenarios.
- [x] Exercise the default, scoped header, and footer slots.
- [x] Add form validation/loading feedback and reusable close actions.

### Task 3: Add methods and lifecycle logging

**Files:**
- Modify: `playground/src/demos/DialogDemo.vue`

- [x] Use `dialogRef.handleClose()` for guarded close commands.
- [x] Add a `resetPosition()` command for draggable dialogs.
- [x] Record all six public lifecycle and focus events.
- [x] Replace `window.confirm` with `ElMessageBox.confirm`.

### Task 4: Style and verify the demo

**Files:**
- Modify: `playground/src/demos/DialogDemo.vue`

- [x] Add PC-focused responsive constraints and compact operational styling.
- [x] Run `pnpm --filter playground exec vite build`.
- [x] Verify all scenarios, controls, events, close guard, fullscreen, and
  instance methods at `http://localhost:5555/`.
- [x] Run `git diff --check` and inspect the focused diff.

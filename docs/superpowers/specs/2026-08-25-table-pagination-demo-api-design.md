# GaTablePagination Complete API Demo Design

## Goal

Rewrite `TablePaginationDemo.vue` as one interactive PC demo that explicitly exercises every public GaTablePagination top-level prop, v-model, event, theme entry point, and forwarded table slot. Column internals are intentionally out of scope.

## Coverage

The component instance will explicitly use `data`, `columns`, `rowKey`, `border`, `stripe`, `size`, `fit`, `showHeader`, `highlightCurrentRow`, `emptyText`, `loading`, `loadingText`, `currentPage`, `pageSize`, `total`, `pageSizes`, `layout`, `background`, `position`, `tableTheme`, and `paginationTheme`.

It will handle `update:current-page`, `update:page-size`, `current-change`, and `size-change`, and demonstrate `column-prepend`, `empty`, `append`, a configured named column slot, and the default slot. The source will state that GaTablePagination currently exposes no instance methods.

## Interaction

A compact control band will switch boolean table/pagination props, component size, pagination position, layout preset, loading, and empty data. An event log will show update and change event order without changing the component's pagination semantics.

## Verification

Run Playground type checking/build where possible, run Vite build, inspect the rendered controls/table/pagination, and trigger page-size/current-page events in the browser.


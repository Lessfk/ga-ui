# GaTable 自适应父容器高度设计

## 目标

为 `GaTable` 增加可选的自动高度模式。开启后，组件占满父容器高度，分页区域固定为 `50px`，表格占用剩余空间并在内部滚动。

## 非目标

- 不通过 JavaScript 或 `ResizeObserver` 计算父容器高度。
- 不改变未开启自动高度模式时的现有布局。
- 不自动为父容器或更上层容器设置高度。
- 不改变现有分页配置和分页事件 API。

## 公共 API

在 `GaTableProps` 中新增：

```ts
autoHeight?: boolean
```

默认值为 `false`。

使用方式：

```vue
<div class="table-area">
  <GaTable auto-height />
</div>
```

父容器必须具有可计算的明确高度：

```scss
.table-area {
  height: 100%;
  min-height: 0;
}
```

如果父容器位于 Flex 或 Grid 布局中，参与高度分配的祖先容器也需要具有明确高度，并在需要收缩的位置设置 `min-height: 0`。

## 尺寸优先级

只有满足以下条件时才启用自动高度布局：

```ts
props.autoHeight === true
  && props.height === undefined
  && props.maxHeight === undefined
```

尺寸优先级为：

1. 显式传入的 `height` 或 `maxHeight`。
2. `autoHeight` 自动填充。
3. Element Plus Table 原有的自然内容高度。

因此，同时传入 `auto-height` 和 `height`/`max-height` 时，自动填充关闭，保持现有 Element Plus 尺寸语义。

## 组件结构

为现有的表格和分页增加统一根容器：

```text
.ga-table-container
├── ElTable.ga-table
└── ElPagination.ga-pagination（pagination !== false 时）
```

根容器负责整体高度分配，`ElTable` 仍负责表格内部滚动，`ElPagination` 继续负责分页展示和事件触发。

## 布局设计

推荐使用 CSS Grid：

```scss
.ga-table-container.is-auto-height {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 50px;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
```

`minmax(0, 1fr)` 允许表格区域在父容器空间不足时继续收缩，避免表格内容撑开整体容器。

自动高度模式下，传给 `ElTable` 的有效高度为 `100%`，使 Element Plus 能计算表体高度并在表体内部产生纵向滚动。

分页区域固定为：

```scss
.ga-pagination {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  min-height: 50px;
}
```

## 隐藏分页

当 `pagination=false` 时不渲染分页，并为容器增加无分页状态类：

```scss
.ga-table-container.is-auto-height.is-without-pagination {
  grid-template-rows: minmax(0, 1fr);
}
```

此时表格占满父容器全部高度。

## 兼容行为

- `autoHeight` 未传或为 `false`：保持现有表格和分页自然排列方式。
- 传入 `height`：继续直接传递给 `ElTable`。
- 传入 `maxHeight`：继续直接传递给 `ElTable`。
- 分页仍固定为 `50px`，不新增分页高度配置。
- `pagination` 的默认显示、对象配置覆盖和事件转发行为保持不变。
- loading、empty、append、自定义列插槽和 `$attrs` 透传行为保持不变。

## 测试设计

增加以下组件测试：

1. `autoHeight` 默认值为 `false`，不启用自动高度状态类。
2. 仅传入 `auto-height` 时，容器启用自动高度状态，并向 `ElTable` 传入 `height="100%"`。
3. `auto-height` 与 `height` 同时传入时，显式 `height` 优先，容器不启用自动高度状态。
4. `auto-height` 与 `maxHeight` 同时传入时，显式 `maxHeight` 优先，容器不启用自动高度状态。
5. `auto-height` 与 `pagination=false` 同时使用时，容器进入无分页状态，分页不渲染。
6. 现有分页、loading、插槽、列渲染和事件透传测试继续通过。

## 验收标准

- 父容器高度明确时，`GaTable auto-height` 精确占满父容器。
- 分页显示时始终占用 `50px`，表格只使用剩余高度。
- 数据超出表格区域时，仅表体内部滚动，分页位置不随表体滚动。
- 隐藏分页后，表格占满全部高度。
- 显式 `height` 或 `maxHeight` 不受自动高度模式影响。
- 组件测试、组件库构建和 playground 构建全部通过。

# GaAsideMenu 父级激活高亮设计

## 问题

折叠状态下，Element Plus 只有在 `ElSubMenu` 的后代菜单项已经挂载时，才能通过内部递归状态为父级增加 `is-active`。折叠菜单的弹出层首次打开前不会挂载后代，因此已激活子项的一级菜单图标不会立即使用激活色；打开浮层后才恢复高亮。

该问题与 `v-bind="menuProps"` 无关。`menuProps` 只负责透传 Element Plus Menu Props，没有覆盖父级激活状态。

## 方案

- `GaMenuTree` 根据当前 `active` 递归判断某个 `submenu` 是否包含激活后代，并为其增加内部 class `ga-aside-menu__submenu--active`。
- 新增内部默认插槽渲染器，递归检查原生 `ElSubMenu`、`ElMenuItemGroup` 和 `ElMenuItem` VNode；当子树包含当前激活菜单项时，为对应 `ElSubMenu` 克隆并增加同一内部 class。
- `GaAsideMenu` 将 `currentActive` 同时传给配置树与默认插槽渲染器。现有 active 状态、事件、路由和 `menuProps` 透传保持不变。
- 样式只在 `.el-aside.ga-aside-menu` 内生效，并使用 `var(--el-menu-active-color)` 设置父级标题颜色，保持 Element Plus 主题兼容。

## 行为

- 配置模式和默认插槽模式都在初始渲染时高亮激活项的全部父级 `ElSubMenu`。
- `v-model:active`、外部 `active` 更新和用户选择后，父级高亮同步更新。
- 折叠浮层是否已经打开不再影响父级高亮。
- 禁用、隐藏、路由、折叠、插槽优先级及公开 API 不变。

## 验证

- 配置树测试验证嵌套激活项为所有祖先子菜单增加 class，并在 active 变化时移动 class。
- 默认插槽真实 Element Plus DOM 测试验证折叠且浮层未打开时，父级已经获得 class。
- 样式测试验证 class 仅在 GaAsideMenu 范围内使用 `--el-menu-active-color`。
- 浏览器验收配置模式和 Legacy 模式的折叠父级图标均立即高亮，控制台无新增警告或错误。

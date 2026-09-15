import type { generatedComponentApi } from '../generated/component-api'
import type { ApiOverrides } from './api'

export const apiOverrides = {
  "dialog": {
    "props": {
      "modelValue": {
        "description": "是否显示，支持 `v-model`",
        "default": "false"
      },
      "title": {
        "description": "默认标题",
        "default": "''"
      },
      "width": {
        "description": "对话框宽度",
        "default": "Element Plus 默认值"
      },
      "top": {
        "description": "距离视口顶部的值",
        "default": "Element Plus 默认值"
      },
      "fullscreen": {
        "description": "全屏状态，支持 `v-model:fullscreen`",
        "default": "false"
      },
      "showFullscreen": {
        "description": "是否显示自绘全屏按钮",
        "default": "true"
      },
      "showClose": {
        "description": "是否显示自绘关闭按钮",
        "default": "true"
      },
      "appendToBody": {
        "description": "是否挂载到 `body`",
        "default": "true"
      },
      "destroyOnClose": {
        "description": "关闭后是否销毁默认插槽内容",
        "default": "true"
      },
      "center": {
        "description": "头部和底部是否居中",
        "default": "false"
      },
      "alignCenter": {
        "description": "对话框是否在视口中垂直居中",
        "default": "true"
      },
      "draggable": {
        "description": "是否允许拖动",
        "default": "true"
      },
      "closeOnClickModal": {
        "description": "点击遮罩是否关闭",
        "default": "false"
      },
      "closeOnPressEscape": {
        "description": "按 Escape 是否关闭",
        "default": "false"
      },
      "beforeClose": {
        "description": "关闭前拦截；调用 `done()` 后继续",
        "default": "undefined"
      }
    },
    "events": {
      "update:modelValue": {
        "description": "显示状态变化",
        "parameters": "(visible: boolean)"
      },
      "update:fullscreen": {
        "description": "全屏状态变化",
        "parameters": "(fullscreen: boolean)"
      },
      "open": {
        "description": "开始打开",
        "parameters": "无"
      },
      "opened": {
        "description": "打开动画结束",
        "parameters": "无"
      },
      "close": {
        "description": "开始关闭",
        "parameters": "无"
      },
      "closed": {
        "description": "关闭动画结束，并恢复受控全屏值",
        "parameters": "无"
      },
      "open-auto-focus": {
        "description": "内容获得焦点后",
        "parameters": "无"
      },
      "close-auto-focus": {
        "description": "焦点恢复后",
        "parameters": "无"
      }
    },
    "slots": {
      "default": {
        "description": "对话框正文",
        "parameters": "无"
      },
      "header": {
        "description": "完全替换默认标题栏；需自行提供关闭按钮和可访问标题",
        "parameters": "{ close, titleId, titleClass }"
      },
      "footer": {
        "description": "底部业务操作区；组件不自动添加按钮",
        "parameters": "无"
      }
    },
    "expose": {
      "dialogRef": {
        "description": "内部 Element Plus Dialog 实例"
      }
    }
  },
  "mega-menu": {
    "props": {
      "menus": {
        "description": "一级菜单及面板数据",
        "default": "[]"
      },
      "activeKey": {
        "description": "当前选中项，支持 `v-model:active-key`",
        "default": "undefined"
      },
      "openKey": {
        "description": "当前打开的一级菜单，支持 `v-model:open-key`",
        "default": "undefined"
      },
      "trigger": {
        "description": "面板触发方式",
        "default": "'click'"
      },
      "openDelay": {
        "description": "悬停打开延时，单位 ms",
        "default": "100"
      },
      "closeDelay": {
        "description": "悬停关闭延时，单位 ms",
        "default": "180"
      },
      "minColumnWidth": {
        "description": "面板自适应列最小宽度",
        "default": "240"
      },
      "maxColumnWidth": {
        "description": "面板单列最大宽度",
        "default": "420"
      },
      "maxHeight": {
        "description": "面板最大高度；`auto` 时按内容自适应",
        "default": "'auto'"
      },
      "closeOnSelect": {
        "description": "选择面板菜单项后是否关闭",
        "default": "true"
      },
      "theme": {
        "description": "一级菜单和面板样式，支持局部覆盖",
        "default": "内置主题"
      },
      "ariaLabel": {
        "description": "导航区域无障碍名称",
        "default": "'大型菜单导航'"
      }
    },
    "events": {
      "update:activeKey": {
        "description": "选中项变化",
        "parameters": "(key)"
      },
      "update:openKey": {
        "description": "打开面板变化",
        "parameters": "(key | undefined)"
      },
      "select": {
        "description": "一级直达菜单或面板项被选择",
        "parameters": "(payload: GaMegaMenuSelectPayload)"
      },
      "open": {
        "description": "面板打开",
        "parameters": "(key, menu)"
      },
      "close": {
        "description": "面板关闭",
        "parameters": "(key, menu)"
      }
    },
    "slots": {
      "menu-item": {
        "description": "自定义一级菜单项",
        "parameters": "{ menu, active, open }"
      },
      "group-title": {
        "description": "自定义分组标题",
        "parameters": "{ menu, group }"
      },
      "panel-item": {
        "description": "自定义面板项",
        "parameters": "{ menu, group, item, active }"
      },
      "empty": {
        "description": "自定义空面板",
        "parameters": "{ menu }"
      }
    },
    "expose": {
      "open": {
        "description": "打开指定一级菜单面板",
        "parameters": "(key)"
      },
      "close": {
        "description": "关闭当前面板",
        "parameters": "无"
      },
      "toggle": {
        "description": "切换指定面板",
        "parameters": "(key)"
      }
    }
  },
  "pagination": {
    "extra": {
      "events": [
        {
          "name": "update:current-page",
          "type": "event",
          "description": "当前页变化",
          "parameters": "(page: number)"
        },
        {
          "name": "update:page-size",
          "type": "event",
          "description": "每页数量变化",
          "parameters": "(size: number)"
        },
        {
          "name": "current-change",
          "type": "event",
          "description": "当前页变化后的业务事件",
          "parameters": "(page: number)"
        },
        {
          "name": "size-change",
          "type": "event",
          "description": "每页数量变化后的业务事件",
          "parameters": "(size: number)"
        }
      ]
    },
    "props": {
      "currentPage": {
        "description": "当前页，支持 `v-model:current-page`",
        "default": "1"
      },
      "pageSize": {
        "description": "每页数量，支持 `v-model:page-size`",
        "default": "10"
      },
      "total": {
        "description": "总条数",
        "default": "0"
      },
      "pageSizes": {
        "description": "每页数量选项",
        "default": "[10, 20, 30, 40, 50]"
      },
      "size": {
        "description": "尺寸",
        "default": "'default'"
      },
      "layout": {
        "description": "Element Plus 分页布局",
        "default": "'total, sizes, prev, pager, next, jumper'"
      },
      "background": {
        "description": "页码按钮是否显示背景",
        "default": "false"
      },
      "disabled": {
        "description": "是否禁用整个分页控件",
        "default": "false"
      },
      "position": {
        "description": "水平对齐",
        "default": "'right'"
      },
      "theme": {
        "description": "当前实例颜色配置",
        "default": "内置主题"
      }
    }
  },
  "table": {
    "extra": {
      "slots": [
        {
          "name": "column-prepend",
          "type": "未声明",
          "description": "放在配置列之前，适合手写选择列或展开列",
          "parameters": "无"
        },
        {
          "name": "[column.slot]",
          "type": "未声明",
          "description": "配置列的动态命名插槽",
          "parameters": "{ row, column, $index }"
        }
      ]
    },
    "props": {
      "data": {
        "description": "表格数据",
        "default": "[]"
      },
      "columns": {
        "description": "配置式列",
        "default": "[]"
      },
      "height": {
        "description": "固定表格高度",
        "default": "undefined"
      },
      "maxHeight": {
        "description": "最大高度",
        "default": "undefined"
      },
      "rowKey": {
        "description": "行主键",
        "default": "undefined"
      },
      "border": {
        "description": "是否显示纵向边框",
        "default": "true"
      },
      "stripe": {
        "description": "是否显示斑马纹",
        "default": "true"
      },
      "size": {
        "description": "尺寸",
        "default": "undefined"
      },
      "fit": {
        "description": "列宽是否自动撑开",
        "default": "true"
      },
      "showHeader": {
        "description": "是否显示表头",
        "default": "true"
      },
      "highlightCurrentRow": {
        "description": "是否高亮当前行",
        "default": "false"
      },
      "emptyText": {
        "description": "默认空状态描述",
        "default": "'暂无数据'"
      },
      "loading": {
        "description": "是否显示 Element Plus Loading",
        "default": "false"
      },
      "loadingText": {
        "description": "加载文字",
        "default": "'加载中...'"
      },
      "theme": {
        "description": "当前实例颜色配置",
        "default": "内置主题"
      }
    },
    "slots": {
      "default": {
        "description": "放在配置列之后，适合手写操作列",
        "parameters": "无"
      },
      "empty": {
        "description": "替换默认 `ElEmpty`",
        "parameters": "无"
      },
      "append": {
        "description": "表格末尾追加区域",
        "parameters": "无"
      }
    },
    "expose": {
      "tableRef": {
        "description": "内部 Element Plus Table 实例，可调用 `clearSelection`、`doLayout` 等方法"
      }
    }
  },
  "aside-menu": {
    "props": {
      "collapse": {
        "description": "是否折叠，支持 `v-model:collapse`",
        "default": "false"
      },
      "width": {
        "description": "展开宽度",
        "default": "'240px'"
      },
      "collapseWidth": {
        "description": "折叠宽度",
        "default": "'64px'"
      },
      "theme": {
        "description": "侧栏和弹层主题",
        "default": "内置深色主题"
      },
      "defaultActive": {
        "description": "默认激活菜单 index",
        "default": "''"
      },
      "defaultOpeneds": {
        "description": "默认展开的子菜单",
        "default": "[]"
      },
      "uniqueOpened": {
        "description": "是否只保持一个子菜单展开",
        "default": "false"
      },
      "router": {
        "description": "是否启用 Vue Router 导航",
        "default": "false"
      },
      "collapseTransition": {
        "description": "是否开启折叠动画",
        "default": "true"
      },
      "ellipsis": {
        "description": "是否处理菜单文字溢出",
        "default": "true"
      },
      "persistent": {
        "description": "收起后是否保留弹层 DOM",
        "default": "true"
      },
      "menuTrigger": {
        "description": "子菜单触发方式",
        "default": "'hover'"
      },
      "showTimeout": {
        "description": "展开与关闭延时",
        "default": "Element Plus 默认值"
      },
      "hideTimeout": {
        "description": "展开与关闭延时",
        "default": "Element Plus 默认值"
      },
      "popperOffset": {
        "description": "折叠弹层偏移和效果",
        "default": "Element Plus 默认值"
      },
      "popperEffect": {
        "description": "折叠弹层偏移和效果",
        "default": "Element Plus 默认值"
      },
      "popperClass": {
        "description": "折叠弹层样式扩展",
        "default": "undefined"
      },
      "popperStyle": {
        "description": "折叠弹层样式扩展",
        "default": "undefined"
      },
      "backgroundColor": {
        "description": "backgroundColor 配置，类型以组件公开声明为准。"
      },
      "textColor": {
        "description": "textColor 配置，类型以组件公开声明为准。"
      },
      "activeTextColor": {
        "description": "activeTextColor 配置，类型以组件公开声明为准。"
      },
      "closeOnClickOutside": {
        "description": "closeOnClickOutside 配置，类型以组件公开声明为准。"
      },
      "ellipsisIcon": {
        "description": "ellipsisIcon 配置，类型以组件公开声明为准。"
      }
    },
    "events": {
      "update:collapse": {
        "description": "折叠状态变化",
        "parameters": "(collapse: boolean)"
      },
      "toggle": {
        "description": "执行一次折叠切换后",
        "parameters": "(collapse: boolean)"
      },
      "select": {
        "description": "菜单项被选择",
        "parameters": "(index, indexPath, item, routerResult?)"
      },
      "open": {
        "description": "子菜单展开",
        "parameters": "(index, indexPath)"
      },
      "close": {
        "description": "子菜单关闭",
        "parameters": "(index, indexPath)"
      }
    },
    "slots": {
      "header": {
        "description": "Logo、系统名等头部内容",
        "parameters": "{ collapse }"
      },
      "default": {
        "description": "原生 Element Plus 菜单节点",
        "parameters": "无"
      },
      "footer": {
        "description": "侧栏底部内容",
        "parameters": "{ collapse }"
      },
      "collapse": {
        "description": "自定义折叠控制；未提供时使用内置按钮",
        "parameters": "{ collapse, toggle }"
      }
    },
    "expose": {
      "menuRef": {
        "description": "内部菜单实例"
      },
      "toggle": {
        "description": "切换折叠状态，并触发模型更新和 `toggle` 事件"
      }
    }
  },
  "search-bar": {
    "props": {
      "modelValue": {
        "description": "最新搜索值，支持 `v-model`",
        "default": "必填"
      },
      "fields": {
        "description": "搜索字段配置",
        "default": "必填"
      },
      "labelMode": {
        "description": "是否显示字段 label，不控制 placeholder",
        "default": "'label'"
      },
      "labelPosition": {
        "description": "表单标签位置",
        "default": "'right'"
      },
      "labelWidth": {
        "description": "全局标签宽度",
        "default": "'auto'"
      },
      "size": {
        "description": "表单和内置控件尺寸",
        "default": "'default'"
      },
      "gutter": {
        "description": "栅格间距",
        "default": "16"
      },
      "collapsed": {
        "description": "是否收起，支持 `v-model:collapsed`",
        "default": "true"
      },
      "collapsedCount": {
        "description": "收起时显示的字段数量",
        "default": "3"
      },
      "disabled": {
        "description": "是否禁用表单字段，不影响按钮",
        "default": "false"
      },
      "actionsLoading": {
        "description": "查询按钮外部 loading",
        "default": "false"
      },
      "actionsDisabled": {
        "description": "是否禁用操作按钮，不影响表单",
        "default": "false"
      },
      "rules": {
        "description": "Element Plus 表单校验规则",
        "default": "undefined"
      },
      "validateOnSearch": {
        "description": "查询前是否执行表单校验",
        "default": "false"
      },
      "actionsShowSearch": {
        "description": "是否显示内置查询按钮",
        "default": "true"
      },
      "actionsShowReset": {
        "description": "是否显示内置重置按钮",
        "default": "true"
      },
      "actionsShowCollapse": {
        "description": "是否显示内置展开/收起按钮",
        "default": "true"
      }
    },
    "events": {
      "update:modelValue": {
        "description": "任一字段输入时同步最新模型",
        "parameters": "(model)"
      },
      "update:collapsed": {
        "description": "展开/收起状态变化",
        "parameters": "(collapsed)"
      },
      "search": {
        "description": "点击查询或调用实例 `search()`；组件不会自动重置页码",
        "parameters": "(model)"
      },
      "reset": {
        "description": "重置完成后的新模型",
        "parameters": "(model)"
      },
      "change": {
        "description": "内置字段 change 事件",
        "parameters": "({ key, value, model, field })"
      },
      "invalid": {
        "description": "查询校验未通过",
        "parameters": "(fields)"
      }
    },
    "slots": {
      "field-{key}": {
        "description": "覆盖某个字段的渲染",
        "parameters": "{ field, value, disabled, update }"
      },
      "prepend": {
        "description": "在字段列表前后插入栅格内容，建议自行使用 `ElCol`",
        "parameters": "无"
      },
      "append": {
        "description": "在字段列表前后插入栅格内容，建议自行使用 `ElCol`",
        "parameters": "无"
      },
      "actions": {
        "description": "完全替换整个按钮区域",
        "parameters": "操作作用域"
      },
      "actions-prepend": {
        "description": "在内置按钮前后插入一个或多个按钮",
        "parameters": "操作作用域"
      },
      "actions-append": {
        "description": "在内置按钮前后插入一个或多个按钮",
        "parameters": "操作作用域"
      },
      "action-search": {
        "description": "只替换查询按钮",
        "parameters": "操作作用域"
      },
      "action-reset": {
        "description": "只替换重置按钮",
        "parameters": "操作作用域"
      },
      "action-collapse": {
        "description": "只替换展开/收起按钮",
        "parameters": "操作作用域"
      }
    },
    "expose": {
      "formRef": {
        "description": "内部 `FormInstance`"
      },
      "search": {
        "description": "执行查询，返回 `Promise<boolean>`"
      },
      "reset": {
        "description": "恢复默认或初始值并触发 `reset`"
      },
      "validate": {
        "description": "执行表单校验"
      },
      "clearValidate": {
        "description": "清除校验结果"
      },
      "toggle": {
        "description": "切换展开和收起"
      }
    }
  },
  "table-pagination": {
    "extra": {
      "events": [
        {
          "name": "update:current-page",
          "type": "event",
          "description": "当前页变化",
          "parameters": "(page: number)"
        },
        {
          "name": "update:page-size",
          "type": "event",
          "description": "每页数量变化",
          "parameters": "(size: number)"
        },
        {
          "name": "current-change",
          "type": "event",
          "description": "当前页业务事件",
          "parameters": "(page: number)"
        },
        {
          "name": "size-change",
          "type": "event",
          "description": "每页数量业务事件",
          "parameters": "(size: number)"
        }
      ]
    },
    "props": {
      "data": {
        "description": "表格数据、配置列和行主键",
        "default": "与 `GaTable` 一致"
      },
      "columns": {
        "description": "表格数据、配置列和行主键",
        "default": "与 `GaTable` 一致"
      },
      "rowKey": {
        "description": "表格数据、配置列和行主键",
        "default": "与 `GaTable` 一致"
      },
      "border": {
        "description": "表格显示行为",
        "default": "true"
      },
      "stripe": {
        "description": "表格显示行为",
        "default": "true"
      },
      "fit": {
        "description": "表格显示行为",
        "default": "true"
      },
      "showHeader": {
        "description": "表格显示行为",
        "default": "true"
      },
      "highlightCurrentRow": {
        "description": "当前行和空状态",
        "default": "与 `GaTable` 一致"
      },
      "emptyText": {
        "description": "当前行和空状态",
        "default": "与 `GaTable` 一致"
      },
      "loading": {
        "description": "加载状态；`loading` 同时禁用分页",
        "default": "false"
      },
      "loadingText": {
        "description": "加载状态；`loading` 同时禁用分页",
        "default": "'加载中...'"
      },
      "size": {
        "description": "同时控制表格和分页尺寸",
        "default": "'default'"
      },
      "currentPage": {
        "description": "分页模型与总数",
        "default": "1"
      },
      "pageSize": {
        "description": "分页模型与总数",
        "default": "10"
      },
      "total": {
        "description": "分页模型与总数",
        "default": "0"
      },
      "pageSizes": {
        "description": "分页选项和布局；`background` 默认为 `true`",
        "default": "与 `GaPagination` 一致"
      },
      "layout": {
        "description": "分页选项和布局；`background` 默认为 `true`",
        "default": "与 `GaPagination` 一致"
      },
      "background": {
        "description": "分页选项和布局；`background` 默认为 `true`",
        "default": "与 `GaPagination` 一致"
      },
      "position": {
        "description": "分页对齐",
        "default": "'right'"
      },
      "tableTheme": {
        "description": "GaTableTheme",
        "default": "undefined"
      },
      "paginationTheme": {
        "description": "GaPaginationTheme",
        "default": "undefined"
      }
    },
    "slots": {
      "default": {
        "description": "default 配置，类型以组件公开声明为准。"
      },
      "empty": {
        "description": "empty 配置，类型以组件公开声明为准。"
      },
      "append": {
        "description": "append 配置，类型以组件公开声明为准。"
      }
    }
  }
} satisfies Record<keyof typeof generatedComponentApi, ApiOverrides>

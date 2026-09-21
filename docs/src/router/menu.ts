import type { AppMenuItem } from "@/types/api";

export const routeMenuItems: AppMenuItem[] = [
  {
    code: "todo",
    title: "待办工作",
    icon: "DocumentChecked",
    children: [
      {
        code: "todo_pending",
        title: "待办工作",
        path: "/todo/pending"
      },
      {
        code: "todo_done",
        title: "已办工作",
        path: "/todo/done"
      }
    ]
  },
  {
    code: "quick_application",
    title: "快查申请",
    icon: "Monitor",
    children: [
      {
        code: "quick_home",
        title: "首页",
        path: "/quick/home"
      },
      {
        code: "clue_list",
        title: "线索列表",
        path: "/quick/clues"
      },
      {
        code: "case_list",
        title: "案件列表",
        path: "/quick/cases"
      }
    ]
  },
  {
    code: "base_data",
    title: "基础数据",
    icon: "Collection",
    children: [
      {
        code: "base_search",
        title: "综合检索",
        path: "/base/search"
      },
      {
        code: "account_rules",
        title: "账号规则",
        path: "/base/account-rules"
      },
      {
        code: "bank_outlets",
        title: "银行网点",
        path: "/base/bank-outlets"
      },
      {
        code: "account_data_query",
        title: "账户数据查询",
        path: "/base/account-query"
      }
    ]
  },
  {
    code: "statistics",
    title: "统计分析",
    icon: "Search",
    children: [
      {
        code: "statistics_summary",
        title: "数据汇总统计",
        path: "/statistics/summary"
      },
      {
        code: "statistics_bank_assistance",
        title: "银行协助情况统计",
        path: "/statistics/bank-assistance"
      },
      {
        code: "statistics_case_category",
        title: "案件类别统计",
        path: "/statistics/case-category"
      }
    ]
  },
  {
    code: "system_config",
    title: "系统配置",
    icon: "Setting",
    children: [
      {
        code: "system_users",
        title: "用户管理",
        path: "/system/users"
      },
      {
        code: "system_departments",
        title: "部门管理",
        path: "/system/departments"
      },
      {
        code: "system_roles",
        title: "角色管理",
        path: "/permission/roles"
      },
      {
        code: "document_templates",
        title: "文书模板管理",
        path: "/system/document-templates"
      },
      {
        code: "system_dictionary",
        title: "字典管理",
        path: "/system/dictionary"
      },
      {
        code: "system_menus",
        title: "功能菜单",
        path: "/permission/menus"
      },
      {
        code: "system_operation_logs",
        title: "系统操作日志",
        path: "/system/operation-logs"
      },
      {
        code: "system_announcements",
        title: "公告管理",
        path: "/system/announcements"
      }
    ]
  }
];

export function flattenRouteMenus(items: AppMenuItem[]): AppMenuItem[] {
  return items.flatMap((item) => (item.children?.length ? flattenRouteMenus(item.children) : [item]));
}

export function resolveAuthorizedHomePath(menuCodes?: string[] | null): string {
  const routeMenus = flattenRouteMenus(routeMenuItems).filter((item) => item.path);
  if (!menuCodes) return "/quick/home";
  const allowed = new Set(menuCodes);
  if (allowed.has("quick_home")) return "/quick/home";
  return routeMenus.find((item) => allowed.has(item.code))?.path || "/quick/home";
}

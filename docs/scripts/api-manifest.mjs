export const apiManifest = {
  dialog: {
    source: '../packages/ui/src/base/components/dialog/types/index.ts',
    props: 'GaDialogProps',
    emits: 'GaDialogEmits',
    expose: 'GaDialogExpose',
    slots: {
      header: 'GaDialogHeaderSlotProps',
      default: null,
      footer: null,
    },
  },
  'mega-menu': {
    source: '../packages/ui/src/base/components/megaMenu/types/index.ts',
    props: 'GaMegaMenuProps',
    emits: 'GaMegaMenuEmits',
    expose: 'GaMegaMenuExpose',
    slots: {
      'menu-item': 'GaMegaMenuMenuItemSlotProps',
      'group-title': 'GaMegaMenuGroupTitleSlotProps',
      'panel-item': 'GaMegaMenuPanelItemSlotProps',
      empty: 'GaMegaMenuEmptySlotProps',
    },
  },
  pagination: {
    source: '../packages/ui/src/base/components/pagination/src/props.ts',
    props: 'GaPaginationProps',
    emits: null,
    expose: null,
    slots: {},
  },
  table: {
    source: '../packages/ui/src/base/components/table/src/props.ts',
    secondarySource: '../packages/ui/src/base/components/table/types/index.ts',
    props: 'GaTableProps',
    emits: null,
    expose: 'GaTableExpose',
    slots: {
      default: null,
      empty: null,
      append: null,
    },
  },
  'aside-menu': {
    source: '../packages/ui/src/business/components/asideMenu/types/index.ts',
    props: 'GaAsideMenuProps',
    emits: 'GaAsideMenuEmits',
    expose: 'GaAsideMenuExpose',
    slots: {
      header: 'GaAsideMenuSlotProps',
      default: 'GaAsideMenuSlotProps',
      footer: 'GaAsideMenuSlotProps',
      collapse: 'GaAsideMenuToggleSlotProps',
    },
  },
  'search-bar': {
    source: '../packages/ui/src/business/components/searchBar/types/index.ts',
    props: 'GaSearchBarProps',
    emits: 'GaSearchBarEmits',
    expose: 'GaSearchBarExpose',
    slots: {},
  },
  'table-pagination': {
    source: '../packages/ui/src/business/components/tablePagination/src/props.ts',
    props: 'GaTablePaginationProps',
    emits: null,
    expose: null,
    slots: {
      default: null,
      empty: null,
      append: null,
    },
  },
}

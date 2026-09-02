export interface GaUiResolverOptions {
  importStyle?: boolean
  elementPlusStyle?: boolean
}

export interface GaUiResolverComponentInfo {
  name: string
  from: string
  sideEffects?: string[]
}

export interface GaUiComponentResolver {
  type: 'component'
  resolve: (name: string) => GaUiResolverComponentInfo | undefined
}

interface ComponentDefinition {
  from: string
  styles: readonly string[]
}

const tableStyles = ['table', 'table-column', 'empty', 'loading'] as const
const paginationStyles = ['pagination'] as const

const components: Record<string, ComponentDefinition> = {
  GaDialog: {
    from: 'ga-ui-plus/base',
    styles: ['dialog'],
  },
  GaMegaMenu: {
    from: 'ga-ui-plus/base',
    styles: ['scrollbar'],
  },
  GaPagination: {
    from: 'ga-ui-plus/base',
    styles: paginationStyles,
  },
  GaTable: {
    from: 'ga-ui-plus/base',
    styles: tableStyles,
  },
  GaAsideMenu: {
    from: 'ga-ui-plus/business',
    styles: ['aside', 'menu', 'scrollbar'],
  },
  GaSearchBar: {
    from: 'ga-ui-plus/business',
    styles: [
      'form',
      'form-item',
      'row',
      'col',
      'button',
      'input',
      'select',
      'option',
      'date-picker',
    ],
  },
  GaTablePagination: {
    from: 'ga-ui-plus/business',
    styles: [...new Set([...tableStyles, ...paginationStyles])],
  },
}

export function GaUiResolver(
  options: GaUiResolverOptions = {},
): GaUiComponentResolver {
  const { importStyle = true, elementPlusStyle = true } = options

  return {
    type: 'component',
    resolve(name) {
      if (!Object.prototype.hasOwnProperty.call(components, name)) {
        return undefined
      }

      const component = components[name]

      const sideEffects = [
        ...(importStyle ? ['ga-ui-plus/style.css'] : []),
        ...(elementPlusStyle
          ? component.styles.map(
              (style) => `element-plus/es/components/${style}/style/css`,
            )
          : []),
      ]

      return {
        name,
        from: component.from,
        ...(sideEffects.length > 0 ? { sideEffects } : {}),
      }
    },
  }
}

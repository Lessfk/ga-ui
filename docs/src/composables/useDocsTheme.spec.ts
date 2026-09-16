import { beforeEach, describe, expect, it } from 'vitest'

import { useDocsTheme } from './useDocsTheme'

describe('useDocsTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('toggles only the docs theme class and persists it', () => {
    const theme = useDocsTheme()
    theme.setTheme('dark')
    expect(document.documentElement.classList.contains('ga-docs-dark')).toBe(
      true,
    )
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('ga-ui-docs-theme')).toBe('dark')
  })

  it('restores the light theme explicitly', () => {
    const theme = useDocsTheme()
    theme.setTheme('dark')
    theme.setTheme('light')
    expect(document.documentElement.classList.contains('ga-docs-dark')).toBe(
      false,
    )
  })

  it('restores the persisted theme when the composable is created', () => {
    localStorage.setItem('ga-ui-docs-theme', 'dark')

    const theme = useDocsTheme()

    expect(theme.theme.value).toBe('dark')
    expect(document.documentElement.classList.contains('ga-docs-dark')).toBe(
      true,
    )
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})

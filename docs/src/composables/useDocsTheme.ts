import { readonly, ref } from 'vue'

export type DocsTheme = 'light' | 'dark'

const storageKey = 'ga-ui-docs-theme'
const currentTheme = ref<DocsTheme>('light')

function applyTheme(theme: DocsTheme) {
  currentTheme.value = theme
  document.documentElement.classList.toggle('ga-docs-dark', theme === 'dark')
  localStorage.setItem(storageKey, theme)
}

export function useDocsTheme() {
  const stored = localStorage.getItem(storageKey)
  if (stored === 'light' || stored === 'dark') applyTheme(stored)

  return {
    theme: readonly(currentTheme),
    setTheme: applyTheme,
    toggleTheme: () =>
      applyTheme(currentTheme.value === 'light' ? 'dark' : 'light'),
  }
}

import { useDark } from '@vueuse/core'

export function useTheme() {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: 'app-theme',
  })

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
}

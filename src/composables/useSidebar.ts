import { createGlobalState, useLocalStorage, useMediaQuery } from '@vueuse/core'

const SIDEBAR_STORAGE_KEY = 'base-structure:sidebar-collapsed'

export const useSidebar = createGlobalState(() => {
  const isCollapsed = useLocalStorage(SIDEBAR_STORAGE_KEY, false)
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const isMobileOpen = ref(false)

  const isOpen = computed(() => (isMobile.value ? isMobileOpen.value : !isCollapsed.value))

  function toggle() {
    if (isMobile.value) {
      isMobileOpen.value = !isMobileOpen.value
      return
    }
    isCollapsed.value = !isCollapsed.value
  }

  function open() {
    if (isMobile.value) isMobileOpen.value = true
    else isCollapsed.value = false
  }

  function close() {
    if (isMobile.value) isMobileOpen.value = false
    else isCollapsed.value = true
  }

  watch(isMobile, (mobile) => {
    if (mobile) isMobileOpen.value = false
    else isMobileOpen.value = false
  })

  return {
    isCollapsed,
    isMobile,
    isMobileOpen,
    isOpen,
    toggle,
    open,
    close,
  }
})

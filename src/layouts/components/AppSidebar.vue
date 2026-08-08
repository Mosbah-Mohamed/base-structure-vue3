<script setup lang="ts">
import {
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  PanelLeftClose,
  Settings2,
  Star,
  X,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NAV_ICONS } from '@/lib/nav'
import { useSidebar } from '@/composables/useSidebar'
import { authService } from '@/services/AuthService'
import { useAuthStore } from '@/stores/AuthStore'
import { useNavStore } from '@/stores/NavStore'
import logoUrl from '@/assets/images/logo.svg'
import SideMenuCustomizer from './SideMenuCustomizer.vue'
import type { NavMenuItem } from '@/interfaces/Shared'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const { authUser, clearAuthUser, hasPermission } = useAuthStore()
const navStore = useNavStore()
const { isCollapsed, isMobile, isMobileOpen, toggle, close } = useSidebar()

const showCustomizer = ref(false)
const isRtl = computed(() => locale.value === 'ar')

const visibleItems = computed(() => {
  const items = (navStore.orderedItems as NavMenuItem[]).filter((item) => {
    if (navStore.hidden.includes(item.id)) return false
    if (item.permission && !hasPermission(item.permission)) return false
    return true
  })

  return [...items].sort((a, b) => {
    const aFav = navStore.favorites.includes(a.id) ? 0 : 1
    const bFav = navStore.favorites.includes(b.id) ? 0 : 1
    return aFav - bFav
  })
})

const showLabels = computed(() => isMobile.value || !isCollapsed.value)

const CollapseIcon = computed(() => {
  if (isMobile.value) return isMobileOpen.value ? X : PanelLeftClose
  if (isCollapsed.value) return isRtl.value ? ChevronsLeft : ChevronsRight
  return isRtl.value ? ChevronsRight : ChevronsLeft
})

watch(
  () => route.fullPath,
  () => {
    if (isMobile.value) close()
  },
)

async function logout() {
  await authService.logout().catch(() => undefined)
  clearAuthUser()
  router.push({ name: 'login-page' })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="filter-drawer">
      <div v-if="isMobileOpen" class="fixed inset-0 z-40 bg-black/50 lg:hidden" @click="close" />
    </Transition>
  </Teleport>

  <aside
    :class="
      cn(
        'z-50 flex shrink-0 flex-col border-e bg-card transition-[width,transform] duration-300',
        // Mobile: fixed full-height drawer
        'fixed inset-y-0 start-0 h-svh w-64 max-w-[85vw]',
        isMobileOpen ? 'translate-x-0' : isRtl ? 'translate-x-full' : '-translate-x-full',
        // Desktop: stretch with layout shell height
        'lg:static lg:z-auto lg:h-full lg:max-w-none lg:translate-x-0',
        isCollapsed ? 'lg:w-[72px]' : 'lg:w-64',
      )
    "
  >
    <div
      :class="
        cn('flex h-14 items-center gap-2 border-b', showLabels ? 'px-4' : 'justify-center px-2')
      "
    >
      <img :src="logoUrl" alt="Logo" class="h-8 w-auto shrink-0" />
      <span v-if="showLabels" class="truncate text-sm font-semibold">Base Structure</span>
      <Button
        v-if="isMobile"
        variant="ghost"
        size="icon"
        class="ms-auto size-8 lg:hidden"
        :title="t('nav.collapseSidebar')"
        @click="close"
      >
        <X class="size-4" />
      </Button>
    </div>

    <div
      :class="
        cn(
          'flex items-center gap-1 px-2 pt-3',
          showLabels ? 'justify-between px-3' : 'flex-col justify-center',
        )
      "
    >
      <p v-if="showLabels" class="text-xs font-medium text-muted-foreground">{{ t('nav.menu') }}</p>

      <div :class="cn('flex items-center gap-1', !showLabels && 'flex-col')">
        <Button
          variant="ghost"
          size="icon"
          class="hidden size-8 lg:inline-flex"
          :title="isCollapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')"
          @click="toggle"
        >
          <component :is="CollapseIcon" class="size-4 rtl:-scale-x-100" />
        </Button>

        <Button
          v-if="showLabels"
          variant="ghost"
          size="icon"
          class="size-8"
          :title="t('nav.customizeTitle')"
          @click="showCustomizer = true"
        >
          <Settings2 class="size-4" />
        </Button>
      </div>
    </div>

    <nav class="flex flex-1 flex-col gap-1 overflow-y-auto p-2 pt-2">
      <TransitionGroup name="list-fade" tag="div" class="flex flex-col gap-1">
        <RouterLink
          v-for="item in visibleItems"
          :key="item.id"
          :to="{ name: item.routeName }"
          :title="t(item.titleKey)"
          :class="
            cn(
              'flex items-center gap-2 rounded-md py-2 text-sm transition-all duration-200 hover:bg-accent',
              showLabels ? 'px-3' : 'justify-center px-2',
              route.name === item.routeName && 'bg-accent font-medium',
            )
          "
        >
          <component :is="NAV_ICONS[item.icon]" class="size-4 shrink-0" />
          <span v-if="showLabels" class="truncate">{{ t(item.titleKey) }}</span>
          <Star
            v-if="showLabels && navStore.favorites.includes(item.id)"
            class="ms-auto size-3.5 text-amber-400"
            fill="currentColor"
          />
        </RouterLink>
      </TransitionGroup>
    </nav>

    <div v-if="authUser" :class="cn('border-t p-2', showLabels && 'p-3')">
      <p v-if="showLabels" class="mb-2 truncate px-1 text-xs text-muted-foreground">
        {{ authUser.email }}
      </p>
      <Button
        variant="outline"
        :class="cn('w-full gap-2', showLabels ? 'justify-start' : 'justify-center px-0')"
        :title="t('auth.logout')"
        @click="logout"
      >
        <LogOut class="size-4" />
        <span v-if="showLabels">{{ t('auth.logout') }}</span>
      </Button>
    </div>

    <SideMenuCustomizer v-model:open="showCustomizer" />
  </aside>
</template>

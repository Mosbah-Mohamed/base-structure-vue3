<script setup lang="ts">
import { PanelLeft } from 'lucide-vue-next'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
import LocaleToggle from '@/components/layout/LocaleToggle.vue'
import NotificationsMenu from '@/components/layout/NotificationsMenu.vue'
import UserProfileMenu from '@/components/layout/UserProfileMenu.vue'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/composables/useSidebar'

const { t } = useI18n()
const { isMobile, isCollapsed, toggle } = useSidebar()
</script>

<template>
  <header class="flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur sm:px-4">
    <Button
      variant="ghost"
      size="icon"
      class="size-8 shrink-0"
      :title="isMobile || isCollapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')"
      @click="toggle"
    >
      <PanelLeft class="size-4 rtl:-scale-x-100" />
    </Button>

    <div class="ms-auto flex items-center gap-1.5 sm:gap-2">
      <LocaleToggle />
      <ThemeToggle />
      <NotificationsMenu />
      <UserProfileMenu />
    </div>
  </header>
</template>

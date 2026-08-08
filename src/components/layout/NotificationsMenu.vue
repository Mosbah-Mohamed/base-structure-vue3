<script setup lang="ts">
import { Bell, CheckCheck, List } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DemoNotification {
  id: number
  titleKey: string
  bodyKey: string
  time: string
  unread: boolean
}

const { t } = useI18n()

const notifications = ref<DemoNotification[]>([
  {
    id: 1,
    titleKey: 'nav.demoNotification1Title',
    bodyKey: 'nav.demoNotification1Body',
    time: '2m',
    unread: true,
  },
  {
    id: 2,
    titleKey: 'nav.demoNotification2Title',
    bodyKey: 'nav.demoNotification2Body',
    time: '1h',
    unread: true,
  },
  {
    id: 3,
    titleKey: 'nav.demoNotification3Title',
    bodyKey: 'nav.demoNotification3Body',
    time: '1d',
    unread: true,
  },
])

const unreadCount = computed(() => notifications.value.filter((item) => item.unread).length)

function markAllRead() {
  notifications.value = notifications.value.map((item) => ({ ...item, unread: false }))
}

function markRead(id: number) {
  const target = notifications.value.find((item) => item.id === id)
  if (target) target.unread = false
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="relative size-9" :title="t('nav.notifications')">
        <Bell class="size-4" />
        <span
          v-if="unreadCount"
          class="absolute end-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-80 p-0" align="end">
      <div class="flex items-center justify-between gap-2 border-b px-3 py-2.5">
        <DropdownMenuLabel class="p-0">
          {{ t('nav.notifications') }}
        </DropdownMenuLabel>
        <Button
          v-if="unreadCount"
          variant="ghost"
          size="sm"
          class="h-7 gap-1.5 px-2 text-xs"
          @click="markAllRead"
        >
          <CheckCheck class="size-3.5 shrink-0" />
          <span>{{ t('nav.markAllRead') }}</span>
        </Button>
      </div>

      <div class="max-h-72 overflow-y-auto py-1">
        <DropdownMenuItem
          v-for="item in notifications"
          :key="item.id"
          class="items-start gap-3 rounded-none px-3 py-2.5"
          @select="markRead(item.id)"
        >
          <span
            class="mt-1.5 size-2 shrink-0 rounded-full"
            :class="item.unread ? 'bg-primary' : 'bg-transparent'"
          />
          <div class="min-w-0 flex-1 space-y-0.5 text-start">
            <div class="flex items-start justify-between gap-2">
              <p class="min-w-0 flex-1 truncate text-sm font-medium">{{ t(item.titleKey) }}</p>
              <span class="shrink-0 text-[11px] text-muted-foreground">{{ item.time }}</span>
            </div>
            <p class="line-clamp-2 text-xs text-muted-foreground">{{ t(item.bodyKey) }}</p>
          </div>
        </DropdownMenuItem>

        <div
          v-if="!notifications.length"
          class="px-3 py-8 text-center text-sm text-muted-foreground"
        >
          {{ t('nav.noNotifications') }}
        </div>
      </div>

      <DropdownMenuSeparator class="my-0" />
      <DropdownMenuItem
        class="justify-center gap-2 rounded-none py-2.5 text-sm font-medium text-primary"
      >
        <List class="size-3.5 shrink-0" />
        <span>{{ t('nav.viewAllNotifications') }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

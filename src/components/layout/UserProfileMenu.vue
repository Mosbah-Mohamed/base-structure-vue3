<script setup lang="ts">
import { ChevronDown, Headset, LayoutDashboard, LogOut, Package, Shield } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/AuthStore'
import { authService } from '@/services/AuthService'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.authUser)
const isLoggingOut = ref(false)

const initials = computed(() => {
  const name = user.value?.name?.trim()
  if (!name) return '?'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
})

const packageLabel = computed(() => t('nav.starterPackage'))

const projectRoles = computed(() => [
  {
    project: t('nav.exampleProject'),
    role: user.value?.roles?.[0]?.name || t('nav.projectOwner'),
  },
])

async function logout() {
  if (isLoggingOut.value) return
  isLoggingOut.value = true

  try {
    if (authStore.getToken !== 'demo-token') {
      await authService.logout()
    }
  } catch {
    // Global axios interceptor already toasts API errors
  } finally {
    authStore.clearAuthUser()
    toast.success(t('auth.logoutDone'))
    router.push({ name: 'login-page' })
    isLoggingOut.value = false
  }
}
</script>

<template>
  <DropdownMenu v-if="user">
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        class="flex max-w-[240px] items-center gap-2 rounded-xl border border-border/80 bg-card px-2 py-1.5 text-start shadow-sm transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar class="size-8">
          <AvatarImage v-if="user.image_path" :src="user.image_path" :alt="user.name" />
          <AvatarFallback>{{ initials }}</AvatarFallback>
        </Avatar>

        <div class="hidden min-w-0 flex-1 text-start sm:block">
          <p class="truncate text-sm font-semibold leading-tight">{{ user.name }}</p>
          <p class="truncate text-[11px] text-muted-foreground">{{ packageLabel }}</p>
        </div>

        <ChevronDown class="hidden size-3.5 shrink-0 text-muted-foreground sm:block" />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-80 p-0" align="end">
      <div class="space-y-2 border-b px-3 py-3 text-start">
        <div class="flex items-start gap-3">
          <Avatar class="size-10">
            <AvatarImage v-if="user.image_path" :src="user.image_path" :alt="user.name" />
            <AvatarFallback>{{ initials }}</AvatarFallback>
          </Avatar>
          <div class="min-w-0 flex-1 text-start">
            <p class="truncate font-semibold">{{ user.name }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ user.email }}</p>
          </div>
        </div>

        <Badge variant="secondary" class="gap-1 font-normal">
          <Package class="size-3 shrink-0" />
          <span>{{ packageLabel }}</span>
        </Badge>
      </div>

      <DropdownMenuGroup class="p-1">
        <DropdownMenuLabel class="text-xs font-medium text-muted-foreground">
          {{ t('nav.myProjectRoles') }}
        </DropdownMenuLabel>

        <div
          v-for="entry in projectRoles"
          :key="entry.project"
          class="mx-1 mb-1 flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-2.5 py-2"
        >
          <div class="flex min-w-0 items-center gap-2">
            <Shield class="size-3.5 shrink-0 text-muted-foreground" />
            <span class="truncate text-sm">{{ entry.project }}</span>
          </div>
          <Badge class="shrink-0 font-normal">{{ entry.role }}</Badge>
        </div>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup class="p-1">
        <DropdownMenuItem class="gap-2">
          <Headset class="size-4 shrink-0 text-muted-foreground" />
          <span>{{ t('nav.techSupport') }}</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="gap-2">
          <LayoutDashboard class="size-4 shrink-0 text-muted-foreground" />
          <span>{{ t('nav.adminPanel') }}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
          :disabled="isLoggingOut"
          @select="logout"
        >
          <LogOut class="size-4 shrink-0" />
          <span>{{ t('auth.logout') }}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

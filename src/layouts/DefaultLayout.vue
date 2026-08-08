<script lang="ts" setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/layouts/components/AppSidebar.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/AuthStore'

const { getPermissions, getToken } = useAuthStore()
const isLoading = ref(true)

onMounted(async () => {
  try {
    if (getToken !== 'demo-token') await getPermissions()
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading" class="flex min-h-svh flex-col gap-4 p-4 sm:p-6">
    <Skeleton class="h-8 w-48 animate-pulse" />
    <Skeleton class="h-64 w-full animate-pulse" />
  </div>
  <div v-else class="flex h-svh w-full overflow-hidden">
    <AppSidebar />
    <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <AppHeader class="shrink-0" />
      <main class="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto p-3 sm:p-4 md:p-6">
        <RouterView v-slot="{ Component, route }">
          <Transition name="app-fade" mode="out-in">
            <div v-if="Component" :key="route.path" class="min-w-0">
              <component :is="Component" />
            </div>
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Filter, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const showFilter = defineModel<boolean>('showFilter', { default: false })

const emit = defineEmits<{
  (e: 'resetFilter'): void
  (e: 'applyFilter'): void
}>()

const { t } = useI18n()

watch(showFilter, (value) => {
  document.documentElement.classList.toggle('overflow-hidden', value)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('overflow-hidden')
})

function hideFilter() {
  showFilter.value = false
}

function resetFilter() {
  emit('resetFilter')
}

function applyFilter() {
  emit('applyFilter')
  hideFilter()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="filter-drawer">
      <div
        v-if="showFilter"
        class="filter-drawer fixed inset-0 z-50 flex justify-end bg-black/50"
        @click.self="hideFilter"
      >
        <aside
          class="filter-drawer__panel flex h-full w-full max-w-sm flex-col border-s bg-card text-card-foreground shadow-xl"
        >
          <div class="flex items-center gap-3 border-b px-4 py-3">
            <Filter class="size-4 text-muted-foreground" />
            <h3 class="me-auto text-sm font-semibold">{{ t('actions.filterResults') }}</h3>
            <Button variant="ghost" size="icon" @click="hideFilter">
              <X class="size-4" />
            </Button>
          </div>

          <div class="flex-1 space-y-4 overflow-y-auto p-4">
            <slot />
          </div>

          <div class="flex gap-2 border-t p-4">
            <Button variant="outline" class="flex-1" @click="resetFilter">
              {{ t('actions.resetFilter') }}
            </Button>
            <Button class="flex-1" @click="applyFilter">
              {{ t('actions.applyFilter') }}
            </Button>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

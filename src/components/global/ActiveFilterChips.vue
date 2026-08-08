<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface ActiveFilterChip {
  key: string
  label: string
  valueLabel: string
}

defineProps<{
  filters: ActiveFilterChip[]
}>()

const emit = defineEmits<{
  (e: 'remove', key: string): void
  (e: 'clear'): void
}>()

const { t } = useI18n()
</script>

<template>
  <div
    v-if="filters.length"
    class="mb-3 flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2"
  >
    <span class="text-xs font-medium text-muted-foreground">{{ t('actions.activeFilters') }}:</span>

    <Badge v-for="filter in filters" :key="filter.key" variant="secondary" class="gap-1 pe-1">
      <span class="text-xs">{{ filter.label }}: {{ filter.valueLabel }}</span>
      <button
        type="button"
        class="rounded-sm p-0.5 hover:bg-background/80"
        :aria-label="t('actions.removeFilter')"
        @click="emit('remove', filter.key)"
      >
        <X class="size-3" />
      </button>
    </Badge>

    <Button variant="ghost" size="sm" class="h-7 text-xs" @click="emit('clear')">
      {{ t('actions.clearFilters') }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import type { AppTableMeta } from '@/interfaces/Shared'
import { Button } from '@/components/ui/button'

const page = defineModel<number>('page', { required: true })
defineProps<{ meta?: AppTableMeta | null }>()

const { t } = useI18n()
</script>

<template>
  <div v-if="meta" class="flex items-center justify-between text-sm text-muted-foreground">
    <span>{{ t('pagination.pageOf', { current: meta.current_page, total: meta.last_page }) }}</span>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" :disabled="page <= 1" @click="page -= 1">
        {{ t('pagination.prev') }}
      </Button>
      <Button variant="outline" size="sm" :disabled="page >= meta.last_page" @click="page += 1">
        {{ t('pagination.next') }}
      </Button>
    </div>
  </div>
</template>

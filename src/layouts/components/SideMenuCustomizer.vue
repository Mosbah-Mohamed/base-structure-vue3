<script setup lang="ts">
import VueDraggable from 'vuedraggable'
import { Check, Eye, EyeOff, GripVertical, RotateCcw, Star } from 'lucide-vue-next'
import type { NavMenuItem } from '@/interfaces/Shared'
import { NAV_ICONS } from '@/lib/nav'
import { useNavStore } from '@/stores/NavStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const open = defineModel<boolean>('open', { default: false })

const { t } = useI18n()
const navStore = useNavStore()

const draftItems = ref<NavMenuItem[]>([])
const draftHidden = ref<string[]>([])
const draftFavorites = ref<string[]>([])

watch(open, (value) => {
  if (!value) return
  draftItems.value = [...(navStore.orderedItems as NavMenuItem[])]
  draftHidden.value = [...navStore.hidden]
  draftFavorites.value = [...navStore.favorites]
})

function isHidden(id: string) {
  return draftHidden.value.includes(id)
}

function isFavorite(id: string) {
  return draftFavorites.value.includes(id)
}

function toggleHidden(id: string) {
  draftHidden.value = isHidden(id)
    ? draftHidden.value.filter((value) => value !== id)
    : [...draftHidden.value, id]
}

function toggleFavorite(id: string) {
  draftFavorites.value = isFavorite(id)
    ? draftFavorites.value.filter((value) => value !== id)
    : [...draftFavorites.value, id]
}

function save() {
  navStore.$patch({
    order: draftItems.value.map((item) => item.id),
    hidden: [...draftHidden.value],
    favorites: [...draftFavorites.value],
  })
  navStore.persist()
  open.value = false
}

function resetDefaults() {
  navStore.reset()
  draftItems.value = [...(navStore.orderedItems as NavMenuItem[])]
  draftHidden.value = []
  draftFavorites.value = []
}
</script>

<template>
  <Teleport to="body">
    <Transition name="filter-drawer">
      <div
        v-if="open"
        class="filter-drawer fixed inset-0 z-50 flex justify-end bg-black/50"
        @click.self="open = false"
      >
        <aside
          class="filter-drawer__panel flex h-full w-full max-w-md flex-col border-s bg-card shadow-xl"
        >
          <div class="border-b px-4 py-3">
            <h3 class="text-sm font-semibold">{{ t('nav.customizeTitle') }}</h3>
            <p class="mt-1 text-xs text-muted-foreground">{{ t('nav.customizeHint') }}</p>
          </div>

          <div class="flex-1 overflow-y-auto p-3">
            <VueDraggable
              v-model="draftItems"
              item-key="id"
              :animation="180"
              handle=".nav-drag-handle"
              ghost-class="sortable-ghost"
              class="space-y-2"
            >
              <template #item="{ element: item }">
                <div
                  class="flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2.5 transition-colors"
                  :class="isHidden(item.id) && 'opacity-50'"
                >
                  <button
                    type="button"
                    class="text-muted-foreground hover:text-foreground"
                    :title="isHidden(item.id) ? t('nav.showItem') : t('nav.hideItem')"
                    @click="toggleHidden(item.id)"
                  >
                    <EyeOff v-if="isHidden(item.id)" class="size-4" />
                    <Eye v-else class="size-4" />
                  </button>

                  <button
                    type="button"
                    :class="
                      cn(
                        'hover:text-amber-400',
                        isFavorite(item.id) ? 'text-amber-400' : 'text-muted-foreground',
                      )
                    "
                    :title="t('nav.favorite')"
                    @click="toggleFavorite(item.id)"
                  >
                    <Star class="size-4" :fill="isFavorite(item.id) ? 'currentColor' : 'none'" />
                  </button>

                  <button
                    type="button"
                    class="nav-drag-handle cursor-grab text-muted-foreground active:cursor-grabbing"
                    :aria-label="t('actions.drag')"
                  >
                    <GripVertical class="size-4" />
                  </button>

                  <span class="me-auto truncate text-sm">{{ t(item.titleKey) }}</span>

                  <div class="rounded-lg bg-muted p-1.5">
                    <component :is="NAV_ICONS[item.icon]" class="size-4" />
                  </div>
                </div>
              </template>
            </VueDraggable>
          </div>

          <div class="space-y-2 border-t p-4">
            <Button variant="ghost" class="w-full justify-start gap-2" @click="resetDefaults">
              <RotateCcw class="size-4" />
              {{ t('nav.restoreDefault') }}
            </Button>
            <Button class="w-full gap-2" @click="save">
              <Check class="size-4" />
              {{ t('nav.done') }}
            </Button>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

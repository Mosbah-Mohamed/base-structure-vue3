<script setup lang="ts" generic="TItem extends object">
import VueDraggable from 'vuedraggable'
import { GripVertical } from 'lucide-vue-next'
import type { AppTableHeader, AppTableMeta, CardsColumns, ListViewMode } from '@/interfaces/Shared'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getNestedValue } from '@/composables/useFormField'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    headers: AppTableHeader[]
    items: TItem[]
    loading?: boolean
    itemKey?: string
    emptyText?: string
    meta?: AppTableMeta | null
    viewMode?: ListViewMode
    cardsColumns?: CardsColumns
    enableDrag?: boolean
    cardTitleKey?: string
    showSelect?: boolean
    selectedItems?: number[]
  }>(),
  {
    loading: false,
    itemKey: 'id',
    emptyText: '',
    meta: null,
    viewMode: 'table',
    cardsColumns: 3,
    enableDrag: false,
    cardTitleKey: '',
    showSelect: false,
    selectedItems: () => [],
  },
)

const emit = defineEmits<{
  (e: 'update:items', value: TItem[]): void
  (e: 'update:selectedItems', value: number[]): void
  (e: 'reorder', value: TItem[]): void
}>()

const { t } = useI18n()

const emptyLabel = computed(() => props.emptyText || t('messages.noData'))
const titleKey = computed(
  () => props.cardTitleKey || props.headers.find((h) => h.key !== 'actions')?.key || props.itemKey,
)

const localItems = computed({
  get: () => props.items,
  set: (value: TItem[]) => {
    emit('update:items', value)
    emit('reorder', value)
  },
})

const cardHeaders = computed(() =>
  props.headers.filter((header) => header.key !== 'actions' && !header.hideInCards),
)

const pageIds = computed(() =>
  props.items.map((item) => Number((item as Record<string, unknown>)[props.itemKey])),
)

const allSelected = computed(
  () => pageIds.value.length > 0 && pageIds.value.every((id) => props.selectedItems.includes(id)),
)

const someSelected = computed(
  () => pageIds.value.some((id) => props.selectedItems.includes(id)) && !allSelected.value,
)

const colSpan = computed(
  () => props.headers.length + (props.enableDrag ? 1 : 0) + (props.showSelect ? 1 : 0),
)

const cardsGridClass = computed(() => {
  const map: Record<CardsColumns, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }
  return map[props.cardsColumns]
})

function cellValue(item: TItem, key: string) {
  const value = getNestedValue(item as Record<string, unknown>, key)
  return value ?? '-'
}

function itemId(item: TItem) {
  return Number((item as Record<string, unknown>)[props.itemKey])
}

function isSelected(item: TItem) {
  return props.selectedItems.includes(itemId(item))
}

function toggleItem(item: TItem, checked: boolean) {
  const id = itemId(item)
  const next = checked
    ? [...new Set([...props.selectedItems, id])]
    : props.selectedItems.filter((value) => value !== id)
  emit('update:selectedItems', next)
}

function toggleAll(checked: boolean) {
  if (!checked) {
    emit(
      'update:selectedItems',
      props.selectedItems.filter((id) => !pageIds.value.includes(id)),
    )
    return
  }
  emit('update:selectedItems', [...new Set([...props.selectedItems, ...pageIds.value])])
}

function alignClass(align?: AppTableHeader['align']) {
  if (align === 'center') return 'text-center'
  if (align === 'end') return 'text-end'
  return 'text-start'
}

function onDragEnd() {
  emit('reorder', [...localItems.value])
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="space-y-2">
      <Skeleton v-for="n in 5" :key="n" class="h-11 w-full animate-pulse rounded-lg" />
    </div>

    <template v-else-if="viewMode === 'cards'">
      <VueDraggable
        v-model="localItems"
        :item-key="itemKey"
        :animation="180"
        :disabled="!enableDrag"
        handle=".row-drag-handle"
        ghost-class="sortable-ghost"
        drag-class="sortable-drag"
        :class="cn('grid gap-4', cardsGridClass)"
        tag="div"
        @end="onDragEnd"
      >
        <template #item="{ element: item }">
          <div
            class="group rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
            :class="isSelected(item) && 'border-primary/50 ring-1 ring-primary/30'"
          >
            <div class="mb-3 flex items-start gap-2">
              <Checkbox
                v-if="showSelect"
                class="mt-0.5"
                :checked="isSelected(item)"
                @update:checked="(value) => toggleItem(item, value)"
              />
              <button
                v-if="enableDrag"
                type="button"
                class="row-drag-handle mt-0.5 cursor-grab text-muted-foreground active:cursor-grabbing"
                :aria-label="t('actions.drag')"
              >
                <GripVertical class="size-4" />
              </button>
              <div class="min-w-0 flex-1">
                <slot name="card-title" :item="item">
                  <h4 class="truncate text-sm font-semibold">
                    {{ cellValue(item, titleKey) }}
                  </h4>
                </slot>
              </div>
              <div class="shrink-0">
                <slot name="item.actions" :item="item" />
              </div>
            </div>

            <div class="space-y-2.5 border-t pt-3">
              <div
                v-for="header in cardHeaders.filter((h) => h.key !== titleKey)"
                :key="header.key"
                class="flex items-start justify-between gap-3 text-sm"
              >
                <span class="text-xs font-medium text-muted-foreground">{{ header.title }}</span>
                <div :class="cn('text-end', alignClass(header.align))">
                  <slot :name="`item.${header.key}`" :item="item">
                    {{ cellValue(item, header.key) }}
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </template>
      </VueDraggable>

      <div
        v-if="!items.length"
        class="rounded-xl border border-dashed bg-muted/20 py-12 text-center text-sm text-muted-foreground"
      >
        {{ emptyLabel }}
      </div>
    </template>

    <div v-else class="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader class="border-b bg-muted/70">
          <TableRow class="border-b hover:bg-transparent">
            <TableHead v-if="showSelect" class="w-12 bg-muted/70">
              <Checkbox
                :checked="allSelected"
                :indeterminate="someSelected"
                @update:checked="toggleAll"
              />
            </TableHead>
            <TableHead v-if="enableDrag" class="w-10 bg-muted/70" />
            <TableHead
              v-for="header in headers"
              :key="header.key"
              :class="cn('bg-muted/70', alignClass(header.align))"
            >
              {{ header.title }}
            </TableHead>
          </TableRow>
        </TableHeader>

        <VueDraggable
          v-model="localItems"
          :item-key="itemKey"
          :animation="180"
          :disabled="!enableDrag"
          handle=".row-drag-handle"
          ghost-class="sortable-ghost"
          drag-class="sortable-drag"
          tag="tbody"
          class="[&_tr:last-child]:border-0"
          @end="onDragEnd"
        >
          <template #item="{ element: item }">
            <TableRow
              class="transition-colors duration-150 hover:bg-muted/40"
              :class="isSelected(item) && 'bg-primary/5'"
            >
              <TableCell v-if="showSelect" class="w-12">
                <Checkbox
                  :checked="isSelected(item)"
                  @update:checked="(value) => toggleItem(item, value)"
                />
              </TableCell>
              <TableCell v-if="enableDrag" class="w-10">
                <button
                  type="button"
                  class="row-drag-handle cursor-grab text-muted-foreground active:cursor-grabbing"
                  :aria-label="t('actions.drag')"
                >
                  <GripVertical class="size-4" />
                </button>
              </TableCell>
              <TableCell
                v-for="header in headers"
                :key="header.key"
                :class="alignClass(header.align)"
              >
                <slot :name="`item.${header.key}`" :item="item">
                  {{ cellValue(item, header.key) }}
                </slot>
              </TableCell>
            </TableRow>
          </template>
        </VueDraggable>

        <TableBody v-if="!items.length">
          <TableRow class="hover:bg-transparent">
            <TableCell :colspan="colSpan" class="py-12 text-center text-muted-foreground">
              {{ emptyLabel }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <slot name="bottom" :meta="meta" />
  </div>
</template>

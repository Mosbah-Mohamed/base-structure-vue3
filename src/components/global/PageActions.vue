<script setup lang="ts">
import {
  Ban,
  CheckSquare,
  ChevronDown,
  Columns3,
  Filter,
  FilterX,
  LayoutGrid,
  Plus,
  RefreshCw,
  Search,
  Table2,
  Trash2,
  Wrench,
  X,
} from 'lucide-vue-next'
import { watchDebounced } from '@vueuse/core'
import { toast } from 'vue-sonner'
import type { CardsColumns, ListViewMode, PageActionsProps } from '@/interfaces/Shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { sharedService } from '@/services/SharedService'
import { isHandledApiError } from '@/lib/apiError'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<PageActionsProps>(), {
  perPageOptions: () => [10, 20, 50, 100],
  pageActionsButtons: () => [],
  showMultiDelete: false,
  showMultiActivate: false,
  showSearch: true,
  searchDebounceMs: 400,
  selectedItems: () => [],
  itemsPerPage: 20,
  search: '',
  model: '',
  column_multi_activate: 'is_active',
  showFilter: false,
  filterActive: false,
  showViewToggle: false,
  viewMode: 'table',
  cardsColumns: 3,
  collapsible: true,
  defaultOpen: true,
})

const emit = defineEmits<{
  (e: 'update:itemsPerPage', value: number): void
  (e: 'update:search', value: string): void
  (e: 'update:viewMode', value: ListViewMode): void
  (e: 'update:cardsColumns', value: CardsColumns): void
  (e: 'reloadData'): void
  (e: 'openFilter'): void
}>()

const { t } = useI18n()
const searchText = ref(props.search ?? '')
const toolsOpen = ref(props.defaultOpen)
const confirmModal = ref<{
  confirm: (options?: { title?: string; description?: string }) => Promise<boolean>
}>()
const isBusy = ref(false)

const bulkService = computed(() => props.bulkService ?? sharedService)
const cardsColumnOptions: CardsColumns[] = [1, 2, 3, 4]

const visibleActions = computed(() =>
  props.pageActionsButtons.filter((item) => item.show !== false),
)

const primaryActions = computed(() =>
  visibleActions.value.filter((item) => item.icon === 'create' || !item.icon),
)

const secondaryActions = computed(() =>
  visibleActions.value.filter((item) => item.icon && item.icon !== 'create'),
)

const hasBulkSelection = computed(
  () => props.selectedItems.length > 0 && (props.showMultiDelete || props.showMultiActivate),
)

watch(
  () => props.search,
  (value: string | undefined) => {
    if (value !== undefined && value !== searchText.value) searchText.value = value
  },
)

watchDebounced(
  searchText,
  (value) => {
    if (value === (props.search ?? '')) return
    emit('update:search', value)
  },
  { debounce: props.searchDebounceMs },
)

function applySearchNow() {
  if (searchText.value === (props.search ?? '')) return
  emit('update:search', searchText.value)
}

function onItemsPerPageChange(value: unknown) {
  emit('update:itemsPerPage', Number(value))
}

function onCardsColumnsChange(value: unknown) {
  emit('update:cardsColumns', Number(value) as CardsColumns)
}

function toggleViewMode() {
  emit('update:viewMode', props.viewMode === 'table' ? 'cards' : 'table')
}

async function runBulk(operation: 'delete' | 'activate' | 'deactivate') {
  const service = bulkService.value
  if (!service) {
    toast.error(t('messages.bulkServiceMissing'))
    return
  }

  const questions = {
    delete: t('messages.bulkDeleteConfirm'),
    activate: t('messages.bulkActivateConfirm'),
    deactivate: t('messages.bulkDeactivateConfirm'),
  }

  const confirmed = await confirmModal.value?.confirm({
    title: t('actions.confirmDelete'),
    description: questions[operation],
  })
  if (!confirmed) return

  isBusy.value = true
  try {
    if (operation === 'delete') {
      const res = await service.deleteBulk({
        model: props.model || '',
        ids: props.selectedItems,
      })
      toast.success(res.data.message || t('messages.deleted'))
    } else {
      const res = await service.toggleActivationBulk({
        model: props.model || '',
        ids: props.selectedItems,
        action: operation === 'activate' ? 1 : 0,
        column: props.column_multi_activate,
      })
      toast.success(res.data.message || t('messages.saved'))
    }
    emit('reloadData')
  } catch (error) {
    if (!isHandledApiError(error)) {
      toast.error(t('messages.bulkFailed'))
    }
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <ConfirmModal ref="confirmModal" />

  <div class="mb-4 space-y-3">
    <Collapsible
      v-if="collapsible"
      v-model:open="toolsOpen"
      class="overflow-hidden rounded-xl border bg-card shadow-sm"
    >
      <!-- Always-visible bar: title + primary actions -->
      <div class="flex items-center gap-2 px-3 py-2.5">
        <CollapsibleTrigger as-child>
          <Button
            variant="ghost"
            size="sm"
            class="h-8 gap-2 px-2 text-muted-foreground hover:text-foreground"
            :title="toolsOpen ? t('actions.collapseTools') : t('actions.expandTools')"
          >
            <Wrench class="size-4" />
            <span class="text-sm font-medium text-foreground">{{ t('actions.tableTools') }}</span>
            <ChevronDown
              class="size-4 transition-transform duration-200"
              :class="toolsOpen && 'rotate-180'"
            />
          </Button>
        </CollapsibleTrigger>

        <div class="ms-auto flex shrink-0 items-center gap-2">
          <Button
            v-if="showFilter"
            variant="outline"
            size="icon"
            class="size-8"
            :title="t('actions.filter')"
            :class="cn(filterActive && 'border-primary text-primary')"
            @click="emit('openFilter')"
          >
            <FilterX v-if="filterActive" class="size-4" />
            <Filter v-else class="size-4" />
          </Button>

          <Button
            v-for="(action, index) in primaryActions"
            :key="`primary-${index}`"
            size="sm"
            class="h-8 gap-1.5"
            @click="action.handler?.()"
          >
            <Plus class="size-4" />
            <span v-if="action.label">{{ action.label }}</span>
          </Button>
        </div>
      </div>

      <!-- Expanded tools: stacked search + compact control row -->
      <CollapsibleContent>
        <div class="space-y-3 border-t px-3 py-3">
          <div v-if="showSearch" class="relative">
            <Search class="absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              v-model="searchText"
              class="h-9 ps-9"
              :placeholder="t('actions.search')"
              @keyup.enter="applySearchNow"
            />
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <Select
              :model-value="String(itemsPerPage)"
              @update:model-value="onItemsPerPageChange"
            >
              <SelectTrigger class="h-8 w-[4.5rem]" :title="t('actions.perPage')">
                <SelectValue :placeholder="String(itemsPerPage)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in perPageOptions"
                  :key="option"
                  :value="String(option)"
                >
                  {{ option }}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              class="size-8"
              :title="t('actions.reload')"
              @click="emit('reloadData')"
            >
              <RefreshCw class="size-4" />
            </Button>

            <Button
              v-if="showViewToggle"
              variant="outline"
              size="icon"
              class="size-8"
              :title="viewMode === 'table' ? t('actions.cardsView') : t('actions.tableView')"
              :class="cn(viewMode === 'cards' && 'border-primary text-primary')"
              @click="toggleViewMode"
            >
              <LayoutGrid v-if="viewMode === 'table'" class="size-4" />
              <Table2 v-else class="size-4" />
            </Button>

            <Select
              v-if="showViewToggle && viewMode === 'cards'"
              :model-value="String(cardsColumns)"
              @update:model-value="onCardsColumnsChange"
            >
              <SelectTrigger class="h-8 w-[7.5rem]" :title="t('actions.cardsColumns')">
                <Columns3 class="me-1.5 size-3.5 shrink-0 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in cardsColumnOptions"
                  :key="option"
                  :value="String(option)"
                >
                  {{ t('actions.cardsColumnsCount', { count: option }) }}
                </SelectItem>
              </SelectContent>
            </Select>

            <div
              v-if="secondaryActions.length"
              class="ms-auto flex flex-wrap items-center gap-2"
            >
              <Button
                v-for="(action, index) in secondaryActions"
                :key="`secondary-${index}`"
                variant="outline"
                size="sm"
                class="h-8 gap-1.5"
                @click="action.handler?.()"
              >
                <Filter v-if="action.icon === 'filter'" class="size-4" />
                <X v-else-if="action.icon === 'reset'" class="size-4" />
                <span v-if="action.label">{{ action.label }}</span>
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>

    <!-- Flat toolbar (no collapse) -->
    <div
      v-else
      class="space-y-3 rounded-xl border bg-card p-3 shadow-sm"
    >
      <div class="flex flex-wrap items-center gap-2">
        <div v-if="showSearch" class="relative min-w-[12rem] flex-1">
          <Search class="absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            v-model="searchText"
            class="h-9 ps-9"
            :placeholder="t('actions.search')"
            @keyup.enter="applySearchNow"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <Select
            :model-value="String(itemsPerPage)"
            @update:model-value="onItemsPerPageChange"
          >
            <SelectTrigger class="h-8 w-[4.5rem]" :title="t('actions.perPage')">
              <SelectValue :placeholder="String(itemsPerPage)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="option in perPageOptions"
                :key="option"
                :value="String(option)"
              >
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            class="size-8"
            :title="t('actions.reload')"
            @click="emit('reloadData')"
          >
            <RefreshCw class="size-4" />
          </Button>

          <Button
            v-if="showViewToggle"
            variant="outline"
            size="icon"
            class="size-8"
            :title="viewMode === 'table' ? t('actions.cardsView') : t('actions.tableView')"
            :class="cn(viewMode === 'cards' && 'border-primary text-primary')"
            @click="toggleViewMode"
          >
            <LayoutGrid v-if="viewMode === 'table'" class="size-4" />
            <Table2 v-else class="size-4" />
          </Button>

          <Select
            v-if="showViewToggle && viewMode === 'cards'"
            :model-value="String(cardsColumns)"
            @update:model-value="onCardsColumnsChange"
          >
            <SelectTrigger class="h-8 w-[7.5rem]" :title="t('actions.cardsColumns')">
              <Columns3 class="me-1.5 size-3.5 shrink-0 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="option in cardsColumnOptions"
                :key="option"
                :value="String(option)"
              >
                {{ t('actions.cardsColumnsCount', { count: option }) }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            v-if="showFilter"
            variant="outline"
            size="icon"
            class="size-8"
            :title="t('actions.filter')"
            :class="cn(filterActive && 'border-primary text-primary')"
            @click="emit('openFilter')"
          >
            <FilterX v-if="filterActive" class="size-4" />
            <Filter v-else class="size-4" />
          </Button>

          <Button
            v-for="(action, index) in visibleActions"
            :key="index"
            :variant="action.icon === 'reset' || action.icon === 'filter' ? 'outline' : 'default'"
            size="sm"
            class="h-8 gap-1.5"
            @click="action.handler?.()"
          >
            <Filter v-if="action.icon === 'filter'" class="size-4" />
            <Plus v-else-if="!action.icon || action.icon === 'create'" class="size-4" />
            <X v-else-if="action.icon === 'reset'" class="size-4" />
            <span v-if="action.label">{{ action.label }}</span>
          </Button>
        </div>
      </div>
    </div>

    <Transition name="app-fade">
      <div
        v-if="hasBulkSelection"
        class="flex flex-wrap items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2"
      >
        <span class="me-auto text-sm text-muted-foreground">
          {{ t('actions.selectedCount', { count: selectedItems.length }) }}
        </span>

        <Button
          v-if="showMultiActivate"
          variant="outline"
          size="sm"
          class="h-8 gap-1.5"
          :disabled="isBusy"
          @click="runBulk('activate')"
        >
          <CheckSquare class="size-4" />
          {{ t('actions.activateSelected') }}
        </Button>

        <Button
          v-if="showMultiActivate"
          variant="outline"
          size="sm"
          class="h-8 gap-1.5"
          :disabled="isBusy"
          @click="runBulk('deactivate')"
        >
          <Ban class="size-4" />
          {{ t('actions.deactivateSelected') }}
        </Button>

        <Button
          v-if="showMultiDelete"
          variant="destructive"
          size="sm"
          class="h-8 gap-1.5"
          :disabled="isBusy"
          @click="runBulk('delete')"
        >
          <Trash2 class="size-4" />
          {{ t('actions.deleteSelected') }}
        </Button>
      </div>
    </Transition>
  </div>
</template>

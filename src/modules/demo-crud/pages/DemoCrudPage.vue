<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Pencil, RotateCcw, Trash2 } from 'lucide-vue-next'
import { formatDate } from '@/lib/format'
import type { CardsColumns, ListViewMode } from '@/interfaces/Shared'
import type { DemoItem } from '../interfaces/DemoItem'
import {
  buildDemoFilterChips,
  EMPTY_DEMO_FILTERS,
  getDemoTableHeaders,
  type DemoFilters,
} from '../constants/demoCrud'
import { useDeleteDemoItemMutation, useDemoItemsQuery } from '../composables/useDemoCrud'
import { reorderDemoItems, resetDemoItems } from '../services/demoCrudStore'
import { demoCrudService } from '../services/DemoCrudService'
import DemoItemFormModal from '../modals/DemoItemFormModal.vue'
import DemoCrudFilter from '../components/DemoCrudFilter.vue'

const { locale, t } = useI18n()
const showFilter = ref(false)
const viewMode = ref<ListViewMode>('table')
const cardsColumns = ref<CardsColumns>(3)
const filters = reactive<DemoFilters>({ ...EMPTY_DEMO_FILTERS })
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  ...EMPTY_DEMO_FILTERS,
})

const { data, isLoading, isFetching, isError, error, refetch } = useDemoItemsQuery(params)
const deleteMutation = useDeleteDemoItemMutation()

const {
  showFormModal,
  formAction,
  activeItem,
  selectedItems,
  confirmModal,
  showCreateModal,
  showEditModal,
  createPageAction,
  deleteWithConfirm,
  onReloadData,
} = UseCrudPage<DemoItem>()

const bulkService = {
  deleteBulk: demoCrudService.deleteBulk,
  toggleActivationBulk: demoCrudService.toggleActivationBulk,
}

const tableItems = ref<DemoItem[]>([])
watch(
  () => data.value?.data,
  (rows) => {
    tableItems.value = rows ? [...rows] : []
  },
  { immediate: true },
)

const meta = computed(() => data.value?.meta ?? null)
const headers = computed(() => getDemoTableHeaders(t))
const activeFilterChips = computed(() => buildDemoFilterChips(filters, t))
const filterActive = computed(() => activeFilterChips.value.length > 0)
const pageActionsButtons = computed(() => [
  createPageAction(showCreateModal),
  {
    label: t('demoCrud.resetData'),
    show: true,
    icon: 'reset',
    handler: resetSeedData,
  },
])

function applyFilters(next: DemoFilters) {
  params.priority = next.priority
  params.is_active = next.is_active
  params.page = 1
  refetch()
}

function resetFilters() {
  Object.assign(filters, EMPTY_DEMO_FILTERS)
  applyFilters(filters)
}

function removeFilterChip(key: string) {
  if (key === 'priority' || key === 'is_active') filters[key] = ''
  applyFilters(filters)
}

function onReorder(items: DemoItem[]) {
  tableItems.value = items
  reorderDemoItems(items.map((item) => item.id))
  toast.success(t('messages.reordered'))
}

function deleteItem(item: DemoItem) {
  deleteWithConfirm(item, deleteMutation.mutate.bind(deleteMutation), () => {
    if (tableItems.value.length <= 1 && params.page > 1) params.page -= 1
  })
}

function resetSeedData() {
  resetDemoItems()
  params.page = 1
  params.keyword = ''
  Object.assign(params, EMPTY_DEMO_FILTERS)
  Object.assign(filters, EMPTY_DEMO_FILTERS)
  selectedItems.value = []
  refetch()
  toast.success(t('demoCrud.resetDone'))
}
</script>

<template>
  <div>
    <ConfirmModal ref="confirmModal" />

    <DemoCrudFilter
      v-model="filters"
      v-model:show-filter="showFilter"
      @apply-filter="applyFilters"
      @reset-filter="resetFilters"
    />

    <DemoItemFormModal
      v-if="showFormModal"
      v-model:show-modal="showFormModal"
      :form-action="formAction"
      :active-item="activeItem"
      @saved="refetch()"
    />

    <Card class="animate-in fade-in duration-300">
      <CardHeader class="gap-2">
        <CardTitle>{{ t('modules.demoCrud') }}</CardTitle>
        <CardDescription>{{ t('demoCrud.subtitle') }}</CardDescription>
      </CardHeader>

      <CardContent>
        <PageActions
          v-model:view-mode="viewMode"
          v-model:cards-columns="cardsColumns"
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          :search="params.keyword"
          :show-search="true"
          :show-filter="true"
          :filter-active="filterActive"
          :show-view-toggle="true"
          :show-multi-delete="true"
          :show-multi-activate="true"
          :selected-items="selectedItems"
          model="demo_items"
          :bulk-service="bulkService"
          @update:items-per-page="
            (value: number) => {
              params.itemPerPage = value
              params.page = 1
            }
          "
          @update:search="
            (value: string) => {
              params.keyword = value
              params.page = 1
            }
          "
          @reload-data="onReloadData(() => refetch())"
          @open-filter="showFilter = true"
        />

        <ActiveFilterChips
          :filters="activeFilterChips"
          @remove="removeFilterChip"
          @clear="resetFilters"
        />

        <div
          v-if="isError"
          class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
        >
          <p class="text-sm text-destructive">
            {{ (error as Error)?.message || t('messages.loadFailed') }}
          </p>
          <Button variant="outline" class="gap-2" @click="refetch()">
            <RotateCcw class="size-4" />
            {{ t('actions.retry') }}
          </Button>
        </div>

        <AppDataTable
          v-else
          v-model:items="tableItems"
          v-model:selected-items="selectedItems"
          :headers="headers"
          :loading="isLoading || isFetching"
          :meta="meta"
          :view-mode="viewMode"
          :cards-columns="cardsColumns"
          :enable-drag="true"
          :show-select="true"
          card-title-key="title.en"
          @reorder="onReorder"
        >
          <template #card-title="{ item }">
            <h4 class="truncate text-sm font-semibold">
              {{ (item as DemoItem).title.en }}
              <span class="ms-1 text-xs font-normal text-muted-foreground">
                ({{ (item as DemoItem).title.ar }})
              </span>
            </h4>
          </template>

          <template #item.priority="{ item }">
            <Badge
              :variant="
                (item as DemoItem).priority === 'high'
                  ? 'destructive'
                  : (item as DemoItem).priority === 'medium'
                    ? 'default'
                    : 'secondary'
              "
            >
              {{ t(`demoCrud.priority.${(item as DemoItem).priority}`) }}
            </Badge>
          </template>

          <template #item.is_active="{ item }">
            <Badge :variant="(item as DemoItem).is_active ? 'default' : 'outline'">
              {{ (item as DemoItem).is_active ? t('status.active') : t('status.inactive') }}
            </Badge>
          </template>

          <template #item.created_at="{ item }">
            {{ formatDate(String((item as DemoItem).created_at), locale) }}
          </template>

          <template #item.actions="{ item }">
            <div class="flex justify-center gap-1">
              <Button variant="ghost" size="icon" @click="showEditModal(item as DemoItem)">
                <Pencil class="size-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="deleteItem(item as DemoItem)">
                <Trash2 class="size-4 text-destructive" />
              </Button>
            </div>
          </template>

          <template #bottom>
            <PagePagination v-model:page="params.page" :meta="meta" />
          </template>
        </AppDataTable>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import {
  EMPTY_DEMO_FILTERS,
  getDemoPriorityOptions,
  getDemoStatusFilterOptions,
  type DemoFilters,
} from '../constants/demoCrud'

defineOptions({ name: 'DemoCrudFilter' })

const props = defineProps<{
  showFilter: boolean
  modelValue: DemoFilters
}>()

const emit = defineEmits<{
  (e: 'update:showFilter', value: boolean): void
  (e: 'update:modelValue', value: DemoFilters): void
  (e: 'applyFilter', value: DemoFilters): void
  (e: 'resetFilter'): void
}>()

const { t } = useI18n()
const showFilter = useVModel(props, 'showFilter', emit)
const filters = useVModel(props, 'modelValue', emit)

const priorityOptions = computed(() => getDemoPriorityOptions(t, true))
const statusOptions = computed(() => getDemoStatusFilterOptions(t))
const draft = reactive<DemoFilters>({ ...props.modelValue })

watch(
  () => props.showFilter,
  (open) => {
    if (open) Object.assign(draft, props.modelValue)
  },
)

function applyFilter() {
  const next = { ...draft }
  filters.value = next
  emit('applyFilter', next)
}

function resetFilter() {
  Object.assign(draft, EMPTY_DEMO_FILTERS)
  filters.value = { ...EMPTY_DEMO_FILTERS }
  emit('resetFilter')
}
</script>

<template>
  <FilterSideBar
    v-model:show-filter="showFilter"
    @apply-filter="applyFilter"
    @reset-filter="resetFilter"
  >
    <div class="space-y-4">
      <AppSelect
        v-model="draft.priority"
        name="filter.priority"
        :label="t('fields.priority')"
        :options="priorityOptions"
      />
      <AppSelect
        v-model="draft.is_active"
        name="filter.is_active"
        :label="t('fields.status')"
        :options="statusOptions"
      />
    </div>
  </FilterSideBar>
</template>

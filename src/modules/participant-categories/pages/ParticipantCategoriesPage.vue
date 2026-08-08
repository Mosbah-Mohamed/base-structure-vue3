<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next'
import { formatDate } from '@/lib/format'
import { useAuthStore } from '@/stores/AuthStore'
import type { ParticipantCategory } from '../interfaces/ParticipantCategory'
import {
  getParticipantTableHeaders,
  getParticipantTypeLabel,
} from '../constants/participantCategories'
import ParticipantCategoryFormModal from '../modals/ParticipantCategoryFormModal.vue'
import {
  useDeleteParticipantCategoryMutation,
  useParticipantCategoriesQuery,
} from '../composables/useParticipantCategories'

const { locale, t } = useI18n()
const { hasPermission } = useAuthStore()

const params = reactive({
  page: 1,
  itemPerPage: 20,
  keyword: '',
})

const { data, isLoading, isFetching, refetch } = useParticipantCategoriesQuery(params)
const deleteMutation = useDeleteParticipantCategoryMutation()

const {
  showFormModal,
  formAction,
  activeItem,
  confirmModal,
  showCreateModal,
  showEditModal,
  createPageAction,
  deleteWithConfirm,
} = UseCrudPage<ParticipantCategory>()

const permissions = computed(() => ({
  create: hasPermission('create_participant_category'),
  edit: hasPermission('update_participant_category'),
  delete: hasPermission('delete_participant_category'),
}))

const items = computed(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta ?? null)
const headers = computed(() => getParticipantTableHeaders(t))
const pageActionsButtons = computed(() => [
  createPageAction(showCreateModal, permissions.value.create),
])
</script>

<template>
  <div>
    <ConfirmModal ref="confirmModal" />

    <ParticipantCategoryFormModal
      v-if="showFormModal"
      v-model:show-modal="showFormModal"
      :form-action="formAction"
      :active-item="activeItem"
      @saved="refetch()"
    />

    <Card>
      <CardHeader>
        <CardTitle>{{ t('modules.participantCategories') }}</CardTitle>
      </CardHeader>

      <CardContent>
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          :search="params.keyword"
          :show-search="true"
          @update:items-per-page="(value: number) => (params.itemPerPage = value)"
          @update:search="
            (value: string) => {
              params.keyword = value
              params.page = 1
            }
          "
          @reload-data="refetch()"
        />

        <AppDataTable
          :headers="headers"
          :items="items"
          :loading="isLoading || isFetching"
          :meta="meta"
        >
          <template #item.type="{ item }">
            <Badge variant="secondary">
              {{ getParticipantTypeLabel(String(item.type), t) }}
            </Badge>
          </template>

          <template #item.is_active="{ item }">
            <Badge :variant="item.is_active ? 'default' : 'outline'">
              {{ item.is_active ? t('status.active') : t('status.inactive') }}
            </Badge>
          </template>

          <template #item.created_at="{ item }">
            {{ formatDate(String(item.created_at), locale) }}
          </template>

          <template #item.actions="{ item }">
            <div class="flex justify-center gap-1">
              <Button
                v-if="permissions.edit"
                variant="ghost"
                size="icon"
                @click="showEditModal(item as ParticipantCategory)"
              >
                <Pencil class="size-4" />
              </Button>
              <Button
                v-if="permissions.delete"
                variant="ghost"
                size="icon"
                @click="
                  deleteWithConfirm(
                    item as ParticipantCategory,
                    deleteMutation.mutate.bind(deleteMutation),
                  )
                "
              >
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

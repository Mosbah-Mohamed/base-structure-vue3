import { toast } from 'vue-sonner'
import type { FormActionType } from '@/interfaces/Forms'
import type { pageAction } from '@/interfaces/Shared'
import type { ApiMessageResponse } from '@/lib/query/createCrudQueries'

export function UseCrudPage<T extends { id: number }>() {
  const { t } = useI18n()
  const showFormModal = ref(false)
  const formAction = ref<FormActionType>('create')
  const activeItem = ref<T | null>(null)
  const selectedItems = ref<number[]>([])
  const confirmModal = ref<{
    confirm: (options?: { title?: string; description?: string }) => Promise<boolean>
  }>()

  function showCreateModal() {
    formAction.value = 'create'
    activeItem.value = null
    showFormModal.value = true
  }

  function showEditModal(item: T) {
    formAction.value = 'edit'
    activeItem.value = item
    showFormModal.value = true
  }

  async function showConfirmDelete(options?: { title?: string; description?: string }) {
    return (
      (await confirmModal.value?.confirm({
        title: options?.title ?? t('actions.confirmDelete'),
        description: options?.description ?? t('messages.deleteConfirm'),
      })) ?? false
    )
  }

  function createPageAction(handler: () => void, show = true): pageAction {
    return {
      label: t('actions.create'),
      show,
      icon: 'create',
      handler,
    }
  }

  async function deleteWithConfirm(
    item: T,
    mutate: (id: number, options?: { onSuccess?: (res: ApiMessageResponse) => void }) => void,
    afterSuccess?: () => void,
  ) {
    const confirmed = await showConfirmDelete()
    if (!confirmed) return

    mutate(item.id, {
      onSuccess: (res) => {
        toast.success(res?.message || t('messages.deleted'))
        afterSuccess?.()
      },
    })
  }

  function clearSelection() {
    selectedItems.value = []
  }

  function onReloadData(reload?: () => void) {
    reload?.()
    clearSelection()
  }

  return {
    showFormModal,
    formAction,
    activeItem,
    selectedItems,
    confirmModal,
    showCreateModal,
    showEditModal,
    showConfirmDelete,
    createPageAction,
    deleteWithConfirm,
    clearSelection,
    onReloadData,
  }
}

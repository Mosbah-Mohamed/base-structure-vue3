import { toast } from 'vue-sonner'
import { useVModel } from '@vueuse/core'
import { cloneItem } from '@/helpers'
import type { FormModalProps } from '@/interfaces/Forms'

type FormModalEmit = {
  (e: 'update:showModal', value: boolean): void
  (e: 'saved'): void
}

/**
 * Shared form-modal wiring: v-model open, reset on open, validate + mutate handlers.
 * Errors are handled globally (axios interceptor / Vue Query MutationCache).
 */
export function useFormModal<TForm extends object>(
  props: FormModalProps,
  emit: FormModalEmit,
  emptyForm: () => TForm,
) {
  const { t } = useI18n()
  const showModal = useVModel(props, 'showModal', emit)
  const formRef = ref<{ validate: () => Promise<{ valid: boolean }> }>()
  const isLoading = ref(false)
  const formData = reactive(emptyForm()) as TForm

  const formTitle = computed(() =>
    props.formAction === 'create' ? t('actions.create') : t('actions.edit'),
  )

  watch(
    () => props.showModal,
    (open) => {
      if (!open) return
      if (props.activeItem) {
        Object.assign(formData, cloneItem(props.activeItem))
      } else {
        Object.assign(formData, emptyForm())
      }
    },
  )

  function submitWith(
    run: (handlers: {
      onSuccess: (res: { message?: string }) => void
      onSettled: () => void
    }) => void,
  ) {
    formRef.value?.validate().then(({ valid }) => {
      if (!valid) return

      isLoading.value = true
      run({
        onSuccess: (res) => {
          toast.success(res?.message || t('messages.saved'))
          showModal.value = false
          emit('saved')
        },
        onSettled: () => {
          isLoading.value = false
        },
      })
    })
  }

  return {
    t,
    showModal,
    formRef,
    isLoading,
    formData,
    formTitle,
    submitWith,
  }
}

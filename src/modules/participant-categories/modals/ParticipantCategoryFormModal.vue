<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import type { FormModalProps } from '@/interfaces/Forms'
import type { ParticipantCategory } from '../interfaces/ParticipantCategory'
import {
  emptyParticipantCategoryForm,
  getParticipantTypeOptions,
} from '../constants/participantCategories'
import { participantCategorySchema } from '../schemas/participantCategorySchema'
import {
  useCreateParticipantCategoryMutation,
  useUpdateParticipantCategoryMutation,
} from '../composables/useParticipantCategories'

const props = withDefaults(defineProps<FormModalProps>(), {
  showModal: false,
  formAction: 'create',
})

const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'saved'): void
}>()

const { t, showModal, formRef, isLoading, formData, formTitle, submitWith } = useFormModal(
  props,
  emit,
  emptyParticipantCategoryForm,
)

const validationSchema = toTypedSchema(participantCategorySchema)
const createMutation = useCreateParticipantCategoryMutation()
const updateMutation = useUpdateParticipantCategoryMutation()
const typeOptions = computed(() => getParticipantTypeOptions(t))

function submit() {
  submitWith((handlers) => {
    if (props.formAction === 'create') {
      createMutation.mutate({ ...formData }, handlers)
    } else {
      updateMutation.mutate({ ...(formData as ParticipantCategory), id: formData.id! }, handlers)
    }
  })
}
</script>

<template>
  <Dialog v-model:open="showModal">
    <DialogContent class="max-w-xl">
      <DialogHeader>
        <DialogTitle>{{ formTitle }}</DialogTitle>
      </DialogHeader>

      <VeeForm
        ref="formRef"
        v-slot="{ meta }"
        :validation-schema="validationSchema"
        @submit="submit"
      >
        <div class="grid gap-4 py-2">
          <div class="grid gap-4 sm:grid-cols-2">
            <AppTextField v-model="formData.name.ar" name="name.ar" :label="t('fields.nameAr')" />
            <AppTextField v-model="formData.name.en" name="name.en" :label="t('fields.nameEn')" />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <AppSelect
              v-model="formData.type"
              name="type"
              :label="t('fields.type')"
              :options="typeOptions"
            />
            <div class="space-y-2">
              <AppTextField v-model="formData.color" name="color" :label="t('fields.color')" />
              <input v-model="formData.color" type="color" class="size-10 rounded border-0" />
            </div>
          </div>

          <AppSwitch v-model="formData.is_active" name="is_active" :label="t('status.active')" />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="showModal = false">
            {{ t('actions.cancel') }}
          </Button>
          <Button type="button" :disabled="!meta.valid || isLoading" @click="submit">
            {{ props.formAction === 'create' ? t('actions.create') : t('actions.save') }}
          </Button>
        </DialogFooter>
      </VeeForm>
    </DialogContent>
  </Dialog>
</template>

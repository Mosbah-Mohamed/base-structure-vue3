<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import type { FormModalProps } from '@/interfaces/Forms'
import type { DemoItem, DemoItemBase, DemoPriority } from '../interfaces/DemoItem'
import { emptyDemoForm, getDemoPriorityOptions } from '../constants/demoCrud'
import { demoItemSchema } from '../schemas/demoItemSchema'
import { useCreateDemoItemMutation, useUpdateDemoItemMutation } from '../composables/useDemoCrud'

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
  emptyDemoForm,
)

const validationSchema = toTypedSchema(demoItemSchema)
const createMutation = useCreateDemoItemMutation()
const updateMutation = useUpdateDemoItemMutation()
const priorityOptions = computed(() => getDemoPriorityOptions(t))

function submit() {
  submitWith((handlers) => {
    const payload: DemoItemBase = {
      title: { ...formData.title },
      description: formData.description,
      email: formData.email,
      priority: formData.priority as DemoPriority,
      is_active: formData.is_active,
      id: formData.id,
    }

    if (props.formAction === 'create') {
      createMutation.mutate(payload, handlers)
    } else {
      updateMutation.mutate({ ...(payload as DemoItem), id: formData.id! }, handlers)
    }
  })
}
</script>

<template>
  <Dialog v-model:open="showModal">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{{ formTitle }}</DialogTitle>
      </DialogHeader>

      <VeeForm
        ref="formRef"
        v-slot="{ meta }"
        :validation-schema="validationSchema"
        @submit="submit"
      >
        <div class="grid max-h-[70vh] gap-4 overflow-y-auto py-2 pe-1">
          <div class="grid gap-4 sm:grid-cols-2">
            <AppTextField v-model="formData.title.ar" name="title.ar" :label="t('fields.nameAr')" />
            <AppTextField v-model="formData.title.en" name="title.en" :label="t('fields.nameEn')" />
          </div>

          <AppTextField
            v-model="formData.email"
            name="email"
            type="email"
            :label="t('fields.email')"
          />

          <AppTextarea
            v-model="formData.description"
            name="description"
            :label="t('fields.description')"
          />

          <div class="grid gap-4 sm:grid-cols-2">
            <AppSelect
              v-model="formData.priority"
              name="priority"
              :label="t('fields.priority')"
              :options="priorityOptions"
            />
            <AppSwitch v-model="formData.is_active" name="is_active" :label="t('status.active')" />
          </div>
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

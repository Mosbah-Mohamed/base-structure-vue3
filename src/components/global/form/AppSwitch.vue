<script setup lang="ts">
import type { FormSwitchProps } from '@/interfaces/Forms'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useFieldRequired } from '@/composables/useFormField'

const props = withDefaults(defineProps<FormSwitchProps>(), {
  rules: '',
  hideDefaultLabel: false,
  hideLabel: false,
})

defineOptions({ name: 'AppSwitch', inheritAttrs: false })

const emit = defineEmits<{ (e: 'update:modelValue', value: unknown): void }>()

const label = computed(() => props.label)
const isRequired = useFieldRequired(props.rules)

const value = computed({
  get: () => Boolean(props.modelValue),
  set: (newValue: boolean) => emit('update:modelValue', newValue),
})
</script>

<template>
  <VeeField
    v-slot="{ handleChange, errorMessage }"
    v-model="value"
    :name="name"
    :label="label"
    :rules="rules"
  >
    <div class="space-y-2" :class="$attrs.class">
      <div v-if="label && !hideDefaultLabel && !hideLabel" class="flex items-center gap-3">
        <Switch
          :model-value="value"
          @update:model-value="
            (checked) => {
              value = !!checked
              handleChange(!!checked)
            }
          "
        />
        <Label
          class="cursor-pointer"
          @click="
            value = !value
            handleChange(value)
          "
        >
          {{ label }}
          <span v-if="isRequired" class="text-destructive">*</span>
        </Label>
      </div>
      <Switch
        v-else
        :model-value="value"
        @update:model-value="
          (checked) => {
            value = !!checked
            handleChange(!!checked)
          }
        "
      />
      <p v-if="errorMessage" class="text-xs text-destructive">{{ errorMessage }}</p>
    </div>
  </VeeField>
</template>

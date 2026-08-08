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

function onCheckedChange(checked: boolean | 'indeterminate', handleChange: (v: boolean) => void) {
  const next = !!checked
  value.value = next
  handleChange(next)
}

function onLabelClick(handleChange: (v: boolean) => void) {
  const next = !value.value
  value.value = next
  handleChange(next)
}
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
          @update:model-value="(checked) => onCheckedChange(checked, handleChange)"
        />
        <Label class="cursor-pointer" @click="onLabelClick(handleChange)">
          {{ label }}
          <span v-if="isRequired" class="text-destructive">*</span>
        </Label>
      </div>
      <Switch
        v-else
        :model-value="value"
        @update:model-value="(checked) => onCheckedChange(checked, handleChange)"
      />
      <p v-if="errorMessage" class="text-xs text-destructive">{{ errorMessage }}</p>
    </div>
  </VeeField>
</template>

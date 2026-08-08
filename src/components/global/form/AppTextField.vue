<script setup lang="ts">
import type { FormInputProps } from '@/interfaces/Forms'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFieldRequired } from '@/composables/useFormField'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<FormInputProps>(), {
  rules: '',
  hideDefaultLabel: false,
  hideLabel: false,
})

defineOptions({ name: 'AppTextField', inheritAttrs: false })

const emit = defineEmits<{ (e: 'update:modelValue', value: unknown): void }>()

const attrs = useAttrs()
const label = computed(() => props.label ?? (attrs.label as string | undefined))
const isRequired = useFieldRequired(props.rules)

const value = computed({
  get: () => props.modelValue,
  set: (newValue: unknown) => emit('update:modelValue', newValue),
})
</script>

<template>
  <VeeField
    v-slot="{ field, errorMessage }"
    v-model="value"
    :name="name"
    :label="label"
    :rules="rules"
  >
    <div class="space-y-2" :class="$attrs.class">
      <Label v-if="label && !hideDefaultLabel && !hideLabel">
        {{ label }}
        <span v-if="isRequired" class="text-destructive">*</span>
      </Label>
      <Input
        v-bind="{ ...$attrs, ...field, class: undefined, label: undefined }"
        :class="cn(errorMessage && 'border-destructive')"
      />
      <p v-if="errorMessage" class="text-xs text-destructive">{{ errorMessage }}</p>
    </div>
  </VeeField>
</template>

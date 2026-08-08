<script setup lang="ts">
import type { FormSelectProps } from '@/interfaces/Forms'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFieldRequired } from '@/composables/useFormField'
import { cn } from '@/lib/utils'

const EMPTY_VALUE = '__empty__'

const props = withDefaults(defineProps<FormSelectProps>(), {
  rules: '',
  hideDefaultLabel: false,
  hideLabel: false,
  options: () => [],
})

defineOptions({ name: 'AppSelect', inheritAttrs: false })

const emit = defineEmits<{ (e: 'update:modelValue', value: unknown): void }>()

const attrs = useAttrs()
const label = computed(() => props.label ?? (attrs.label as string | undefined))
const isRequired = useFieldRequired(props.rules)
const placeholder = computed(() => (attrs.placeholder as string | undefined) || label.value || '')

const value = computed({
  get: () => props.modelValue,
  set: (newValue: unknown) => emit('update:modelValue', newValue),
})

function toSelectValue(optionValue: unknown) {
  if (optionValue === '' || optionValue === null || optionValue === undefined) return EMPTY_VALUE
  return String(optionValue)
}

function fromSelectValue(selected: string) {
  if (selected === EMPTY_VALUE) {
    const emptyOption = props.options.find(
      (option) => option.value === '' || option.value === null || option.value === undefined,
    )
    return emptyOption ? emptyOption.value : ''
  }

  const matched = props.options.find((option) => String(option.value) === selected)
  return matched ? matched.value : selected
}

const selectModel = computed({
  get: () => toSelectValue(value.value),
  set: (selected: unknown) => {
    value.value = fromSelectValue(String(selected ?? ''))
  },
})

const selectedLabel = computed(() => {
  const matched = props.options.find((option) => String(option.value) === String(value.value))
  if (matched) return matched.label
  if (value.value === '' || value.value === null || value.value === undefined) {
    return props.options.find((option) => option.value === '' || option.value === null)?.label
  }
  return undefined
})
</script>

<template>
  <VeeField
    v-slot="{ errorMessage, handleChange, handleBlur }"
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

      <Select
        v-model="selectModel"
        @update:model-value="(val) => handleChange(fromSelectValue(String(val ?? '')))"
        @update:open="(open) => !open && handleBlur()"
      >
        <SelectTrigger
          :class="
            cn(
              'w-full',
              errorMessage && 'border-destructive focus:ring-destructive',
              $attrs.disabled !== undefined && 'opacity-50',
            )
          "
        >
          <SelectValue :placeholder="placeholder">
            {{ selectedLabel || placeholder }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="option in options"
            :key="toSelectValue(option.value)"
            :value="toSelectValue(option.value)"
          >
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>

      <p v-if="errorMessage" class="text-xs text-destructive">{{ errorMessage }}</p>
    </div>
  </VeeField>
</template>

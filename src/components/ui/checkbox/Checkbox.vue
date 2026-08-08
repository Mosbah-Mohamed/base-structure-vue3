<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  (e: 'update:checked', value: boolean): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

watch(
  () => props.indeterminate,
  (value) => {
    if (inputRef.value) inputRef.value.indeterminate = !!value
  },
  { immediate: true },
)

function onChange(event: Event) {
  emit('update:checked', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <input
    ref="inputRef"
    type="checkbox"
    :checked="checked"
    :disabled="disabled"
    :class="
      cn(
        'size-4 shrink-0 cursor-pointer rounded border border-input accent-primary disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
    @change="onChange"
  />
</template>

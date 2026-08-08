<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { SelectLabel as RekaSelectLabel, type SelectLabelProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<SelectLabelProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <RekaSelectLabel :class="cn('px-2 py-1.5 text-sm font-semibold', props.class)">
    <slot />
  </RekaSelectLabel>
</template>

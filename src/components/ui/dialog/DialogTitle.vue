<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DialogTitle as RekaDialogTitle } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <RekaDialogTitle :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)">
    <slot />
  </RekaDialogTitle>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AlertDialogTitle as RekaAlertDialogTitle } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <RekaAlertDialogTitle :class="cn('text-lg font-semibold', props.class)">
    <slot />
  </RekaAlertDialogTitle>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AlertDialogDescription as RekaAlertDialogDescription } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <RekaAlertDialogDescription :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </RekaAlertDialogDescription>
</template>

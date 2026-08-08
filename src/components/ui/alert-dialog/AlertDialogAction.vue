<script setup lang="ts">
import { AlertDialogAction as RekaAlertDialogAction } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

defineProps<{ class?: string }>()
</script>

<template>
  <RekaAlertDialogAction :class="cn(buttonVariants(), $attrs.class as string)">
    <slot />
  </RekaAlertDialogAction>
</template>

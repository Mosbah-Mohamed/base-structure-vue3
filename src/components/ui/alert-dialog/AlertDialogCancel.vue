<script setup lang="ts">
import { AlertDialogCancel as RekaAlertDialogCancel } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

defineProps<{ class?: string }>()
</script>

<template>
  <RekaAlertDialogCancel
    :class="cn(buttonVariants({ variant: 'outline' }), $attrs.class as string)"
  >
    <slot />
  </RekaAlertDialogCancel>
</template>

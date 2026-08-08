<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  AlertDialogContent as RekaAlertDialogContent,
  AlertDialogOverlay,
  AlertDialogPortal,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AlertDialogPortal>
    <AlertDialogOverlay class="fixed inset-0 z-50 bg-black/80" />
    <RekaAlertDialogContent
      :class="
        cn(
          'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
          props.class,
        )
      "
    >
      <slot />
    </RekaAlertDialogContent>
  </AlertDialogPortal>
</template>

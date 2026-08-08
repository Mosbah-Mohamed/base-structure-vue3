<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <th
    :class="
      cn(
        'h-11 px-3 text-start align-middle text-xs font-semibold tracking-wide text-foreground/80 [&:has([role=checkbox])]:pr-0',
        props.class,
      )
    "
  >
    <slot />
  </th>
</template>

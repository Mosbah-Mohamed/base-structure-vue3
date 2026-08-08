<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <thead :class="cn('sticky top-0 z-10 [&_tr]:border-b', props.class)">
    <slot />
  </thead>
</template>

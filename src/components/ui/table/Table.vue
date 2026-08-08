<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div class="relative w-full max-w-full overflow-x-auto">
    <table :class="cn('w-full min-w-[640px] caption-bottom text-sm', props.class)">
      <slot />
    </table>
  </div>
</template>

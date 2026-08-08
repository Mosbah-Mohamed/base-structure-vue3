<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { SelectGroup as RekaSelectGroup, type SelectGroupProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<SelectGroupProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <RekaSelectGroup :class="cn('w-full p-1', props.class)">
    <slot />
  </RekaSelectGroup>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { SelectValue as RekaSelectValue, type SelectValueProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<SelectValueProps & { class?: HTMLAttributes['class'] }>()
const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <RekaSelectValue v-bind="delegated" :class="cn('line-clamp-1 text-start', props.class)">
    <slot />
  </RekaSelectValue>
</template>

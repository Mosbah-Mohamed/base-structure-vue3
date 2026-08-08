<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  DropdownMenuLabel as RekaDropdownMenuLabel,
  type DropdownMenuLabelProps,
  useForwardProps,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<DropdownMenuLabelProps & { class?: HTMLAttributes['class']; inset?: boolean }>(),
  { inset: false },
)

const delegated = reactiveOmit(props, 'class', 'inset')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <RekaDropdownMenuLabel
    v-bind="forwarded"
    :class="cn('px-2.5 py-1.5 text-start text-sm font-semibold', inset && 'ps-8', props.class)"
  >
    <slot />
  </RekaDropdownMenuLabel>
</template>

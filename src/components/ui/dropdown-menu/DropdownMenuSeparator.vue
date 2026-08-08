<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  DropdownMenuSeparator as RekaDropdownMenuSeparator,
  type DropdownMenuSeparatorProps,
  useForwardProps,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuSeparatorProps & { class?: HTMLAttributes['class'] }>()
const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <RekaDropdownMenuSeparator
    v-bind="forwarded"
    :class="cn('-mx-1 my-1 h-px bg-border', props.class)"
  />
</template>

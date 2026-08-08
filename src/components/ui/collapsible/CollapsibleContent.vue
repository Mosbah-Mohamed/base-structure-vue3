<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  CollapsibleContent as RekaCollapsibleContent,
  type CollapsibleContentProps,
  useForwardProps,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<CollapsibleContentProps & { class?: HTMLAttributes['class'] }>()
const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <RekaCollapsibleContent
    v-bind="forwarded"
    :class="
      cn(
        'overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
        props.class,
      )
    "
  >
    <slot />
  </RekaCollapsibleContent>
</template>

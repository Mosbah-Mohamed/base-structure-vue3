<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ChevronDown } from 'lucide-vue-next'
import {
  SelectIcon,
  SelectTrigger as RekaSelectTrigger,
  type SelectTriggerProps,
  useForwardProps,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<SelectTriggerProps & { class?: HTMLAttributes['class'] }>()
const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <RekaSelectTrigger
    v-bind="forwarded"
    :class="
      cn(
        'flex h-9 w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-start text-sm shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        '[&>span]:line-clamp-1 [&>span]:min-w-0 [&>span]:flex-1 [&>span]:text-start',
        props.class,
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="size-4 shrink-0 opacity-50" />
    </SelectIcon>
  </RekaSelectTrigger>
</template>

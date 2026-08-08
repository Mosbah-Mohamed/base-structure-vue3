<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  DropdownMenuItem as RekaDropdownMenuItem,
  type DropdownMenuItemProps,
  useForwardProps,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<DropdownMenuItemProps & { class?: HTMLAttributes['class']; inset?: boolean }>(),
  { inset: false },
)

const delegated = reactiveOmit(props, 'class', 'inset')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <RekaDropdownMenuItem
    v-bind="forwarded"
    :class="
      cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-start text-sm outline-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'ps-8',
        props.class,
      )
    "
  >
    <slot />
  </RekaDropdownMenuItem>
</template>

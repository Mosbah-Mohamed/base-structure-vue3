<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  DropdownMenuContent as RekaDropdownMenuContent,
  DropdownMenuPortal,
  type DropdownMenuContentEmits,
  type DropdownMenuContentProps,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<DropdownMenuContentProps & { class?: HTMLAttributes['class'] }>(),
  { sideOffset: 8, align: 'end' },
)
const emits = defineEmits<DropdownMenuContentEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DropdownMenuPortal>
    <RekaDropdownMenuContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'z-50 min-w-56 overflow-hidden rounded-xl border bg-popover p-1 text-start text-popover-foreground shadow-lg',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          props.class,
        )
      "
    >
      <slot />
    </RekaDropdownMenuContent>
  </DropdownMenuPortal>
</template>

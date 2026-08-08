<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  AvatarFallback as RekaAvatarFallback,
  type AvatarFallbackProps,
  useForwardProps,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<AvatarFallbackProps & { class?: HTMLAttributes['class'] }>()
const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <RekaAvatarFallback
    v-bind="forwarded"
    :class="
      cn(
        'flex size-full items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground',
        props.class,
      )
    "
  >
    <slot />
  </RekaAvatarFallback>
</template>

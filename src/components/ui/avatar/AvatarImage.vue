<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AvatarImage as RekaAvatarImage, type AvatarImageProps, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<AvatarImageProps & { class?: HTMLAttributes['class'] }>()
const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <RekaAvatarImage
    v-bind="forwarded"
    :class="cn('aspect-square size-full object-cover', props.class)"
  />
</template>

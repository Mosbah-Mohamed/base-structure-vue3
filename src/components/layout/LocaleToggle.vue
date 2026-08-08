<script setup lang="ts">
import { Languages } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useAppLocale } from '@/composables/useAppLocale'

const { locale, toggleLocale } = useAppLocale()
</script>

<template>
  <Button variant="ghost" size="sm" class="gap-2" @click="toggleLocale">
    <Languages class="size-4" />
    {{ locale === 'ar' ? 'EN' : 'AR' }}
  </Button>
</template>

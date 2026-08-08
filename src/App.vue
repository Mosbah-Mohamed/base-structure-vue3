<script setup lang="ts">
import { ConfigProvider } from 'reka-ui'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { useAppLocale } from '@/composables/useAppLocale'
import { Sonner as Toaster } from '@/components/ui/sonner'
import UseAppLayouts from '@/composables/UseAppLayouts'
import 'vue-sonner/style.css'

const { layoutComponent } = UseAppLayouts()
const { initLocale, locale, dir } = useAppLocale()
const isDev = import.meta.env.DEV

initLocale()
</script>

<template>
  <ConfigProvider :dir="dir" :locale="locale">
    <div class="min-h-svh bg-background text-foreground transition-colors duration-300" :dir="dir">
      <Component :is="layoutComponent" v-if="layoutComponent">
        <RouterView />
      </Component>
      <Toaster rich-colors position="top-center" />
      <VueQueryDevtools v-if="isDev" />
    </div>
  </ConfigProvider>
</template>

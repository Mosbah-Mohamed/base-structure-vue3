<script setup lang="ts">
import { Button } from '@/components/ui/button'

const route = useRoute()
const message = route.query.message as string | undefined
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
    <h1 class="text-2xl font-bold">حدث خطأ ما</h1>
    <p class="text-muted-foreground">{{ message || 'Something went wrong' }}</p>
    <Button as-child>
      <RouterLink to="/">العودة للرئيسية</RouterLink>
    </Button>
  </div>
</template>

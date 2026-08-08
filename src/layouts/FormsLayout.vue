<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import logoUrl from '@/assets/images/logo.svg'
</script>

<template>
  <div class="flex min-h-svh items-center justify-center bg-muted/40 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="flex-row items-center gap-3 space-y-0">
        <img :src="logoUrl" alt="Logo" class="h-10 w-auto" />
        <CardTitle>Base Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <RouterView />
      </CardContent>
    </Card>
  </div>
</template>

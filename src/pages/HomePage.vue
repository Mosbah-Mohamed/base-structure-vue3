<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'

const { t } = useI18n()
const router = useRouter()
const { authUser } = useAuthStore()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ t('home.title') }}</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4 text-sm">
      <p>{{ t('home.description') }}</p>
      <p v-if="authUser" class="text-muted-foreground">
        {{ t('home.loggedInAs', { name: authUser.name, email: authUser.email }) }}
      </p>
      <Button @click="router.push({ name: 'demo-crud-page' })">
        {{ t('home.openDemo') }}
      </Button>
    </CardContent>
  </Card>
</template>

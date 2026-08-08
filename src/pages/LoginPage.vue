<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { User } from '@/interfaces/Auth'
import { authService } from '@/services/AuthService'
import { useAuthStore } from '@/stores/AuthStore'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { setAuthUser } = useAuthStore()

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> }>()
const isLoading = ref(false)
const redirectPath = (route.query.redirect as string) || '/demo-crud'

const formData = reactive({
  email: '',
  password: '',
})

function enterAsDemoUser() {
  const demoUser: User = {
    id: 1,
    uuid: 'demo-user',
    name: 'Demo User',
    email: 'demo@base-structure.local',
    image_path: '',
    token: 'demo-token',
    created_at: new Date().toISOString(),
    permissions: [
      'view_participant_categories',
      'create_participant_category',
      'update_participant_category',
      'delete_participant_category',
    ],
    roles: [{ id: 1, name: 'Demo' }],
    apps: ['dashboard'],
  }

  setAuthUser(demoUser)
  toast.success(t('auth.demoLogin'))
  router.push(redirectPath)
}

function submit() {
  formRef.value?.validate().then(({ valid }) => {
    if (!valid) return

    isLoading.value = true
    authService
      .login(formData)
      .then((res) => {
        setAuthUser(res.data.data)
        router.push(redirectPath)
      })
      .catch(() => {
        toast.error(t('messages.loginFailed'))
      })
      .finally(() => {
        isLoading.value = false
      })
  })
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold">{{ t('auth.welcome') }}</h2>
      <p class="text-sm text-muted-foreground">{{ t('auth.loginSubtitle') }}</p>
    </div>

    <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
      <div class="space-y-4">
        <AppTextField
          v-model="formData.email"
          name="email"
          :label="t('auth.email')"
          type="email"
          rules="required|email|min:6"
          autocomplete="email"
        />

        <AppTextField
          v-model="formData.password"
          name="password"
          :label="t('auth.password')"
          type="password"
          rules="required|min:6"
          autocomplete="current-password"
        />

        <Button type="button" class="w-full" :disabled="!meta.valid || isLoading" @click="submit">
          {{ isLoading ? t('auth.loggingIn') : t('auth.login') }}
        </Button>
      </div>
    </VeeForm>

    <div class="relative py-2">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">or</span>
      </div>
    </div>

    <Button type="button" variant="outline" class="w-full" @click="enterAsDemoUser">
      {{ t('auth.demoLogin') }}
    </Button>
    <p class="text-center text-xs text-muted-foreground">{{ t('auth.demoLoginHint') }}</p>
  </div>
</template>

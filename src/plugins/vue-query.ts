import type { App } from 'vue'
import {
  MutationCache,
  QueryClient,
  VueQueryPlugin,
  type VueQueryPluginOptions,
} from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { isHandledApiError } from '@/lib/apiError'
import i18n from '@/plugins/i18n'

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError(error) {
      // Axios errors already toasted in the interceptor (spaces-vue style)
      if (isHandledApiError(error)) return

      const message =
        error instanceof Error && error.message
          ? error.message
          : String(i18n.global.t('messages.saveFailed'))

      toast.error(message)
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
})

export const vueQueryPluginOptions: VueQueryPluginOptions = { queryClient }

export default {
  install(app: App) {
    app.use(VueQueryPlugin, vueQueryPluginOptions)
  },
}

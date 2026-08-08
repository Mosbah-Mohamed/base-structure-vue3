import type { App } from 'vue'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { toast } from 'vue-sonner'
import { env } from '@/lib/env'
import { useAuthStore } from '@/stores/AuthStore'
import i18n from '@/plugins/i18n'

function currentLocale() {
  const locale = i18n.global.locale
  return typeof locale === 'string' ? locale : locale.value
}

export const axiosPlugin = {
  install(app: App) {
    const router = app.config.globalProperties.$router
    axios.defaults.baseURL = env.VITE_BASE_API_URL

    axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const authStore = useAuthStore()
      const token = authStore.getToken

      config.headers = config.headers ?? {}
      if (token) config.headers.Authorization = `Bearer ${token}`
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json'
      config.headers['Accept-Language'] = currentLocale()
      config.headers.platform = 'dashboard'

      const timezoneOffset = -new Date().getTimezoneOffset() / 60
      const sign = timezoneOffset >= 0 ? '+' : ''
      config.headers['Time-Zone'] = `${sign}${timezoneOffset}`

      return config
    })

    axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<{ message?: string; error?: string }>) => {
        if (error.name === 'CanceledError') return Promise.reject(error)

        const authStore = useAuthStore()
        const status = error.response?.status
        const message = error.response?.data?.message || error.response?.data?.error
        const t = i18n.global.t

        switch (status) {
          case 400:
          case 403:
          case 405:
            if (message) toast.error(message)
            break
          case 401:
            toast.error(message || String(t('messages.unauthorized')))
            authStore.clearAuthUser()
            if (router.currentRoute.value.name !== 'login-page') {
              router.push({
                name: 'login-page',
                query: { redirect: router.currentRoute.value.fullPath },
              })
            }
            break
          case 500:
            router.push({
              name: 'error-page',
              query: { message: String(t('messages.serverError')) },
            })
            break
          default:
            if (message) toast.error(message)
            else if (!error.response) toast.error(String(t('messages.networkError')))
        }

        return Promise.reject(error)
      },
    )
  },
}

export default axiosPlugin

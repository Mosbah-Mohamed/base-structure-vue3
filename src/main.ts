import '@/assets/index.css'
import App from '@/App.vue'
import { axiosPlugin } from '@/plugins/axios'
import i18n from '@/plugins/i18n'
import veeValidate from '@/plugins/vee-validate'
import vueQuery from '@/plugins/vue-query'
import router from '@/router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { applyZodLocale } from '@/lib/zodLocale'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
applyZodLocale()
app.use(axiosPlugin)
app.use(vueQuery)
app.use(veeValidate)

app.mount('#app')

import { setLocale } from '@vee-validate/i18n'
import { applyZodLocale } from '@/lib/zodLocale'

export type AppDirection = 'rtl' | 'ltr'

export function useAppLocale() {
  const { locale } = useI18n()
  const dir = computed<AppDirection>(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))

  function applyLocale(lang: 'ar' | 'en') {
    locale.value = lang
    setLocale(lang)
    applyZodLocale()
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('app-locale', lang)
  }

  function initLocale() {
    const saved = localStorage.getItem('app-locale') as 'ar' | 'en' | null
    applyLocale(saved ?? 'ar')
  }

  function toggleLocale() {
    applyLocale(locale.value === 'ar' ? 'en' : 'ar')
  }

  return { locale, dir, applyLocale, initLocale, toggleLocale }
}

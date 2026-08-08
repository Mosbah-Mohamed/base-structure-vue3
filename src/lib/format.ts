import { format } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

export function formatDate(value: string | undefined, locale = 'ar') {
  if (!value) return '-'
  return format(new Date(value), 'dd/MM/yyyy', {
    locale: locale === 'ar' ? ar : enUS,
  })
}

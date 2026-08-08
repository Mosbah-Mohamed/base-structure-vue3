import { z } from 'zod'
import i18n from '@/plugins/i18n'

/** Map Zod issues through vue-i18n (reads current locale on each error). */
export function applyZodLocale() {
  z.setErrorMap((issue, ctx) => {
    const t = i18n.global.t

    switch (issue.code) {
      case z.ZodIssueCode.invalid_type:
        if (issue.received === 'undefined' || issue.received === 'null') {
          return { message: String(t('validation.required')) }
        }
        return { message: String(t('validation.invalid')) }

      case z.ZodIssueCode.too_small:
        if (issue.type === 'string') {
          if (issue.minimum === 1 && !issue.inclusive) {
            return { message: String(t('validation.required')) }
          }
          if (issue.minimum === 1) {
            return { message: String(t('validation.required')) }
          }
          return { message: String(t('validation.min', { min: issue.minimum })) }
        }
        if (issue.type === 'number' || issue.type === 'array') {
          return { message: String(t('validation.minValue', { min: issue.minimum })) }
        }
        break

      case z.ZodIssueCode.too_big:
        if (issue.type === 'string') {
          return { message: String(t('validation.max', { max: issue.maximum })) }
        }
        if (issue.type === 'number' || issue.type === 'array') {
          return { message: String(t('validation.maxValue', { max: issue.maximum })) }
        }
        break

      case z.ZodIssueCode.invalid_string:
        if (issue.validation === 'email') {
          return { message: String(t('validation.email')) }
        }
        if (issue.validation === 'url') {
          return { message: String(t('validation.url')) }
        }
        return { message: String(t('validation.invalid')) }

      case z.ZodIssueCode.invalid_enum_value:
      case z.ZodIssueCode.invalid_literal:
        return { message: String(t('validation.invalid')) }

      default:
        break
    }

    return { message: ctx.defaultError }
  })
}

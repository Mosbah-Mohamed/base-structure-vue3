import type { FormInputProps } from '@/interfaces/Forms'

export function useFieldRequired(rules?: FormInputProps['rules']) {
  return computed(() => {
    if (!rules) return false
    if (typeof rules === 'string') return rules.includes('required')
    if (typeof rules === 'object') return !!rules.required
    return false
  })
}

export function getNestedValue(obj: Record<string, unknown>, path: string) {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj)
}

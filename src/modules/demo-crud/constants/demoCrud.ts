import type { DemoItemBase } from '../interfaces/DemoItem'

export interface DemoFilters {
  priority: string
  is_active: string
}

export const EMPTY_DEMO_FILTERS: DemoFilters = {
  priority: '',
  is_active: '',
}

export function emptyDemoForm(): DemoItemBase {
  return {
    title: { ar: '', en: '' },
    description: '',
    email: '',
    priority: 'medium',
    is_active: true,
  }
}

type Translate = (key: string) => string

export function getDemoPriorityOptions(t: Translate, includeAll = false) {
  const options = [
    { label: t('demoCrud.priority.low'), value: 'low' },
    { label: t('demoCrud.priority.medium'), value: 'medium' },
    { label: t('demoCrud.priority.high'), value: 'high' },
  ]
  return includeAll ? [{ label: t('demoCrud.priority.all'), value: '' }, ...options] : options
}

export function getDemoStatusFilterOptions(t: Translate) {
  return [
    { label: t('demoCrud.status.all'), value: '' },
    { label: t('status.active'), value: 'true' },
    { label: t('status.inactive'), value: 'false' },
  ]
}

export function getDemoTableHeaders(t: Translate) {
  return [
    { title: '#', key: 'id' },
    { title: t('fields.nameAr'), key: 'title.ar' },
    { title: t('fields.nameEn'), key: 'title.en' },
    { title: t('fields.email'), key: 'email' },
    { title: t('fields.priority'), key: 'priority', align: 'center' as const },
    { title: t('fields.status'), key: 'is_active', align: 'center' as const },
    { title: t('fields.createdAt'), key: 'created_at' },
    { title: t('fields.actions'), key: 'actions', align: 'center' as const },
  ]
}

export function buildDemoFilterChips(filters: DemoFilters, t: Translate) {
  const chips: { key: string; label: string; valueLabel: string }[] = []

  if (filters.priority) {
    chips.push({
      key: 'priority',
      label: t('fields.priority'),
      valueLabel: t(`demoCrud.priority.${filters.priority}`),
    })
  }

  if (filters.is_active !== '') {
    chips.push({
      key: 'is_active',
      label: t('fields.status'),
      valueLabel: filters.is_active === 'true' ? t('status.active') : t('status.inactive'),
    })
  }

  return chips
}

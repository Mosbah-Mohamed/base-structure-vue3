import type { ParticipantCategoryBase } from '../interfaces/ParticipantCategory'

export function emptyParticipantCategoryForm(): ParticipantCategoryBase {
  return {
    name: { ar: '', en: '' },
    type: 'general',
    color: '#000000',
    is_active: false,
  }
}

type Translate = (key: string) => string

export function getParticipantTypeOptions(t: Translate) {
  return [
    { label: t('participantCategories.types.highlight'), value: 'highlight' },
    { label: t('participantCategories.types.block'), value: 'block' },
    { label: t('participantCategories.types.general'), value: 'general' },
  ]
}

export function getParticipantTypeLabel(type: string, t: Translate) {
  const key = `participantCategories.types.${type}`
  const label = t(key)
  return label === key ? type : label
}

export function getParticipantTableHeaders(t: Translate) {
  return [
    { title: '#', key: 'sort' },
    { title: t('fields.nameAr'), key: 'name.ar' },
    { title: t('fields.nameEn'), key: 'name.en' },
    { title: t('fields.type'), key: 'type', align: 'center' as const },
    { title: t('fields.status'), key: 'is_active', align: 'center' as const },
    { title: t('fields.createdAt'), key: 'created_at' },
    { title: t('fields.actions'), key: 'actions', align: 'center' as const },
  ]
}

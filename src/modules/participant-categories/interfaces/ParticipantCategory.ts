export interface ParticipantCategoryBase {
  id?: number
  name: {
    ar: string
    en: string
  }
  type: 'highlight' | 'ban' | 'block' | 'general'
  color?: string
  is_active?: boolean | null
  is_approved?: boolean | null
  sort?: number
  can_edit?: boolean
  created_by?: string
  created_at?: string
}

export interface ParticipantCategory extends ParticipantCategoryBase {
  id: number
  is_active: boolean
  is_approved: boolean
  sort: number
  can_edit: boolean
  created_by: string
  created_at: string
}

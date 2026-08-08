export type DemoPriority = 'low' | 'medium' | 'high'

export interface DemoItemBase {
  id?: number
  title: { ar: string; en: string }
  description: string
  email: string
  priority: DemoPriority
  is_active: boolean
}

export interface DemoItem extends DemoItemBase {
  id: number
  created_at: string
  updated_at: string
}

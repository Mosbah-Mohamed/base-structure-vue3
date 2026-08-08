import type { DemoItem, DemoItemBase } from '../interfaces/DemoItem'

const STORAGE_KEY = 'base-structure:demo-crud-items'

function seedItems(): DemoItem[] {
  const now = new Date().toISOString()
  const priorities: Array<DemoItem['priority']> = ['low', 'medium', 'high']

  return Array.from({ length: 15 }, (_, index) => {
    const n = index + 1
    return {
      id: n,
      title: { ar: `عنصر تجريبي ${n}`, en: `Demo item ${n}` },
      description: `Seeded description for demo item ${n}. Used to exercise search and pagination.`,
      email: `item${n}@example.com`,
      priority: priorities[index % priorities.length],
      is_active: n % 2 === 1,
      created_at: now,
      updated_at: now,
    }
  })
}

function readStore(): DemoItem[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const seeded = seedItems()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  }
  return JSON.parse(raw) as DemoItem[]
}

function writeStore(items: DemoItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function listDemoItems(params: {
  page: number
  itemPerPage: number
  keyword: string
  priority?: string
  is_active?: string | boolean | null
}): {
  data: DemoItem[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
} {
  const keyword = params.keyword.trim().toLowerCase()
  let items = readStore()

  if (keyword) {
    items = items.filter(
      (item) =>
        item.title.ar.toLowerCase().includes(keyword) ||
        item.title.en.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword),
    )
  }

  if (params.priority) {
    items = items.filter((item) => item.priority === params.priority)
  }

  if (params.is_active === true || params.is_active === 'true') {
    items = items.filter((item) => item.is_active)
  } else if (params.is_active === false || params.is_active === 'false') {
    items = items.filter((item) => !item.is_active)
  }

  const total = items.length
  const perPage = params.itemPerPage
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const page = Math.min(Math.max(1, params.page), lastPage)
  const start = (page - 1) * perPage

  return {
    data: items.slice(start, start + perPage),
    meta: {
      current_page: page,
      last_page: lastPage,
      per_page: perPage,
      total,
    },
  }
}

export function reorderDemoItems(orderedIds: number[]) {
  const items = readStore()
  const byId = new Map(items.map((item) => [item.id, item]))
  const reordered = orderedIds.map((id) => byId.get(id)).filter(Boolean) as DemoItem[]
  const remaining = items.filter((item) => !orderedIds.includes(item.id))
  writeStore([...reordered, ...remaining])
}

export function createDemoItem(payload: DemoItemBase): DemoItem {
  const items = readStore()
  const now = new Date().toISOString()
  const nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1
  const created: DemoItem = {
    ...payload,
    id: nextId,
    created_at: now,
    updated_at: now,
  }
  writeStore([created, ...items])
  return created
}

export function updateDemoItem(payload: DemoItem): DemoItem {
  const items = readStore()
  const index = items.findIndex((item) => item.id === payload.id)
  if (index === -1) throw new Error('Item not found')

  const updated: DemoItem = {
    ...payload,
    updated_at: new Date().toISOString(),
  }
  items[index] = updated
  writeStore(items)
  return updated
}

export function deleteDemoItem(id: number) {
  writeStore(readStore().filter((item) => item.id !== id))
}

export function deleteDemoItemsBulk(ids: number[]) {
  writeStore(readStore().filter((item) => !ids.includes(item.id)))
}

export function toggleDemoItemsActiveBulk(ids: number[], action: number) {
  const items = readStore().map((item) =>
    ids.includes(item.id)
      ? { ...item, is_active: action === 1, updated_at: new Date().toISOString() }
      : item,
  )
  writeStore(items)
}

export function resetDemoItems() {
  writeStore(seedItems())
}

import type { AxiosPromise, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiMessageResponse, PaginatedResponse } from '@/lib/query/createCrudQueries'
import type { DemoItem, DemoItemBase } from '../interfaces/DemoItem'

const STORAGE_KEY = 'base-structure:demo-crud-items'

export interface DemoCrudParams {
  page: number
  itemPerPage: number
  keyword: string
  priority?: string
  is_active?: string
}

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function asAxiosResponse<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }
}

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

class DemoCrudService {
  contextPath = 'demo_items'

  /** **************** get ******************/
  async getItem(params: DemoCrudParams): AxiosPromise<PaginatedResponse<DemoItem>> {
    await delay()

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

    if (params.is_active === 'true') {
      items = items.filter((item) => item.is_active)
    } else if (params.is_active === 'false') {
      items = items.filter((item) => !item.is_active)
    }

    const total = items.length
    const perPage = params.itemPerPage
    const lastPage = Math.max(1, Math.ceil(total / perPage))
    const page = Math.min(Math.max(1, params.page), lastPage)
    const start = (page - 1) * perPage

    return asAxiosResponse({
      data: items.slice(start, start + perPage),
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total,
      },
    })
  }

  getSingleItem(id: number): AxiosPromise<DemoItem> {
    const item = readStore().find((entry) => entry.id === id)
    if (!item) return Promise.reject(new Error('Item not found'))
    return Promise.resolve(asAxiosResponse(item))
  }

  /** **************** post ******************/
  async createItem(data: DemoItemBase): AxiosPromise<ApiMessageResponse<DemoItem>> {
    await delay()
    const items = readStore()
    const now = new Date().toISOString()
    const nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1
    const created: DemoItem = {
      ...data,
      id: nextId,
      created_at: now,
      updated_at: now,
    }
    writeStore([created, ...items])
    return asAxiosResponse({ message: 'Created successfully', data: created })
  }

  /** **************** put ******************/
  async editItem(data: DemoItem): AxiosPromise<ApiMessageResponse<DemoItem>> {
    await delay()
    const items = readStore()
    const index = items.findIndex((item) => item.id === data.id)
    if (index === -1) throw new Error('Item not found')

    const updated: DemoItem = {
      ...data,
      updated_at: new Date().toISOString(),
    }
    items[index] = updated
    writeStore(items)
    return asAxiosResponse({ message: 'Updated successfully', data: updated })
  }

  /** **************** delete ******************/
  async deleteItem(id: number): AxiosPromise<ApiMessageResponse> {
    await delay()
    writeStore(readStore().filter((item) => item.id !== id))
    return asAxiosResponse({ message: 'Deleted successfully' })
  }

  /** **************** bulk / extras (demo only) ******************/
  async deleteBulk(payload: { model: string; ids: number[] }) {
    await delay()
    writeStore(readStore().filter((item) => !payload.ids.includes(item.id)))
    return { data: { message: 'Selected items deleted' } }
  }

  async toggleActivationBulk(payload: {
    model: string
    ids: number[]
    action: number
    column?: string
  }) {
    await delay()
    writeStore(
      readStore().map((item) =>
        payload.ids.includes(item.id)
          ? { ...item, is_active: payload.action === 1, updated_at: new Date().toISOString() }
          : item,
      ),
    )
    return {
      data: {
        message: payload.action === 1 ? 'Selected items activated' : 'Selected items deactivated',
      },
    }
  }

  reorderItems(orderedIds: number[]) {
    const items = readStore()
    const byId = new Map(items.map((item) => [item.id, item]))
    const reordered = orderedIds.map((id) => byId.get(id)).filter(Boolean) as DemoItem[]
    const remaining = items.filter((item) => !orderedIds.includes(item.id))
    writeStore([...reordered, ...remaining])
  }

  resetItems() {
    writeStore(seedItems())
  }
}

export const demoCrudService = new DemoCrudService()

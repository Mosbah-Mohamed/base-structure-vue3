import type { AxiosPromise, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiMessageResponse, PaginatedResponse } from '@/lib/query/createCrudQueries'
import type { DemoItem, DemoItemBase } from '../interfaces/DemoItem'
import {
  createDemoItem,
  deleteDemoItem,
  deleteDemoItemsBulk,
  listDemoItems,
  toggleDemoItemsActiveBulk,
  updateDemoItem,
} from './demoCrudStore'

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

export interface DemoCrudParams {
  page: number
  itemPerPage: number
  keyword: string
  priority?: string
  is_active?: string
}

export const demoCrudService = {
  async getItem(params: DemoCrudParams): AxiosPromise<PaginatedResponse<DemoItem>> {
    await delay()
    return asAxiosResponse(listDemoItems(params))
  },

  async createItem(data: DemoItemBase): AxiosPromise<ApiMessageResponse<DemoItem>> {
    await delay()
    const created = createDemoItem(data)
    return asAxiosResponse({ message: 'Created successfully', data: created })
  },

  async editItem(data: DemoItem): AxiosPromise<ApiMessageResponse<DemoItem>> {
    await delay()
    const updated = updateDemoItem(data)
    return asAxiosResponse({ message: 'Updated successfully', data: updated })
  },

  async deleteItem(id: number): AxiosPromise<ApiMessageResponse> {
    await delay()
    deleteDemoItem(id)
    return asAxiosResponse({ message: 'Deleted successfully' })
  },

  async deleteBulk(payload: { model: string; ids: number[] }) {
    await delay()
    deleteDemoItemsBulk(payload.ids)
    return { data: { message: 'Selected items deleted' } }
  },

  async toggleActivationBulk(payload: {
    model: string
    ids: number[]
    action: number
    column?: string
  }) {
    await delay()
    toggleDemoItemsActiveBulk(payload.ids, payload.action)
    return {
      data: {
        message: payload.action === 1 ? 'Selected items activated' : 'Selected items deactivated',
      },
    }
  },
}

import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { BulkService } from '@/interfaces/Shared'

class SharedService implements BulkService {
  deleteBulk(payload: { model: string; ids: number[] }): AxiosPromise {
    return axios.delete('multi_destroy', { data: payload })
  }

  toggleActivationBulk(payload: {
    model: string
    ids: number[]
    action: number
    column?: string
  }): AxiosPromise {
    return axios.put('multi_toggle_activation', payload)
  }

  toggleActivation(payload: { model: string; id: number; column?: string }): AxiosPromise {
    return axios.put('toggle_activation', payload)
  }

  sortBulk(payload: { model: string; ids: number[]; target_id: number }): AxiosPromise {
    return axios.post('sorting', payload)
  }
}

export const sharedService = new SharedService()

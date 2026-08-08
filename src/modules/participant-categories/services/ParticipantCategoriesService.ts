import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type {
  ParticipantCategory,
  ParticipantCategoryBase,
} from '../interfaces/ParticipantCategory'

class ParticipantCategoriesService {
  contextPath = 'participant_categories'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getSingleItem(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  /** **************** post ******************/
  createItem(data: ParticipantCategoryBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: ParticipantCategory): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const participantCategoriesService = new ParticipantCategoriesService()

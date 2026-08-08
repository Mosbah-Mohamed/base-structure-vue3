import type { AxiosPromise } from 'axios'
import axios from 'axios'

class AuthService {
  contextPath = 'auth'

  getPermissions(): AxiosPromise {
    return axios.get(`${this.contextPath}/getMyPermissions`)
  }

  login(payload: { email: string; password: string }): AxiosPromise {
    return axios.post(`${this.contextPath}/login`, payload)
  }

  logout(): AxiosPromise {
    return axios.post(`${this.contextPath}/logout`)
  }
}

export const authService = new AuthService()

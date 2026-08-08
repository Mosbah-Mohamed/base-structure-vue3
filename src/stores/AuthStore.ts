import type { User } from '@/interfaces/Auth'
import { authService } from '@/services/AuthService'

interface State {
  authUser: User | null
}

export const useAuthStore = defineStore('authStore', {
  state: (): State => ({
    authUser: JSON.parse(localStorage.getItem('authUser') || 'null'),
  }),
  getters: {
    isAuthUser: (state) => !!state.authUser,
    getToken: (state) => state.authUser?.token,
    hasPermission:
      (state) =>
      (permission: string): boolean =>
        !!state.authUser?.permissions?.includes(permission),
    hasPermissions:
      (state) =>
      (permissions: string[]): boolean =>
        permissions.every((p) => state.authUser?.permissions?.includes(p)),
    hasAtLeaseOnePermission:
      (state) =>
      (permissions: string[]): boolean =>
        permissions.some((p) => state.authUser?.permissions?.includes(p)),
  },
  actions: {
    setAuthUser(user: User) {
      this.authUser = user
      localStorage.setItem('authUser', JSON.stringify(user))
    },
    clearAuthUser() {
      this.authUser = null
      localStorage.removeItem('authUser')
    },
    setUserPermissions(permissions: string[]) {
      if (this.authUser) {
        this.authUser.permissions = permissions
        localStorage.setItem('authUser', JSON.stringify(this.authUser))
      }
    },
    getPermissions() {
      return authService.getPermissions().then((res) => {
        this.setUserPermissions(res.data.data.permissions)
        return res.data.data.permissions
      })
    },
  },
})

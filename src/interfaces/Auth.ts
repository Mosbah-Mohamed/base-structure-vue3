export interface UserRole {
  id: number
  name: string
}

export interface User {
  id: number
  uuid: string
  name: string
  email: string
  image_path: string
  token: string
  created_at: string
  permissions: string[]
  roles: UserRole[]
  apps: string[]
}

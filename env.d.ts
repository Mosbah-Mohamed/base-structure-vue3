/// <reference types="vite/client" />

export {}

interface ImportMetaEnv {
  readonly VITE_BASE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'default' | 'forms' | 'blank'
    requiredPermission?: string
  }
}

import HomePage from '@/pages/HomePage.vue'
import { DemoCrudRoutes } from '@/modules/demo-crud/DemoCrudRoutes'
import { ParticipantCategoriesRoutes } from '@/modules/participant-categories/ParticipantCategoriesRoutes'
import { useAuthStore } from '@/stores/AuthStore'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: HomePage,
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/login',
      name: 'login-page',
      component: () => import('@/pages/LoginPage.vue'),
      meta: {
        layout: 'forms',
      },
    },
    {
      path: '/error',
      name: 'error-page',
      component: () => import('@/pages/ErrorPage.vue'),
      meta: {
        layout: 'blank',
      },
    },
    {
      path: '/demo-crud',
      name: 'demo-crud',
      component: () => import('@/modules/demo-crud/DemoCrudModule.vue'),
      meta: {
        layout: 'default',
      },
      children: DemoCrudRoutes,
    },
    {
      path: '/participant-categories',
      name: 'participant-categories',
      component: () => import('@/modules/participant-categories/ParticipantCategoriesModule.vue'),
      meta: {
        layout: 'default',
      },
      children: ParticipantCategoriesRoutes,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const { isAuthUser, hasPermission } = useAuthStore()

  if (to.meta.layout === 'default' && !isAuthUser) {
    next({ name: 'login-page', query: { redirect: to.fullPath } })
    return
  }

  if (
    isAuthUser &&
    to.meta.requiredPermission &&
    !hasPermission(to.meta.requiredPermission as string)
  ) {
    next({ name: 'error-page', query: { message: 'errors.you_are_not_authorized' } })
    return
  }

  next()
})

export default router

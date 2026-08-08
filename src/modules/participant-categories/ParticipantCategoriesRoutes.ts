export const ParticipantCategoriesRoutes = [
  {
    path: '',
    name: 'participant-categories-page',
    component: () => import('./pages/ParticipantCategoriesPage.vue'),
    meta: {
      requiredPermission: 'view_participant_categories',
    },
  },
]

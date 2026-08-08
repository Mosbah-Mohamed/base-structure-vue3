import { createCrudQueries } from '@/lib/query/createCrudQueries'
import type {
  ParticipantCategory,
  ParticipantCategoryBase,
} from '../interfaces/ParticipantCategory'
import { participantCategoriesService } from '../services/ParticipantCategoriesService'

export interface ParticipantCategoriesParams {
  page: number
  itemPerPage: number
  keyword: string
}

export const participantCategoriesQueries = createCrudQueries<
  ParticipantCategory,
  ParticipantCategoriesParams,
  ParticipantCategoryBase,
  ParticipantCategory
>('participant-categories', participantCategoriesService)

export const {
  useListQuery: useParticipantCategoriesQuery,
  useCreateMutation: useCreateParticipantCategoryMutation,
  useUpdateMutation: useUpdateParticipantCategoryMutation,
  useDeleteMutation: useDeleteParticipantCategoryMutation,
} = participantCategoriesQueries

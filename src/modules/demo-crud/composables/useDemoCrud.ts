import { createCrudQueries } from '@/lib/query/createCrudQueries'
import type { DemoItem, DemoItemBase } from '../interfaces/DemoItem'
import { demoCrudService, type DemoCrudParams } from '../services/DemoCrudService'

export type { DemoCrudParams }

export const demoCrudQueries = createCrudQueries<DemoItem, DemoCrudParams, DemoItemBase, DemoItem>(
  'demo-crud',
  demoCrudService,
)

export const {
  useListQuery: useDemoItemsQuery,
  useCreateMutation: useCreateDemoItemMutation,
  useUpdateMutation: useUpdateDemoItemMutation,
  useDeleteMutation: useDeleteDemoItemMutation,
} = demoCrudQueries

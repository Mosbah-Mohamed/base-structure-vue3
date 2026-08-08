import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { AxiosPromise } from 'axios'
import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ApiMessageResponse<T = unknown> {
  message?: string
  data?: T
}

export interface CrudService<
  TItem,
  TParams extends object = object,
  TCreate = Partial<TItem>,
  TUpdate = TItem,
> {
  getItem(params: TParams): AxiosPromise<PaginatedResponse<TItem>>
  createItem(data: TCreate): AxiosPromise<ApiMessageResponse<TItem>>
  editItem(data: TUpdate): AxiosPromise<ApiMessageResponse<TItem>>
  deleteItem(id: number): AxiosPromise<ApiMessageResponse>
}

export function createCrudQueries<
  TItem extends { id: number },
  TParams extends object,
  TCreate = Partial<TItem>,
  TUpdate = TItem,
>(resourceKey: string, service: CrudService<TItem, TParams, TCreate, TUpdate>) {
  const keys = {
    all: [resourceKey] as const,
    list: (params: TParams) => [...keys.all, 'list', params] as const,
  }

  function useListQuery(params: MaybeRefOrGetter<TParams>) {
    return useQuery({
      queryKey: computed(() => [...keys.all, 'list', toValue(params)] as readonly unknown[]),
      queryFn: async () => {
        const response = await service.getItem(toValue(params))
        return response.data
      },
    })
  }

  function useCreateMutation() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (data: TCreate) => service.createItem(data).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
    })
  }

  function useUpdateMutation() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (data: TUpdate) => service.editItem(data).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
    })
  }

  function useDeleteMutation() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: number) => service.deleteItem(id).then((res) => res.data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
    })
  }

  return {
    keys,
    useListQuery,
    useCreateMutation,
    useUpdateMutation,
    useDeleteMutation,
  }
}

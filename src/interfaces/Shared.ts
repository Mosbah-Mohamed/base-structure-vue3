export type ListViewMode = 'table' | 'cards'
export type CardsColumns = 1 | 2 | 3 | 4

export interface pageAction {
  icon?: 'create' | 'filter' | 'reset' | 'custom' | string
  label?: string
  show?: boolean
  handler?: () => void
}

export interface BulkService {
  deleteBulk: (payload: { model: string; ids: number[] }) => Promise<{ data: { message?: string } }>
  toggleActivationBulk: (payload: {
    model: string
    ids: number[]
    action: number
    column?: string
  }) => Promise<{ data: { message?: string } }>
}

export interface PageActionsProps {
  pageActionsButtons?: pageAction[]
  itemsPerPage?: number
  perPageOptions?: number[]
  showMultiDelete?: boolean
  showMultiActivate?: boolean
  showSearch?: boolean
  search?: string
  searchDebounceMs?: number
  selectedItems?: number[]
  model?: string
  column_multi_activate?: string
  bulkService?: BulkService
  showFilter?: boolean
  filterActive?: boolean
  showViewToggle?: boolean
  viewMode?: ListViewMode
  cardsColumns?: CardsColumns
  /** Wrap toolbar tools in a collapsible panel (default true). */
  collapsible?: boolean
  /** Initial open state when collapsible (default true). */
  defaultOpen?: boolean
}

export interface AppTableHeader {
  title: string
  key: string
  align?: 'start' | 'center' | 'end'
  hideInCards?: boolean
}

export interface AppTableMeta {
  current_page: number
  last_page: number
  per_page?: number
  total?: number
}

export interface NavMenuItem {
  id: string
  titleKey: string
  routeName: string
  icon: string
  permission?: string
  system?: boolean
}

import {
  DEFAULT_NAV_ITEMS,
  getDefaultNavPreferences,
  loadNavPreferences,
  saveNavPreferences,
  type NavPreferences,
} from '@/lib/nav'
import type { NavMenuItem } from '@/interfaces/Shared'

export const useNavStore = defineStore('navStore', {
  state: (): NavPreferences => loadNavPreferences(),
  getters: {
    orderedItems: (state): NavMenuItem[] => {
      const byId = new Map(DEFAULT_NAV_ITEMS.map((item) => [item.id, item]))
      return state.order.map((id) => byId.get(id)).filter((item): item is NavMenuItem => !!item)
    },
  },
  actions: {
    setOrder(order: string[]) {
      this.order = order
      this.persist()
    },
    toggleHidden(id: string) {
      this.hidden = this.hidden.includes(id)
        ? this.hidden.filter((value) => value !== id)
        : [...this.hidden, id]
      this.persist()
    },
    toggleFavorite(id: string) {
      this.favorites = this.favorites.includes(id)
        ? this.favorites.filter((value) => value !== id)
        : [...this.favorites, id]
      this.persist()
    },
    reset() {
      const defaults = getDefaultNavPreferences()
      this.order = defaults.order
      this.hidden = defaults.hidden
      this.favorites = defaults.favorites
      this.persist()
    },
    persist() {
      saveNavPreferences({
        order: this.order,
        hidden: this.hidden,
        favorites: this.favorites,
      })
    },
  },
})

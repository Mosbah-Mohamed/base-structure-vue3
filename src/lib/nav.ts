import type { Component } from 'vue'
import { FlaskConical, Home, LayoutGrid } from 'lucide-vue-next'
import type { NavMenuItem } from '@/interfaces/Shared'

/** Register icons here once; reference them by key on nav items. */
export const NAV_ICONS: Record<string, Component> = {
  home: Home,
  flask: FlaskConical,
  grid: LayoutGrid,
}

/**
 * Module nav registry. Add a new module with `registerNavItem(...)` — AppSidebar
 * reads from this list (do not edit the sidebar component for new links).
 */
export const DEFAULT_NAV_ITEMS: NavMenuItem[] = []

export function registerNavItem(item: NavMenuItem, icon?: Component) {
  if (icon && item.icon) {
    NAV_ICONS[item.icon] = icon
  }
  const existing = DEFAULT_NAV_ITEMS.findIndex((entry) => entry.id === item.id)
  if (existing >= 0) {
    DEFAULT_NAV_ITEMS[existing] = item
  } else {
    DEFAULT_NAV_ITEMS.push(item)
  }
}

registerNavItem({
  id: 'home',
  titleKey: 'nav.home',
  routeName: 'home-page',
  icon: 'home',
})

registerNavItem({
  id: 'demo-crud',
  titleKey: 'nav.demoCrud',
  routeName: 'demo-crud-page',
  icon: 'flask',
})

registerNavItem({
  id: 'participant-categories',
  titleKey: 'nav.participantCategories',
  routeName: 'participant-categories-page',
  icon: 'grid',
  permission: 'view_participant_categories',
})

export interface NavPreferences {
  order: string[]
  hidden: string[]
  favorites: string[]
}

const STORAGE_KEY = 'base-structure:nav-preferences'

export function getDefaultNavPreferences(): NavPreferences {
  return {
    order: DEFAULT_NAV_ITEMS.map((item) => item.id),
    hidden: [],
    favorites: [],
  }
}

export function loadNavPreferences(): NavPreferences {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return getDefaultNavPreferences()

  try {
    const parsed = JSON.parse(raw) as NavPreferences
    const knownIds = DEFAULT_NAV_ITEMS.map((item) => item.id)
    const order = [
      ...parsed.order.filter((id) => knownIds.includes(id)),
      ...knownIds.filter((id) => !parsed.order.includes(id)),
    ]
    return {
      order,
      hidden: parsed.hidden.filter((id) => knownIds.includes(id)),
      favorites: parsed.favorites.filter((id) => knownIds.includes(id)),
    }
  } catch {
    return getDefaultNavPreferences()
  }
}

export function saveNavPreferences(prefs: NavPreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

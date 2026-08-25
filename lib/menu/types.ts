// -------------------------------------------------------
// Menu System Types — Mannat Events Banquet Integration
// Additive types that extend MealSelection via menu_config
// -------------------------------------------------------

/**
 * A single selected item within a category.
 * Uses the item name as the identifier (source of truth).
 */
export interface CategorySelection {
  categoryId: string
  items: string[]
}

/**
 * The complete menu configuration for one meal (lunch or dinner).
 * Stored as menu_config inside MealSelection.
 * menu_item_names[0] still holds the package name for backward compat.
 */
export interface MenuConfig {
  packageId: string
  packageName: string
  pricePerHead: number
  mealType: 'veg' | 'non-veg'
  selections: CategorySelection[]
  liveStations: string[]
  addOns: string[]
}

/**
 * A single menu item inside a category.
 */
export interface MenuItemEntry {
  name: string
  subLabel?: string // optional note, e.g. "with Rotis/Rice/Curd"
}

/**
 * A category inside a package (e.g. "Soup", "Starters - Veg Indian")
 */
export interface MenuCategory {
  id: string
  label: string
  emoji: string
  /** Maximum number of items the user may select. undefined = unlimited/assorted. */
  limit?: number
  items: MenuItemEntry[]
}

/**
 * A single live station entry with its sub-items.
 */
export interface LiveStation {
  id: string
  label: string
  subItems: string[]
}

/**
 * A banquet package definition.
 */
export interface BanquetPackage {
  id: string
  name: string
  mealType: 'veg' | 'non-veg'
  pricePerHead: number
  tagline: string
  categories: MenuCategory[]
  liveStations: LiveStation[]
  addOns: string[]
}

import { NextRequest, NextResponse } from 'next/server'
import { getLocalDb, saveLocalDb } from '@/lib/supabase/mockDb'
import { ALL_BANQUET_PACKAGES } from '@/lib/menu/menuLibrary'

const DEFAULT_DECORATION_PACKAGES = [
  {
    id: 'silver',
    title: 'Silver Package',
    subtitle: 'Elegant Standard Decor',
    badge: 'Essential',
    features: [
      'Standard floral mandap setup',
      'Ambient LED warm lighting',
      'Welcome arch & walkway drapes',
      'Standard seating covers & runners',
    ],
    image_url: '/wedding_mandap.png',
    price: 280000,
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'gold',
    title: 'Gold Package',
    subtitle: 'Royal Mughal Aesthetics',
    badge: 'Popular',
    features: [
      'Ornate dome mandap with fresh blooms',
      'Fairytale fairytale fairy lights & chandelier',
      'Photobooth with floral backdrop',
      'Royal red sandstone stage backdrop',
    ],
    image_url: '/royal.jpg',
    price: 480000,
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'platinum',
    title: 'Platinum Package',
    subtitle: 'Opulent Palace Styling',
    badge: 'Premium',
    features: [
      'Custom grand stage with import flowers',
      'Taj-view entrance gate with mirrors',
      'Intricate floral aisles & varmala stage',
      'Architectural projection lighting',
    ],
    image_url: '/floral.jpg',
    price: 750000,
    is_active: true,
    sort_order: 3,
  },
  {
    id: 'luxury',
    title: 'Luxury Package',
    subtitle: 'Bespoke Imperial Extravaganza',
    badge: 'Signature',
    features: [
      'Fully customized imperial theme',
      'Exotic orchid & rose floral canopy',
      'Designer lounge furniture & bar setup',
      'Complete venue transformation & FX',
    ],
    image_url: '/venue_palace.png',
    price: 1100000,
    is_active: true,
    sort_order: 4,
  },
]

const DEFAULT_WEDDING_FUNCTIONS = [
  { name: 'Welcome Lunch', type: 'lunch', sort_order: 1 },
  { name: 'Welcome Dinner', type: 'dinner', sort_order: 2 },
  { name: 'Mehendi', type: 'both', sort_order: 3 },
  { name: 'Haldi', type: 'both', sort_order: 4 },
  { name: 'Sangeet', type: 'both', sort_order: 5 },
  { name: 'Wedding Ceremony', type: 'both', sort_order: 6 },
  { name: 'Mandap Decoration', type: 'both', sort_order: 7 },
  { name: 'Baraat', type: 'both', sort_order: 8 },
  { name: 'Hath Teela', type: 'both', sort_order: 9 },
  { name: 'Cocktail', type: 'both', sort_order: 10 },
  { name: 'Phere', type: 'both', sort_order: 11 },
  { name: 'Reception', type: 'both', sort_order: 12 },
  { name: 'Other', type: 'both', sort_order: 13 },
]

export async function GET(req: NextRequest) {
  try {
    const db = getLocalDb()

    // 1. Migrate Categories
    const categoryMap = new Map<string, any>()
    let catSort = 1
    for (const pkg of ALL_BANQUET_PACKAGES) {
      for (const cat of pkg.categories) {
        if (!categoryMap.has(cat.id)) {
          categoryMap.set(cat.id, {
            id: cat.id,
            label: cat.label,
            emoji: cat.emoji,
            sort_order: catSort++,
          })
        }
      }
    }
    db.menu_categories = Array.from(categoryMap.values())

    // 2. Migrate Menu Items
    const itemMap = new Map<string, any>()
    let itemSort = 1
    for (const pkg of ALL_BANQUET_PACKAGES) {
      for (const cat of pkg.categories) {
        for (const item of cat.items) {
          const key = `${item.name}-${pkg.mealType}`
          if (!itemMap.has(key)) {
            itemMap.set(key, {
              id: crypto.randomUUID(),
              name: item.name,
              sub_label: item.subLabel || null,
              type: pkg.mealType,
              is_active: true,
              sort_order: itemSort++,
            })
          }
        }
      }
    }
    db.menu_items = Array.from(itemMap.values())

    // 3. Migrate Banquet Packages
    const packageList: any[] = []
    let pkgSort = 1
    for (const pkg of ALL_BANQUET_PACKAGES) {
      packageList.push({
        id: pkg.id,
        name: pkg.name,
        meal_type: pkg.mealType,
        price_per_head: pkg.pricePerHead,
        tagline: pkg.tagline,
        is_active: true,
        sort_order: pkgSort++,
      })
    }
    db.banquet_packages = packageList

    // 4. Migrate Package Categories & Package Items (limits & contents mappings)
    const packageCategories: any[] = []
    const packageItems: any[] = []
    
    for (const pkg of ALL_BANQUET_PACKAGES) {
      let pcSort = 1
      for (const cat of pkg.categories) {
        packageCategories.push({
          package_id: pkg.id,
          category_id: cat.id,
          limit_count: cat.limit !== undefined ? cat.limit : null,
          sort_order: pcSort++,
        })

        for (const item of cat.items) {
          const itemKey = `${item.name}-${pkg.mealType}`
          const matchedItem = db.menu_items.find((i: any) => i.name === item.name && i.type === pkg.mealType)
          if (matchedItem) {
            packageItems.push({
              package_id: pkg.id,
              category_id: cat.id,
              item_id: matchedItem.id,
            })
          }
        }
      }
    }
    db.package_categories = packageCategories
    db.package_items = packageItems

    // 5. Migrate Live Stations & Station Items
    const liveStationMap = new Map<string, any>()
    const liveStationItems: any[] = []
    const packageLiveStations: any[] = []
    let stationSort = 1

    for (const pkg of ALL_BANQUET_PACKAGES) {
      for (const station of pkg.liveStations) {
        if (!liveStationMap.has(station.id)) {
          liveStationMap.set(station.id, {
            id: station.id,
            label: station.label,
            is_active: true,
            sort_order: stationSort++,
          })

          let itemOrder = 1
          for (const subItem of station.subItems) {
            liveStationItems.push({
              id: crypto.randomUUID(),
              station_id: station.id,
              name: subItem,
              sort_order: itemOrder++,
            })
          }
        }

        packageLiveStations.push({
          package_id: pkg.id,
          station_id: station.id,
        })
      }
    }
    db.live_stations = Array.from(liveStationMap.values())
    db.live_station_items = liveStationItems
    db.package_live_stations = packageLiveStations

    // 6. Migrate Add-ons & Package Add-ons
    const addOnSet = new Set<string>()
    const packageAddons: any[] = []
    for (const pkg of ALL_BANQUET_PACKAGES) {
      for (const addOn of pkg.addOns) {
        addOnSet.add(addOn)
        packageAddons.push({
          package_id: pkg.id,
          addon_name: addOn,
        })
      }
    }
    
    let addOnSort = 1
    db.menu_addons = Array.from(addOnSet).map(name => ({
      name,
      is_active: true,
      sort_order: addOnSort++,
    }))
    db.package_addons = packageAddons

    // 7. Migrate Decoration Packages
    db.decoration_packages = DEFAULT_DECORATION_PACKAGES

    // 8. Migrate Wedding Functions
    let fnId = 1
    db.wedding_functions = DEFAULT_WEDDING_FUNCTIONS.map(fn => ({
      id: crypto.randomUUID(),
      name: fn.name,
      type: fn.type,
      is_active: true,
      sort_order: fn.sort_order,
    }))

    // Save database state
    saveLocalDb(db)

    return NextResponse.json({
      ok: true,
      message: 'Migrated all menu data, decoration packages and functions to local_db.json successfully',
      stats: {
        categories: db.menu_categories.length,
        items: db.menu_items.length,
        packages: db.banquet_packages.length,
        liveStations: db.live_stations.length,
        addons: db.menu_addons.length,
        decorations: db.decoration_packages.length,
        functions: db.wedding_functions.length,
      }
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({ error: error.message || error }, { status: 500 })
  }
}

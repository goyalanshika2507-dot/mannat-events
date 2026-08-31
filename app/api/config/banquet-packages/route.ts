import { NextResponse } from 'next/server'
import { mockSupabase } from '@/lib/supabase/mockDb'

/**
 * GET /api/config/banquet-packages
 * Returns all active banquet packages with their categories, items, live stations and add-ons.
 * This is the single source of truth for the customer booking wizard.
 */
export async function GET() {
  try {
    // Fetch packages
    const { data: packages } = await mockSupabase.from('banquet_packages').select()
    const activePackages = (packages ?? []).filter((p: any) => p.is_active)

    // Fetch categories
    const { data: categories } = await mockSupabase.from('menu_categories').select()

    // Fetch items (only active)
    const { data: items } = await mockSupabase.from('menu_items').select()
    const activeItems = (items ?? []).filter((i: any) => i.is_active)

    // Fetch package_categories (limits)
    const { data: pkgCats } = await mockSupabase.from('package_categories').select()

    // Fetch package_items (dish assignments)
    const { data: pkgItems } = await mockSupabase.from('package_items').select()

    // Fetch live stations
    const { data: stations } = await mockSupabase.from('live_stations').select()
    const activeStations = (stations ?? []).filter((s: any) => s.is_active)

    // Fetch station items
    const { data: stationItems } = await mockSupabase.from('live_station_items').select()

    // Fetch package live station associations
    const { data: pkgStations } = await mockSupabase.from('package_live_stations').select()

    // Fetch add-ons
    const { data: addons } = await mockSupabase.from('menu_addons').select()
    const activeAddons = (addons ?? []).filter((a: any) => a.is_active)

    // Fetch package add-on associations
    const { data: pkgAddons } = await mockSupabase.from('package_addons').select()

    // Build rich package objects
    const enriched = activePackages.map((pkg: any) => {
      // Get categories for this package, sorted
      const myCats = (pkgCats ?? [])
        .filter((pc: any) => pc.package_id === pkg.id)
        .sort((a: any, b: any) => a.sort_order - b.sort_order)

      const enrichedCats = myCats.map((pc: any) => {
        const catDef = (categories ?? []).find((c: any) => c.id === pc.category_id)
        
        // Get active items for this package/category
        const myItems = (pkgItems ?? [])
          .filter((pi: any) => pi.package_id === pkg.id && pi.category_id === pc.category_id)
          .map((pi: any) => activeItems.find((i: any) => i.id === pi.item_id))
          .filter(Boolean)
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((i: any) => ({ name: i.name, subLabel: i.sub_label || undefined }))

        return {
          id: pc.category_id,
          label: catDef?.label ?? pc.category_id,
          emoji: catDef?.emoji ?? '🍽️',
          limit: pc.limit_count ?? undefined,
          items: myItems,
        }
      })

      // Get live stations for this package
      const myStationIds = (pkgStations ?? [])
        .filter((ps: any) => ps.package_id === pkg.id)
        .map((ps: any) => ps.station_id)

      const enrichedStations = activeStations
        .filter((s: any) => myStationIds.includes(s.id))
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((s: any) => ({
          id: s.id,
          label: s.label,
          subItems: (stationItems ?? [])
            .filter((si: any) => si.station_id === s.id)
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((si: any) => si.name),
        }))

      // Get add-ons for this package
      const myAddonNames = (pkgAddons ?? [])
        .filter((pa: any) => pa.package_id === pkg.id)
        .map((pa: any) => pa.addon_name)

      const enrichedAddons = activeAddons
        .filter((a: any) => myAddonNames.includes(a.name))
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((a: any) => a.name)

      return {
        id: pkg.id,
        name: pkg.name,
        mealType: pkg.meal_type,
        pricePerHead: pkg.price_per_head,
        tagline: pkg.tagline,
        categories: enrichedCats,
        liveStations: enrichedStations,
        addOns: enrichedAddons,
      }
    }).sort((a: any, b: any) => {
      const ap = activePackages.find((p: any) => p.id === a.id)
      const bp = activePackages.find((p: any) => p.id === b.id)
      return (ap?.sort_order ?? 0) - (bp?.sort_order ?? 0)
    })

    return NextResponse.json(enriched)
  } catch (error: any) {
    console.error('[/api/config/banquet-packages]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

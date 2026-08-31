import { NextRequest, NextResponse } from 'next/server'
import { mockSupabase } from '@/lib/supabase/mockDb'
import { requireAdmin } from '@/lib/auth/guards'

/**
 * GET /api/admin/package-config
 * Returns full package config: package_categories + package_items for all packages
 */
export async function GET() {
  try {
    const { data: pkgCats } = await mockSupabase.from('package_categories').select()
    const { data: pkgItems } = await mockSupabase.from('package_items').select()
    return NextResponse.json({ pkgCats: pkgCats ?? [], pkgItems: pkgItems ?? [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/package-config
 * Update a package-category limit count
 */
export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { package_id, category_id, limit_count } = await req.json()
    if (!package_id || !category_id) return NextResponse.json({ error: 'package_id and category_id required' }, { status: 400 })
    
    const db = (await mockSupabase.from('package_categories').select()).data ?? []
    const exists = db.find((r: any) => r.package_id === package_id && r.category_id === category_id)
    
    if (!exists) return NextResponse.json({ error: 'Package category not found' }, { status: 404 })
    
    // Update limit_count
    const { data: updated } = await mockSupabase
      .from('package_categories')
      .update({ limit_count })
      .eq('package_id', package_id)
      .eq('category_id', category_id)
      .select()

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/admin/package-config
 * Add an item to a package category
 */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { package_id, category_id, item_id } = await req.json()
    if (!package_id || !category_id || !item_id) {
      return NextResponse.json({ error: 'package_id, category_id, item_id required' }, { status: 400 })
    }
    const { data, error } = await mockSupabase.from('package_items').insert({ package_id, category_id, item_id })
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/package-config
 * Remove an item from a package category
 */
export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { package_id, category_id, item_id } = await req.json()
    if (!package_id || !category_id || !item_id) {
      return NextResponse.json({ error: 'package_id, category_id, item_id required' }, { status: 400 })
    }
    
    const { getLocalDb, saveLocalDb } = await import('@/lib/supabase/mockDb')
    const fullDb = getLocalDb()
    fullDb.package_items = (fullDb.package_items ?? []).filter((r: any) => !(r.package_id === package_id && r.category_id === category_id && r.item_id === item_id))
    saveLocalDb(fullDb)
    
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

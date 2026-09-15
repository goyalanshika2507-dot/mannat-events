import { NextRequest, NextResponse } from 'next/server'
import { mockSupabase } from '@/lib/supabase/mockDb'
import { requireAdmin } from '@/lib/auth/guards'

export async function GET() {
  try {
    const { data } = await mockSupabase.from('menu_items').select()
    const sorted = (data ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)
    return NextResponse.json(sorted)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  try {
    const body = await req.json()
    if (!body.name || !body.type) return NextResponse.json({ error: 'name and type required' }, { status: 400 })
    const { data, error } = await mockSupabase.from('menu_items').insert({
      name: body.name,
      sub_label: body.sub_label || null,
      type: body.type,
      price: Number(body.price ?? 0),
      is_active: true,
      sort_order: body.sort_order ?? 99,
    })
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  try {
    const { id, ...rest } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const { data, error } = await mockSupabase.from('menu_items').update(rest).eq('id', id).select()
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const { error } = await mockSupabase.from('menu_items').delete().eq('id', id)
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

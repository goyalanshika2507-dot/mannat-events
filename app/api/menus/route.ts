import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[GET /api/menus]', error)
    return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 })
  }

  // Group by type
  const veg    = (data ?? []).filter((m: any) => m.type === 'veg')
  const nonVeg = (data ?? []).filter((m: any) => m.type === 'non-veg')

  return NextResponse.json({ veg, 'non-veg': nonVeg })
}

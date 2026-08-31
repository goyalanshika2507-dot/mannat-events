import { NextRequest, NextResponse } from 'next/server'
import { mockSupabase } from '@/lib/supabase/mockDb'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      table,
      action,
      filters,
      updates,
      inserts,
      sortColumn,
      sortAscending,
      limitCount,
      isSingle,
    } = body

    if (!table) {
      return NextResponse.json({ error: 'table is required' }, { status: 400 })
    }

    let query: any = mockSupabase.from(table)

    // Apply filters
    if (filters && Array.isArray(filters)) {
      for (const filter of filters) {
        if (filter.type === 'eq') {
          query = query.eq(filter.column, filter.value)
        } else if (filter.type === 'in') {
          query = query.in(filter.column, filter.values)
        }
      }
    }

    // Apply ordering
    if (sortColumn) {
      query = query.order(sortColumn, { ascending: sortAscending })
    }

    // Apply limit
    if (limitCount !== null && limitCount !== undefined) {
      query = query.limit(limitCount)
    }

    // Apply single
    if (isSingle) {
      query = query.single()
    }

    // Execute based on action
    let result: any
    if (action === 'select') {
      result = await query.select()
    } else if (action === 'insert') {
      result = await query.insert(inserts)
    } else if (action === 'update') {
      result = await query.update(updates)
    } else if (action === 'delete') {
      result = await query.delete()
    } else {
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Supabase proxy error:', error)
    return NextResponse.json({ data: null, error: { message: error.message || error } }, { status: 500 })
  }
}

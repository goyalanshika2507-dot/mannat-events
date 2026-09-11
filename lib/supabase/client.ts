'use client'

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

class MockBrowserQuery {
  private table: string
  private filters: any[] = []
  private updates: any = null
  private inserts: any = null
  private action: string = 'select'
  private sortColumn: string | null = null
  private sortAscending: boolean = true
  private limitCount: number | null = null
  private isSingle: boolean = false

  constructor(table: string) {
    this.table = table
  }

  select(columns?: string) {
    return this
  }

  eq(column: string, value: any) {
    this.filters.push({ type: 'eq', column, value })
    return this
  }

  in(column: string, values: any[]) {
    this.filters.push({ type: 'in', column, values })
    return this
  }

  order(column: string, { ascending = true } = {}) {
    this.sortColumn = column
    this.sortAscending = ascending
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  insert(row: any) {
    this.action = 'insert'
    this.inserts = row
    return this
  }

  update(updates: any) {
    this.action = 'update'
    this.updates = updates
    return this
  }

  delete() {
    this.action = 'delete'
    return this
  }

  async execute(): Promise<{ data: any; error: any }> {
    try {
      const res = await fetch('/api/supabase-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: this.table,
          action: this.action,
          filters: this.filters,
          updates: this.updates,
          inserts: this.inserts,
          sortColumn: this.sortColumn,
          sortAscending: this.sortAscending,
          limitCount: this.limitCount,
          isSingle: this.isSingle,
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        return { data: null, error: { message: errData.error || 'Proxy error' } }
      }
      return await res.json()
    } catch (err: any) {
      return { data: null, error: { message: err?.message || 'Network error' } }
    }
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any): Promise<any> {
    return this.execute().then(onfulfilled, onrejected)
  }
}

export const mockBrowserSupabase = {
  from(table: string) {
    return new MockBrowserQuery(table)
  },
  auth: {
    async getUser() {
      let session: string | null = null
      if (typeof window !== 'undefined') {
        const match = document.cookie.match(new RegExp('(^| )mannat-session=([^;]+)'))
        session = match ? decodeURIComponent(match[2]) : null
      }
      if (!session) {
        return { data: { user: null }, error: null }
      }
      return {
        data: {
          user: {
            id: 'user-' + session,
            phone: session,
            user_metadata: { phone: session },
          },
        },
        error: null,
      }
    },
    async signInWithPassword() {
      return { data: { user: null }, error: { message: 'Use phone OTP authentication instead.' } }
    },
    async signUp() {
      return { data: { user: null }, error: { message: 'Use phone OTP authentication instead.' } }
    },
    async signInWithOtp() {
      return { data: null, error: null }
    },
    async verifyOtp() {
      return { data: { session: {} }, error: null }
    },
    async signOut() {
      if (typeof window !== 'undefined') {
        document.cookie = 'mannat-session=; path=/; max-age=0'
      }
      return { error: null }
    },
    async resetPasswordForEmail() {
      return { error: null }
    },
    async updateUser() {
      return { data: null, error: null }
    },
    onAuthStateChange() {
      return { data: { subscription: { unsubscribe() {} } } }
    },
  },
}

export function createClient() {
  if (supabaseUrl && supabaseAnonKey) {
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return mockBrowserSupabase as any
}
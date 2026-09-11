import 'server-only'
import fs from 'node:fs'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), 'supabase', 'local_db.json')

export function getLocalDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
      menu_categories: [],
      menu_items: [],
      banquet_packages: [],
      package_categories: [],
      package_items: [],
      live_stations: [],
      live_station_items: [],
      package_live_stations: [],
      menu_addons: [],
      package_addons: [],
      decoration_packages: [],
      wedding_functions: [],
      bookings: [],
      profiles: [
        {
          id: 'admin-user-id',
          email: 'admin@mannatevents.com',
          full_name: 'Mannat Admin',
          role: 'admin',
          phone: '+918888888888'
        }
      ]
    }, null, 2))
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
}

export function saveLocalDb(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

class MockQuery {
  private table: string
  private filters: Array<(row: any) => boolean> = []
  private sortColumn: string | null = null
  private sortAscending: boolean = true
  private limitCount: number | null = null
  private isSingle: boolean = false
  private action: 'select' | 'insert' | 'update' | 'delete' | 'upsert' = 'select'
  private updates: any = null
  private inserts: any = null
  // selectColumns is tracked separately so calling .select() after .insert() does NOT
  // reset the action — it only records which columns to return from the write result.
  private selectColumns: string | null = null

  constructor(table: string) {
    this.table = table
  }

  select(columns?: string) {
    // Only switch to 'select' action when no write action has been set yet
    if (this.action === 'select') {
      this.action = 'select'
    }
    this.selectColumns = columns ?? null
    return this
  }

  eq(column: string, value: any) {
    this.filters.push(row => row[column] === value)
    return this
  }

  in(column: string, values: any[]) {
    this.filters.push(row => values.includes(row[column]))
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

  upsert(row: any, options?: any) {
    this.action = 'upsert'
    this.inserts = row
    return this
  }

  async execute(): Promise<any> {
    const db = getLocalDb()
    let data = db[this.table] || []

    if (this.action === 'select') {
      for (const filter of this.filters) {
        data = data.filter(filter)
      }

      if (this.sortColumn) {
        data.sort((a: any, b: any) => {
          const valA = a[this.sortColumn!]
          const valB = b[this.sortColumn!]
          if (valA < valB) return this.sortAscending ? -1 : 1
          if (valA > valB) return this.sortAscending ? 1 : -1
          return 0
        })
      }

      if (this.limitCount !== null) {
        data = data.slice(0, this.limitCount)
      }

      if (this.isSingle) {
        return { data: data[0] || null, error: null }
      }

      return { data, error: null }
    }

    if (this.action === 'insert' || this.action === 'upsert') {
      const rows = Array.isArray(this.inserts) ? this.inserts : [this.inserts]
      const inserted: any[] = []

      for (const r of rows) {
        const newRow = { 
          id: r.id || crypto.randomUUID(), 
          created_at: r.created_at || new Date().toISOString(), 
          updated_at: r.updated_at || new Date().toISOString(), 
          ...r 
        }
        
        if (this.action === 'upsert') {
          const index = data.findIndex((x: any) => x.id === newRow.id)
          if (index !== -1) {
            data[index] = newRow
          } else {
            data.push(newRow)
          }
        } else {
          data.push(newRow)
        }
        
        inserted.push(newRow)
      }

      db[this.table] = data
      saveLocalDb(db)

      // Return inserted data (mimics Supabase .insert().select() behaviour)
      const result = Array.isArray(this.inserts) ? inserted : inserted[0]
      if (this.isSingle) {
        return { data: Array.isArray(result) ? result[0] : result, error: null }
      }
      return { data: result, error: null }
    }

    if (this.action === 'update') {
      let updatedRows: any[] = []
      db[this.table] = data.map((row: any) => {
        let matches = true
        for (const filter of this.filters) {
          if (!filter(row)) matches = false
        }
        if (matches) {
          const updated = { ...row, ...this.updates, updated_at: new Date().toISOString() }
          updatedRows.push(updated)
          return updated
        }
        return row
      })

      saveLocalDb(db)
      return { data: this.isSingle ? updatedRows[0] || null : updatedRows, error: null }
    }

    if (this.action === 'delete') {
      const remainingRows: any[] = []
      const deletedRows: any[] = []

      for (const row of data) {
        let matches = true
        for (const filter of this.filters) {
          if (!filter(row)) matches = false
        }
        if (matches) {
          deletedRows.push(row)
        } else {
          remainingRows.push(row)
        }
      }

      db[this.table] = remainingRows
      saveLocalDb(db)
      return { data: deletedRows, error: null }
    }

    return { data: null, error: null }
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any): Promise<any> {
    return this.execute().then(onfulfilled, onrejected)
  }
}

export const mockSupabase = {
  from(table: string) {
    return new MockQuery(table)
  },
  auth: {
    async getUser(...args: any[]): Promise<{ data: { user: any }, error: any }> {
      let session: string | null = null

      if (typeof window !== 'undefined') {
        const match = document.cookie.match(new RegExp('(^| )mannat-session=([^;]+)'))
        session = match ? decodeURIComponent(match[2]) : null
      } else {
        try {
          const { cookies } = await import('next/headers')
          const cookieStore = await cookies()
          session = cookieStore.get('mannat-session')?.value || null
        } catch (e) {
          session = null
        }
      }

      if (!session) {
        return { data: { user: null }, error: null }
      }

      const db = getLocalDb()
      const profile = (db.profiles || []).find((p: any) => p.phone === session)
      if (!profile) {
        return { data: { user: null }, error: null }
      }

      const user = {
        id: profile.id,
        email: profile.email || '',
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: { role: profile.role, full_name: profile.full_name },
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString(),
        phone: profile.phone
      }

      return { data: { user }, error: null }
    },
    async signInWithPassword(...args: any[]): Promise<{ data: any, error: any }> {
      return { data: { user: null }, error: { message: 'Use phone OTP authentication instead.' } }
    },
    async signUp(...args: any[]): Promise<{ data: any, error: any }> {
      return { data: { user: null }, error: { message: 'Use phone OTP authentication instead.' } }
    },
    async signInWithOtp(...args: any[]): Promise<{ data: any, error: any }> {
      return { data: null, error: null }
    },
    async verifyOtp(...args: any[]): Promise<{ data: any, error: any }> {
      return { data: { session: {} }, error: null }
    },
    async signOut(...args: any[]): Promise<{ error: any }> {
      // Clear cookie in browser if client calls it
      if (typeof window !== 'undefined') {
        document.cookie = 'mannat-session=; path=/; max-age=0'
      }
      return { error: null }
    },
    async resetPasswordForEmail(...args: any[]): Promise<{ error: any }> {
      return { error: null }
    },
    async updateUser(...args: any[]): Promise<{ data: any, error: any }> {
      return { data: null, error: null }
    },
    async resend(...args: any[]): Promise<{ error: any }> {
      return { error: null }
    },
    async exchangeCodeForSession(...args: any[]): Promise<{ data: any, error: any }> {
      return { data: { session: {} }, error: null }
    },
    onAuthStateChange(callback: any) {
      return { data: { subscription: { unsubscribe() {} } } }
    }
  }
}

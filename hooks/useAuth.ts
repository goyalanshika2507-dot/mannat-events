'use client'

import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import { useEffect, useState } from 'react'

interface AuthState {
  profile: Profile | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ profile: null, loading: true })

  useEffect(() => {
    const supabase = createClient()

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setState({ profile: null, loading: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setState({ profile: profile ?? null, loading: false })
    }

    loadProfile()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadProfile()
    })

    return () => subscription.unsubscribe()
  }, [])

  return state
}

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getLocalDb } from '@/lib/supabase/mockDb'

/**
 * Resolves the current user's profile from the mannat-session cookie or Supabase auth.
 * Returns { profile, user } on success, or { error, status } on failure.
 */
export async function resolveUser(req?: NextRequest) {
  let session: string | null = null

  // 1. Try reading from request headers cookie (middleware/proxy context)
  if (req) {
    session = req.cookies.get('mannat-session')?.value ?? null
  }

  // 2. Fall back to next/headers cookies (route handler / server layout context)
  if (!session) {
    try {
      const cookieStore = await cookies()
      session = cookieStore.get('mannat-session')?.value ?? null
    } catch {
      session = null
    }
  }

  // 3. Try Supabase Auth user if available
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    if (authData?.user) {
      const serviceClient = createServiceClient()
      const { data: profile } = await serviceClient
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profile) {
        return { profile, user: authData.user }
      }
      return {
        profile: {
          id: authData.user.id,
          email: authData.user.email || '',
          phone: authData.user.phone || '',
          role: 'user',
          full_name: authData.user.user_metadata?.full_name || 'Authenticated User'
        },
        user: authData.user
      }
    }
  } catch {
    /* fallback to session cookie lookup */
  }

  if (!session) {
    return { error: 'Not authenticated', status: 401 }
  }

  // 4. Look up profile by phone number in database / local_db
  try {
    const serviceClient = createServiceClient()
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('*')
      .eq('phone', session)
      .single()

    if (profile) {
      const user = {
        id: profile.id,
        email: profile.email || '',
        phone: profile.phone,
        role: profile.role || 'user',
        full_name: profile.full_name || 'Authenticated User'
      }
      return { profile, user }
    }
  } catch {
    /* fallback to localDb search */
  }

  try {
    const db = getLocalDb()
    const profile = (db.profiles || []).find((p: any) => p.phone === session)
    if (profile) {
      const user = {
        id: profile.id,
        email: profile.email || '',
        phone: profile.phone,
        role: profile.role || 'user',
        full_name: profile.full_name || 'Authenticated User'
      }
      return { profile, user }
    }
  } catch {
    /* ignore fallback error */
  }

  // 5. Test mode fallback: if session phone cookie exists, construct user profile for testing
  const fallbackUser = {
    id: 'user-' + session.replace(/\D/g, ''),
    phone: session,
    email: `${session.replace(/\D/g, '')}@mannatevents.com`,
    full_name: 'Authenticated User',
    role: 'admin'
  }

  return { profile: fallbackUser, user: fallbackUser }
}

/**
 * Guard for admin-only route handlers.
 * Returns { profile } on success, or a NextResponse 401/403 on failure.
 */
export async function requireAdmin(req?: NextRequest): Promise<
  | { profile: any; error?: undefined }
  | { error: NextResponse; profile?: undefined }
> {
  const result = await resolveUser(req)

  if ('error' in result && !result.profile) {
    return {
      error: NextResponse.json(
        { error: result.error },
        { status: result.status as number }
      ),
    }
  }

  const profile = result.profile!

  // TEMPORARY OVERRIDE FOR TESTING PHASE:
  // Any authenticated user can access admin APIs during testing phase.
  // Set DEV_ALLOW_ANY_PHONE = false when real admin phone numbers are provided.
  const DEV_ALLOW_ANY_PHONE = true

  if (!DEV_ALLOW_ANY_PHONE) {
    if (profile.role !== 'admin') {
      return {
        error: NextResponse.json(
          { error: 'Forbidden: admin access required' },
          { status: 403 }
        ),
      }
    }
  }

  return { profile }
}

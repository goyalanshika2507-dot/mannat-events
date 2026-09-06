import { NextResponse, type NextRequest } from 'next/server'
import { mockSupabase } from '@/lib/supabase/mockDb'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Retrieve user session dynamically using mock database cookie reader
  const {
    data: { user },
  } = await mockSupabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ---- Public landing page ----
  if (pathname === '/') {
    return supabaseResponse
  }

  // ---- Unauthenticated redirect ----
  const protectedPaths = ['/dashboard', '/admin']
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // ---- Admin role authorization check ----
  if (pathname.startsWith('/admin')) {
    // Read local database directly to verify role
    const { getLocalDb } = await import('@/lib/supabase/mockDb')
    const db = getLocalDb()
    const profile = db.profiles?.find((p: any) => p.id === user?.id)

    // TEMPORARY OVERRIDE FOR TESTING PHASE:
    // Any authenticated phone + OTP 0000 can access /admin during testing.
    const DEV_ALLOW_ANY_PHONE = true

    if (!DEV_ALLOW_ANY_PHONE) {
      if (!profile || profile.role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  }

  // ---- Redirect authenticated users away from auth pages ----
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone()
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard'
    url.pathname = redirectTo
    url.searchParams.delete('redirectTo')
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

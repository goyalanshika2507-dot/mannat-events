import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  // Retrieve user session dynamically from the mannat-session cookie
  const sessionCookie = request.cookies.get('mannat-session')?.value
  const hasUser = !!sessionCookie

  // ---- Public landing page ----
  if (pathname === '/') {
    return supabaseResponse
  }

  // ---- Unauthenticated redirect ----
  const protectedPaths = ['/dashboard', '/admin']
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (!hasUser && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // ---- Admin role authorization check ----
  if (pathname.startsWith('/admin')) {
    // TEMPORARY OVERRIDE FOR TESTING PHASE:
    // Any authenticated phone + OTP 0000 can access /admin during testing.
    const DEV_ALLOW_ANY_PHONE = true

    if (!DEV_ALLOW_ANY_PHONE && !hasUser) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // ---- Redirect authenticated users away from auth pages ----
  if (hasUser && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone()
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard'
    if (redirectTo !== '/login' && redirectTo !== '/signup') {
      url.pathname = redirectTo
      url.searchParams.delete('redirectTo')
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

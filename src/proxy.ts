import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// Admin route protection (Next.js 16 "proxy" — the renamed `middleware`).
//
// Scope: this runs ONLY on /admin/* (see `config.matcher`), so the public site
// is never touched. Responsibilities:
//   1. Refresh the Supabase auth session (per @supabase/ssr) so tokens stay valid.
//   2. Gate protected /admin/* pages behind an admin check sourced from the
//      database (`profiles.role`), never from anything client-controlled.
//
// /admin/login and /admin/reset-password are the only public /admin paths.
// The password-reset / invite email links land on /auth/callback (its own route
// handler), which is outside this matcher.
//
// NOTE (defense in depth): Server Functions (Server Actions) POST to the route
// they live on. A matcher change could silently drop proxy coverage, so the
// protected admin layout ALSO re-checks auth server-side. Never rely on this
// proxy alone for authorization of mutations.
// ---------------------------------------------------------------------------

const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/reset-password']

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() revalidates the token against Supabase Auth. Do NOT trust
  // getSession() here — its user data is not guaranteed to be authentic.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )

  if (isPublicAdminPath) {
    // Bounce already-authenticated admins off the login page to the dashboard.
    if (pathname === '/admin/login' && user && (await isAdmin(supabase, user.id))) {
      return redirectTo('/admin', request, response)
    }
    return response
  }

  // Everything else under /admin/* is protected.
  if (!user) {
    return redirectTo('/admin/login', request, response)
  }
  if (!(await isAdmin(supabase, user.id))) {
    // Authenticated but not an admin: deny. (RLS also blocks their data access.)
    return redirectTo('/admin/login?error=not_authorized', request, response)
  }

  return response
}

async function isAdmin(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<boolean> {
  // RLS (profiles_self_select) lets a user read their own profile row.
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  return data?.role === 'admin'
}

// Redirect while preserving any refreshed-session cookies set on `response`.
function redirectTo(target: string, request: NextRequest, response: NextResponse) {
  const [path, query] = target.split('?')
  const url = request.nextUrl.clone()
  url.pathname = path
  url.search = query ? `?${query}` : ''

  const redirect = NextResponse.redirect(url)
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
  return redirect
}

export const config = {
  matcher: ['/admin/:path*'],
}

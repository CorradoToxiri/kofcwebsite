import { createSupabaseServerClient } from '@/lib/supabase/server'

// Defense-in-depth admin check for Route Handlers. Route Handlers are NOT
// wrapped by the (protected) layout's React guard — only the proxy matcher
// (`/admin/:path*`) covers them — so any route.ts under /admin must re-check
// here, mirroring proxy.ts and (protected)/layout.tsx.
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false as const, status: 401 as const }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { ok: false as const, status: 403 as const }
  }

  return { ok: true as const, supabase }
}

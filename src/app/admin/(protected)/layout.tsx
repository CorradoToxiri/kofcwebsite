import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import AdminSidebar from '../_components/AdminSidebar'
import AdminTopbar from '../_components/AdminTopbar'
import AdminChromeStyles from '../_components/AdminChromeStyles'

// Server-side guard for every protected admin page. This duplicates the proxy's
// check on purpose (defense in depth): Server Actions added in later slices POST
// to these routes, and a matcher change must never be the only thing standing
// between a non-admin and the admin UI.
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, email, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/admin/login?error=not_authorized')
  }

  const who = profile.display_name?.trim() || profile.email

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <div className="admin-main">
        <AdminTopbar />

        <div className="admin-banner" role="status">
          <span className="admin-banner-dot" aria-hidden="true" />
          ADMIN MODE — logged in as {who}
        </div>

        <main className="admin-content">{children}</main>
      </div>

      <AdminChromeStyles />
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function AdminTopbar() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    if (!window.confirm('Log out of the admin?')) return
    setLoggingOut(true)
    await supabase.auth.signOut()
    // Full navigation so the proxy re-evaluates with the cleared cookies.
    window.location.assign('/admin/login')
  }

  return (
    <header className="atb">
      <Link href="/admin" className="atb-brand">
        KofC 6033 <span className="atb-brand-dot">·</span> <span className="atb-brand-admin">Admin</span>
      </Link>

      <div className="atb-actions">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="atb-btn atb-btn-ghost"
        >
          Preview site
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
        <button
          type="button"
          className="atb-btn atb-btn-logout"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </header>
  )
}

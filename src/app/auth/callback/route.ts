import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// Landing point for Supabase email links (password recovery + admin invite).
// Those links resolve to Supabase's verify endpoint which then redirects here
// with a PKCE `code`. We exchange it for a session (setting auth cookies), then
// forward the user to `next` — the set-new-password page for recovery/invite.
//
// The email-OTP *code* flow (6-digit code typed into the login form) does NOT
// come through here; it is verified client-side with verifyOtp().
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // No code, or the exchange failed (expired/invalid link).
  return NextResponse.redirect(`${origin}/admin/login?error=link_invalid`)
}

// Only allow internal, single-slash relative paths to avoid open-redirects.
function safeNext(next: string | null): string {
  if (next && next.startsWith('/') && !next.startsWith('//')) return next
  return '/admin/reset-password'
}

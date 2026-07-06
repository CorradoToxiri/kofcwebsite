'use client'

import { useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import AuthShell from '../_components/AuthShell'

type Feedback = { kind: 'error' | 'info' | 'success'; text: string } | null

// Landing page for the "forgot password" and admin-invite email links. By the
// time the user arrives here, /auth/callback has already exchanged the recovery
// code for a session, so they are momentarily authenticated and may set a new
// password. Works for both an existing admin resetting a password and an
// invited user choosing their first password.
export default function ResetPasswordPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])

  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setHasSession(Boolean(data.user))
      setChecking(false)
    })
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setFeedback({ kind: 'error', text: 'Use at least 8 characters.' })
      return
    }
    if (password !== confirm) {
      setFeedback({ kind: 'error', text: "Those passwords don't match." })
      return
    }
    setLoading(true)
    setFeedback(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setLoading(false)
      setFeedback({ kind: 'error', text: "We couldn't update the password. Please request a new reset link." })
      return
    }
    setDone(true)
    setLoading(false)
    setFeedback({ kind: 'success', text: 'Password updated. Redirecting to the dashboard…' })
    setTimeout(() => window.location.assign('/admin'), 1200)
  }

  if (checking) {
    return <AuthShell title="Set a new password">{null}</AuthShell>
  }

  if (!hasSession) {
    return (
      <AuthShell
        title="Reset link expired"
        subtitle="This password-reset link has expired or was already used."
      >
        <p className="auth-msg auth-msg-info">
          Head back to the sign-in page and choose <strong>Forgot password</strong> to get a fresh link.
        </p>
        <a href="/admin/login" className="auth-btn auth-btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 16 }}>
          Back to sign-in
        </a>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose a password for your admin account.">
      <form className="auth-form" onSubmit={handleSubmit}>
        {feedback && <p className={`auth-msg auth-msg-${feedback.kind}`}>{feedback.text}</p>}
        <div>
          <label className="auth-label" htmlFor="password">New password</label>
          <input
            id="password" name="password" type="password" autoComplete="new-password" required
            className="auth-input" value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="auth-label" htmlFor="confirm">Confirm password</label>
          <input
            id="confirm" name="confirm" type="password" autoComplete="new-password" required
            className="auth-input" value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <button type="submit" className="auth-btn auth-btn-primary" disabled={loading || done}>
          {loading ? 'Saving…' : 'Save password'}
        </button>
      </form>
    </AuthShell>
  )
}

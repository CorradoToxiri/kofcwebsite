'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import AuthShell from '../_components/AuthShell'

type Mode = 'password' | 'otp-request' | 'otp-verify'
type Feedback = { kind: 'error' | 'info' | 'success'; text: string } | null

function initialFeedback(errorParam: string | null): Feedback {
  switch (errorParam) {
    case 'not_authorized':
      return { kind: 'error', text: "That account isn't authorized for the admin area." }
    case 'link_invalid':
      return {
        kind: 'error',
        text: 'That link has expired or was already used. Please request a new one.',
      }
    default:
      return null
  }
}

function LoginForm() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const searchParams = useSearchParams()

  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(() =>
    initialFeedback(searchParams.get('error'))
  )

  // Full-page navigation so the proxy sees the freshly-set auth cookies.
  function goToDashboard() {
    window.location.assign('/admin')
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      setFeedback({ kind: 'error', text: "That email or password doesn't match." })
      return
    }
    goToDashboard()
  }

  async function handleOtpRequest(e?: React.FormEvent) {
    e?.preventDefault()
    if (!email) {
      setFeedback({ kind: 'error', text: 'Enter your email first.' })
      return
    }
    setLoading(true)
    setFeedback(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })
    setLoading(false)
    if (error) {
      setFeedback({ kind: 'error', text: "We couldn't send a code. Check the email and try again." })
      return
    }
    setMode('otp-verify')
    setFeedback({ kind: 'info', text: `We emailed a 6-digit code to ${email}. It expires shortly.` })
  }

  async function handleOtpVerify(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'email',
    })
    if (error) {
      setLoading(false)
      setFeedback({ kind: 'error', text: "That code isn't right or has expired." })
      return
    }
    goToDashboard()
  }

  async function handleForgotPassword() {
    if (!email) {
      setFeedback({ kind: 'error', text: 'Enter your email above, then choose "Forgot password".' })
      return
    }
    setLoading(true)
    setFeedback(null)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/admin/reset-password`,
    })
    setLoading(false)
    // Always generic — don't reveal whether the address has an account.
    setFeedback({
      kind: 'info',
      text: 'If that email has an admin account, a password-reset link is on its way.',
    })
  }

  const message = feedback && (
    <p className={`auth-msg auth-msg-${feedback.kind}`}>{feedback.text}</p>
  )

  if (mode === 'otp-request' || mode === 'otp-verify') {
    return (
      <AuthShell
        title="Sign in with a code"
        subtitle={
          mode === 'otp-request'
            ? "We'll email you a one-time login code."
            : 'Enter the 6-digit code from your email.'
        }
      >
        {mode === 'otp-request' ? (
          <form className="auth-form" onSubmit={handleOtpRequest}>
            {message}
            <div>
              <label className="auth-label" htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email" autoComplete="email" required
                className="auth-input" value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
              {loading ? 'Sending…' : 'Email me a code'}
            </button>
            <div className="auth-linkrow">
              <button type="button" className="auth-link" onClick={() => { setMode('password'); setFeedback(null) }}>
                ← Back to password sign-in
              </button>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleOtpVerify}>
            {message}
            <div>
              <label className="auth-label" htmlFor="code">6-digit code</label>
              <input
                id="code" name="code" inputMode="numeric" autoComplete="one-time-code"
                maxLength={6} required className="auth-input code" value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <button type="submit" className="auth-btn auth-btn-primary" disabled={loading || code.length < 6}>
              {loading ? 'Verifying…' : 'Sign in'}
            </button>
            <div className="auth-linkrow">
              <button type="button" className="auth-link" onClick={() => handleOtpRequest()} disabled={loading}>
                Resend code
              </button>
              <button type="button" className="auth-link" onClick={() => { setMode('password'); setCode(''); setFeedback(null) }}>
                Use password instead
              </button>
            </div>
          </form>
        )}
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Admin sign-in" subtitle="Sign in to manage the council website.">
      <form className="auth-form" onSubmit={handlePasswordLogin}>
        {message}
        <div>
          <label className="auth-label" htmlFor="email">Email</label>
          <input
            id="email" name="email" type="email" autoComplete="email" required
            className="auth-input" value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="auth-label" htmlFor="password">Password</label>
          <input
            id="password" name="password" type="password" autoComplete="current-password" required
            className="auth-input" value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <div className="auth-linkrow">
          <button type="button" className="auth-link" onClick={handleForgotPassword} disabled={loading}>
            Forgot password?
          </button>
        </div>
      </form>

      <div className="auth-divider" style={{ marginTop: 22 }}>or</div>

      <button
        type="button"
        className="auth-btn auth-btn-secondary"
        style={{ marginTop: 14 }}
        onClick={() => { setMode('otp-request'); setFeedback(null) }}
      >
        Email me a login code instead
      </button>
    </AuthShell>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AuthShell title="Admin sign-in">{null}</AuthShell>}>
      <LoginForm />
    </Suspense>
  )
}

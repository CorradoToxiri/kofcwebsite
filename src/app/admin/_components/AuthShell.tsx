import Image from 'next/image'

// Shared visual frame for the unauthenticated admin screens (login,
// set-new-password). Navy gradient field + centered card, so it reads as
// "Council #6033 admin" but is clearly its own place, not the public site.
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="auth-field">
      <div className="auth-card">
        <div className="auth-brand">
          <Image
            src="/kofc-emblem-reversed.png"
            alt="Knights of Columbus emblem"
            width={48}
            height={48}
            priority
          />
          <div className="auth-brand-text">
            <span className="auth-brand-council">Presentation Council #6033</span>
            <span className="auth-brand-tag">Admin</span>
          </div>
        </div>

        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}

        {children}
      </div>

      <p className="auth-footnote">
        Knights of Columbus · Upper Saddle River, NJ
      </p>

      <style>{`
        .auth-field {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 32px 20px;
          background: linear-gradient(160deg, var(--color-navy-deeper) 0%, var(--color-navy-dark) 55%, var(--color-navy) 100%);
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: 12px;
          border-top: 4px solid var(--color-gold);
          box-shadow: 0 18px 50px rgba(0,10,40,.45);
          padding: 34px 32px 30px;
        }
        .auth-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          margin-bottom: 22px;
          border-bottom: 1px solid var(--color-border);
        }
        .auth-brand-text { display: flex; flex-direction: column; line-height: 1.1; }
        .auth-brand-council {
          font-family: var(--font-serif);
          font-size: 16px; font-weight: 600; color: var(--color-navy);
        }
        .auth-brand-tag {
          font-family: var(--font-sans);
          font-size: 11px; font-weight: 700; letter-spacing: .16em;
          text-transform: uppercase; color: var(--color-gold-dark); margin-top: 3px;
        }
        .auth-title {
          font-size: 24px; line-height: 1.2; margin: 0 0 6px; color: var(--color-navy);
        }
        .auth-subtitle {
          font-size: 14.5px; color: var(--color-muted); margin: 0 0 20px; line-height: 1.5;
        }
        .auth-footnote {
          font-size: 12px; color: rgba(255,255,255,.55);
          font-family: var(--font-mono); letter-spacing: .04em; margin: 0;
        }

        /* Form primitives shared by the auth screens */
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .auth-label {
          display: block; font-size: 13px; font-weight: 600;
          color: var(--color-ink-soft); margin-bottom: 6px;
        }
        .auth-input {
          width: 100%; box-sizing: border-box;
          padding: 11px 13px; font-size: 15px; font-family: var(--font-sans);
          color: var(--color-ink);
          border: 1px solid var(--color-border-strong); border-radius: 7px;
          background: #fff; transition: border-color .12s, box-shadow .12s;
        }
        .auth-input:focus {
          outline: none; border-color: var(--color-navy);
          box-shadow: 0 0 0 3px rgba(0,48,135,.12);
        }
        .auth-input.code {
          letter-spacing: .5em; text-align: center;
          font-family: var(--font-mono); font-size: 22px; padding: 12px;
        }
        .auth-btn {
          width: 100%; box-sizing: border-box; cursor: pointer;
          padding: 12px 16px; font-size: 15px; font-weight: 700;
          font-family: var(--font-sans); border-radius: 7px; border: 1px solid transparent;
          transition: background .12s, opacity .12s;
        }
        .auth-btn-primary { background: var(--color-navy); color: #fff; }
        .auth-btn-primary:hover:not(:disabled) { background: var(--color-navy-dark); }
        .auth-btn-secondary {
          background: #fff; color: var(--color-navy);
          border-color: var(--color-border-strong);
        }
        .auth-btn-secondary:hover:not(:disabled) { background: var(--color-surface-alt); }
        .auth-btn:disabled { opacity: .6; cursor: not-allowed; }
        .auth-linkrow {
          display: flex; justify-content: space-between; align-items: center;
          gap: 12px; flex-wrap: wrap; margin-top: 4px;
        }
        .auth-link {
          background: none; border: none; padding: 0; cursor: pointer;
          font-size: 13.5px; font-weight: 600; color: var(--color-navy);
          font-family: var(--font-sans);
        }
        .auth-link:hover { color: var(--color-gold-dark); text-decoration: underline; }
        .auth-divider {
          display: flex; align-items: center; gap: 12px;
          color: var(--color-muted); font-size: 12px; margin: 2px 0;
        }
        .auth-divider::before, .auth-divider::after {
          content: ""; flex: 1; height: 1px; background: var(--color-border);
        }
        .auth-msg {
          font-size: 13.5px; line-height: 1.5; padding: 10px 12px;
          border-radius: 7px; margin: 0;
        }
        .auth-msg-error {
          background: #fdecec; color: #8a1220; border: 1px solid #f3c2c7;
        }
        .auth-msg-info {
          background: var(--color-surface-alt); color: var(--color-ink-soft);
          border: 1px solid var(--color-border-strong);
        }
        .auth-msg-success {
          background: #e9f6ec; color: #1c6b34; border: 1px solid #b9e0c4;
        }
      `}</style>
    </div>
  )
}

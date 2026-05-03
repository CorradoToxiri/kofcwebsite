'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '/',           label: 'Home' },
  { href: '/about',      label: 'About' },
  { href: '/officers',   label: 'Officers' },
  { href: '/calendar',   label: 'Calendar' },
  { href: '/activities', label: 'Activities' },
  { href: '/charities',  label: 'Charities' },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  return (
    <div ref={ref} className="mob-nav">
      <button
        className="mob-btn"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <XIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div className="mob-panel" role="dialog" aria-modal="true" aria-label="Site navigation">
          <nav>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="mob-link" onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="mob-ctas">
            <Link href="/join"   className="btn btn-on-navy mob-cta-btn" onClick={() => setOpen(false)}>Join</Link>
            <Link href="/donate" className="btn btn-primary mob-cta-btn" onClick={() => setOpen(false)}>Donate</Link>
          </div>
        </div>
      )}

      <style>{`
        .mob-nav { display: none; position: relative; }
        @media (max-width: 1000px) { .mob-nav { display: block; } }
        .mob-btn {
          width: 48px; height: 48px; border-radius: 6px;
          background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .mob-btn:hover { background: rgba(255,255,255,.18); }
        .mob-panel {
          position: absolute; top: calc(100% + 10px); right: 0;
          min-width: 230px;
          background: var(--color-navy-dark);
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 8px; overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,.45);
          z-index: 200;
        }
        .mob-link {
          display: block; padding: 14px 20px;
          color: #fff !important; font-family: var(--font-sans);
          font-size: 16px; font-weight: 500;
          border-bottom: 1px solid rgba(255,255,255,.07); text-decoration: none;
        }
        .mob-link:hover { background: rgba(255,255,255,.08); text-decoration: none; }
        .mob-ctas {
          display: flex; gap: 8px; padding: 12px 16px;
          border-top: 1px solid rgba(255,255,255,.12);
        }
        .mob-cta-btn { flex: 1; justify-content: center; font-size: 14px; padding: 11px 14px; }
      `}</style>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

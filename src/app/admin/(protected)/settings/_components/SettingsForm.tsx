'use client'

import { useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { SiteSetting } from '@/lib/supabase/types'

type Props = { settings: SiteSetting[] }

const SECTION_HEADING: Record<SiteSetting['section'], string> = {
  annual_figures: 'Annual Figures',
  national_stats: 'National Statistics',
  grand_knight: 'Grand Knight Quote',
}

const SECTION_ORDER: SiteSetting['section'][] = ['annual_figures', 'national_stats', 'grand_knight']

export default function SettingsForm({ settings }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(settings.map((s) => [s.key, s.value]))
  )
  const [errors, setErrors] = useState<string[]>([])
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const groups = SECTION_ORDER.map((section) => ({
    section,
    heading: SECTION_HEADING[section],
    items: settings.filter((s) => s.section === section),
  })).filter((g) => g.items.length > 0)

  function setValue(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }))
    setSaved(false)
  }

  function validate(): string[] {
    const errs: string[] = []
    for (const s of settings) {
      if (!values[s.key]?.trim()) errs.push(`${s.label} cannot be empty.`)
    }
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    setSaveError(null)
    setSaved(false)
    if (errs.length > 0) return

    setSaving(true)
    const results = await Promise.all(
      settings.map((s) =>
        supabase.from('site_settings').update({ value: values[s.key].trim() }).eq('key', s.key)
      )
    )
    setSaving(false)

    if (results.some((r) => r.error)) {
      setSaveError("Couldn't save changes. Please try again.")
      return
    }
    setSaved(true)
  }

  return (
    <form className="evf stf" onSubmit={handleSubmit} noValidate>
      <p className="stf-note">
        These values appear on the public website. After saving, use Preview to check how they look.
      </p>

      {errors.length > 0 && (
        <div className="evf-alert evf-alert-error" role="alert">
          <strong>Fix the following before saving:</strong>
          <ul>{errors.map((err) => <li key={err}>{err}</li>)}</ul>
        </div>
      )}
      {saveError && (
        <div className="evf-alert evf-alert-error" role="alert">{saveError}</div>
      )}
      {saved && (
        <div className="evp-success" role="status">Settings saved.</div>
      )}

      {groups.map((group) => (
        <fieldset className="stf-section" key={group.section}>
          <legend className="stf-heading">{group.heading}</legend>
          {group.items.map((s) => (
            <div className="evf-field" key={s.key}>
              <label className="evf-label" htmlFor={s.key}>{s.label}</label>
              {s.section === 'grand_knight' ? (
                <textarea
                  id={s.key} className="evf-input evf-textarea" rows={4}
                  value={values[s.key] ?? ''}
                  onChange={(e) => setValue(s.key, e.target.value)}
                />
              ) : (
                <input
                  id={s.key} className="evf-input" value={values[s.key] ?? ''}
                  onChange={(e) => setValue(s.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </fieldset>
      ))}

      <div className="evf-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <SettingsFormStyles />
    </form>
  )
}

function SettingsFormStyles() {
  return (
    <style>{`
      .evf { max-width: 720px; background: #fff; border: 1px solid var(--color-border);
        border-radius: 12px; padding: 32px 34px; box-shadow: var(--shadow-card); }
      .evf-field { margin-bottom: 20px; display: flex; flex-direction: column; gap: 6px; }
      .evf-label { font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--color-navy); }
      .evf-input {
        font-family: var(--font-sans); font-size: 15px; color: var(--color-ink);
        padding: 10px 12px; border: 1px solid var(--color-border-strong); border-radius: 6px;
        background: #fff; width: 100%;
      }
      .evf-input:focus { outline: 2px solid var(--color-gold); outline-offset: 1px; border-color: var(--color-navy); }
      .evf-textarea { resize: vertical; font-family: var(--font-sans); line-height: 1.5; }

      .evf-alert {
        border-radius: 8px; padding: 14px 16px; font-size: 14px; margin-bottom: 22px; line-height: 1.5;
      }
      .evf-alert-error { background: #FDECEC; border: 1px solid #F3B9BE; color: #8A1420; }
      .evf-alert ul { margin: 6px 0 0; padding-left: 20px; }
      .evp-success {
        background: #E4F5E9; border: 1px solid #B9E3C6; color: #1F7A3D;
        border-radius: 8px; padding: 12px 16px; font-size: 14px; margin-bottom: 20px;
      }

      .evf-actions { display: flex; gap: 12px; margin-top: 8px; }

      .stf-note {
        font-size: 13px; color: var(--color-muted); margin: 0 0 22px; line-height: 1.5;
      }
      .stf-section { border: none; padding: 0; margin: 0 0 30px; }
      .stf-section:last-of-type { margin-bottom: 8px; }
      .stf-heading {
        font-family: var(--font-sans); font-size: 12px; font-weight: 700;
        letter-spacing: .1em; text-transform: uppercase; color: var(--color-gold-dark);
        padding: 0 0 12px; margin-bottom: 8px; border-bottom: 1px solid var(--color-border);
        width: 100%;
      }

      @media (max-width: 640px) {
        .evf { padding: 24px 20px; }
      }
    `}</style>
  )
}

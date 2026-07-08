'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Charity } from '@/lib/supabase/types'
import { CHARITY_CATEGORY_OPTIONS, type CharityCategory } from '@/lib/utils/charityCategories'
import { slugify, withRandomSuffix } from '@/lib/utils/slug'
import CharityPhotoField from './CharityPhotoField'

type Props = { mode: 'create' } | { mode: 'edit'; charity: Charity }

type FormState = {
  name: string
  category: CharityCategory | ''
  shortDescription: string
  body: string
  photoUrl: string | null
  externalUrl: string
  sortOrder: string
  isPublished: boolean
}

function emptyState(): FormState {
  return {
    name: '', category: '', shortDescription: '', body: '', photoUrl: null,
    externalUrl: '', sortOrder: '0', isPublished: true,
  }
}

function stateFromCharity(c: Charity): FormState {
  return {
    name: c.name,
    category: c.category,
    shortDescription: c.short_description ?? '',
    body: c.body ?? '',
    photoUrl: c.photo_url,
    externalUrl: c.external_url ?? '',
    sortOrder: String(c.sort_order),
    isPublished: c.is_published,
  }
}

export default function CharityForm(props: Props) {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [form, setForm] = useState<FormState>(() =>
    props.mode === 'edit' ? stateFromCharity(props.charity) : emptyState()
  )
  const [errors, setErrors] = useState<string[]>([])
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(): string[] {
    const errs: string[] = []
    if (!form.name.trim()) errs.push('Name is required.')
    if (!form.category) errs.push('Choose a category.')
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    setSaveError(null)
    if (errs.length > 0) return

    setSaving(true)

    const payload = {
      name: form.name.trim(),
      category: form.category as CharityCategory,
      short_description: form.shortDescription.trim() || null,
      body: form.body.trim() || null,
      photo_url: form.photoUrl,
      external_url: form.externalUrl.trim() || null,
      sort_order: Number(form.sortOrder) || 0,
      is_published: form.isPublished,
    }

    if (props.mode === 'edit') {
      const { error } = await supabase.from('charities').update(payload).eq('id', props.charity.id)
      setSaving(false)
      if (error) {
        setSaveError("Couldn't save changes. Please try again.")
        return
      }
      router.push('/admin/charities?success=updated')
      return
    }

    // Create: auto-generate a unique slug, retrying with a short suffix on collision.
    const baseSlug = slugify(form.name)
    let slug = baseSlug
    let failed = false
    for (let attempt = 0; attempt < 5; attempt++) {
      const { error } = await supabase.from('charities').insert({ ...payload, slug })
      if (!error) {
        failed = false
        break
      }
      failed = true
      if (error.code === '23505') {
        slug = withRandomSuffix(baseSlug)
        continue
      }
      break
    }
    setSaving(false)
    if (failed) {
      setSaveError("Couldn't save this charity. Please try again.")
      return
    }
    router.push('/admin/charities?success=created')
  }

  function handleCancel() {
    router.push('/admin/charities')
  }

  return (
    <form className="evf" onSubmit={handleSubmit} noValidate>
      {errors.length > 0 && (
        <div className="evf-alert evf-alert-error" role="alert">
          <strong>Fix the following before saving:</strong>
          <ul>{errors.map((err) => <li key={err}>{err}</li>)}</ul>
        </div>
      )}
      {saveError && (
        <div className="evf-alert evf-alert-error" role="alert">{saveError}</div>
      )}

      <div className="evf-field">
        <label className="evf-label" htmlFor="name">Name <span className="evf-req">*</span></label>
        <input
          id="name" className="evf-input" value={form.name}
          onChange={(e) => set('name', e.target.value)} required
        />
      </div>

      <div className="evf-row">
        <div className="evf-field">
          <label className="evf-label" htmlFor="category">Category <span className="evf-req">*</span></label>
          <select
            id="category" className="evf-input" value={form.category}
            onChange={(e) => set('category', e.target.value as CharityCategory)} required
          >
            <option value="" disabled>Select a category…</option>
            {CHARITY_CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="evf-field">
          <label className="evf-label" htmlFor="sortOrder">Sort order</label>
          <input
            id="sortOrder" type="number" step={1} className="evf-input" value={form.sortOrder}
            onChange={(e) => set('sortOrder', e.target.value)}
          />
        </div>
      </div>

      <div className="evf-field">
        <label className="evf-label" htmlFor="shortDescription">Short description</label>
        <textarea
          id="shortDescription" className="evf-input evf-textarea" rows={2}
          value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)}
        />
      </div>

      <div className="evf-field">
        <label className="evf-label" htmlFor="body">Body <span className="evf-hint">(optional)</span></label>
        <textarea
          id="body" className="evf-input evf-textarea" rows={5}
          value={form.body} onChange={(e) => set('body', e.target.value)}
        />
      </div>

      <div className="evf-field">
        <span className="evf-label">Photo</span>
        <CharityPhotoField value={form.photoUrl} onChange={(url) => set('photoUrl', url)} />
      </div>

      <div className="evf-row">
        <div className="evf-field">
          <label className="evf-label" htmlFor="externalUrl">
            External URL <span className="evf-hint">(optional)</span>
          </label>
          <input
            id="externalUrl" type="url" placeholder="https://…"
            className="evf-input" value={form.externalUrl}
            onChange={(e) => set('externalUrl', e.target.value)}
          />
        </div>
        <div className="evf-field">
          <span className="evf-label">Visible on website</span>
          <label className="evf-toggle">
            <input
              type="checkbox" checked={form.isPublished}
              onChange={(e) => set('isPublished', e.target.checked)}
            />
            <span className="evf-toggle-track"><span className="evf-toggle-thumb" /></span>
            <span className="evf-toggle-state">{form.isPublished ? 'Visible' : 'Hidden'}</span>
          </label>
        </div>
      </div>

      <div className="evf-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={saving}>
          Cancel
        </button>
      </div>

      <CharityFormStyles />
    </form>
  )
}

function CharityFormStyles() {
  return (
    <style>{`
      .evf { max-width: 720px; background: #fff; border: 1px solid var(--color-border);
        border-radius: 12px; padding: 32px 34px; box-shadow: var(--shadow-card); }
      .evf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      .evf-field { margin-bottom: 20px; display: flex; flex-direction: column; gap: 6px; }
      .evf-label { font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--color-navy); }
      .evf-req { color: var(--color-kofc-red); }
      .evf-hint { font-weight: 400; color: var(--color-muted); font-size: 12px; }
      .evf-input {
        font-family: var(--font-sans); font-size: 15px; color: var(--color-ink);
        padding: 10px 12px; border: 1px solid var(--color-border-strong); border-radius: 6px;
        background: #fff; width: 100%;
      }
      .evf-input:focus { outline: 2px solid var(--color-gold); outline-offset: 1px; border-color: var(--color-navy); }
      .evf-textarea { resize: vertical; font-family: var(--font-sans); line-height: 1.5; }

      /* Toggle */
      .evf-toggle { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; width: fit-content; }
      .evf-toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
      .evf-toggle-track {
        width: 42px; height: 24px; border-radius: 999px; background: var(--color-border-strong);
        position: relative; transition: background .15s; flex-shrink: 0;
      }
      .evf-toggle-thumb {
        position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%;
        background: #fff; box-shadow: var(--shadow-sm); transition: transform .15s;
      }
      .evf-toggle input:checked + .evf-toggle-track { background: var(--color-gold); }
      .evf-toggle input:checked + .evf-toggle-track .evf-toggle-thumb { transform: translateX(18px); }
      .evf-toggle-state { font-size: 14px; font-weight: 600; color: var(--color-navy); }

      /* Alerts */
      .evf-alert {
        border-radius: 8px; padding: 14px 16px; font-size: 14px; margin-bottom: 22px; line-height: 1.5;
      }
      .evf-alert-error { background: #FDECEC; border: 1px solid #F3B9BE; color: #8A1420; }
      .evf-alert ul { margin: 6px 0 0; padding-left: 20px; }

      .evf-actions { display: flex; gap: 12px; margin-top: 8px; }

      @media (max-width: 640px) {
        .evf { padding: 24px 20px; }
        .evf-row { grid-template-columns: 1fr; }
      }
    `}</style>
  )
}

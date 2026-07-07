'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Event, EventType } from '@/lib/supabase/types'
import { EVENT_TYPE_OPTIONS } from '@/lib/utils/eventTypes'
import { localDateTimeToISO, isoToLocalDateTimeInput, TZ } from '@/lib/utils/dates'
import { slugify, withRandomSuffix } from '@/lib/utils/slug'

type Props = { mode: 'create' } | { mode: 'edit'; event: Event }

type FormState = {
  title: string
  eventType: EventType | ''
  startsAt: string
  endsAt: string
  locationName: string
  locationAddress: string
  locationMapUrl: string
  description: string
  signupUrl: string
  signupDeadline: string
  isPublished: boolean
}

function emptyState(): FormState {
  return {
    title: '', eventType: '', startsAt: '', endsAt: '',
    locationName: '', locationAddress: '', locationMapUrl: '',
    description: '', signupUrl: '', signupDeadline: '',
    isPublished: true,
  }
}

function stateFromEvent(ev: Event): FormState {
  return {
    title: ev.title,
    eventType: ev.event_type,
    startsAt: isoToLocalDateTimeInput(ev.starts_at),
    endsAt: ev.ends_at ? isoToLocalDateTimeInput(ev.ends_at) : '',
    locationName: ev.location_name ?? '',
    locationAddress: ev.location_address ?? '',
    locationMapUrl: ev.location_map_url ?? '',
    description: ev.description ?? '',
    signupUrl: ev.signup_url ?? '',
    signupDeadline: ev.signup_deadline ? isoToLocalDateTimeInput(ev.signup_deadline) : '',
    isPublished: ev.is_published,
  }
}

export default function EventForm(props: Props) {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [form, setForm] = useState<FormState>(() =>
    props.mode === 'edit' ? stateFromEvent(props.event) : emptyState()
  )
  const [errors, setErrors] = useState<string[]>([])
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(): string[] {
    const errs: string[] = []
    if (!form.title.trim()) errs.push('Title is required.')
    if (!form.eventType) errs.push('Choose an event type.')
    if (!form.startsAt) errs.push('Start date & time is required.')
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
      title: form.title.trim(),
      event_type: form.eventType as EventType,
      starts_at: localDateTimeToISO(form.startsAt),
      ends_at: form.endsAt ? localDateTimeToISO(form.endsAt) : null,
      location_name: form.locationName.trim() || null,
      location_address: form.locationAddress.trim() || null,
      location_map_url: form.locationMapUrl.trim() || null,
      description: form.description.trim() || null,
      signup_url: form.signupUrl.trim() || null,
      signup_deadline: form.signupDeadline ? localDateTimeToISO(form.signupDeadline) : null,
      is_published: form.isPublished,
    }

    if (props.mode === 'edit') {
      const { error } = await supabase.from('events').update(payload).eq('id', props.event.id)
      setSaving(false)
      if (error) {
        setSaveError("Couldn't save changes. Please try again.")
        return
      }
      router.push('/admin/events?success=updated')
      return
    }

    // Create: auto-generate a unique slug, retrying with a short suffix on collision.
    const baseSlug = slugify(form.title)
    let slug = baseSlug
    let failed = false
    for (let attempt = 0; attempt < 5; attempt++) {
      const { error } = await supabase.from('events').insert({ ...payload, slug })
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
      setSaveError("Couldn't save this event. Please try again.")
      return
    }
    router.push('/admin/events?success=created')
  }

  function handleCancel() {
    router.push('/admin/events')
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
        <label className="evf-label" htmlFor="title">Title <span className="evf-req">*</span></label>
        <input
          id="title" className="evf-input" value={form.title}
          onChange={(e) => set('title', e.target.value)} required
        />
      </div>

      <div className="evf-row">
        <div className="evf-field">
          <label className="evf-label" htmlFor="eventType">Event type <span className="evf-req">*</span></label>
          <select
            id="eventType" className="evf-input" value={form.eventType}
            onChange={(e) => set('eventType', e.target.value as EventType)} required
          >
            <option value="" disabled>Select a type…</option>
            {EVENT_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
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

      <div className="evf-row">
        <div className="evf-field">
          <label className="evf-label" htmlFor="startsAt">
            Starts at <span className="evf-req">*</span>{' '}
            <span className="evf-hint">({TZ.replace('_', ' ')})</span>
          </label>
          <input
            id="startsAt" type="datetime-local" className="evf-input"
            value={form.startsAt} onChange={(e) => set('startsAt', e.target.value)} required
          />
        </div>
        <div className="evf-field">
          <label className="evf-label" htmlFor="endsAt">Ends at <span className="evf-hint">(optional)</span></label>
          <div className="evf-clearable">
            <input
              id="endsAt" type="datetime-local" className="evf-input"
              value={form.endsAt} onChange={(e) => set('endsAt', e.target.value)}
            />
            {form.endsAt && (
              <button type="button" className="evf-clear" onClick={() => set('endsAt', '')}>Clear</button>
            )}
          </div>
        </div>
      </div>

      <div className="evf-row">
        <div className="evf-field">
          <label className="evf-label" htmlFor="locationName">Location name</label>
          <input
            id="locationName" className="evf-input" value={form.locationName}
            onChange={(e) => set('locationName', e.target.value)}
          />
        </div>
        <div className="evf-field">
          <label className="evf-label" htmlFor="locationAddress">Location address</label>
          <input
            id="locationAddress" className="evf-input" value={form.locationAddress}
            onChange={(e) => set('locationAddress', e.target.value)}
          />
        </div>
      </div>

      <div className="evf-field">
        <label className="evf-label" htmlFor="locationMapUrl">Location map URL</label>
        <input
          id="locationMapUrl" type="url" placeholder="https://maps.google.com/…"
          className="evf-input" value={form.locationMapUrl}
          onChange={(e) => set('locationMapUrl', e.target.value)}
        />
      </div>

      <div className="evf-field">
        <label className="evf-label" htmlFor="description">Description</label>
        <textarea
          id="description" className="evf-input evf-textarea" rows={5}
          value={form.description} onChange={(e) => set('description', e.target.value)}
        />
      </div>

      <div className="evf-row">
        <div className="evf-field">
          <label className="evf-label" htmlFor="signupUrl">Signup URL</label>
          <input
            id="signupUrl" type="url" placeholder="https://signup.com/…"
            className="evf-input" value={form.signupUrl}
            onChange={(e) => set('signupUrl', e.target.value)}
          />
        </div>
        <div className="evf-field">
          <label className="evf-label" htmlFor="signupDeadline">
            Signup deadline <span className="evf-hint">(optional)</span>
          </label>
          <div className="evf-clearable">
            <input
              id="signupDeadline" type="datetime-local" className="evf-input"
              value={form.signupDeadline} onChange={(e) => set('signupDeadline', e.target.value)}
            />
            {form.signupDeadline && (
              <button type="button" className="evf-clear" onClick={() => set('signupDeadline', '')}>Clear</button>
            )}
          </div>
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

      <EventFormStyles />
    </form>
  )
}

function EventFormStyles() {
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
      .evf-clearable { display: flex; align-items: center; gap: 10px; }
      .evf-clear {
        font-size: 12.5px; color: var(--color-muted); background: none; border: none;
        cursor: pointer; text-decoration: underline; white-space: nowrap;
      }
      .evf-clear:hover { color: var(--color-navy); }

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

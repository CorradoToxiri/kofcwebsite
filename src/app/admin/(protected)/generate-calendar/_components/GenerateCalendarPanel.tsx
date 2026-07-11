'use client'

import { useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { getColumbianYearBounds } from '@/lib/utils/columbianYear'
import { rollInstantToColumbianYear, buildDestinationSlug } from '@/lib/utils/columbianRoll'
import { localDateTimeToISO, isoToLocalDateTimeInput, TZ } from '@/lib/utils/dates'
import { EVENT_TYPE_LABEL } from '@/lib/utils/eventTypes'
import { withRandomSuffix } from '@/lib/utils/slug'
import type { Event, EventType } from '@/lib/supabase/types'

type Props = {
  yearOptions: number[]
  defaultSourceYear: number
  defaultDestYear: number
}

type GeneratedRow = {
  key: string
  title: string
  eventType: EventType
  startsAt: string // datetime-local wall-clock string, America/New_York
  endsAt: string // datetime-local wall-clock string, may be ''
  locationName: string | null
  locationAddress: string | null
  locationMapUrl: string | null
  description: string | null
  heroImageUrl: string | null
  slug: string
  select: boolean
  tbc: boolean
  isPublished: boolean
}

type UploadResult = {
  key: string
  title: string
  ok: boolean
  reason: string | null
}

function describeUploadError(error: { code?: string; message: string }): string {
  if (error.code === '23505') return 'Slug already exists.'
  return error.message || 'Upload failed.'
}

// `localDateTime` is a "YYYY-MM-DDTHH:mm" wall-clock string — the calendar
// date alone determines the weekday, so no timezone conversion is needed here.
function weekdayLabel(localDateTime: string): string {
  if (!localDateTime) return ''
  const [datePart] = localDateTime.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' })
}

export default function GenerateCalendarPanel({ yearOptions, defaultSourceYear, defaultDestYear }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [sourceYear, setSourceYear] = useState(defaultSourceYear)
  const [destYear, setDestYear] = useState(defaultDestYear)

  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [generated, setGenerated] = useState(false)
  const [rows, setRows] = useState<GeneratedRow[]>([])

  const [uploading, setUploading] = useState(false)
  const [uploadSummary, setUploadSummary] = useState<UploadResult[] | null>(null)

  function set<K extends keyof GeneratedRow>(key: string, field: K, value: GeneratedRow[K]) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, [field]: value } : r)))
  }

  async function handleGenerate() {
    setGenerating(true)
    setGenerateError(null)
    setUploadSummary(null)

    const { startISO, endISO } = getColumbianYearBounds(sourceYear)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('starts_at', startISO)
      .lt('starts_at', endISO)
      .order('starts_at', { ascending: true })

    setGenerating(false)
    setGenerated(true)

    if (error) {
      setGenerateError("Couldn't load source events. Please try again.")
      setRows([])
      return
    }

    const source = (data ?? []) as Event[]
    const newRows: GeneratedRow[] = source.map((ev) => {
      const destStartsAtIso = rollInstantToColumbianYear(ev.starts_at, sourceYear, destYear)
      const destStartsAtLocal = isoToLocalDateTimeInput(destStartsAtIso)

      let destEndsAtLocal = ''
      if (ev.ends_at) {
        const durationMs = new Date(ev.ends_at).getTime() - new Date(ev.starts_at).getTime()
        const destEndsAtIso = new Date(new Date(destStartsAtIso).getTime() + durationMs).toISOString()
        destEndsAtLocal = isoToLocalDateTimeInput(destEndsAtIso)
      }

      return {
        key: ev.id,
        title: ev.title,
        eventType: ev.event_type,
        startsAt: destStartsAtLocal,
        endsAt: destEndsAtLocal,
        locationName: ev.location_name,
        locationAddress: ev.location_address,
        locationMapUrl: ev.location_map_url,
        description: ev.description,
        heroImageUrl: ev.hero_image_url,
        slug: buildDestinationSlug(ev.title, destStartsAtLocal),
        select: true,
        tbc: false,
        isPublished: true,
      }
    })
    setRows(newRows)
  }

  async function handleUpload() {
    const selected = rows.filter((r) => r.select)
    if (selected.length === 0) return
    if (!window.confirm(
      `Upload ${selected.length} event${selected.length === 1 ? '' : 's'} to the site?`
    )) return

    setUploading(true)
    setUploadSummary(null)

    const results = await Promise.all(selected.map(async (row): Promise<UploadResult> => {
      const title = row.tbc ? `*TBC* ${row.title}` : row.title
      const basePayload = {
        title,
        event_type: row.eventType,
        starts_at: localDateTimeToISO(row.startsAt),
        ends_at: row.endsAt ? localDateTimeToISO(row.endsAt) : null,
        location_name: row.locationName,
        location_address: row.locationAddress,
        location_map_url: row.locationMapUrl,
        description: row.description,
        hero_image_url: row.heroImageUrl,
        signup_url: null,
        signup_deadline: null,
        is_published: row.isPublished,
      }

      // Auto-disambiguate on slug collision (same approach as the Events
      // editor's create/duplicate flow) — the admin never sees the slug, so a
      // conflict here shouldn't fail the row, just get a short suffix.
      let slug = row.slug
      let lastError: { code?: string; message: string } | null = null
      for (let attempt = 0; attempt < 5; attempt++) {
        const { error } = await supabase.from('events').insert({ ...basePayload, slug })
        if (!error) {
          return { key: row.key, title, ok: true, reason: null }
        }
        lastError = error
        if (error.code === '23505') {
          slug = withRandomSuffix(row.slug)
          continue
        }
        break
      }
      return {
        key: row.key,
        title,
        ok: false,
        reason: lastError ? describeUploadError(lastError) : 'Upload failed.',
      }
    }))

    setUploading(false)
    setUploadSummary(results)
  }

  const selectedCount = rows.filter((r) => r.select).length

  return (
    <div className="gcp">
      <p className="gcp-note">
        Generates a draft set of next-year events from an existing Columbian year&apos;s events,
        using the same week-of-year/weekday mapping. Review and edit below — nothing is saved
        until you click &ldquo;Upload Events&rdquo;.
      </p>

      <div className="gcp-controls">
        <div className="gcp-field">
          <label className="gcp-label" htmlFor="gcp-source">Source Columbian year</label>
          <select
            id="gcp-source" className="gcp-select" value={sourceYear}
            onChange={(e) => setSourceYear(Number(e.target.value))}
          >
            {yearOptions.map((y) => <option key={y} value={y}>{y}–{y + 1}</option>)}
          </select>
        </div>
        <div className="gcp-field">
          <label className="gcp-label" htmlFor="gcp-dest">Destination Columbian year</label>
          <select
            id="gcp-dest" className="gcp-select" value={destYear}
            onChange={(e) => setDestYear(Number(e.target.value))}
          >
            {yearOptions.map((y) => <option key={y} value={y}>{y}–{y + 1}</option>)}
          </select>
        </div>
        <button
          type="button" className="btn btn-primary gcp-generate-btn"
          onClick={handleGenerate} disabled={generating}
        >
          {generating ? 'Generating…' : 'Generate Events'}
        </button>
      </div>

      {generateError && <div className="gcp-alert gcp-alert-error" role="alert">{generateError}</div>}

      {generated && !generateError && rows.length === 0 && (
        <p className="gcp-empty">No events found for the selected source year.</p>
      )}

      {generated && rows.length > 0 && (
        <>
          <div className="gcp-table-wrap">
            <table className="gcp-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>TBC</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Start ({TZ.replace('_', ' ')})</th>
                  <th>End</th>
                  <th>Visible</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className={row.select ? '' : 'gcp-row-excluded'}>
                    <td>
                      <input
                        type="checkbox" checked={row.select}
                        onChange={(e) => set(row.key, 'select', e.target.checked)}
                        aria-label={`Include ${row.title}`}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox" checked={row.tbc}
                        onChange={(e) => set(row.key, 'tbc', e.target.checked)}
                        aria-label={`Mark ${row.title} as TBC`}
                      />
                    </td>
                    <td className="gcp-title">{row.title}</td>
                    <td>{EVENT_TYPE_LABEL[row.eventType] ?? row.eventType}</td>
                    <td>
                      <div className="gcp-dt-cell">
                        <span className="gcp-weekday">{weekdayLabel(row.startsAt)}</span>
                        <input
                          type="datetime-local" className="gcp-input"
                          value={row.startsAt}
                          onChange={(e) => set(row.key, 'startsAt', e.target.value)}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="gcp-dt-cell">
                        <span className="gcp-weekday">{weekdayLabel(row.endsAt)}</span>
                        <input
                          type="datetime-local" className="gcp-input"
                          value={row.endsAt}
                          onChange={(e) => set(row.key, 'endsAt', e.target.value)}
                        />
                      </div>
                    </td>
                    <td>
                      <input
                        type="checkbox" checked={row.isPublished}
                        onChange={(e) => set(row.key, 'isPublished', e.target.checked)}
                        aria-label={`Visible on website: ${row.title}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="gcp-upload-bar">
            <button
              type="button" className="btn btn-primary"
              onClick={handleUpload} disabled={uploading || selectedCount === 0}
            >
              {uploading ? 'Uploading…' : `Upload Events (${selectedCount})`}
            </button>
          </div>
        </>
      )}

      {uploadSummary && (
        <div className="gcp-summary">
          <h2 className="gcp-summary-title">Upload results</h2>
          <ul className="gcp-summary-list">
            {uploadSummary.map((r) => (
              <li key={r.key} className={r.ok ? 'gcp-summary-ok' : 'gcp-summary-fail'}>
                {r.ok ? '✓' : '✗'} {r.title}
                {!r.ok && r.reason && <span className="gcp-summary-reason"> — {r.reason}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <GenerateCalendarPanelStyles />
    </div>
  )
}

function GenerateCalendarPanelStyles() {
  return (
    <style>{`
      .gcp-note { font-size: 13px; color: var(--color-muted); margin: 0 0 22px; line-height: 1.55; max-width: 760px; }

      .gcp-controls { display: flex; align-items: flex-end; gap: 20px; flex-wrap: wrap; margin-bottom: 22px; }
      .gcp-field { display: flex; flex-direction: column; gap: 6px; }
      .gcp-label { font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--color-navy); }
      .gcp-select {
        font-family: var(--font-sans); font-size: 15px; color: var(--color-ink);
        padding: 10px 12px; border: 1px solid var(--color-border-strong); border-radius: 6px;
        background: #fff; min-width: 160px;
      }
      .gcp-select:focus { outline: 2px solid var(--color-gold); outline-offset: 1px; border-color: var(--color-navy); }
      .gcp-generate-btn { white-space: nowrap; }

      .gcp-alert { border-radius: 8px; padding: 12px 16px; font-size: 14px; margin-bottom: 20px; line-height: 1.5; }
      .gcp-alert-error { background: #FDECEC; border: 1px solid #F3B9BE; color: #8A1420; }
      .gcp-empty { font-size: 14px; color: var(--color-muted); background: #fff;
        border: 1px solid var(--color-border); border-radius: 12px; padding: 32px; text-align: center; }

      .gcp-table-wrap { background: #fff; border: 1px solid var(--color-border); border-radius: 12px;
        box-shadow: var(--shadow-card); overflow-x: auto; margin-bottom: 18px; }
      .gcp-table { width: 100%; border-collapse: collapse; font-size: 14px; }
      .gcp-table th {
        text-align: left; padding: 12px 14px; font-family: var(--font-sans); font-size: 11.5px;
        font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-muted);
        background: var(--color-surface-alt); border-bottom: 1px solid var(--color-border); white-space: nowrap;
      }
      .gcp-table td { padding: 10px 14px; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
      .gcp-table tr:last-child td { border-bottom: none; }
      .gcp-row-excluded { opacity: .5; }
      .gcp-title { font-weight: 600; color: var(--color-navy); min-width: 180px; }
      .gcp-input {
        font-family: var(--font-sans); font-size: 13.5px; color: var(--color-ink);
        padding: 7px 8px; border: 1px solid var(--color-border-strong); border-radius: 6px;
        background: #fff;
      }
      .gcp-input:focus { outline: 2px solid var(--color-gold); outline-offset: 1px; border-color: var(--color-navy); }
      .gcp-dt-cell { display: flex; align-items: center; gap: 8px; }
      .gcp-weekday {
        font-family: var(--font-sans); font-size: 12px; font-weight: 700; color: var(--color-muted);
        width: 32px; flex-shrink: 0; text-align: right;
      }

      .gcp-upload-bar { display: flex; margin-bottom: 22px; }

      .gcp-summary { max-width: 720px; background: #fff; border: 1px solid var(--color-border);
        border-radius: 12px; padding: 24px 26px; box-shadow: var(--shadow-card); }
      .gcp-summary-title { font-size: 16px; margin: 0 0 12px; color: var(--color-navy); }
      .gcp-summary-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; font-size: 14px; }
      .gcp-summary-ok { color: #1F7A3D; }
      .gcp-summary-fail { color: #8A1420; }
      .gcp-summary-reason { color: var(--color-muted); }
    `}</style>
  )
}

'use client'

import { useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Props = { defaultStartYear: number }

const YEAR_SPAN_BEFORE = 2
const YEAR_SPAN_AFTER = 3

// Bucket/path the public Calendar page's download link points at
// (src/app/(public)/calendar/page.tsx) — every upload is written here under
// this exact name, regardless of the local file's original name, so the
// public link never has to change.
const BUCKET = 'documents'
const OBJECT_PATH = 'KofC6033_Calendar.pdf'
const ALLOWED_EXTENSIONS = ['pdf']
const MAX_BYTES = 5 * 1024 * 1024

function getExtension(filename: string): string {
  const match = filename.match(/\.([a-zA-Z0-9]+)$/)
  return match ? match[1].toLowerCase() : ''
}

export default function CalendarPdfPanel({ defaultStartYear }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [startYear, setStartYear] = useState(defaultStartYear)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)

  const yearOptions = Array.from(
    { length: YEAR_SPAN_BEFORE + YEAR_SPAN_AFTER + 1 },
    (_, i) => defaultStartYear - YEAR_SPAN_BEFORE + i
  )

  const rangeLabel = `Jul 1, ${startYear} – Jun 30, ${startYear + 1}`

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploadError(null)
    setUploadSuccess(null)

    const ext = getExtension(file.name)
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setUploadError('Please use a PDF file.')
      return
    }
    if (file.size > MAX_BYTES) {
      setUploadError('Please use a PDF under 5 MB.')
      return
    }

    if (!window.confirm('This will replace the calendar that visitors download. Continue?')) return

    setUploading(true)
    const { error } = await supabase.storage.from(BUCKET).upload(OBJECT_PATH, file, {
      upsert: true,
      contentType: 'application/pdf',
    })
    setUploading(false)

    if (error) {
      setUploadError("Couldn't upload this file. Please try again.")
      return
    }
    setUploadSuccess(
      file.name.toLowerCase() === OBJECT_PATH.toLowerCase()
        ? 'Uploaded — the site now serves this file.'
        : `Uploaded as "${OBJECT_PATH}" — the site now serves this file.`
    )
  }

  return (
    <div className="cpp">
      <p className="cpp-note">
        <strong>1. Generate</strong> a printable annual calendar from published events and
        review it. <strong>2. Upload</strong> the reviewed PDF to replace the calendar visitors
        download from the public Calendar page.
      </p>

      <div className="cpp-field">
        <label className="cpp-label" htmlFor="cpp-year">Columbian year</label>
        <select
          id="cpp-year"
          className="cpp-select"
          value={startYear}
          onChange={(e) => setStartYear(Number(e.target.value))}
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}–{y + 1}</option>
          ))}
        </select>
        <span className="cpp-range">{rangeLabel}</span>
      </div>

      {uploadError && <div className="cpp-alert cpp-alert-error" role="alert">{uploadError}</div>}
      {uploadSuccess && <div className="cpp-alert cpp-alert-success" role="status">{uploadSuccess}</div>}

      <div className="cpp-actions">
        <a
          href={`/admin/calendar-pdf/download?year=${startYear}`}
          className="btn btn-secondary"
        >
          Generate PDF Calendar
        </a>
        <label className="btn btn-primary cpp-upload-btn">
          {uploading ? 'Uploading…' : 'Upload to site'}
          <input
            type="file" accept=".pdf,application/pdf"
            onChange={handleFileChange} disabled={uploading} hidden
          />
        </label>
      </div>
      <p className="cpp-hint">PDF only, up to 5 MB. The file is uploaded as-is — verify it before uploading.</p>

      <CalendarPdfPanelStyles />
    </div>
  )
}

function CalendarPdfPanelStyles() {
  return (
    <style>{`
      .cpp { max-width: 720px; background: #fff; border: 1px solid var(--color-border);
        border-radius: 12px; padding: 32px 34px; box-shadow: var(--shadow-card); }
      .cpp-note { font-size: 13px; color: var(--color-muted); margin: 0 0 24px; line-height: 1.55; }
      .cpp-field { margin-bottom: 20px; display: flex; flex-direction: column; gap: 6px; max-width: 260px; }
      .cpp-label { font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--color-navy); }
      .cpp-select {
        font-family: var(--font-sans); font-size: 15px; color: var(--color-ink);
        padding: 10px 12px; border: 1px solid var(--color-border-strong); border-radius: 6px;
        background: #fff;
      }
      .cpp-select:focus { outline: 2px solid var(--color-gold); outline-offset: 1px; border-color: var(--color-navy); }
      .cpp-range { font-family: var(--font-mono); font-size: 12.5px; color: var(--color-muted); }

      .cpp-alert { border-radius: 8px; padding: 12px 16px; font-size: 14px; margin-bottom: 20px; line-height: 1.5; }
      .cpp-alert-error { background: #FDECEC; border: 1px solid #F3B9BE; color: #8A1420; }
      .cpp-alert-success { background: #E4F5E9; border: 1px solid #B9E3C6; color: #1F7A3D; }

      .cpp-actions { display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap; }
      .cpp-upload-btn { cursor: pointer; }
      .cpp-hint { font-size: 12.5px; color: var(--color-muted); margin: 10px 0 0; }

      @media (max-width: 640px) {
        .cpp { padding: 24px 20px; }
      }
    `}</style>
  )
}

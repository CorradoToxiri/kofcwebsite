'use client'

import { useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const BUCKET = 'public-photos'
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png']
const MAX_BYTES = 5 * 1024 * 1024

function getExtension(filename: string): string {
  const match = filename.match(/\.([a-zA-Z0-9]+)$/)
  return match ? match[1].toLowerCase() : ''
}

// Spaces → underscores, then a "Head_" prefix (no double-prefixing).
function normalizeFilename(filename: string): string {
  const underscored = filename.replace(/\s+/g, '_')
  return underscored.startsWith('Head_') ? underscored : `Head_${underscored}`
}

type Props = {
  value: string | null
  onChange: (url: string | null) => void
}

export default function PhotoField({ value, onChange }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  // Set right after a fresh upload so the preview bypasses the CDN cache for
  // this session; not persisted onto the stored photo_url.
  const [cacheBust, setCacheBust] = useState<number | null>(null)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerFiles, setPickerFiles] = useState<string[] | null>(null)
  const [pickerLoading, setPickerLoading] = useState(false)
  const [pickerError, setPickerError] = useState<string | null>(null)

  const previewSrc = value ? (cacheBust ? `${value}?v=${cacheBust}` : value) : null

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploadError(null)
    const ext = getExtension(file.name)
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setUploadError('Please use a JPG or PNG image.')
      return
    }
    if (file.size > MAX_BYTES) {
      setUploadError('Please use an image under 5 MB.')
      return
    }

    const finalName = normalizeFilename(file.name)
    setUploading(true)
    const { error } = await supabase.storage.from(BUCKET).upload(finalName, file, {
      upsert: true,
      contentType: file.type || undefined,
    })
    setUploading(false)
    if (error) {
      setUploadError("Couldn't upload this photo. Please try again.")
      return
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(finalName)
    setCacheBust(Date.now())
    setPickerFiles(null)
    onChange(data.publicUrl)
  }

  async function togglePicker() {
    setPickerOpen((open) => !open)
    if (pickerFiles || pickerLoading) return
    setPickerLoading(true)
    setPickerError(null)
    const { data, error } = await supabase.storage.from(BUCKET).list('', {
      limit: 500,
      search: 'Head_',
      sortBy: { column: 'name', order: 'asc' },
    })
    setPickerLoading(false)
    if (error) {
      setPickerError("Couldn't load existing photos. Please try again.")
      return
    }
    setPickerFiles((data ?? []).map((f) => f.name).filter((name) => name.startsWith('Head_')))
  }

  function pickFile(name: string) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(name)
    setCacheBust(null)
    setUploadError(null)
    onChange(data.publicUrl)
    setPickerOpen(false)
  }

  function removePhoto() {
    setCacheBust(null)
    setUploadError(null)
    onChange(null)
  }

  return (
    <div className="pf">
      <div className="pf-preview">
        {previewSrc ? (
          // Admin-only thumbnail; a plain <img> keeps this simple (no next/image sizing needed).
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewSrc} alt="" />
        ) : (
          <span className="pf-preview-empty">No photo</span>
        )}
      </div>

      <div className="pf-controls">
        <label className="btn btn-secondary pf-upload-btn">
          {uploading ? 'Uploading…' : 'Upload photo'}
          <input
            type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={handleFileChange} disabled={uploading} hidden
          />
        </label>
        <button type="button" className="btn btn-secondary" onClick={togglePicker}>
          Choose existing…
        </button>
        {value && (
          <button type="button" className="pf-remove" onClick={removePhoto}>
            Remove photo
          </button>
        )}
      </div>

      {uploadError && <p className="pf-error" role="alert">{uploadError}</p>}

      {pickerOpen && (
        <div className="pf-picker">
          {pickerLoading && <p className="pf-picker-status">Loading…</p>}
          {pickerError && <p className="pf-error" role="alert">{pickerError}</p>}
          {!pickerLoading && !pickerError && pickerFiles && pickerFiles.length === 0 && (
            <p className="pf-picker-status">No existing headshots found in storage.</p>
          )}
          {!pickerLoading && pickerFiles && pickerFiles.length > 0 && (
            <ul className="pf-picker-list">
              {pickerFiles.map((name) => (
                <li key={name}>
                  <button type="button" className="pf-picker-item" onClick={() => pickFile(name)}>
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <PhotoFieldStyles />
    </div>
  )
}

function PhotoFieldStyles() {
  return (
    <style>{`
      .pf-preview {
        width: 120px; height: 120px; border-radius: 10px; overflow: hidden;
        background: var(--color-surface-alt); border: 1px solid var(--color-border);
        display: flex; align-items: center; justify-content: center; margin-bottom: 12px;
      }
      .pf-preview img { width: 100%; height: 100%; object-fit: cover; }
      .pf-preview-empty { font-size: 12.5px; color: var(--color-muted); }
      .pf-controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
      .pf-upload-btn { cursor: pointer; }
      .pf-remove {
        font-size: 13px; color: var(--color-kofc-red); background: none; border: none;
        cursor: pointer; padding: 0; text-decoration: underline;
      }
      .pf-error { color: #8A1420; font-size: 13.5px; margin: 10px 0 0; }
      .pf-picker {
        margin-top: 12px; border: 1px solid var(--color-border); border-radius: 8px;
        padding: 10px 12px; max-height: 220px; overflow-y: auto; background: var(--color-surface-alt);
      }
      .pf-picker-status { font-size: 13px; color: var(--color-muted); margin: 4px 0; }
      .pf-picker-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
      .pf-picker-item {
        display: block; width: 100%; text-align: left; background: none; border: none;
        cursor: pointer; padding: 6px 8px; border-radius: 6px; font-size: 13.5px;
        font-family: var(--font-mono); color: var(--color-ink);
      }
      .pf-picker-item:hover { background: #fff; color: var(--color-navy); }
    `}</style>
  )
}

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

function normalizeFilename(filename: string): string {
  return filename.replace(/\s+/g, '_')
}

type Props = {
  value: string | null
  onChange: (url: string | null) => void
}

export default function CharityPhotoField({ value, onChange }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  // Set right after a fresh upload so the preview bypasses the CDN cache for
  // this session; not persisted onto the stored photo_url.
  const [cacheBust, setCacheBust] = useState<number | null>(null)

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
    onChange(data.publicUrl)
  }

  function removePhoto() {
    setCacheBust(null)
    setUploadError(null)
    onChange(null)
  }

  return (
    <div className="cpf">
      <div className="cpf-preview">
        {previewSrc ? (
          // Admin-only thumbnail; a plain <img> keeps this simple (no next/image sizing needed).
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewSrc} alt="" />
        ) : (
          <span className="cpf-preview-empty">No photo</span>
        )}
      </div>

      <div className="cpf-controls">
        <label className="btn btn-secondary cpf-upload-btn">
          {uploading ? 'Uploading…' : 'Upload photo'}
          <input
            type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={handleFileChange} disabled={uploading} hidden
          />
        </label>
        {value && (
          <button type="button" className="cpf-remove" onClick={removePhoto}>
            Remove photo
          </button>
        )}
      </div>

      <p className="cpf-hint">Landscape images (roughly 16:9) look best.</p>

      {uploadError && <p className="cpf-error" role="alert">{uploadError}</p>}

      <CharityPhotoFieldStyles />
    </div>
  )
}

function CharityPhotoFieldStyles() {
  return (
    <style>{`
      .cpf-preview {
        width: 160px; aspect-ratio: 16 / 9; border-radius: 10px; overflow: hidden;
        background: var(--color-surface-alt); border: 1px solid var(--color-border);
        display: flex; align-items: center; justify-content: center; margin-bottom: 12px;
      }
      .cpf-preview img { width: 100%; height: 100%; object-fit: cover; }
      .cpf-preview-empty { font-size: 12.5px; color: var(--color-muted); }
      .cpf-controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
      .cpf-upload-btn { cursor: pointer; }
      .cpf-remove {
        font-size: 13px; color: var(--color-kofc-red); background: none; border: none;
        cursor: pointer; padding: 0; text-decoration: underline;
      }
      .cpf-hint { font-size: 12.5px; color: var(--color-muted); margin: 10px 0 0; }
      .cpf-error { color: #8A1420; font-size: 13.5px; margin: 10px 0 0; }
    `}</style>
  )
}

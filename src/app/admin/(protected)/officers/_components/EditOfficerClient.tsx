'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Officer } from '@/lib/supabase/types'
import OfficerForm from './OfficerForm'

export default function EditOfficerClient({ officer }: { officer: Officer }) {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleDelete() {
    if (!window.confirm(`Delete '${officer.full_name}'? This can't be undone.`)) return
    setDeleting(true)
    setDeleteError(null)
    const { error } = await supabase.from('officers').delete().eq('id', officer.id)
    if (error) {
      setDeleting(false)
      setDeleteError("Couldn't delete this officer. Please try again.")
      return
    }
    router.push('/admin/officers?success=deleted')
  }

  return (
    <div>
      <OfficerForm mode="edit" officer={officer} />

      <div className="evf-danger">
        {deleteError && <div className="evf-danger-error" role="alert">{deleteError}</div>}
        <button type="button" className="evf-danger-btn" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete this officer'}
        </button>
      </div>

      <style>{`
        .evf-danger { max-width: 720px; margin-top: 20px; padding-top: 20px; border-top: 1px dashed var(--color-border-strong); }
        .evf-danger-btn {
          background: none; border: 1px solid var(--color-kofc-red); color: var(--color-kofc-red);
          padding: 9px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .evf-danger-btn:hover:not(:disabled) { background: #FDECEC; }
        .evf-danger-btn:disabled { opacity: .6; cursor: not-allowed; }
        .evf-danger-error { color: #8A1420; font-size: 13.5px; margin-bottom: 10px; }
      `}</style>
    </div>
  )
}

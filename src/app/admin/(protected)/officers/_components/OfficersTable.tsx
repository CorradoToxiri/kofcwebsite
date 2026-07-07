'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Officer } from '@/lib/supabase/types'
import { OFFICER_CATEGORY_LABEL } from '@/lib/utils/officerCategories'

export default function OfficersTable({ officers }: { officers: Officer[] }) {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const sorted = useMemo(() => {
    const copy = officers.slice()
    copy.sort((a, b) => a.sort_order - b.sort_order)
    return copy
  }, [officers])

  async function handleDelete(officer: Officer) {
    if (!window.confirm(`Delete '${officer.full_name}'? This can't be undone.`)) return
    setDeletingId(officer.id)
    setDeleteError(null)
    const { error } = await supabase.from('officers').delete().eq('id', officer.id)
    setDeletingId(null)
    if (error) {
      setDeleteError("Couldn't delete this officer. Please try again.")
      return
    }
    router.refresh()
  }

  if (officers.length === 0) {
    return (
      <div className="evt-empty">
        <p>No officers yet. Click &ldquo;+ Add New Officer&rdquo; to create the first one.</p>
        <OfficersTableStyles />
      </div>
    )
  }

  return (
    <div className="evt-wrap">
      {deleteError && <div className="evt-alert" role="alert">{deleteError}</div>}

      <table className="evt-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sort order</th>
            <th>Title</th>
            <th>Category</th>
            <th>Featured</th>
            <th>Visible on website</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((o) => (
            <tr key={o.id} className="evt-row">
              <td>
                <Link href={`/admin/officers/${o.id}/edit`} className="evt-title-link">
                  {o.full_name}
                </Link>
              </td>
              <td className="evt-mono">{o.sort_order}</td>
              <td>{o.title}</td>
              <td>{OFFICER_CATEGORY_LABEL[o.category] ?? o.category}</td>
              <td>
                {o.is_featured ? (
                  <span className="evt-badge evt-badge-yes">Yes</span>
                ) : (
                  <span className="evt-badge evt-badge-no">No</span>
                )}
              </td>
              <td>
                {o.is_published ? (
                  <span className="evt-badge evt-badge-yes">Yes</span>
                ) : (
                  <span className="evt-badge evt-badge-no">No</span>
                )}
              </td>
              <td className="evt-actions">
                <div className="evt-actions-inner">
                  <Link href={`/admin/officers/${o.id}/edit`} className="evt-action-link">Edit</Link>
                  <button
                    type="button" className="evt-action-link evt-action-danger"
                    onClick={() => handleDelete(o)} disabled={deletingId === o.id}
                  >
                    {deletingId === o.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <OfficersTableStyles />
    </div>
  )
}

function OfficersTableStyles() {
  return (
    <style>{`
      .evt-empty {
        background: #fff; border: 1px solid var(--color-border); border-radius: 12px;
        padding: 40px; text-align: center; color: var(--color-ink-soft); font-size: 15px;
      }
      .evt-wrap { background: #fff; border: 1px solid var(--color-border); border-radius: 12px;
        box-shadow: var(--shadow-card); overflow: hidden; }
      .evt-alert { background: #FDECEC; border-bottom: 1px solid #F3B9BE; color: #8A1420;
        padding: 12px 20px; font-size: 14px; }
      .evt-table { width: 100%; border-collapse: collapse; font-size: 14.5px; }
      .evt-table th {
        text-align: left; padding: 14px 18px; font-family: var(--font-sans); font-size: 12px;
        font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-muted);
        background: var(--color-surface-alt); border-bottom: 1px solid var(--color-border);
      }
      .evt-row td { padding: 14px 18px; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
      .evt-row:last-child td { border-bottom: none; }
      .evt-title-link { font-weight: 600; color: var(--color-navy); }
      .evt-mono { font-family: var(--font-mono); font-size: 13px; color: var(--color-ink-soft); }
      .evt-badge {
        display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;
        letter-spacing: .03em;
      }
      .evt-badge-yes { background: #E4F5E9; color: #1F7A3D; }
      .evt-badge-no { background: #F1F2F4; color: #6b7280; }
      .evt-actions-inner { display: flex; align-items: center; gap: 14px; white-space: nowrap; }
      .evt-action-link {
        font-size: 13.5px; font-weight: 600; color: var(--color-navy); background: none;
        border: none; cursor: pointer; padding: 0; text-decoration: none;
      }
      .evt-action-link:hover { text-decoration: underline; }
      .evt-action-danger { color: var(--color-kofc-red); }
      .evt-action-link:disabled { opacity: .5; cursor: not-allowed; }
      @media (max-width: 780px) {
        .evt-table { display: block; overflow-x: auto; }
      }
    `}</style>
  )
}

'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Event } from '@/lib/supabase/types'
import { EVENT_TYPE_LABEL } from '@/lib/utils/eventTypes'
import { TZ } from '@/lib/utils/dates'

type SortKey = 'starts_at' | 'title'
type SortDir = 'asc' | 'desc'
type PageSize = '20' | '50' | 'all'

function formatStartsAt(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZone: TZ,
  })
}

export default function EventsTable({ events }: { events: Event[] }) {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [sortKey, setSortKey] = useState<SortKey>('starts_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [pageSize, setPageSize] = useState<PageSize>('50')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const sorted = useMemo(() => {
    const copy = events.slice()
    copy.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'starts_at') {
        cmp = new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
      } else {
        cmp = a.title.localeCompare(b.title)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [events, sortKey, sortDir])

  const visible = useMemo(() => (
    pageSize === 'all' ? sorted : sorted.slice(0, Number(pageSize))
  ), [sorted, pageSize])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'starts_at' ? 'desc' : 'asc')
    }
  }

  async function handleDelete(ev: Event) {
    if (!window.confirm(`Delete '${ev.title}'? This can't be undone.`)) return
    setDeletingId(ev.id)
    setDeleteError(null)
    const { error } = await supabase.from('events').delete().eq('id', ev.id)
    setDeletingId(null)
    if (error) {
      setDeleteError("Couldn't delete this event. Please try again.")
      return
    }
    router.refresh()
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return null
    return <span className="evt-sort-ind">{sortDir === 'asc' ? '▲' : '▼'}</span>
  }

  if (events.length === 0) {
    return (
      <div className="evt-empty">
        <p>No events yet. Click &ldquo;+ Add New Event&rdquo; to create the first one.</p>
        <EventsTableStyles />
      </div>
    )
  }

  return (
    <div className="evt-wrap">
      <div className="evt-toolbar">
        <label className="evt-pagesize">
          Show
          <select value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)}>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="all">All</option>
          </select>
        </label>
        <span className="evt-count">{visible.length} of {events.length} events</span>
      </div>

      {deleteError && <div className="evt-alert" role="alert">{deleteError}</div>}

      <table className="evt-table">
        <thead>
          <tr>
            <th>
              <button type="button" className="evt-sortbtn" onClick={() => toggleSort('title')}>
                Title {sortIndicator('title')}
              </button>
            </th>
            <th>Event type</th>
            <th>
              <button type="button" className="evt-sortbtn" onClick={() => toggleSort('starts_at')}>
                Starts at {sortIndicator('starts_at')}
              </button>
            </th>
            <th>Visible on website</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {visible.map((ev) => (
            <tr key={ev.id} className="evt-row">
              <td>
                <Link href={`/admin/events/${ev.id}/edit`} className="evt-title-link">
                  {ev.title}
                </Link>
              </td>
              <td>{EVENT_TYPE_LABEL[ev.event_type] ?? ev.event_type}</td>
              <td className="evt-mono">{formatStartsAt(ev.starts_at)}</td>
              <td>
                {ev.is_published ? (
                  <span className="evt-badge evt-badge-yes">Yes</span>
                ) : (
                  <span className="evt-badge evt-badge-no">No</span>
                )}
              </td>
              <td className="evt-actions">
                <div className="evt-actions-inner">
                  <Link href={`/admin/events/${ev.id}/edit`} className="evt-action-link">Edit</Link>
                  <Link href={`/admin/events/new?duplicateFrom=${ev.id}`} className="evt-action-link">Duplicate</Link>
                  <button
                    type="button" className="evt-action-link evt-action-danger"
                    onClick={() => handleDelete(ev)} disabled={deletingId === ev.id}
                  >
                    {deletingId === ev.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EventsTableStyles />
    </div>
  )
}

function EventsTableStyles() {
  return (
    <style>{`
      .evt-empty {
        background: #fff; border: 1px solid var(--color-border); border-radius: 12px;
        padding: 40px; text-align: center; color: var(--color-ink-soft); font-size: 15px;
      }
      .evt-wrap { background: #fff; border: 1px solid var(--color-border); border-radius: 12px;
        box-shadow: var(--shadow-card); overflow: hidden; }
      .evt-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px;
        padding: 14px 18px; border-bottom: 1px solid var(--color-border); flex-wrap: wrap; }
      .evt-pagesize { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px;
        font-weight: 600; color: var(--color-navy); }
      .evt-pagesize select {
        font: inherit; padding: 5px 8px; border: 1px solid var(--color-border-strong);
        border-radius: 6px; background: #fff; color: var(--color-ink);
      }
      .evt-count { font-size: 13px; color: var(--color-muted); }
      .evt-alert { background: #FDECEC; border-bottom: 1px solid #F3B9BE; color: #8A1420;
        padding: 12px 20px; font-size: 14px; }
      .evt-table { width: 100%; border-collapse: collapse; font-size: 14.5px; }
      .evt-table th {
        text-align: left; padding: 14px 18px; font-family: var(--font-sans); font-size: 12px;
        font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-muted);
        background: var(--color-surface-alt); border-bottom: 1px solid var(--color-border);
      }
      .evt-sortbtn {
        background: none; border: none; cursor: pointer; padding: 0; font: inherit;
        letter-spacing: inherit; text-transform: inherit; color: inherit;
        display: inline-flex; align-items: center; gap: 4px;
      }
      .evt-sortbtn:hover { color: var(--color-navy); }
      .evt-sort-ind { font-size: 9px; }
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

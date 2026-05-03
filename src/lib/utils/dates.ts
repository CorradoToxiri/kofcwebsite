const TZ = 'America/New_York'

export function eventDateParts(iso: string) {
  const d = new Date(iso)
  const month = d.toLocaleString('en-US', { month: 'short', timeZone: TZ })   // "Nov"
  const day   = d.toLocaleString('en-US', { day: 'numeric',  timeZone: TZ })  // "19"
  const dow   = d.toLocaleString('en-US', { weekday: 'short', timeZone: TZ }) // "Wed"
  const year  = d.toLocaleString('en-US', { year: 'numeric',  timeZone: TZ }) // "2025"
  const time  = d.toLocaleString('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: TZ,
  }) // "7:30 PM"
  return { month, day, dowYear: `${dow} · ${year}`, time }
}

export function shortWeekdayTime(iso: string) {
  const d = new Date(iso)
  const dow  = d.toLocaleString('en-US', { weekday: 'short', timeZone: TZ })
  const time = d.toLocaleString('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: TZ,
  })
  return `${dow} · ${time}` // "Mon · 7:30 PM"
}

export function monthYearPill(iso: string) {
  const d = new Date(iso)
  const mon = d.toLocaleString('en-US', { month: 'short', timeZone: TZ }).toUpperCase()
  const yr  = d.toLocaleString('en-US', { year: '2-digit', timeZone: TZ })
  return `${mon} '${yr}` // "NOV '25"
}

export function shortDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', timeZone: TZ,
  }) // "Nov 20"
}

export function isSameCalendarDay(iso1: string, iso2: string): boolean {
  const fmt = (d: Date) =>
    d.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TZ })
  return fmt(new Date(iso1)) === fmt(new Date(iso2))
}

// Returns "7:30 PM" (no ends_at), "1:00 PM – 2:30 PM" (same-day), or null (multi-day).
export function formatTimeRange(startsAt: string, endsAt: string | null): string | null {
  const t1 = new Date(startsAt).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ })
  if (!endsAt) return t1
  if (!isSameCalendarDay(startsAt, endsAt)) return null
  const t2 = new Date(endsAt).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ })
  return `${t1} – ${t2}`
}

// Returns "Mon · 7:30 PM", "Mon · 1:00 PM – 2:30 PM" (same-day), or "Mon – Wed" (multi-day).
export function shortWeekdayTimeRange(startsAt: string, endsAt: string | null): string {
  const start = new Date(startsAt)
  const startDow = start.toLocaleString('en-US', { weekday: 'short', timeZone: TZ })
  if (!endsAt) return shortWeekdayTime(startsAt)
  if (isSameCalendarDay(startsAt, endsAt)) {
    const t1 = start.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ })
    const t2 = new Date(endsAt).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ })
    return `${startDow} · ${t1} – ${t2}`
  }
  const endDow = new Date(endsAt).toLocaleString('en-US', { weekday: 'short', timeZone: TZ })
  return `${startDow} – ${endDow}`
}

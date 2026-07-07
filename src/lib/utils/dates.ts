export const TZ = 'America/New_York'

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

// Returns "Mon 05/07 · 7:30 PM", "Mon 05/07 · 1:00 PM – 2:30 PM", or "Mon 05/07 – Wed 05/09".
export function shortWeekdayDateTimeRange(startsAt: string, endsAt: string | null): string {
  const start = new Date(startsAt)
  const startDow = start.toLocaleString('en-US', { weekday: 'short', timeZone: TZ })
  const startMd  = start.toLocaleString('en-US', { month: '2-digit', day: '2-digit', timeZone: TZ })
  const t1 = start.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ })
  if (!endsAt) return `${startDow} ${startMd} · ${t1}`
  if (isSameCalendarDay(startsAt, endsAt)) {
    const t2 = new Date(endsAt).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ })
    return `${startDow} ${startMd} · ${t1} – ${t2}`
  }
  const end = new Date(endsAt)
  const endDow = end.toLocaleString('en-US', { weekday: 'short', timeZone: TZ })
  const endMd  = end.toLocaleString('en-US', { month: '2-digit', day: '2-digit', timeZone: TZ })
  return `${startDow} ${startMd} – ${endDow} ${endMd}`
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

// ── Timezone-safe conversions for admin date/time pickers ──────────────────
//
// <input type="datetime-local"> has no timezone: its value is a bare wall-clock
// string like "2026-08-01T19:30". Council events are always local to `TZ`
// (America/New_York), regardless of what timezone the admin's browser/OS is
// set to, so we must convert that wall-clock string to/from UTC by explicitly
// anchoring it to `TZ` — never via `new Date(value)`, which anchors to the
// browser's local timezone instead and would shift the time if an admin ever
// enters an event from outside US Eastern.

function timeZoneOffsetMinutes(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
  const parts = dtf.formatToParts(instant)
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value)
  const asUTC = Date.UTC(
    get('year'), get('month') - 1, get('day'),
    get('hour'), get('minute'), get('second')
  )
  return (asUTC - instant.getTime()) / 60000
}

// Converts a "YYYY-MM-DDTHH:mm" wall-clock string, interpreted as local time in
// `timeZone`, to a UTC ISO string suitable for a timestamptz column.
export function localDateTimeToISO(value: string, timeZone: string = TZ): string {
  const [datePart, timePart] = value.split('T')
  const [y, mo, d] = datePart.split('-').map(Number)
  const [hh, mm] = timePart.split(':').map(Number)
  const guessUTC = Date.UTC(y, mo - 1, d, hh, mm)
  const offset = timeZoneOffsetMinutes(new Date(guessUTC), timeZone)
  return new Date(guessUTC - offset * 60000).toISOString()
}

// Converts a UTC ISO timestamp to a "YYYY-MM-DDTHH:mm" wall-clock string in
// `timeZone`, for pre-filling an <input type="datetime-local">.
export function isoToLocalDateTimeInput(iso: string, timeZone: string = TZ): string {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  })
  const parts = dtf.formatToParts(new Date(iso))
  const get = (type: string) => parts.find((p) => p.type === type)!.value
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`
}

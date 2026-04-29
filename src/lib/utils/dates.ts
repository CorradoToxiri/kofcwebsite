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

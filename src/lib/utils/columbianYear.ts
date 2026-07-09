import { localDateTimeToISO, TZ } from './dates'

// The Columbian year runs July 1 – June 30.
// July–December: currentYear–nextYear; January–June: prevYear–currentYear.
export function getColumbianYear(date: Date = new Date()): string {
  const month = date.getMonth() // 0-indexed; July = 6
  const year  = date.getFullYear()
  return month >= 6 ? `${year}–${year + 1}` : `${year - 1}–${year}`
}

// Returns e.g. "Jul 2025 – Jun 2026" for use in the officers hero stats strip.
export function getColumbianYearRange(date: Date = new Date()): string {
  const cy         = getColumbianYear(date)
  const startYear  = parseInt(cy) // parseInt stops at the en-dash
  return `Jul ${startYear} – Jun ${startYear + 1}`
}

// Returns the numeric start year of the Columbian year current as of `date`
// (e.g. 2026 for anything from 2026-07-01 through 2027-06-30).
export function getCurrentColumbianStartYear(date: Date = new Date()): number {
  return parseInt(getColumbianYear(date)) // parseInt stops at the en-dash
}

// Half-open [startISO, endISO) instant bounds for the Columbian year beginning
// July 1 of `startYear`, anchored to `timeZone` (America/New_York by default) so
// the boundary is correct regardless of the querying machine's local timezone.
// Use with `.gte('starts_at', startISO).lt('starts_at', endISO)` — this includes
// all of June 30 (end year) and excludes July 1 (end year).
export function getColumbianYearBounds(startYear: number, timeZone: string = TZ) {
  return {
    startISO: localDateTimeToISO(`${startYear}-07-01T00:00`, timeZone),
    endISO: localDateTimeToISO(`${startYear + 1}-07-01T00:00`, timeZone),
  }
}

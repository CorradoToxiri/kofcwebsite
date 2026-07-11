import { TZ, localDateTimeToISO, isoToLocalDateTimeInput } from './dates'
import { slugify } from './slug'

// Rolls a Columbian-year event forward/back to another Columbian year, keeping
// the same ISO week number + ISO weekday (and wall-clock time of day) rather
// than a fixed 365-day offset — this is what keeps recurring meetings on the
// same "which Tuesday of the month" pattern year over year.
// Proven examples: Sat 2025-10-18 -> Sat 2026-10-17; Tue 2025-11-25 -> Tue 2026-11-24.

function isoWeekParts(y: number, m: number, d: number): { week: number; weekday: number } {
  const date = new Date(Date.UTC(y, m - 1, d))
  const weekday = date.getUTCDay() || 7 // 1=Mon..7=Sun
  const thursday = new Date(date)
  thursday.setUTCDate(date.getUTCDate() + 4 - weekday)
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((thursday.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return { week, weekday }
}

function dateFromIsoWeekParts(year: number, week: number, weekday: number): { y: number; m: number; d: number } {
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const jan4Weekday = jan4.getUTCDay() || 7
  const week1Monday = new Date(jan4)
  week1Monday.setUTCDate(jan4.getUTCDate() - (jan4Weekday - 1))
  const result = new Date(week1Monday)
  result.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7 + (weekday - 1))
  return { y: result.getUTCFullYear(), m: result.getUTCMonth() + 1, d: result.getUTCDate() }
}

// Rolls a "YYYY-MM-DDTHH:mm" wall-clock string by `yearOffset` calendar years,
// preserving ISO week number + ISO weekday + time of day.
export function rollLocalDateTime(localDateTime: string, yearOffset: number): string {
  const [datePart, timePart] = localDateTime.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  const { week, weekday } = isoWeekParts(y, m, d)
  const { y: dy, m: dm, d: dd } = dateFromIsoWeekParts(y + yearOffset, week, weekday)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${dy}-${pad(dm)}-${pad(dd)}T${timePart}`
}

// Maps a UTC ISO instant to its Columbian-year-rolled equivalent, anchored to
// `timeZone` so the wall-clock date/time (not the UTC instant) is what rolls.
export function rollInstantToColumbianYear(
  iso: string,
  sourceStartYear: number,
  destStartYear: number,
  timeZone: string = TZ
): string {
  const localDateTime = isoToLocalDateTimeInput(iso, timeZone)
  const rolled = rollLocalDateTime(localDateTime, destStartYear - sourceStartYear)
  return localDateTimeToISO(rolled, timeZone)
}

// Builds the destination slug fresh from the title (same normalization the
// Events editor uses for new events) plus the destination event's year/month —
// rather than editing the source slug, which may not end in a `-YYYY-MM`/`-YYYY`
// pattern at all (e.g. "test-event-2024-1"). Uniqueness against existing rows
// is handled at upload time (see withRandomSuffix), same as the Events editor's
// create/duplicate flow.
export function buildDestinationSlug(title: string, destLocalDateTime: string): string {
  const [datePart] = destLocalDateTime.split('T')
  const [y, m] = datePart.split('-')
  return `${slugify(title)}-${y}-${m}`
}

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

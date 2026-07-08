const CHARTER_YEAR = 1968
const CHARTER_MONTH = 2 // March (0-indexed)
const CHARTER_DAY = 10

// Council #6033 was chartered March 10, 1968. The years-serving count
// increments on that anniversary each year, not on Jan 1.
export function getYearsServing(date: Date = new Date()): number {
  const year = date.getFullYear()
  const beforeAnniversary =
    date.getMonth() < CHARTER_MONTH ||
    (date.getMonth() === CHARTER_MONTH && date.getDate() < CHARTER_DAY)
  return year - CHARTER_YEAR - (beforeAnniversary ? 1 : 0)
}

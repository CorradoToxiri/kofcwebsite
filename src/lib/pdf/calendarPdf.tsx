import fs from 'node:fs'
import path from 'node:path'
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import type { Event, EventType } from '@/lib/supabase/types'
import { TZ } from '@/lib/utils/dates'

const COUNCIL_ADDRESS = '271 West Saddle River Road, Upper Saddle River, NJ 07458'

// ─── Grouping ────────────────────────────────────────────────────────────────

type MonthGroup = { key: string; label: string; events: Event[] }

function monthKey(iso: string): string {
  const d = new Date(iso)
  const year  = d.toLocaleString('en-US', { year: 'numeric', timeZone: TZ })
  const month = d.toLocaleString('en-US', { month: '2-digit', timeZone: TZ })
  return `${year}-${month}` // "YYYY-MM"
}

function monthLabel(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: TZ })
}

function groupByMonth(events: Event[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>()
  for (const ev of events) {
    const key = monthKey(ev.starts_at)
    if (!map.has(key)) map.set(key, { key, label: monthLabel(ev.starts_at), events: [] })
    map.get(key)!.events.push(ev)
  }
  return Array.from(map.values())
}

// Reading order is vertical, not balanced: column 1 gets Jul–Dec, column 2
// gets Jan–Jun, matching the Columbian year's own Jul-start layout.
function splitIntoColumns(groups: MonthGroup[]): [MonthGroup[], MonthGroup[]] {
  const columns: [MonthGroup[], MonthGroup[]] = [[], []]
  for (const group of groups) {
    const calendarMonth = parseInt(group.key.slice(5, 7), 10) // "YYYY-MM" -> MM
    columns[calendarMonth >= 7 ? 0 : 1].push(group)
  }
  return columns
}

function formatEventDate(iso: string): string {
  const d = new Date(iso)
  const dow = d.toLocaleString('en-US', { weekday: 'short', timeZone: TZ })
  const mon = d.toLocaleString('en-US', { month: 'short', timeZone: TZ })
  const day = d.toLocaleString('en-US', { day: 'numeric', timeZone: TZ })
  return `${dow} ${mon} ${day}`
}

// ─── Per-event-type line styling ───────────────────────────────────────────
// officers_meeting: diamond marker, navy line. council_meeting: asterisk
// marker, bold red line. Everything else: plain hyphen, default styling.

type LineKind = 'default' | 'officers' | 'council'

function lineKind(type: EventType): LineKind {
  if (type === 'officers_meeting') return 'officers'
  if (type === 'council_meeting') return 'council'
  return 'default'
}

// ─── Logo ────────────────────────────────────────────────────────────────────
// Read once per process from the deployed `public/` directory. Passed to
// react-pdf's <Image> as a raw Buffer (no network fetch — safe under the
// Vercel serverless Node runtime, which bundles `public/` with the function).

let logoBuffer: Buffer | null = null
function getLogoBuffer(): Buffer | null {
  if (logoBuffer) return logoBuffer
  try {
    logoBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'kofc-emblem.png'))
  } catch {
    logoBuffer = null
  }
  return logoBuffer
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const NAVY = '#003087'
const RED = '#C8102E'

const styles = StyleSheet.create({
  page: { padding: 34, fontFamily: 'Helvetica', fontSize: 9, color: '#1A1A1A' },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  logo: { width: 44, height: 44 },
  headerText: { flexDirection: 'column', gap: 3 },
  title: { fontFamily: 'Helvetica-Bold', fontSize: 15, color: NAVY },
  address: { fontSize: 9, color: '#5A6478' },
  subtitle: { fontSize: 9, color: '#5A6478', textAlign: 'center', marginTop: 12, marginBottom: 11 },
  subtitleRed: { color: RED },
  divider: { height: 2, backgroundColor: '#F2A900', marginTop: 8, marginBottom: 14 },
  columns: { flexDirection: 'row', gap: 26 },
  column: { flex: 1 },
  month: { marginBottom: 11 },
  monthHeading: {
    fontFamily: 'Helvetica-Bold', fontSize: 10, color: NAVY,
    textTransform: 'uppercase', letterSpacing: 0.6,
    borderBottom: '1pt solid #D9DEE5', paddingBottom: 3, marginBottom: 5,
  },
  eventRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3 },
  eventDate: { width: 58, fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: '#5A6478', textAlign: 'right' },
  eventSeparator: { width: 14, fontSize: 8.5, textAlign: 'center', color: '#5A6478' },
  eventTitle: { flex: 1, fontSize: 8.5, lineHeight: 1.25 },
  diamondWrap: { width: 14, alignItems: 'center', justifyContent: 'center', paddingTop: 2 },
  diamond: { width: 5, height: 5, backgroundColor: NAVY, transform: 'rotate(45deg)' },
  lineOfficers: { color: NAVY },
  lineCouncil: { color: RED, fontFamily: 'Helvetica-Bold' },
})

// ─── Document ────────────────────────────────────────────────────────────────

type Props = { events: Event[]; startYear: number }

export function CalendarPdfDocument({ events, startYear }: Props) {
  const yearRange = `${startYear}–${startYear + 1}`
  const groups = groupByMonth(events)
  const [colA, colB] = splitIntoColumns(groups)
  const logo = getLogoBuffer()

  return (
    <Document title={`Presentation Council #6033 — Calendar ${yearRange}`}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.headerTop}>
          {logo && <Image src={logo} style={styles.logo} />}
          <View style={styles.headerText}>
            <Text style={styles.title}>
              Presentation Council #6033 — Calendar {yearRange}
            </Text>
            <Text style={styles.address}>{COUNCIL_ADDRESS}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          <Text style={styles.subtitleRed}>Council Meetings *</Text>
          <Text> are on the 3rd Wed of the Month - 7:30pm at the Church</Text>
        </Text>

        <View style={styles.divider} />

        <View style={styles.columns}>
          <MonthColumn groups={colA} />
          <MonthColumn groups={colB} />
        </View>
      </Page>
    </Document>
  )
}

function MonthColumn({ groups }: { groups: MonthGroup[] }) {
  return (
    <View style={styles.column}>
      {groups.map((group) => (
        <View style={styles.month} key={group.key} wrap={false}>
          <Text style={styles.monthHeading}>{group.label}</Text>
          {group.events.map((ev) => (
            <EventLine key={ev.id} event={ev} />
          ))}
        </View>
      ))}
    </View>
  )
}

function withLine(base: Style, kind: LineKind): Style[] {
  if (kind === 'officers') return [base, styles.lineOfficers]
  if (kind === 'council') return [base, styles.lineCouncil]
  return [base]
}

function EventLine({ event: ev }: { event: Event }) {
  const kind = lineKind(ev.event_type)

  return (
    <View style={styles.eventRow}>
      <Text style={withLine(styles.eventDate, kind)}>{formatEventDate(ev.starts_at)}</Text>
      {kind === 'officers' ? (
        <View style={styles.diamondWrap}>
          <View style={styles.diamond} />
        </View>
      ) : (
        <Text style={withLine(styles.eventSeparator, kind)}>{kind === 'council' ? '*' : '-'}</Text>
      )}
      <Text style={withLine(styles.eventTitle, kind)}>{ev.title}</Text>
    </View>
  )
}

// ─── Render ──────────────────────────────────────────────────────────────────

export async function renderCalendarPdfBuffer(props: Props): Promise<Buffer> {
  return renderToBuffer(<CalendarPdfDocument {...props} />)
}

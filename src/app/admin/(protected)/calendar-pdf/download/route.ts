import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { getCalendarEvents } from '@/lib/pdf/getCalendarEvents'
import { renderCalendarPdfBuffer } from '@/lib/pdf/calendarPdf'
import { getCurrentColumbianStartYear } from '@/lib/utils/columbianYear'

export const runtime = 'nodejs'

function parseStartYear(request: NextRequest): number {
  const raw = request.nextUrl.searchParams.get('year')
  const year = raw ? parseInt(raw, 10) : NaN
  if (Number.isInteger(year) && year >= 2000 && year <= 2100) return year
  return getCurrentColumbianStartYear()
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return new NextResponse('Unauthorized', { status: auth.status })

  const startYear = parseStartYear(request)
  const events = await getCalendarEvents(auth.supabase, startYear)
  const buffer = await renderCalendarPdfBuffer({ events, startYear })

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="KofC6033_Calendar_${startYear}-${startYear + 1}.pdf"`,
    },
  })
}

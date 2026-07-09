import { getCurrentColumbianStartYear } from '@/lib/utils/columbianYear'
import CalendarPdfPanel from './_components/CalendarPdfPanel'

export const metadata = { title: 'Calendar PDF · Admin' }

export default function AdminCalendarPdfPage() {
  const defaultStartYear = getCurrentColumbianStartYear()

  return (
    <div className="evp">
      <div className="evp-head">
        <div>
          <span className="evp-eyebrow">Site content</span>
          <h1 className="evp-title">Annual Calendar PDF</h1>
        </div>
      </div>

      <CalendarPdfPanel defaultStartYear={defaultStartYear} />

      <style>{`
        .evp-head { display: flex; align-items: flex-start; justify-content: space-between;
          gap: 20px; margin-bottom: 22px; flex-wrap: wrap; }
        .evp-eyebrow { font-family: var(--font-sans); font-size: 12px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--color-gold-dark); }
        .evp-title { font-size: 30px; margin: 8px 0 0; color: var(--color-navy); }
      `}</style>
    </div>
  )
}

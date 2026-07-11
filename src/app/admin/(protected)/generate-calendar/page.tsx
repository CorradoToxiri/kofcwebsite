import { getCurrentColumbianStartYear } from '@/lib/utils/columbianYear'
import GenerateCalendarPanel from './_components/GenerateCalendarPanel'

export const metadata = { title: 'Generate Calendar · Admin' }

const YEAR_SPAN_BEFORE = 5
const YEAR_SPAN_AFTER = 2

export default function AdminGenerateCalendarPage() {
  const currentStartYear = getCurrentColumbianStartYear()
  const yearOptions = Array.from(
    { length: YEAR_SPAN_BEFORE + YEAR_SPAN_AFTER + 1 },
    (_, i) => currentStartYear - YEAR_SPAN_BEFORE + i
  )

  return (
    <div className="evp">
      <div className="evp-head">
        <div>
          <span className="evp-eyebrow">Site content</span>
          <h1 className="evp-title">Generate Calendar</h1>
        </div>
      </div>

      <GenerateCalendarPanel
        yearOptions={yearOptions}
        defaultSourceYear={currentStartYear - 1}
        defaultDestYear={currentStartYear}
      />

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

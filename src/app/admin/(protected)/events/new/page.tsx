import EventForm from '../_components/EventForm'

export const metadata = { title: 'Add Event · Admin' }

export default function NewEventPage() {
  return (
    <div className="evp">
      <div className="evp-head">
        <div>
          <span className="evp-eyebrow">Council calendar</span>
          <h1 className="evp-title">Add New Event</h1>
        </div>
      </div>

      <EventForm mode="create" />

      <style>{`
        .evp-eyebrow { font-family: var(--font-sans); font-size: 12px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--color-gold-dark); }
        .evp-title { font-size: 30px; margin: 8px 0 22px; color: var(--color-navy); }
      `}</style>
    </div>
  )
}

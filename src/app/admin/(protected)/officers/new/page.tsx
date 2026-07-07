import OfficerForm from '../_components/OfficerForm'

export const metadata = { title: 'Add Officer · Admin' }

export default function NewOfficerPage() {
  return (
    <div className="evp">
      <div className="evp-head">
        <div>
          <span className="evp-eyebrow">Council leadership</span>
          <h1 className="evp-title">Add New Officer</h1>
        </div>
      </div>

      <OfficerForm mode="create" />

      <style>{`
        .evp-eyebrow { font-family: var(--font-sans); font-size: 12px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--color-gold-dark); }
        .evp-title { font-size: 30px; margin: 8px 0 22px; color: var(--color-navy); }
      `}</style>
    </div>
  )
}

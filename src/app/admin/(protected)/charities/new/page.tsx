import CharityForm from '../_components/CharityForm'

export const metadata = { title: 'Add Charity · Admin' }

export default function NewCharityPage() {
  return (
    <div className="evp">
      <div className="evp-head">
        <div>
          <span className="evp-eyebrow">Charitable outreach</span>
          <h1 className="evp-title">Add New Charity</h1>
        </div>
      </div>

      <CharityForm mode="create" />

      <style>{`
        .evp-eyebrow { font-family: var(--font-sans); font-size: 12px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--color-gold-dark); }
        .evp-title { font-size: 30px; margin: 8px 0 22px; color: var(--color-navy); }
      `}</style>
    </div>
  )
}

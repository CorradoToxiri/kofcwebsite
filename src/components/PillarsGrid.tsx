// Shared four-pillars grid — used on Home and About pages.

export function PillarCard({
  num, title, body, meta, icon,
}: {
  num: string; title: string; body: string; meta: string; icon: React.ReactNode
}) {
  return (
    <div className="pillar">
      <svg className="pillar-ico" viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>
      <div className="pillar-num">{num}</div>
      <h3>{title}</h3>
      <span className="flourish" />
      <p>{body}</p>
      <div className="pillar-meta">{meta}</div>
    </div>
  )
}

type PillarsGridProps = {
  charityRaised: string
  reportingYear: string
  parishEventsPerYear: string
  activeMembers: string
  fourthDegreeKnights: string
}

export function PillarsGrid({
  charityRaised, reportingYear, parishEventsPerYear, activeMembers, fourthDegreeKnights,
}: PillarsGridProps) {
  return (
    <div className="pillars-grid">
      <PillarCard
        num="I."
        title="Charity"
        body="From the food pantry collection to our work with Covenant House Newark, we are our parish's hands and feet for those in need."
        meta={`${charityRaised} given in ${reportingYear}`}
        icon={
          <path d="M12 21s-7-4.5-9.2-9A5.4 5.4 0 0 1 12 6.4 5.4 5.4 0 0 1 21.2 12c-2.2 4.5-9.2 9-9.2 9z"
            stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
        }
      />
      <PillarCard
        num="II."
        title="Unity"
        body="None of us is as good as all of us. We work shoulder-to-shoulder with our pastor, our parish, and our community."
        meta={`${parishEventsPerYear} parish events / year`}
        icon={<>
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <path d="M3.5 12h17M12 3.5c2.5 3 2.5 14 0 17M12 3.5c-2.5 3-2.5 14 0 17"
            stroke="currentColor" strokeWidth="1.6" fill="none" />
        </>}
      />
      <PillarCard
        num="III."
        title="Fraternity"
        body="A circle of Catholic men who hold each other up — at first communions and at funerals, in joys and in trials."
        meta={`${activeMembers} brother knights`}
        icon={
          <path d="M5 20a7 7 0 0 1 14 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
            stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        }
      />
      <PillarCard
        num="IV."
        title="Patriotism"
        body="Faithful citizens who honor our country, support our veterans, and stand for the dignity of every life among us."
        meta={`${fourthDegreeKnights} Fourth Degree Knights`}
        icon={<>
          <path d="M4 5h16v9l-8 5-8-5V5z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
          <path d="M4 9h16M12 5v14" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </>}
      />
    </div>
  )
}

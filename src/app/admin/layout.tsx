import type { Metadata } from 'next'

// Metadata-only layout for the whole /admin segment. It adds NO chrome (the
// protected shell lives in (protected)/layout.tsx; login/reset are bare) — it
// just gives admin pages their own <title> instead of the public site default,
// and keeps the admin area out of search results.
export const metadata: Metadata = {
  title: {
    template: '%s · KofC 6033 Admin',
    default: 'KofC 6033 Admin',
  },
  robots: { index: false, follow: false },
}

export default function AdminSegmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

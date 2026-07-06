import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GolfBanner from '@/components/GolfBanner'

// Public-site chrome. Everything under the (public) route group renders inside
// the header / golf banner / footer. The (public) group does not change URLs —
// /about, /charities, etc. are unaffected. The admin area lives outside this
// group so it never inherits this chrome.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <GolfBanner />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

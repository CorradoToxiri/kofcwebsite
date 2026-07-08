import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { SiteSetting } from '@/lib/supabase/types'
import SettingsForm from './_components/SettingsForm'

export const metadata = { title: 'Settings · Admin' }

async function getSettings(): Promise<SiteSetting[]> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .order('section', { ascending: true })
    .order('sort_order', { ascending: true })
  return data ?? []
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="evp">
      <div className="evp-head">
        <div>
          <span className="evp-eyebrow">Site content</span>
          <h1 className="evp-title">Settings</h1>
        </div>
      </div>

      <SettingsForm settings={settings} />

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

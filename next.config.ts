import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage (all projects under supabase.co)
      new URL('https://*.supabase.co/storage/v1/object/public/**'),
      // uknight.org — officer headshots (Phase 1A interim source)
      new URL('https://uknight.org/**'),
    ],
  },
}

export default nextConfig

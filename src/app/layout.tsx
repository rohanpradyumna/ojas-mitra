import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@fontsource/eb-garamond/400.css'
import '@fontsource/eb-garamond/400-italic.css'
import '@fontsource/eb-garamond/500.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/tiro-devanagari-hindi/400.css'
import '@fontsource/caveat/500.css'
import './globals.css'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { AppProviders } from '@/components/providers/AppProviders'
import { SITE } from '@/data/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — made the way a home is made`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  icons: { icon: '/logo/mark.svg' },
  openGraph: {
    siteName: SITE.name,
    type: 'website',
    locale: 'en_IN',
  },
}

export const viewport: Viewport = {
  themeColor: '#f1e7d3',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AppProviders>
          <SiteHeader />
          {children}
        </AppProviders>
      </body>
    </html>
  )
}

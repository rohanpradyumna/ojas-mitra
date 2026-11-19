import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'

/** Reading pages: they scroll, end in the footer, and offer a way to write to us. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main id="main">{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  )
}

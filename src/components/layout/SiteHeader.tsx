'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { SITE } from '@/data/site'
import { useHideOnScroll } from '@/hooks/useHideOnScroll'
import { cx } from '@/lib/cx'
import { MenuOverlay } from './MenuOverlay'
import styles from './SiteHeader.module.css'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const hidden = useHideOnScroll()

  return (
    <>
      <header className={cx(styles.header, hidden && !menuOpen && styles.hidden)} data-site-header>
        <a className={styles.order} href={SITE.whatsapp.href}>
          order on whatsapp
        </a>
        <Link href="/" className={styles.brand} aria-label={`${SITE.name}, home`}>
          <Image src="/logo/mark.svg" alt="" width={54} height={54} unoptimized priority />
          <span className={styles.word}>{SITE.name}</span>
          <small className="deva">{SITE.deva}</small>
        </Link>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen(true)}
        >
          <span className={styles.menuLabel}>Menu</span>
          <span className={styles.menuDot} aria-hidden="true" />
        </button>
      </header>
      <MenuOverlay id="site-menu" open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { NAV_LINKS, SITE } from '@/data/site'
import { gsap, useGSAP } from '@/lib/gsap'
import { cx } from '@/lib/cx'
import { useLenis } from '@/components/providers/SmoothScroll'
import styles from './MenuOverlay.module.css'

interface Props {
  id: string
  open: boolean
  onClose: () => void
}

export function MenuOverlay({ id, open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  // Lock the page behind the menu, close on Escape, move focus in and back out.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const scroller = lenis.current
    scroller?.stop()
    ref.current?.querySelector('a')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      scroller?.start()
      opener?.focus()
    }
  }, [open, onClose, lenis])

  useGSAP(
    () => {
      if (!open) return
      gsap.from('[data-menu-item]', {
        yPercent: 60,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        delay: 0.15,
      })
    },
    { scope: ref, dependencies: [open] },
  )

  return (
    <div
      ref={ref}
      id={id}
      className={cx(styles.overlay, open && styles.open)}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
    >
      <button type="button" className={styles.close} onClick={onClose}>
        Close
      </button>
      <nav aria-label="Site">
        <ul className={styles.links}>
          <li data-menu-item>
            <Link href="/" onClick={onClose}>
              Home
            </Link>
          </li>
          {NAV_LINKS.map((link) => (
            <li key={link.href} data-menu-item>
              <Link href={link.href} onClick={onClose}>
                {link.label}
              </Link>
            </li>
          ))}
          <li data-menu-item>
            <a href={SITE.whatsapp.href} className={styles.write}>
              Write to us
            </a>
          </li>
        </ul>
      </nav>
      <p className={styles.foot} data-menu-item>
        Orders happen on WhatsApp — <a href={SITE.whatsapp.href}>{SITE.whatsapp.display}</a>. We
        reply when the kitchen is quiet.
      </p>
    </div>
  )
}

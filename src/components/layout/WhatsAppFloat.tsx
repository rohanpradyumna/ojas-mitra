'use client'

import { useEffect, useState } from 'react'
import { SITE } from '@/data/site'
import { cx } from '@/lib/cx'
import styles from './WhatsAppFloat.module.css'

/** A quiet way to write to us, offered once the visitor has started reading. */
export function WhatsAppFloat() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.55)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href={SITE.whatsapp.href}
      className={cx(styles.float, shown && styles.shown)}
      aria-label="Write to us on WhatsApp"
      tabIndex={shown ? 0 : -1}
    >
      write to us <span className={styles.arrow}>&rarr;</span>
    </a>
  )
}

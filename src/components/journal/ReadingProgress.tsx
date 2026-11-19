'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import styles from './ReadingProgress.module.css'

/** A thin line across the top that fills as the entry is read. */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      },
    )
  })

  return <div ref={ref} className={styles.bar} aria-hidden="true" />
}

'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { SITE } from '@/data/site'
import { gsap, useGSAP } from '@/lib/gsap'
import styles from './Loader.module.css'

/** The loader plays once per visit; coming back to the home page goes straight to the bottles. */
let playedThisVisit = false
export const loaderHasPlayed = (): boolean => playedThisVisit

const MIN_DURATION = 1.9

interface Props {
  /** Fired part-way through the wipe, so the bottles can start arriving underneath. */
  onReveal: () => void
  /** Fired when the loader has fully gone and can be unmounted. */
  onDone: () => void
}

export function Loader({ onReveal, onDone }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const counter = { value: 0 }
      const countEl = ref.current?.querySelector<HTMLElement>('[data-count]')
      const lineEl = ref.current?.querySelector<HTMLElement>('[data-line]')

      const counting = gsap.to(counter, {
        value: 100,
        duration: reduced ? 0.2 : MIN_DURATION,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (countEl) countEl.textContent = String(Math.round(counter.value)).padStart(3, '0')
          if (lineEl) lineEl.style.transform = `scaleX(${counter.value / 100})`
        },
      })

      let cancelled = false
      Promise.all([document.fonts.ready, counting.then()]).then(() => {
        if (cancelled) return
        playedThisVisit = true
        gsap
          .timeline({ onComplete: onDone })
          .to('[data-inner]', { y: -40, autoAlpha: 0, duration: 0.55, ease: 'power3.in' })
          .to(
            ref.current,
            { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.05, ease: 'expo.inOut' },
            '-=0.15',
          )
          .call(onReveal, [], '-=0.55')
      })
      return () => {
        cancelled = true
      }
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={styles.loader} aria-hidden="true">
      <div className={styles.inner} data-inner>
        <Image src="/logo/mark.svg" alt="" width={124} height={124} unoptimized priority />
        <p className={styles.word}>
          {SITE.name}
          <span className="deva">{SITE.deva}</span>
        </p>
      </div>
      <div className={styles.foot} data-inner>
        <span>made by hand, in a kitchen</span>
        <span className={styles.count} data-count>
          000
        </span>
      </div>
      <div className={styles.line}>
        <i data-line />
      </div>
    </div>
  )
}

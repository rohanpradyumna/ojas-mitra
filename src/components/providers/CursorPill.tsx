'use client'

import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import styles from './CursorPill.module.css'

interface CursorApi {
  show: (label: string) => void
  hide: () => void
}

const CursorContext = createContext<CursorApi>({ show: () => {}, hide: () => {} })

/** A small label that follows the pointer — "discover the product", "drag". Fine pointers only. */
export function CursorProvider({ children }: { children: ReactNode }) {
  const pillRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const pathname = usePathname()

  useGSAP(() => {
    const pill = pillRef.current
    if (!pill || !window.matchMedia('(pointer: fine)').matches) return
    gsap.set(pill, { autoAlpha: 0, scale: 0.6 })
    const xTo = gsap.quickTo(pill, 'x', { duration: 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(pill, 'y', { duration: 0.35, ease: 'power3.out' })
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX + 16)
      yTo(e.clientY + 14)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  })

  const api = useMemo<CursorApi>(
    () => ({
      show(label) {
        if (labelRef.current) labelRef.current.textContent = label
        gsap.to(pillRef.current, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' })
      },
      hide() {
        gsap.to(pillRef.current, { autoAlpha: 0, scale: 0.6, duration: 0.2, ease: 'power2.in' })
      },
    }),
    [],
  )

  useEffect(() => api.hide(), [pathname, api])

  return (
    <CursorContext.Provider value={api}>
      {children}
      <div ref={pillRef} className={styles.pill} aria-hidden="true">
        <span ref={labelRef} />
      </div>
    </CursorContext.Provider>
  )
}

export const useCursor = (): CursorApi => useContext(CursorContext)

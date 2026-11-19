'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const LenisContext = createContext<RefObject<Lenis | null> | null>(null)

/** Routes that are a single fixed screen and use wheel input themselves. */
const NO_SCROLL_ROUTES = new Set(['/'])

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const reducedMotion = useReducedMotion()
  const pathname = usePathname()
  const scrollable = !NO_SCROLL_ROUTES.has(pathname)

  useEffect(() => {
    if (reducedMotion || !scrollable) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, autoRaf: false })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    lenisRef.current = lenis
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reducedMotion, scrollable])

  // New page, new top. Lenis keeps its own position, so reset it with the route.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })
  }, [pathname])

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
}

/** The active Lenis instance (null on fixed routes or with reduced motion). Read `.current` at call time. */
export function useLenis(): RefObject<Lenis | null> {
  const ctx = useContext(LenisContext)
  if (!ctx) throw new Error('useLenis must be used inside <SmoothScroll>')
  return ctx
}
